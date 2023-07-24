import GraphComponent from "components/ui/Graph";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetDataSourceVertices, makeGraph } from "services/DataSourceService";
import Loading from "components/ui/Loading";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiPostEdgesByVertices } from "services/EdgeService";
import { PageHeader } from "./Common";
import { useDimensions } from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { noop } from "lodash";
import { Vertex } from "models";
import { apiGetVertices } from "../../services/VertexService";

const Graph = () => {

  const elementRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(elementRef);
  const [managedVertices, setManagedVertices] = useState<Vertex[]>([]);
  const [q, setQ] = useState<string>("");
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { data: vertices } = useQuery({
    queryKey: ["vertices", searchParams],
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

  useEffect(() => {
    queryClient.fetchQuery({ queryKey: ["candidates", q] }).then(noop);
  }, [q]);

  const { data: edges, isLoading } = useQuery({
    queryKey: [`edges-by-vertices`, vertices.map(v => v.id)],
    queryFn: () => apiPostEdgesByVertices(vertices.map(v => v.id))
      .then(resp => resp.data),
    keepPreviousData: true,
    initialData: [],
    enabled: managedVertices.length > 0,
    refetchOnWindowFocus: false,
  });

  const { data: candidates, isLoading: isLoadingCandidates } = useQuery({
    queryKey: ["candidates", q],
    queryFn: () => q === ""
      ? Promise.resolve([])
      : apiGetVertices(q).then(resp => resp.data.content.map(v => ({ value: v.id, label: v.name }))),
    keepPreviousData: true,
    initialData: [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const graph = useMemo(() => {
    return makeGraph(vertices, edges);
  }, [vertices, edges]);

  return (
    <Loading loading={isLoading} type="cover" className="h-full relative">
      <PageHeader title={"Graph"} ref={elementRef}>
        <AsyncSelect options={candidates} isLoading={isLoadingCandidates} onInputChange={setQ} />
      </PageHeader>
      <GraphComponent data={graph} className={"absolute bottom-0 left-0 right-0"}
                      style={{ top: `${dimensions?.borderBox.height}px` }} />
    </Loading>
  );
};

export default Graph;