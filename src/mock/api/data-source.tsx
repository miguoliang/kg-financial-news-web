import { Server } from "miragejs/server";
import createPaginationResponse from "../common/createPaginationResponse";
import { get } from "lodash";

export default function dataSource(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/data-sources`, (schema, request) => {
    const page = Number(get(request.queryParams, "page", "0"));
    const size = Number(get(request.queryParams, "size", "10"));
    return createPaginationResponse(schema.db.DataSources, page, size);
  });
}
