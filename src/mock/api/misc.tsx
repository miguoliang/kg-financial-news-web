import { appConfig } from "../../configs";
import { rest } from "msw";
import times from "lodash-es/times";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

export default [
  rest.get(`${appConfig.apiPrefix}/knowledge/history`, (req, res, context) => {
    return res(
      context.json(
        randomKnowledgeStatData(Number(req.url.searchParams.get("days"))),
      ),
    );
  }),
  rest.get(`${appConfig.apiPrefix}/storage/history`, (req, res, context) => {
    return res(
      context.json(
        randomStorageStatData(Number(req.url.searchParams.get("months"))),
      ),
    );
  }),
  rest.get(`${appConfig.apiPrefix}/network/history`, (req, res, context) => {
    return res(
      context.json(
        randomNetworkStatData(Number(req.url.searchParams.get("months"))),
      ),
    );
  }),
  rest.get(`${appConfig.apiPrefix}/compute/history`, (req, res, context) => {
    return res(
      context.json(
        randomComputeStatData(Number(req.url.searchParams.get("months"))),
      ),
    );
  }),
  rest.get(`${appConfig.apiPrefix}/data-source/history`, (req, res, context) => {
    return res(
      context.json(
        randomDataSourceStatData(Number(req.url.searchParams.get("months"))),
      ),
    );
  }),
];

function randomDataSourceStatData(months: number = 30) {
  const file = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  const website = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  const database = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  return { file, website, database };
}

function randomComputeStatData(months: number = 30) {
  const hours = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  return { hours };
}

function randomNetworkStatData(months: number = 30) {
  const read = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  const write = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  return { read, write };
}

function randomStorageStatData(months: number = 30) {
  const database = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  const file = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.int({ min: 500, max: 50000 }),
  }));
  const usage = times(months, (i) => ({
    date: dayjs().subtract(i, "month").format("YYYY-MM"),
    value: faker.number.float({ min: 0, max: 1 }),
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
  return { vertices, edges, properties };
}
