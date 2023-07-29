import * as echarts from "echarts/core";
import { ComposeOption } from "echarts/core";
import { GraphChart, GraphSeriesOption, TreemapChart, TreemapSeriesOption } from "echarts/charts";
import { LegendComponent, LegendComponentOption } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GraphChart,
  TreemapChart,
  LegendComponent,
  CanvasRenderer,
]);

export type ECGraphOption = ComposeOption<
  | LegendComponentOption
  | GraphSeriesOption
>

export type ECTreemapOption = ComposeOption<
  | TreemapSeriesOption
>


export default echarts;