import { Server } from "miragejs/server";
import random from "lodash-es/random";
import times from "lodash-es/times";
import dayjs from "dayjs";

export default function property(server: Server, apiPrefix: string) {

  server.get(`${apiPrefix}/properties/stat`, () => times(100, (i) => ({
    label: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: random(0, 1000),
  })));
}
