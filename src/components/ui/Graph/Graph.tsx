import { Link, Node } from "./types";
import { useRef } from "react";
import { Box } from "@chakra-ui/react";

interface GraphProps<T = any> {
  nodes: Node<T>[];
  links: Link<T>[];
  linkTypes: string[];
}

export function GraphComponent<T>({ nodes, links, linkTypes }: GraphProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  return <Box></Box>
}