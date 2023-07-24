import { Server } from "miragejs/server";
import { flatMap } from "lodash";
import { Vertex } from "../../models/vertex";

export default function edges(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/edges-by-vertices`, (schema, request) => {
    const vertexIds = JSON.parse(request.requestBody);
    const vertices = schema.db.Vertices.filter((v: Vertex) =>
      vertexIds.includes(v.id));
    const pairs = flatMap(vertices, (v, i) =>
      vertices.slice(i + 1).map((v2: Vertex) => [v, v2]));
    return pairs.map(([v1, v2]) => ({
      inVertexId: v1.id,
      outVertexId: v2.id,
      name: "associated with",
    }));
  });
}
