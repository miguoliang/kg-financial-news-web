import { accountApi, dataSourceApi, edgeApi, propertyApi, vertexApi } from "./api";
import { setupWorker } from "msw";

const handlers = [
  ...accountApi,
  ...dataSourceApi,
  ...edgeApi,
  ...propertyApi,
  ...vertexApi,
];

export const worker = setupWorker(...handlers);
