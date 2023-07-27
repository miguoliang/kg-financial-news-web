import React, { useEffect, useRef } from "react";
import echarts from "configs/echarts";
import { Graph as GraphData } from "models/echarts";
import { Box } from "@chakra-ui/react";
import { EChartsType } from "echarts/core";

interface GraphProps {
  data: GraphData;
  className?: string;
  style?: React.CSSProperties;
}

const GraphComponent = ({ data, className, style }: GraphProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: EChartsType | undefined;
    if (chartRef.current !== null) {
      chart = echarts.init(chartRef.current!);
    }
    if (chart) {
      updateGraph(chart, data);
    }
    return () => {
      chart?.dispose();
    };
  }, [data]);

  return (
    <Box className={className}
         style={style}
         ref={chartRef}>
    </Box>
  );
};

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
