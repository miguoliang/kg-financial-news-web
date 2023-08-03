import { Link, Node } from "./types";
import { forwardRef, useContext, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as vis from "vis-network";
import { GraphContext } from "views/Dashboard/Graph/context";

interface GraphProps<T = any> {
  nodes: Node<T>[];
  links: Link<T>[];
  className?: string;
}

export const GraphComponent = forwardRef<HTMLDivElement, GraphProps>(({
                                                                        nodes,
                                                                        links,
                                                                        className,
                                                                      }, ref) => {
  const context = useContext(GraphContext);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const networkNodes = nodes.map((n) => ({
      id: n.id,
      label: n.label,
      hover: true,
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
    const networkInstance = new vis.Network(elementRef.current, {
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

    networkInstance.on("hoverNode", (event) => {
      if (context?.hoverHost === "list") {
        context.setHoverNode(event.node, "graph");
      }
    });
    networkInstance.on("blurNode", () => {
      if (context?.hoverHost === "list") {
        context.setHoverNode(null, "graph");
      }
    });

    context?.setGraphInstance(networkInstance);
  }, [elementRef, nodes, links]);
  return <Box ref={(node) => {
    elementRef.current = node;
    if (ref && typeof ref === "function") {
      ref(node);
    } else if (ref && typeof ref === "object") {
      ref.current = node;
    }
  }} className={className}></Box>;
});
