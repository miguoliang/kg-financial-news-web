import GraphComponent from "components/ui/Graph";
import { useSearchParams } from "react-router-dom";
import Loading from "components/ui/Loading";
import React, { useEffect, useRef } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import { Category, Edge, Graph as GraphModel, Link, Node, Vertex } from "models";
import { PageHeader } from "../Common";
import { Button, Icon, Input, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import NodeList from "./NodeList";
import { motion } from "framer-motion";
import { theme } from "twin.macro";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import { saveAs } from "file-saver";
import { useGetEdgesByVertices, useGetVerticesByDataSource } from "services";
import { useQueryClient } from "@tanstack/react-query";
import { GraphContext } from "./context";

const Graph = () => {

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const nodeListRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const dimensions = useSize(pageHeaderRef);
  const [managedVertices, setManagedVertices] = React.useState<Vertex[]>([]);
  const [graph, setGraph] = React.useState<GraphModel | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isEdgesLoading, setIsEdgesLoading] = useBoolean(false);

  const { data: verticesByDataSource, isLoading: isVerticesByDataSourceLoading } = useGetVerticesByDataSource({
    variables: searchParams.get("dataSourceId")!,
    enabled: searchParams.has("dataSourceId"),
  });

  useEffect(() => {
    if (verticesByDataSource?.length) {
      setManagedVertices(verticesByDataSource);
    }
  }, [verticesByDataSource]);

  useEffect(() => {
    if (!managedVertices.length) {
      return;
    }
    setIsEdgesLoading.on();
    const vertexIds = managedVertices.map(v => v.id);
    const queryKey = useGetEdgesByVertices.getKey(vertexIds);
    const queryFn = useGetEdgesByVertices.queryFn;
    queryClient.fetchQuery({
      queryKey,
      queryFn,
    }).then(v => setGraph(makeGraph(managedVertices, v)))
      .finally(() => setIsEdgesLoading.off());
  }, [managedVertices]);

  const handleManagedVerticesChange = (vertices: Vertex[]) => {
    setManagedVertices(vertices);
  };

  const handleExportGraph = () => {
    saveAs(new Blob([JSON.stringify(managedVertices)], { type: "application/json" }), "graph.json");
  };

  const handleImportGraph = () => {
    const file = uploadRef.current?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const vertices = JSON.parse(e.target?.result as string) as Vertex[];
      setManagedVertices(vertices);
    };
    reader.readAsText(file);
  };

  const isLoading = isEdgesLoading || isVerticesByDataSourceLoading;

  return (
    <Loading loading={isLoading} type="cover" className="h-full relative">
      <PageHeader title={"Graph"} description={"Knowledge graph"} ref={pageHeaderRef}>
        <Button variant={"outline"}
                bg={isOpen ? "gray.100" : "white"}
                leftIcon={<Icon as={isOpen ? HiOutlineChevronDoubleRight : HiOutlineChevronDoubleLeft} />}
                onClick={isOpen ? onClose : onOpen}>Node
          List</Button>
        <Button variant={"outline"} leftIcon={<Icon as={HiOutlineArrowUpTray} />}
                onClick={handleExportGraph}>Export</Button>
        <Button variant={"outline"}
                leftIcon={<Icon as={HiOutlineArrowDownTray} />}
                onClick={() => uploadRef.current?.click()}>
          <Text>Import</Text>
          <Input type={"file"} display={"none"} ref={uploadRef} onChange={handleImportGraph} />
        </Button>
      </PageHeader>
      <GraphContext.Provider value={{ vertices: managedVertices, setVertices: handleManagedVerticesChange }}>
        {graph && <GraphComponent data={graph} className={"absolute left-0 right-0 bottom-0"} style={{
          top: `${dimensions?.height}px`,
        }} />}
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

function makeGraph(vertices: Vertex[], edges: Edge[]) {
  const nodes: Node[] = [];
  const categories: Category[] = [];
  vertices.forEach((vertex, index) => {
    nodes.push({
      id: vertex.id,
      name: vertex.name,
      category: index,
    });
    categories.push({ name: vertex.name });
  });
  const links: Link[] = edges.map((edge) => ({
    source: edge.inVertexId,
    target: edge.outVertexId,
  }));
  return { nodes, links, categories } as GraphModel;
}


export default Graph;