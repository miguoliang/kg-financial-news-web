import GraphComponent from "components/ui/Graph";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGetDataSourceVertices, makeGraph } from "services/DataSourceService";
import Loading from "components/ui/Loading";
import { useMemo, useRef } from "react";
import { apiPostEdgesByVertices } from "services/EdgeService";
import { PageHeader } from "./Common";
import { useDimensions } from "@chakra-ui/react";

const Graph = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(elementRef);

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
    queryKey: [`edges-by-vertices`, vertices.map(v => v.id)],
    queryFn: () => apiPostEdgesByVertices(vertices.map(v => v.id))
      .then(resp => resp.data),
    keepPreviousData: true,
    initialData: [],
    enabled: status === "success",
  });

  const graph = useMemo(() => {
    return makeGraph(vertices, edges);
  }, [vertices, edges]);

  return (
    <Loading loading={isLoading} type="cover" className="h-full relative">
      <PageHeader title={"Graph"} ref={elementRef} />
      <GraphComponent data={graph} className={"absolute bottom-0 left-0 right-0"}
                      style={{ top: `${dimensions?.borderBox.height}px` }} />
    </Loading>
  );
};

export default Graph;