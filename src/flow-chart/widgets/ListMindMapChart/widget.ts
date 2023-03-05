import { IChangedTiddlers } from 'tiddlywiki';
import type { NodeData } from 'reaflow';

import type { IAppProps } from 'src/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp';
import { ITiddlerGraphResult, getChildTiddlersRecursively, getPort } from 'src/flow-chart/utils/getNodeAndRelationship';
// import { widget as ReactWidget } from '$:/plugins/linonetwo/tw-react/widget.js';
import * as App from '$:/plugins/linonetwo/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp.js';
import * as Widget from '$:/plugins/linonetwo/tw-react/widget.js';

class MindMapFlowChartWidget extends Widget.widget<IAppProps> {
  public reactComponent = App.App;

  private rootTiddler?: string;
  private nodes?: ITiddlerGraphResult['nodes'];
  private edges?: ITiddlerGraphResult['edges'];

  public getProps = () => {
    return {
      rootTiddler: this.rootTiddler,
      /** can be RIGHT */
      direction: this.getAttribute('direction'),
      // a default height
      height: this.getAttribute('height') ? Number(this.getAttribute('height')?.replace('px', '')) : 500,
      // default to full width 100%, but it requires number, so we have to get number from parent element
      width: this.getAttribute('width') ? Number(this.getAttribute('width')?.replace('px', '')) : (this.parentDomNode as HTMLElement)?.offsetWidth,
      nodes: this.nodes,
      edges: this.edges,
    };
  };

  private calculateGraph() {
    if (this.rootTiddler === undefined) return;
    const { nodes, edges } = getChildTiddlersRecursively(this.rootTiddler, { invertArrow: this.invertArrow });
    this.nodes = nodes;
    this.edges = edges;
  }

  public refresh(changedTiddlers: IChangedTiddlers): boolean {
    if (this.rootTiddler === undefined) return false;
    const changedAttributes = this.computeAttributes();
    if ($tw.utils.count(changedAttributes) > 0 || changedTiddlers[this.rootTiddler]) {
      this.refreshSelf();
      return true;
    }
    return false;
  }

  execute() {
    /** don't use `this.getVariable('currentTiddler')` otherwise it will overwrite the widget. */
    this.rootTiddler = this.getAttribute('tiddler');
    if (!this.nodes && !this.edges) {
      this.calculateGraph();
    }
    // Make the child widgets
    this.makeChildWidgets();
  }
}

exports.mindMapFlowChart = MindMapFlowChartWidget;
