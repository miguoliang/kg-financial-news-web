import ApiService from "./ApiService";
import { PaginationResponse, Vertex } from "models";

export async function apiGetVertices(q: string, page: number = 0, size: number = 10) {
  return ApiService.fetchData<PaginationResponse<Vertex>>({
    url: "/vertices",
    method: "get",
    params: {
      q,
      page,
      size,
    },
  });
}
