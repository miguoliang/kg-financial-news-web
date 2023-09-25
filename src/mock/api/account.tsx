import shuffle from "lodash-es/shuffle";
import first from "lodash-es/first";
import { rest } from "msw";
import { appConfig } from "configs";
import { Subscriptions } from "../seed";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

export default [
  rest.get(`${appConfig.apiPrefix}/account/subscriptions`, (_req, res, ctx) => {
    const shuffled = shuffle(Subscriptions);
    return res(ctx.json([first(shuffled)]));
  }),
  rest.get(`${appConfig.apiPrefix}/account/cost`, (_req, res, ctx) => {
    const endOfMonth = dayjs().endOf("month");
    const calendar = [];
    for (
      let date = dayjs().startOf("month");
      date.isBefore(endOfMonth);
      date = date.add(1, "day")
    ) {
      calendar.push(date.format("YYYY-MM-DD"));
    }

    return res(
      ctx.json({
        series: calendar.map((date) => ({
          date,
          value: faker.number.float({ min: 0, max: 100 }),
        })),
        usages: [
          {
            label: "Compute",
            amount: faker.number.float({ min: 0, max: 100 }),
          },
          {
            label: "Storage",
            amount: faker.number.float({ min: 0, max: 100 }),
          },
          {
            label: "Network",
            amount: faker.number.float({ min: 0, max: 100 }),
          },
        ],
        previous: faker.number.float({ min: 0, max: 100 }),
        current: faker.number.float({ min: 0, max: 100 }),
        forecast: faker.number.float({ min: 0, max: 100 }),
      }),
    );
  }),
];
