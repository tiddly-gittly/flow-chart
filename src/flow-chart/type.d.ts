declare module '$:/plugins/linonetwo/tw-react/widget.js' {
  import type { ReactWidget } from 'tw-react';
  export const widget: typeof ReactWidget;
}

declare module '$:/plugins/linonetwo/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp.js' {
  import type { FunctionComponent } from 'react';

  export const App: FunctionComponent<any>;
}

declare module '$:/plugins/linonetwo/flow-chart/components/ReaFlowLibrary' {
  export { Canvas, Edge, Node, hasLink } from 'reaflow';
}
