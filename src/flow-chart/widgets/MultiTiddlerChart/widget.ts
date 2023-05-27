import { IChangedTiddlers } from 'tiddlywiki';
import type { NodeData } from 'reaflow';

import type { IAppProps } from 'src/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp';
import { ITiddlerGraphResult, getChildTiddlersRecursively, getPort } from 'src/flow-chart/utils/getNodeAndRelationship';
// import { widget as ReactWidget } from '$:/plugins/linonetwo/tw-react/widget.js';
import * as App from '$:/plugins/linonetwo/flow-chart/App/MultiTiddlerChartApp/MultiTiddlerChartApp.js';
import * as Widget from '$:/plugins/linonetwo/tw-react/widget.js';

class FlowChartWidget extends Widget.widget<IAppProps> {
  public reactComponent = App.App;

  private rootTiddler?: string;
  private invertArrow?: boolean;
  private nodes?: ITiddlerGraphResult['nodes'];
  private edges?: ITiddlerGraphResult['edges'];

  public getProps = () => {
    return {
      rootTiddler: this.rootTiddler,
      newTiddlerTemplate: this.getAttribute('$template'),
      newTiddlerTags: this.getAttribute('$template-tags'),
      /** can be RIGHT */
      direction: this.getAttribute('direction'),
      // a default height
      height: this.getAttribute('height') ? Number(this.getAttribute('height')?.replace('px', '')) : 500,
      // default to full width 100%, but it requires number, so we have to get number from parent element
      width: this.getAttribute('width') ? Number(this.getAttribute('width')?.replace('px', '')) : (this.parentDomNode as HTMLElement)?.offsetWidth,
      invertArrow: this.invertArrow,
      field: 'tags',
      nodes: this.nodes,
      edges: this.edges,
    };
  };

  private calculateGraph() {
    if (this.rootTiddler === undefined) return;
    const subfilter = this.getAttribute('subfilter');
    const { nodes, edges } = getChildTiddlersRecursively(this.rootTiddler, { invertArrow: this.invertArrow, subfilter, widget: this });
    let extraNodes = this.getExtraNodes();
    if (extraNodes.length > 0) {
      const existedNodeId = nodes.map((node) => node.id);
      extraNodes = extraNodes.filter((node) => !existedNodeId.includes(node.id));
    }
    this.nodes = [...nodes, ...extraNodes];
    this.edges = edges;
  }

  private getExtraNodes(): NodeData[] {
    /** Filter to get extra nodes shown as orphan node in the graph, awaited to be connected */
    const extraNodesFilter = this.getAttribute('extra');
    if (!extraNodesFilter) return [];
    const extraTiddlers = $tw.wiki.filterTiddlers(extraNodesFilter);
    return extraTiddlers.map((title) => ({ id: title, text: title, ports: [getPort(title)] }));
  }

  public refresh(changedTiddlers: IChangedTiddlers): boolean {
    if (this.rootTiddler === undefined) return false;
    const changedAttributes = this.computeAttributes();
    this.calculateGraph();
    const someNodesChanged = this.nodes?.some((node) => changedTiddlers[node.id]?.modified === true || changedTiddlers[node.id]?.deleted === true);
    if ($tw.utils.count(changedAttributes) > 0 || someNodesChanged) {
      this.refreshSelf();
      return true;
    }
    return false;
  }

  execute() {
    /** don't use `this.getVariable('currentTiddler')` otherwise it will overwrite the widget. */
    this.rootTiddler = this.getAttribute('tiddler');
    this.invertArrow = this.getAttribute('invert') === 'yes';
    if (!this.nodes && !this.edges) {
      this.calculateGraph();
    }
    // Make the child widgets
    this.makeChildWidgets();
  }
}

exports.flowchart = FlowChartWidget;
