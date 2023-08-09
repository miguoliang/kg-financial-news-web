import { TimeSeries } from "./common";
import { createQuery } from "react-query-kit";
import AxiosFetch from "./AxiosFetch";

interface KnowledgeHistoryParams {
  days?: number;
}

interface KnowledgeHistoryResponse {
  knowledge: TimeSeries;
  vertices: TimeSeries;
  edges: TimeSeries;
  properties: TimeSeries;
}

export const useGetKnowledgeHistory = createQuery<KnowledgeHistoryResponse, KnowledgeHistoryParams>({
  primaryKey: "get.knowledge.history",
  queryFn: ({ queryKey: [, params] }) => AxiosFetch<KnowledgeHistoryResponse>({
    url: "/knowledge/history",
    method: "get",
    params,
  }).then(res => res.data),
});

interface StorageHistoryParams {
  months?: number;
}

interface StorageHistoryResponse {
  database: TimeSeries;
  file: TimeSeries;
  usage: TimeSeries;
}

export const useGetStorageHistory = createQuery<StorageHistoryResponse, StorageHistoryParams>({
  primaryKey: "get.storage.history",
  queryFn: ({ queryKey: [, params] }) => AxiosFetch<StorageHistoryResponse>({
    url: "/storage/history",
    method: "get",
    params,
  }).then(res => res.data),
});