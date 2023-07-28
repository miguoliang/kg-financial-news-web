import React from "react";
import { Vertex } from "models";

interface GraphContextProps {
  vertices: Vertex[];
  setVertices: (vertices: Vertex[]) => void;
}

export const GraphContext = React.createContext<GraphContextProps | null>(null);