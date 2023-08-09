import { forwardRef, useContext, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as vis from "vis-network";
import { GraphContext } from "views/Dashboard/Graph/context";

export const GraphComponent = forwardRef<HTMLDivElement, {
  className?: string
}>(({ className }, ref) => {
  const context = useContext(GraphContext);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    if (context?.graphInstance) {
      context.graphInstance.setData({ nodes: context.nodes, edges: context.links });
      return;
    }

    const networkInstance = new vis.Network(elementRef.current, {
      nodes: context?.nodes ?? [],
      edges: context?.links ?? [],
    }, {
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
      },
    });

    networkInstance.on("hoverNode", (event) => {
      context?.setHoverNode(event.node);
    });
    networkInstance.on("blurNode", () => {
      context?.setHoverNode(null);
    });
    networkInstance.on("selectNode", (event) => {
      context?.setSelectedNode(event.nodes[0]);
    });
    networkInstance.on("deselectNode", () => {
      context?.setSelectedNode(null);
    });

    context?.setGraphInstance(networkInstance);
  }, [elementRef, context?.nodes, context?.links]);
  return <Box ref={(node) => {
    elementRef.current = node;
    if (ref && typeof ref === "function") {
      ref(node);
    } else if (ref && typeof ref === "object") {
      ref.current = node;
    }
  }} className={className}></Box>;
});
