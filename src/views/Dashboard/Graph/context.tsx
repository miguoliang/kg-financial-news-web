import React from "react";
import { Vertex } from "models";

interface GraphContextProps {
  vertices: Vertex[];
  setVertices: (vertices: Vertex[]) => void;
  graphInstance: any;
  setGraphInstance: (instance: any) => void;
  hoverNode: string | number | null;
  setHoverNode: (node: string | number | null, host: "graph" | "list") => void;
  hoverHost: "graph" | "list";
}

export const GraphContext = React.createContext<GraphContextProps | null>(null);
