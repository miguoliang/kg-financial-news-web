import { Server } from "miragejs/server";
import createPaginationResponse from "../common/createPaginationResponse";
import chain from 'lodash/chain';
import get from 'lodash/get';
import random from 'lodash/random';

export default function dataSource(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/data-sources`, (schema, request) => {
    const page = Number(get(request.queryParams, "page", "0"));
    const size = Number(get(request.queryParams, "size", "10"));
    return createPaginationResponse(schema.db.DataSources, page, size);
  });

  server.get(`${apiPrefix}/data-sources/:id/vertices`, (schema) =>
    chain(schema.db.Vertices).shuffle().splice(0, random(10, 20)).value());
}
