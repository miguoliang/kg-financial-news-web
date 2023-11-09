import { useContext, useEffect } from "react";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  Position,
  ReactFlow,
  useReactFlow,
} from "reactflow";
import { Edge as EdgeModel, Vertex as VertexModel } from "models";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled";
import { LayoutOptions } from "elkjs/lib/elk-api";
import { GraphContext } from "./context";
import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from "./FloatingConnectionLine";
import "./GraphComponent.css";

type NodeDataType = {
  label: string;
};

const edgeTypes = {
  floating: FloatingEdge,
};

const elk = new ELK();

const defaultOptions: LayoutOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "50",
  "elk.spacing.nodeNode": "80",
};

export const GraphComponent = () => {
  const { vertices, edges } = useContext(GraphContext);
  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    const reactFlowNodes = vertices2nodes(vertices);
    const reactFlowEdges = edges2links(edges);
    setEdges(reactFlowEdges);
    const elkNodes = reactFlowNodesToElkNodes(reactFlowNodes);
    const elkEdges = reactFlowEdgesToElkEdges(reactFlowEdges);
    elk
      .layout({
        id: "root",
        layoutOptions: defaultOptions,
        children: elkNodes,
        edges: elkEdges,
      })
      .then((g) => {
        const nodes =
          g.children?.map((c) => ({
            id: c.id,
            position: { x: c.x, y: c.y },
            data: { label: c.labels?.[0].text },
          })) || [];
        setNodes(nodes as Node<NodeDataType>[]);
      })
      .catch(console.error);
  }, [vertices, edges]);

  return (
    <ReactFlow
      defaultNodes={[]}
      defaultEdges={[]}
      edgeTypes={edgeTypes}
      connectionLineComponent={FloatingConnectionLine}
      className="graph-component"
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

function vertices2nodes(vertices: VertexModel[]): Node<NodeDataType>[] {
  return vertices.map((v) => ({
    id: v.id,
    position: { x: 0, y: 0 },
    data: { label: v.name },
    targetPosition: Position.Right,
    sourcePosition: Position.Left,
  }));
}

function edges2links(edges: EdgeModel[]): Edge[] {
  return edges.map((e) => ({
    source: e.inVertexId,
    target: e.outVertexId,
    id: `${e.inVertexId}-${e.name}-${e.outVertexId}`,
    type: "floating",
  }));
}

function reactFlowNodesToElkNodes(nodes: Node<NodeDataType>[]): ElkNode[] {
  return nodes.map((node) => ({
    id: node.id,
    // width of the node in px.
    width: 150,
    // height of the node in px.
    height: 75,
    labels: [{ text: node.data.label }],
  }));
}

function reactFlowEdgesToElkEdges(edges: Edge[]): ElkExtendedEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    // the id of the source node of this edge.
    sources: [edge.source],
    // the id of the target node of this edge.
    targets: [edge.target],
  }));
}
