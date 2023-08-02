import React from "react";
import { Vertex } from "models";

interface GraphContextProps {
  vertices: Vertex[];
  setVertices: (vertices: Vertex[]) => void;
  graphInstance: any;
  setGraphInstance: (instance: any) => void;
  selectedNodes?: string[];
  setSelectedNodes?: (nodes: string[]) => void;
}

export const GraphContext = React.createContext<GraphContextProps | null>(null);
