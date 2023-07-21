import { createServer } from "miragejs";
import appConfig from "configs/app.config";

import { dataSourceApi } from "./api";
import { DataSources } from "./seed";

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
    },
  });
  server.db.loadData({
    DataSources,
  });
  return server;
}
