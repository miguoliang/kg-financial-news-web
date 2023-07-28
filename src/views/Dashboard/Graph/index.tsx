import GraphComponent from "components/ui/Graph";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { Category, Edge, Graph as GraphModel, Link, Node, Vertex } from "models";
import { PageHeader } from "../Common";
import { Box, Button, Flex, Icon, Input, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import NodeList from "./NodeList";
import { motion } from "framer-motion";
import { theme } from "twin.macro";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import { saveAs } from "file-saver";
import { useGetEdgesByVertices, useGetVerticesByDataSource } from "services";
import { useQueryClient } from "@tanstack/react-query";
import { GraphContext } from "./context";
import { findIndex } from "lodash";
import echarts from "configs/echarts";

const Graph = () => {

  const nodeListRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [managedVertices, setManagedVertices] = React.useState<Vertex[]>([]);
  const [graph, setGraph] = React.useState<GraphModel>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isEdgesLoading, setIsEdgesLoading] = useBoolean(false);
  const [isVerticesLoading, setIsVerticesLoading] = useBoolean(false);

  useEffect(() => {
    if (!searchParams.has("dataSourceId")) {
      return;
    }
    setIsVerticesLoading.on();
    queryClient.fetchQuery({
      queryKey: useGetVerticesByDataSource.getKey(searchParams.get("dataSourceId")!),
      queryFn: useGetVerticesByDataSource.queryFn,
    }).then(v => setManagedVertices(v))
      .finally(() => setIsVerticesLoading.off());
  }, [searchParams]);

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

  const handleNodeListHover = (vertex: Vertex) => {
    const chart = graphRef.current && echarts.getInstanceByDom(graphRef.current);
    const index = chart ? findIndex(graph?.nodes, it => it.id === vertex.id) : -1;
    chart && chart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index,
    });
  };

  const handleNodeListLeave = (vertex: Vertex) => {
    const chart = graphRef.current && echarts.getInstanceByDom(graphRef.current);
    const index = chart ? findIndex(graph?.nodes, it => it.id === vertex.id) : -1;
    chart && chart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: index,
    });
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

  return (
    <Flex flexDirection={"column"} alignItems={"stretch"} h={"full"}>
      <PageHeader title={"Graph"} description={"Knowledge graph"}>
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
      <Box className={"flex-grow relative"}>
        <GraphContext.Provider value={{ vertices: managedVertices, setVertices: handleManagedVerticesChange }}>
          <GraphComponent data={graph} ref={graphRef} className={"absolute top-0 bottom-0 left-0 right-0"} />
          <motion.div
            className={"absolute right-0 top-0 bottom-0 border border-gray-200 overflow-hidden bg-white rounded-lg shadow-md opacity-0 w-0"}
            ref={nodeListRef}
            animate={{
              opacity: isOpen ? 1 : 0,
              width: isOpen ? theme`minWidth.md` : "0%",
              borderColor: isOpen ? theme`colors.gray.200` : theme`colors.white`,
            }} transition={{ type: "spring", duration: 0.5, bounce: 0 }}>
            <NodeList onHover={handleNodeListHover} onLeave={handleNodeListLeave} />
          </motion.div>
        </GraphContext.Provider>
      </Box>
    </Flex>
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