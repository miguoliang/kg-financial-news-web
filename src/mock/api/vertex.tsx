import { Server } from "miragejs/server";
import { Vertex } from "models";
import get from "lodash-es/get";
import createPaginationResponse from "../common/createPaginationResponse";
import random from "lodash-es/random";
import times from "lodash-es/times";
import dayjs from "dayjs";

export default function vertices(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/vertices`, (schema, request) => {
    const q = request.queryParams.q!.toLowerCase();
    const size = Number(get(request.queryParams, "size", "10"));
    const vertices = schema.db.Vertices.filter((v: Vertex) =>
      v.name.toLowerCase().includes(q));
    console.debug("vertices", vertices);
    return createPaginationResponse(vertices.slice(0, size));
  });

  server.get(`${apiPrefix}/vertices/stat`, () => times(100, (i) => ({
    label: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: random(0, 1000),
  })));
}
