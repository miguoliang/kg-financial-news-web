import * as echarts from "echarts/core";
import { ComposeOption } from "echarts/core";
import { GraphChart, GraphSeriesOption } from "echarts/charts";
import { LegendComponent, LegendComponentOption } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GraphChart,
  LegendComponent,
  CanvasRenderer,
]);

export type ECGraphOption = ComposeOption<
  | LegendComponentOption
  | GraphSeriesOption
>

export default echarts;