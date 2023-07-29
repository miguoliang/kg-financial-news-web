import { Server } from "miragejs/server";
import flatMap from "lodash-es/flatMap";
import { Vertex } from "models";
import random from "lodash-es/random";
import { combinations } from "mathjs";
import dayjs from "dayjs";
import times from "lodash-es/times";

export default function edges(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/edges-by-vertices`, (schema, request) => {
    const vertexIds = JSON.parse(request.requestBody);
    const pairs = flatMap(vertexIds, (v, i) =>
      vertexIds.slice(i + 1).map((v2: Vertex) => [v, v2]));
    return pairs.map(([v1, v2]) => ({
      inVertexId: v1,
      name: "associated with",
      outVertexId: v2,
    }));
  });

  server.get(`${apiPrefix}/edges/stat`, (schema) => {
    const c = combinations(schema.db.Vertices.length, 2);
    return times(100, (i) => ({
      label: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
      value: random(0, c),
    }));
  });
}
