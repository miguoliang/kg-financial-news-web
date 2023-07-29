import { Server } from "miragejs/server";
import createPaginationResponse from "../common/createPaginationResponse";
import shuffle from "lodash-es/shuffle";
import get from "lodash-es/get";
import random from "lodash-es/random";

export default function dataSource(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/data-sources`, (schema, request) => {
    const page = Number(get(request.queryParams, "page", "0"));
    const size = Number(get(request.queryParams, "size", "10"));
    return createPaginationResponse(schema.db.DataSources, page, size);
  });

  server.get(`${apiPrefix}/data-sources/:id/vertices`, (schema) =>
    shuffle(schema.db.Vertices).splice(0, random(10, 20)));
}
