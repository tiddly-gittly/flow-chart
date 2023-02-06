(function flowChartWidgetIIFE() {
  // eslint-disable-next-line no-undef
  if (!$tw.browser) {
    return;
  }
  // separate the widget from the exports here, so we can skip the require of react code if `!$tw.browser`. Those ts code will error if loaded in the nodejs side.
  const components = require('$:/plugins/linonetwo/flow-chart/widget.js');
  // DEBUG: console components
  console.log(`components`, components);
  const { flowchart } = components;
  exports.flowchart = flowchart;
})();
