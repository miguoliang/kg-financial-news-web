import { Box, HTMLChakraProps, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useGetKnowledgeHistory, useGetStorageHistory } from "../../services/MiscService";
import { echarts } from "../../configs";
import { ECLineOption } from "../../configs/echarts";

const KnowledgeStatChart = () => {

  const styles = {
    borderRadius: "lg",
    color: "gray.500",
    _selected: {
      color: "black",
      fontSize: "lg",
      fontWeight: "bold",
    },
  };

  return (
    <Tabs isLazy display={"flex"} flexDirection={"column"} h={"full"} variant={"unstyled"}>
      <TabList gap={2}>
        <Tab {...styles}>
          Knowledge
        </Tab>
        <Tab {...styles}>
          Storage
        </Tab>
      </TabList>
      <TabPanels position={"relative"} flexGrow={1}>
        <TabPanel p={0} h={"full"}>
          <KnowledgeHistoryChart w={"full"} h={"full"} />
        </TabPanel>
        <TabPanel p={0} h={"full"}>
          <StorageHistoryChart w={"full"} h={"full"} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

interface StorageHistoryChartProps extends HTMLChakraProps<"div"> {
  months?: number;
}

const StorageHistoryChart = ({ months = 12, ...props }: StorageHistoryChartProps) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const getStorageHistory = useGetStorageHistory({
    variables: { months },
  });
  useEffect(() => {
    if (chartRef.current === null || getStorageHistory.data === undefined) {
      return;
    }
    const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
    const options: ECLineOption = {
      legend: {
        top: 20,
        data: ["Knowledge", "Vertices", "Edges", "Properties"],
      },
      xAxis: {
        type: "category",
        data: getStorageHistory.data.database.map((item) => item.date),
      },
      yAxis: [
        {
          type: "value",
          name: "Size (MB)",
        },
        {
          type: "value",
          name: "Percentage",
          axisLabel: {
            formatter: "{value} %",
          },
        },
      ],
      grid: {
        left: 60,
        bottom: 45,
        right: 45,
      },
      series: [
        {
          name: "Database",
          type: "bar",
          data: getStorageHistory.data.database.map((item) => item.value),
        },
        {
          name: "File",
          type: "bar",
          data: getStorageHistory.data.file.map((item) => item.value),
        },
        {
          name: "Usage",
          type: "line",
          yAxisIndex: 1,
          data: getStorageHistory.data.usage.map((item) => item.value),
        },
      ],
    };
    chart.setOption(options);
  }, [chartRef, getStorageHistory.data]);
  return (
    <Box ref={chartRef} {...props}></Box>
  );
};

interface KnowledgeHistoryChartProps extends HTMLChakraProps<"div"> {
  days?: number;
}

const KnowledgeHistoryChart = ({ days = 30, ...props }: KnowledgeHistoryChartProps) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const getKnowledgeHistory = useGetKnowledgeHistory({
    variables: { days },
  });
  useEffect(() => {
    if (chartRef.current === null || getKnowledgeHistory.data === undefined) {
      return;
    }
    const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
    const options: ECLineOption = {
      legend: {
        top: 20,
        data: ["Knowledge", "Vertices", "Edges", "Properties"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: getKnowledgeHistory.data.knowledge.map((item) => item.date),
      },
      yAxis: {
        type: "value",
      },
      grid: {
        left: 60,
        bottom: 45,
        right: 20,
      },
      series: [
        {
          name: "Knowledge",
          type: "line",
          stack: "Total",
          data: getKnowledgeHistory.data.knowledge.map((item) => item.value),
        },
        {
          name: "Vertices",
          type: "line",
          stack: "Total",
          data: getKnowledgeHistory.data.vertices.map((item) => item.value),
        },
        {
          name: "Edges",
          type: "line",
          stack: "Total",
          data: getKnowledgeHistory.data.edges.map((item) => item.value),
        },
        {
          name: "Properties",
          type: "line",
          stack: "Total",
          data: getKnowledgeHistory.data.properties.map((item) => item.value),
        },
      ],
    };
    chart.setOption(options);
  }, [chartRef, getKnowledgeHistory.data]);
  return (
    <Box ref={chartRef} {...props}></Box>
  );
};

export default KnowledgeStatChart;