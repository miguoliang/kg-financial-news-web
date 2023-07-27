import { Server } from "miragejs/server";
import { Vertex } from "models";
import get from 'lodash/get';
import createPaginationResponse from "../common/createPaginationResponse";

export default function vertices(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/vertices`, (schema, request) => {
    const q = request.queryParams.q!.toLowerCase();
    const size = Number(get(request.queryParams, "size", "10"));
    const vertices = schema.db.Vertices.filter((v: Vertex) =>
      v.name.toLowerCase().includes(q));
    console.debug("vertices", vertices);
    return createPaginationResponse(vertices.slice(0, size));
  });
}
