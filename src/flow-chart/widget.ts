import { IChangedTiddlers } from 'tiddlywiki';
import type { ReactWidget } from 'tw-react';

import { App, IAppProps } from './components/App';
import { ITiddlerGraphResult, getChildTiddlersRecursively } from './utils/getNodeAndRelationship';
// import { widget as ReactWidget } from '$:/plugins/linonetwo/tw-react/widget.js';

const Widget = require('$:/plugins/linonetwo/tw-react/widget.js').widget as typeof ReactWidget;

class FlowChartWidget extends Widget<IAppProps> {
  public reactComponent = App;

  private rootTiddler?: string;
  private invertArrow?: boolean;
  private nodes?: ITiddlerGraphResult['nodes'];
  private edges?: ITiddlerGraphResult['edges'];

  public getProps = () => {
    return {
      rootTiddler: this.rootTiddler,
      newTiddlerTemplate: this.getAttribute('$template'),
      // a default height
      height: this.getAttribute('height') ? Number(this.getAttribute('height')) : 500,
      // default to full width 100%, but it requires number, so we have to get number from parent element
      width: this.getAttribute('width') ? Number(this.getAttribute('width')) : (this.parentDomNode as HTMLElement)?.offsetWidth,
      invertArrow: this.invertArrow,
      field: 'tags',
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
    this.calculateGraph();
    const someNodesChanged = this.nodes?.some((node) => changedTiddlers[node.id]?.modified === true);
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
