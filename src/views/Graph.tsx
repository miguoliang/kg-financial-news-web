import GraphComponent from "components/ui/Graph";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGetDataSourceVertices, makeGraph } from "../services/DataSourceService";
import Loading from "../components/ui/Loading";
import { useMemo } from "react";

const Graph = () => {
  const params = useParams<{ id: string }>();
  const { data: vertices, status } = useQuery({
    queryKey: [`vertices${params.id ? "ByDataSourceId" : ""}`, params],
    queryFn: () => params.id
      ? apiGetDataSourceVertices(params.id).then(resp => resp.data)
      : Promise.resolve([]),
    keepPreviousData: true,
    initialData: [],
  });

  const { data: edges, isLoading } = useQuery({
    queryKey: [`edges`, vertices],
    queryFn: () => Promise.resolve([]),
    keepPreviousData: true,
    initialData: [],
    enabled: status === "success",
  });

  const graph = useMemo(() => {
    return makeGraph(vertices, edges);
  }, [vertices, edges]);

  return (
    <Loading loading={isLoading} type="cover" className="h-full">
      <GraphComponent data={graph} />
    </Loading>
  );
};

export default Graph;