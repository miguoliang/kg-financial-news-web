import { createQuery } from "react-query-kit";
import AxiosFetch from "./AxiosFetch";
import { Edge } from "models";

export const useGetEdgesByVertices = createQuery<Edge[], string[]>({
  primaryKey: "get.edges-by-vertices",
  queryFn: ({ queryKey: [, data] }) => AxiosFetch({
    url: "/edges-by-vertices",
    method: "post",
    data,
  }).then((resp) => resp.data),
});
