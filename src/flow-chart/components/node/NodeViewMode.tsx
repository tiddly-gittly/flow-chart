import { NodeChildProps } from 'reaflow';
import { FlowChartAddButton } from '../FlowChartAddButton';
import { IFocusedState } from '../types';

/** move up a bit to make room for the add button */
const topExtraAreaHeight = 20;

interface IOwnProps {
  newTiddlerTemplate?: string;
  focusedStateSetter: (newState: IFocusedState) => void;
}

export function NodeViewMode(props: NodeChildProps & IOwnProps) {
  return (
    <foreignObject height={props.height + topExtraAreaHeight} width={props.width} x={0} y={-topExtraAreaHeight / 2}>
      <div className="flow-chart-add-node-container">
        <FlowChartAddButton tiddlerTitle={props.node.id} newTiddlerTemplate={props.newTiddlerTemplate} focusedStateSetter={props.focusedStateSetter} />
      </div>
    </foreignObject>
  );
}
