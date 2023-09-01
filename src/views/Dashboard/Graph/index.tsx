import { GraphComponent, GraphContext, useGraphContext } from "components/ui";
import { ReactFlowProvider } from "reactflow";
import { useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useRef } from "react";
import { Vertex as VertexModel } from "models";
import { PageHeader } from "../components";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import NodeList from "./NodeList";
import { motion } from "framer-motion";
import { theme } from "twin.macro";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import { saveAs } from "file-saver";
import { useGetEdgesByVertices, useGetVerticesByDataSource } from "services";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

async function queryNodesAndEdgesByDataSourceId(
  queryClient: QueryClient,
  dataSourceId: string,
) {
  const vertices = await queryClient.fetchQuery({
    queryKey: useGetVerticesByDataSource.getKey(dataSourceId),
    queryFn: useGetVerticesByDataSource.queryFn,
  });
  const vertexIds = vertices.map((v) => v.id);
  const edges = await queryEdgesByVertices(queryClient, vertexIds);
  return { vertices, edges };
}

async function queryEdgesByVertices(
  queryClient: QueryClient,
  vertexIds: string[],
) {
  return await queryClient.fetchQuery({
    queryKey: useGetEdgesByVertices.getKey(vertexIds),
    queryFn: useGetEdgesByVertices.queryFn,
  });
}

const Graph = () => {
  const nodeListRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { vertices, setVertices, edges, setEdges } = useGraphContext({});

  const handleExportGraph = () => {
    saveAs(
      new Blob([JSON.stringify(vertices)], { type: "application/json" }),
      "graph.json",
    );
  };

  const handleImportGraph = () => {
    const file = uploadRef.current?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const vertices = JSON.parse(e.target?.result as string) as VertexModel[];
      setVertices(vertices);
    };
    reader.readAsText(file);
  };

  return (
    <Flex flexDirection={"column"} alignItems={"stretch"} h={"full"}>
      <PageHeader title={"Graph"} description={"Knowledge graph"}>
        <Button
          variant={"outline"}
          bg={isOpen ? "gray.100" : "white"}
          leftIcon={
            <Icon
              as={
                isOpen
                  ? HiOutlineChevronDoubleRight
                  : HiOutlineChevronDoubleLeft
              }
            />
          }
          onClick={isOpen ? onClose : onOpen}
        >
          Node List
        </Button>
        <Button
          variant={"outline"}
          leftIcon={<Icon as={HiOutlineArrowUpTray} />}
          onClick={handleExportGraph}
        >
          Export
        </Button>
        <Button
          variant={"outline"}
          leftIcon={<Icon as={HiOutlineArrowDownTray} />}
          onClick={() => uploadRef.current?.click()}
        >
          <Text>Import</Text>
          <Input
            type={"file"}
            display={"none"}
            ref={uploadRef}
            onChange={handleImportGraph}
          />
        </Button>
      </PageHeader>
      <Box className={"flex-grow relative"}>
        <GraphContext.Provider
          value={{ vertices, edges, setVertices, setEdges }}
        >
          <GraphCanvas />
          <motion.div
            className={
              "absolute right-0 top-0 bottom-0 border border-gray-200 overflow-hidden bg-white rounded-lg shadow-md opacity-0 w-0"
            }
            ref={nodeListRef}
            animate={{
              opacity: isOpen ? 1 : 0,
              width: isOpen ? theme`minWidth.md` : "0%",
              borderColor: isOpen
                ? theme`colors.gray.200`
                : theme`colors.white`,
            }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          >
            <NodeList />
          </motion.div>
        </GraphContext.Provider>
      </Box>
    </Flex>
  );
};

const GraphCanvas = () => {
  const [searchParams] = useSearchParams();
  const { setVertices, setEdges } = useContext(GraphContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    searchParams.has("dataSourceId") &&
      queryNodesAndEdgesByDataSourceId(
        queryClient,
        searchParams.get("dataSourceId")!,
      ).then(({ vertices, edges }) => {
        setVertices(vertices);
        setEdges(edges);
      });
  }, [searchParams]);

  return (
    <ReactFlowProvider>
      <GraphComponent />
    </ReactFlowProvider>
  );
};

export default Graph;
