declare module '$:/plugins/linonetwo/tw-react/widget.js' {
  import type { IReactWidget } from 'tw-react';

  export const widget: IReactWidget;
}

declare module '$:/plugins/linonetwo/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp.js' {
  import type { FunctionComponent } from 'react';

  export const App: FunctionComponent<any>;
}

declare module '$:/plugins/linonetwo/flow-chart/components/ReaFlowLibrary' {
  export { Canvas, Edge, Node, hasLink } from 'reaflow';
}
