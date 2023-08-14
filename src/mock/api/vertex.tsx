import { Vertex } from "models";
import createPaginationResponse from "../common/createPaginationResponse";
import random from "lodash-es/random";
import times from "lodash-es/times";
import dayjs from "dayjs";
import { appConfig } from "configs";
import { rest } from "msw";
import { Vertices } from "mock/seed";

export default [
  rest.get(`${appConfig.apiPrefix}/vertices`, (req, res, context) => {
    const q = req.url.searchParams.get("q")!.toLowerCase();
    const size = Number(req.url.searchParams.get("size") ?? "10");
    const vertices = Vertices.filter((v: Vertex) =>
      v.name.toLowerCase().includes(q),
    );
    return res(context.json(createPaginationResponse(vertices.slice(0, size))));
  }),

  rest.get(`${appConfig.apiPrefix}/vertices/stat`, (_req, res, context) =>
    res(
      context.json(
        times(100, (i) => ({
          label: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
          value: random(0, 1000),
        })),
      ),
    ),
  ),
];
