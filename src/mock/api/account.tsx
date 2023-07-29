import { Server } from "miragejs/server";
import shuffle from "lodash-es/shuffle";
import first from "lodash-es/first";

export default function account(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/account/subscriptions`, (schema) => {
    const shuffled = shuffle(schema.db.Subscriptions);
    return [first(shuffled)];
  });
}
