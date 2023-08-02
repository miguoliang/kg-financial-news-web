import shuffle from "lodash-es/shuffle";
import first from "lodash-es/first";
import { rest } from "msw";
import { appConfig } from "configs";
import { Subscriptions } from "../seed";

export default [
  rest.get(`${appConfig.apiPrefix}/account/subscriptions`, (_req, res, ctx) => {
    const shuffled = shuffle(Subscriptions);
    return res(ctx.json([first(shuffled)]));
  }),
];
