import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Graph } from "models/echarts";
import { apiGetDataSourceVertices, makeGraph } from "services/DataSourceService";
import { useParams } from "react-router-dom";
import { apiGetEdgesByVertices } from "services/EdgeService";
import { Button, useBoolean } from "@chakra-ui/react";
import Loading from "components/ui/Loading";

const KnowledgeGraph = () => {
  const [loading, setLoading] = useBoolean();
  const chartRef = useRef<HTMLDivElement>(null);
  const { id: dataSourceId } = useParams<{ id: string }>();

  useEffect(() => {
    setLoading.on();
    const chart = echarts.init(chartRef.current!);
    composeGraph(dataSourceId!)
      .then((data) => {
        const graph = makeGraph(data.vertices, data.edges);
        updateGraph(chart, graph);
      })
      .finally(() => {
        setLoading.off();
      });
  }, []);

  return (
    <Loading loading={loading} type="cover" className="h-full relative">
      <div
        className="absolute left-0 bottom-0 right-0 top-0"
        ref={chartRef}
      ></div>
      <Button position="absolute" bottom={0}>
        Add
      </Button>
    </Loading>
  );
};

function updateGraph(chart: echarts.ECharts, graph: Graph) {
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

const composeGraph = async (dataSourceId: string) => {
  const vertices = await apiGetDataSourceVertices(dataSourceId);
  const vertexIds = vertices.data.map((v) => v.id);
  const edge =
    vertexIds.length > 0
      ? await apiGetEdgesByVertices(vertexIds)
      : { data: [] };
  return { vertices: vertices.data, edges: edge.data };
};

export default KnowledgeGraph;
