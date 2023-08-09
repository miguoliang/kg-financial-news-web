import * as echarts from "echarts/core";
import { ComposeOption } from "echarts/core";
import { GridComponent, GridComponentOption, LegendComponent, LegendComponentOption } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from "echarts/charts";

echarts.use([
  LineChart,
  BarChart,
  LegendComponent,
  CanvasRenderer,
  GridComponent,
]);

export type ECLineOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | LegendComponentOption
  | GridComponentOption
>;

export default echarts;