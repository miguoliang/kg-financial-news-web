export type Node<VALUE = any> = {
  id: string | number;
  label: string;
  value?: VALUE;
} & Record<string, any>;

type MarkerType = "none" | "normal" | "reverse" | "bidirectional";

export type Link<VALUE = any> = {
  source: Node<VALUE>;
  target: Node<VALUE>;
  marker?: MarkerType;
  type: string;
} & Record<string, any>;

export type Graph<VALUE = any> = Link<VALUE>[];