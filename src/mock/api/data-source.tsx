import createPaginationResponse from "../common/createPaginationResponse";
import shuffle from "lodash-es/shuffle";
import random from "lodash-es/random";
import { appConfig } from "configs";
import { rest } from "msw";
import { DataSources, Vertices } from "../seed";

export default [
  rest.get(`${appConfig.apiPrefix}/data-sources`, (req, res, context) => {
    const page = Number(req.url.searchParams.get("page") ?? "0");
    const size = Number(req.url.searchParams.get("size") ?? "10");
    return res(context.json(createPaginationResponse(DataSources, page, size)));
  }),
  rest.get(`${appConfig.apiPrefix}/data-sources/count`, (req, res, context) => {
    return res(context.json({ count: DataSources.length }));
  }),
  rest.get(`${appConfig.apiPrefix}/data-sources/:id/vertices`, (_req, res, context) =>
    res(context.json(shuffle(Vertices).splice(0, random(10, 20))))),
];
