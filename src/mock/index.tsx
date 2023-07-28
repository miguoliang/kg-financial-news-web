import { createServer } from "miragejs";
import { appConfig } from "configs";

import { accountApi, dataSourceApi, edgeApi, vertexApi } from "./api";
import { DataSources, Subscriptions, Vertices } from "./seed";

const { apiPrefix } = appConfig;

export default function mockServer({ environment = "development" }) {
  const server = createServer({
    environment,
    routes() {
      this.urlPrefix = window.location.origin;
      this.namespace = apiPrefix;
      this.passthrough((request) => request.url.startsWith("https://"));
      this.passthrough((request) =>
        request.url.startsWith(
          new URL(import.meta.env.VITE_OIDC_AUTHORITY).origin,
        ),
      );
      dataSourceApi(this, apiPrefix);
      edgeApi(this, apiPrefix);
      vertexApi(this, apiPrefix);
      accountApi(this, apiPrefix);
    },
  });
  server.db.loadData({
    DataSources,
    Vertices,
    Subscriptions,
  });
  return server;
}
