import { Server } from "miragejs/server";
import flatMap from "lodash/flatMap";
import { Vertex } from "models";

export default function edges(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/edges-by-vertices`, (schema, request) => {
    const vertexIds = JSON.parse(request.requestBody);
    const pairs = flatMap(vertexIds, (v, i) =>
      vertexIds.slice(i + 1).map((v2: Vertex) => [v, v2]));
    return pairs.map(([v1, v2]) => ({
      inVertexId: v1,
      outVertexId: v2,
      name: "associated with",
    }));
  });
}
