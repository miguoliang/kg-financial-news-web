import { DataSource } from "models/data-source";
import { faker } from "@faker-js/faker";
import { times } from "lodash";

export const dataSources: DataSource[] = times(100, i => ({
  id: i,
  title: faker.lorem.sentence(),
  source: faker.internet.url(),
  sourceType: "url",
  contentType: "text",
  content: faker.lorem.paragraph(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.past().toISOString(),
}));
