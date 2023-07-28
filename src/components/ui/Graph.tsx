import React, { forwardRef, useEffect, useRef } from "react";
import echarts from "configs/echarts";
import { Graph as GraphData } from "models/echarts";
import { Box } from "@chakra-ui/react";

interface GraphProps {
  data?: GraphData;
  className?: string;
  style?: React.CSSProperties;
}

const GraphComponent = forwardRef<HTMLDivElement, GraphProps>(({ data, className, style }, ref) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chart = chartRef.current && echarts.init(chartRef.current);
    if (chart && data) {
      updateGraph(chart, data);
    }
    return () => {
      chart?.dispose();
    };
  }, [ref, data]);

  return (
    <Box className={className}
         style={style}
         ref={(node) => {
           chartRef.current = node;
           if (typeof ref === "function") {
             ref(node);
           } else if (ref) {
             ref.current = node;
           }
         }}>
    </Box>
  );
});

function updateGraph(chart: echarts.ECharts, graph: GraphData) {
  const option = {
    legend: [
      {
        data: graph.categories?.map(function(a) {
          return a.name;
        }),
        orient: "vertical",
        right: 0,
      },
    ],
    series: [
      {
        name: "Knowledge Index",
        type: "graph",
        layout: "circular",
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
        labelLayout: {
          hideOverlap: true,
        },
        scaleLimit: {
          min: 0.4,
          max: 2,
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  };
  chart.setOption(option);
}

export default GraphComponent;
