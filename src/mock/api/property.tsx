import random from "lodash-es/random";
import times from "lodash-es/times";
import dayjs from "dayjs";
import { rest } from "msw";
import { appConfig } from "../../configs";

export default [
  rest.get(`${appConfig.apiPrefix}/properties/stat`, (req, res, context) =>
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
