import { PaginationRequest, PaginationResponse, Vertex } from "models";
import { createQuery } from "react-query-kit";
import AxiosFetch from "./AxiosFetch";

type GetVerticesResponse = PaginationResponse<Vertex>;

type GetVerticesParams = {
  q: string;
} & PaginationRequest;

export const useGetVertices = createQuery<GetVerticesResponse, GetVerticesParams>({
  primaryKey: "get.vertices",
  queryFn: ({ queryKey: [, params] }) => AxiosFetch({
    url: "/vertices",
    method: "get",
    params,
  }).then(res => res.data),
});
