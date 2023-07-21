import { ComponentProps, LazyExoticComponent } from "react";

export type Route = {
  path: string;
  key: string;
  component: LazyExoticComponent<(props: ComponentProps<any>) => JSX.Element>;
  authority?: string[];
  label?: string;
  meta?: Record<string, any>;
};

export type Routes = Route[];
