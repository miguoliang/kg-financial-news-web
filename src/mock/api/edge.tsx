import random from "lodash-es/random";
import { combinations } from "mathjs";
import dayjs from "dayjs";
import times from "lodash-es/times";
import { rest } from "msw";
import { appConfig } from "configs";
import { Vertices } from "../seed";
import { flatMap } from "lodash-es";

export default [
  rest.post(
    `${appConfig.apiPrefix}/edges-by-vertices`,
    async (req, res, context) => {
      const vertexIds = await req.json<string[]>();
      const pairs = flatMap(vertexIds, (v, i) =>
        vertexIds.slice(i + 1).map((v2) => [v, v2]),
      );
      // const first = vertexIds[0];
      // const pairs = vertexIds.slice(1).map((v) => [first, v]);
      return res(
        context.json(
          pairs.map(([v1, v2]) => ({
            inVertexId: v1,
            name: "associated with",
            outVertexId: v2,
          })),
        ),
      );
    },
  ),
  rest.get(`${appConfig.apiPrefix}/edges/stat`, (_req, res, context) => {
    const c = combinations(Vertices.length, 2);
    return res(
      context.json(
        times(100, (i) => ({
          label: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
          value: random(0, c),
        })),
      ),
    );
  }),
];
