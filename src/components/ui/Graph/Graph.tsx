import { Link, Node } from "./types";
import { useContext, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as vis from "vis-network";
import { GraphContext } from "views/Dashboard/Graph/context";

interface GraphProps<T = any> {
  nodes: Node<T>[];
  links: Link<T>[];
  linkTypes: string[];
  className?: string;
}

export function GraphComponent<T>({ nodes, links, linkTypes, className }: GraphProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(GraphContext);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const networkNodes = nodes.map((n) => ({
      id: n.id,
      label: n.label,
    }));

    const networkLinks = links.map((l) => ({
      from: l.source.id,
      to: l.target.id,
      id: `${l.source.id}-${l.target.id}`,
      smooth: false,
    }));

    if (context?.graphInstance) {
      context.graphInstance.setData({
        nodes: networkNodes,
        edges: networkLinks,
      });
      return;
    }

    const networkInstance = new vis.Network(ref.current, {
      nodes: networkNodes,
      edges: networkLinks,
    }, {
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
      },
    });
    context?.setGraphInstance(networkInstance);

  }, [ref, nodes, links]);
  return <Box ref={ref} className={className}></Box>;
}