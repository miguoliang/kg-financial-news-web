import { IdType } from "vis-network";

export type Node = {
  id: IdType;
  label: string;
} & Record<string, any>;

export type Link = {
  from: IdType;
  to: IdType;
  label?: string;
  smooth?: boolean;
} & Record<string, any>;