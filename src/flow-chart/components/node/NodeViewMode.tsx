import { NodeChildProps } from 'reaflow';
import { FlowChartAddButton } from '../buttons/FlowChartAddButton';
import { IFocusedState } from '../types';
import { FlowChartEditButton } from '../buttons/FlowChartEditButton';

/** move up a bit to make room for the add button */
const topExtraAreaHeight = 20;

interface IOwnProps {
  newTiddlerTemplate?: string;
  newTiddlerTags?: string;
  focusedStateSetter: (newState: IFocusedState) => void;
  focusedState: IFocusedState;
}

export function NodeViewMode(props: NodeChildProps & IOwnProps) {
  const focused = props.focusedState.id === props.node.id && props.focusedState.state === 'focus';
  return (
    <foreignObject
      height={props.height + topExtraAreaHeight}
      width={props.width}
      x={0}
      y={-topExtraAreaHeight / 2}
      className={`flow-chart-mouse-event-node ${focused ? 'flow-chart-focused-node' : 'flow-chart-node-view-mode'}`}>
      {focused && (
        <div className="flow-chart-buttons-container">
          <FlowChartAddButton
            tiddlerTitle={props.node.id}
            newTiddlerTemplate={props.newTiddlerTemplate}
            newTiddlerTags={props.newTiddlerTags}
            focusedStateSetter={props.focusedStateSetter}
          />
          <FlowChartEditButton tiddlerTitle={props.node.id} focusedStateSetter={props.focusedStateSetter} />
        </div>
      )}
    </foreignObject>
  );
}
