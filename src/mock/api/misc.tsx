import { appConfig } from "../../configs";
import { rest } from "msw";
import times from "lodash-es/times";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

export default [
  rest.get(`${appConfig.apiPrefix}/knowledge/history`, (req, res, context) => {
    return res(context.json(randomKnowledgeStatData(Number(req.url.searchParams.get("days")))));
  }),
  rest.get(`${appConfig.apiPrefix}/storage/history`, (req, res, context) => {
    return res(context.json(randomStorageStatData(Number(req.url.searchParams.get("months")))));
  }),
];

function randomStorageStatData(months: number = 30) {
  const database = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 10, max: 500 }),
  }));
  const file = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 100, max: 1000 }),
  }));
  const usage = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.float({ min: 10, max: 100 }),
  }));
  return { database, file, usage };
}

function randomKnowledgeStatData(days: number = 30) {
  const vertices = times(days, (i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: faker.number.int({ min: 1000, max: 10000 }),
  }));
  const edges = times(days, (i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: faker.number.int({ min: 1000, max: 10000 }),
  }));
  const properties = times(days, (i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: faker.number.int({ min: 1000, max: 10000 }),
  }));
  const knowledge = times(days, (i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: vertices[i].value + edges[i].value + properties[i].value,
  }));
  return { vertices, edges, properties, knowledge };
}