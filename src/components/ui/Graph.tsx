import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Graph as GraphData } from "models/echarts";
import { Box } from "@chakra-ui/react";

const GraphComponent = ({ data }: { data: GraphData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);
    updateGraph(chart, data);
  }, [data]);

  return (
    <Box position={"absolute"} top={0} left={0} right={0} bottom={0}
         ref={chartRef}>
    </Box>
  );
};

function updateGraph(chart: echarts.ECharts, graph: GraphData) {
  const option = {
    tooltip: {},
    title: {
      text: "Knowledge Graph",
      subtext: "Circular layout",
      top: 0,
      left: 0,
      show: true,
    },
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
        name: "Knowledge Graph",
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
