import { GraphVis, Link as GraphLink, Node as GraphNode } from "components/ui";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { Edge, Vertex } from "models";
import { PageHeader } from "../components";
import { Box, Button, Flex, Icon, Input, Text, useBoolean, useDisclosure } from "@chakra-ui/react";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import NodeList from "./NodeList";
import { motion } from "framer-motion";
import { theme } from "twin.macro";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import { saveAs } from "file-saver";
import { useGetEdgesByVertices, useGetVerticesByDataSource } from "services";
import { useQueryClient } from "@tanstack/react-query";
import { GraphContext, useGraphContext } from "./context";
import uniqBy from "lodash-es/uniqBy";
import * as vis from "vis-network";

const Graph = () => {

  const nodeListRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [graphInstance, setGraphInstance] = React.useState<vis.Network | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [linkTypes, setLinkTypes] = React.useState<string[]>([]);
  const {
    nodes,
    setNodes,
    links,
    setLinks,
    hoverNode,
    setHoverNode,
    selectedNode,
    setSelectedNode,
  } = useGraphContext();
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
    }).then(v => setNodes(vertices2nodes(v)))
      .finally(() => setIsVerticesLoading.off());
  }, [searchParams]);

  useEffect(() => {
    if (!nodes.length) {
      return;
    }
    setIsEdgesLoading.on();
    const vertexIds = nodes.map(v => v.id);
    const queryKey = useGetEdgesByVertices.getKey(vertexIds as string[]);
    const queryFn = useGetEdgesByVertices.queryFn;
    queryClient.fetchQuery({
      queryKey,
      queryFn,
    }).then(v => {
      const linkTypes = uniqBy(v, "type").map(v => v.name);
      const links = edges2links(v);
      setNodes(nodes);
      setLinks(links);
      setLinkTypes(linkTypes);
    }).finally(() => setIsEdgesLoading.off());
  }, [nodes]);

  const handleExportGraph = () => {
    saveAs(new Blob([JSON.stringify(nodes)], { type: "application/json" }), "graph.json");
  };

  const handleNodeHover = (nodeId: string | number | null) => {
    setHoverNode(nodeId);
    if (!graphInstance || !graphRef.current) {
      return;
    }
    const instance = graphInstance as any;
    const selectionHandler = instance.selectionHandler;
    selectionHandlerHoverObject(selectionHandler, nodeId);
  };

  const handleNodeSelect = (nodeId: string | number | null) => {
    setSelectedNode(nodeId);
    if (!graphInstance || !graphRef.current) {
      return;
    }
    nodeId ? graphInstance.selectNodes([nodeId]) : graphInstance.selectNodes([]);
  }

  const handleImportGraph = () => {
    const file = uploadRef.current?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const vertices = JSON.parse(e.target?.result as string) as Vertex[];
      setNodes(vertices2nodes(vertices));
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
        <GraphContext.Provider
          value={{
            nodes,
            links,
            setNodes,
            setLinks,
            graphInstance,
            setGraphInstance,
            hoverNode,
            setHoverNode: handleNodeHover,
            selectedNode,
            setSelectedNode: handleNodeSelect,
          }}>
          <GraphVis ref={graphRef} className={"w-full h-full"} />
          <motion.div
            className={"absolute right-0 top-0 bottom-0 border border-gray-200 overflow-hidden bg-white rounded-lg shadow-md opacity-0 w-0"}
            ref={nodeListRef}
            animate={{
              opacity: isOpen ? 1 : 0,
              width: isOpen ? theme`minWidth.md` : "0%",
              borderColor: isOpen ? theme`colors.gray.200` : theme`colors.white`,
            }} transition={{ type: "spring", duration: 0.5, bounce: 0 }}>
            <NodeList />
          </motion.div>
        </GraphContext.Provider>
      </Box>
    </Flex>
  );
};

function vertices2nodes(vertices: Vertex[]): GraphNode[] {
  return vertices.map(v => ({
    id: v.id,
    label: v.name,
  }));
}

function edges2links(edges: Edge[]): GraphLink[] {
  return edges.map(e => ({
    from: e.inVertexId,
    to: e.outVertexId,
    id: `${e.inVertexId}-${e.name}-${e.outVertexId}`,
    smooth: false,
  } as GraphLink));
}

function selectionHandlerHoverObject(thisArg: any, nodeId: string | number | null) {

  let object = nodeId && thisArg.body.nodes[nodeId];
  if (!object) {
    object = nodeId && thisArg.body.edges[nodeId];
  }

  let hoverChanged = false;
  // remove all node hover highlights
  for (const nodeId in thisArg.hoverObj.nodes) {
    if (Object.prototype.hasOwnProperty.call(thisArg.hoverObj.nodes, nodeId)) {
      thisArg.emitBlurEvent(event, { x: 0, y: 0 }, thisArg.hoverObj.nodes[nodeId]);
      delete thisArg.hoverObj.nodes[nodeId];
      hoverChanged = true;
    }
  }

  // removing all edge hover highlights
  for (const edgeId in thisArg.hoverObj.edges) {
    if (Object.prototype.hasOwnProperty.call(thisArg.hoverObj.edges, edgeId)) {
      // if the hover has been changed here it means that the node has been hovered over or off
      // we then do not use the emitBlurEvent method here.
      if (hoverChanged) {
        thisArg.hoverObj.edges[edgeId].hover = false;
        delete thisArg.hoverObj.edges[edgeId];
      } else {
        // if the blur remains the same and the object is undefined (mouse off) or another
        // edge has been hovered, or another node has been hovered we blur the edge.
        thisArg.emitBlurEvent(event, { x: 0, y: 0 }, thisArg.hoverObj.edges[edgeId]);
        delete thisArg.hoverObj.edges[edgeId];
        hoverChanged = true;
      }
    }
  }

  if (object) {
    const hoveredEdgesCount = Object.keys(thisArg.hoverObj.edges).length;
    const hoveredNodesCount = Object.keys(thisArg.hoverObj.nodes).length;
    const newOnlyHoveredEdge =
      hoveredEdgesCount === 0 &&
      hoveredNodesCount === 0;
    const newOnlyHoveredNode =
      hoveredEdgesCount === 0 &&
      hoveredNodesCount === 0;

    if (hoverChanged || newOnlyHoveredEdge || newOnlyHoveredNode) {
      if (!Object.hasOwn(object, "hover")) {
        object.hover = false;
      }
      hoverChanged = thisArg.emitHoverEvent(event, { x: 0, y: 0 }, object);
    }

    if (object && thisArg.options.hoverConnectedEdges === true) {
      thisArg._hoverConnectedEdges(object);
    }
  }

  if (hoverChanged) {
    thisArg.body.emitter.emit("_requestRedraw");
  }
}

export default Graph;