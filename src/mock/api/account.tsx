import { Server } from "miragejs/server";
import shuffle from "lodash/shuffle";
import first from "lodash/first";

export default function account(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/account/subscriptions`, (schema) => {
    const shuffled = shuffle(schema.db.Subscriptions);
    return [first(shuffled)];
  });
}
