import { IChangedTiddlers } from 'tiddlywiki';
import type { ReactWidget } from 'tw-react';

import { App, IAppProps } from './components/App';
// import { widget as ReactWidget } from '$:/plugins/linonetwo/tw-react/widget.js';

const Widget = require('$:/plugins/linonetwo/tw-react/widget.js').widget as typeof ReactWidget;

class FlowChartWidget extends Widget<IAppProps> {
  public reactComponent = App;

  private rootTiddler?: string;

  public getProps = () => {
    return {
      currentTiddler: this.rootTiddler,
      height: this.getAttribute('height') && Number(this.getAttribute('height')),
      width: this.getAttribute('width') && Number(this.getAttribute('width')),
      field: 'tags',
    };
  };

  public refresh(changedTiddlers: IChangedTiddlers): boolean {
    if (this.rootTiddler === undefined) return false;
    const changedAttributes = this.computeAttributes();
    if ($tw.utils.count(changedAttributes) > 0 || changedTiddlers[this.rootTiddler]?.modified === true) {
      this.refreshSelf();
      return true;
    }
    return false;
  }

  execute() {
    /** don't use `this.getVariable('currentTiddler')` otherwise it will overwrite the widget. */
    this.rootTiddler = this.getAttribute('tiddler');
    // Make the child widgets
    this.makeChildWidgets();
  }
}

exports.flowchart = FlowChartWidget;
