import * as echarts from "echarts/core";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import { LegendComponent, LegendComponentOption } from "echarts/components";
import { ComposeOption } from "echarts/core";

echarts.use([
  GraphChart,
  LegendComponent,
]);

export type ECGraphOption = ComposeOption<
  | LegendComponentOption
  | GraphSeriesOption
>

export default echarts;