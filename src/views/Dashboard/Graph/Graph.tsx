import GraphComponent from "components/ui/Graph";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGetDataSourceVertices, makeGraph } from "services/DataSourceService";
import Loading from "components/ui/Loading";
import React, { useEffect, useMemo, useRef } from "react";
import { apiPostEdgesByVertices } from "services/EdgeService";
import { useSize } from "@chakra-ui/react-use-size";
import { Vertex } from "models";
import { PageHeader } from "../Common";
import { Button, Icon, useDisclosure } from "@chakra-ui/react";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import NodeList from "./NodeList";
import { motion } from "framer-motion";
import { theme } from "twin.macro";

interface GraphContextProps {
  vertices: Vertex[];
  setVertices: (vertices: Vertex[]) => void;
}

export const GraphContext = React.createContext<GraphContextProps | null>(null);

const Graph = () => {

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const nodeListRef = useRef<HTMLDivElement>(null);
  const dimensions = useSize(pageHeaderRef);
  const [managedVertices, setManagedVertices] = React.useState<Vertex[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();

  const { data: vertices } = useQuery({
    queryKey: ["vertices", searchParams],
    queryFn: () => searchParams.get("dataSourceId")
      ? apiGetDataSourceVertices(searchParams.get("dataSourceId")!).then(resp => resp.data)
      : Promise.resolve([]),
    keepPreviousData: true,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setManagedVertices(vertices);
  }, [vertices]);

  const { data: edges, isLoading } = useQuery({
    queryKey: [`edges-by-vertices`, vertices.map(v => v.id)],
    queryFn: () => apiPostEdgesByVertices(vertices.map(v => v.id))
      .then(resp => resp.data),
    keepPreviousData: true,
    initialData: [],
    enabled: managedVertices.length > 0,
    refetchOnWindowFocus: false,
  });

  const handleManagedVerticesChange = (vertices: Vertex[]) => {
    setManagedVertices(vertices);
  };

  const graph = useMemo(() => {
    return makeGraph(managedVertices, edges);
  }, [managedVertices, edges]);

  return (
    <Loading loading={isLoading} type="cover" className="h-full relative">
      <PageHeader title={"Graph"} description={"Knowledge graph"} ref={pageHeaderRef}>
        <Button variant={"outline"}
                bg={isOpen ? "gray.100" : "white"}
                leftIcon={<Icon as={isOpen ? HiOutlineChevronDoubleRight : HiOutlineChevronDoubleLeft} />}
                onClick={isOpen ? onClose : onOpen}>Node
          List</Button>
      </PageHeader>
      <GraphContext.Provider value={{ vertices: managedVertices, setVertices: handleManagedVerticesChange }}>
        <GraphComponent data={graph} className={"absolute left-0 right-0 bottom-0"} style={{
          top: `${dimensions?.height}px`,
        }} />
        <motion.div
          className={"absolute right-0 bottom-0 border border-gray-200 overflow-hidden bg-white rounded-lg shadow-md opacity-0 w-0"}
          ref={nodeListRef}
          style={{
            top: `${dimensions?.height}px`,
          }}
          animate={{
            opacity: isOpen ? 1 : 0,
            width: isOpen ? theme`minWidth.md` : "0%",
            borderColor: isOpen ? theme`colors.gray.200` : theme`colors.transparent`,
          }} transition={{ type: "spring", duration: 0.5, bounce: 0 }}>
          <NodeList />
        </motion.div>
      </GraphContext.Provider>
    </Loading>
  );
};

export default Graph;