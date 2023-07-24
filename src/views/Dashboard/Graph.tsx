import GraphComponent from "components/ui/Graph";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGetDataSourceVertices, makeGraph } from "services/DataSourceService";
import Loading from "components/ui/Loading";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiPostEdgesByVertices } from "services/EdgeService";
import { PageHeader } from "./Common";
import { useDimensions } from "@chakra-ui/react";
import { Vertex } from "../../models/vertex";

const Graph = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(elementRef);
  const [managedVertices, setManagedVertices] = useState<Vertex[]>([]);
  const [searchParams] = useSearchParams();

  const { data: vertices } = useQuery({
    queryKey: ["vertices"],
    queryFn: () => searchParams.get("dataSourceId")
      ? apiGetDataSourceVertices(searchParams.get("dataSourceId")!).then(resp => resp.data)
      : Promise.resolve([]),
    keepPreviousData: true,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setManagedVertices(vertices);
  }, [vertices]);

  const { data: edges, isLoading } = useQuery({
    queryKey: [`edges-by-vertices`, vertices.map(v => v.id)],
    queryFn: () => apiPostEdgesByVertices(vertices.map(v => v.id))
      .then(resp => resp.data),
    keepPreviousData: true,
    initialData: [],
    enabled: managedVertices.length > 0,
    refetchOnWindowFocus: false,
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