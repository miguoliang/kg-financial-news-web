import React from "react";
import { Link, Node } from "components/ui/Graph";
import * as vis from "vis-network";

interface GraphContextProps {
  nodes: Node[];
  links: Link[];
  setNodes: (nodes: Node[]) => void;
  setLinks: (links: Link[]) => void;
  graphInstance: vis.Network | null;
  setGraphInstance: (instance: vis.Network) => void;
  hoverNode: string | number | null;
  setHoverNode: (node: string | number | null) => void;
  selectedNode: string | number | null;
  setSelectedNode: (node: string | number | null) => void;
}

export const GraphContext = React.createContext<GraphContextProps | null>(null);

export const useGraphContext = () => {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [links, setLinks] = React.useState<Link[]>([]);
  const [graphInstance, setGraphInstance] = React.useState<vis.Network | null>(
    null,
  );
  const [hoverNode, setHoverNode] = React.useState<string | number | null>(
    null,
  );
  const [selectedNode, setSelectedNode] = React.useState<
    string | number | null
  >(null);

  return {
    nodes,
    links,
    setNodes,
    setLinks,
    graphInstance,
    setGraphInstance,
    hoverNode,
    setHoverNode,
    selectedNode,
    setSelectedNode,
  };
};
