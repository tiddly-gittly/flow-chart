import { ParentWidgetContext } from 'tw-react';
import { useContext } from 'react';
import { NodeChildProps } from 'reaflow';
import { navigateToTiddlerInDefaultLayout } from 'src/flow-chart/utils/navigateToTiddlerInDefaultLayout';
import { FlowChartAddButton } from '../buttons/FlowChartAddButton';
import { IFocusedState } from '../types';
import { FlowChartEditButton } from '../buttons/FlowChartEditButton';

/** move up a bit to make room for the add button */
const topExtraAreaHeight = 20;

interface IOwnProps {
  newTiddlerTemplate?: string;
  focusedStateSetter: (newState: IFocusedState) => void;
  focusedState: IFocusedState;
}

export function NodeViewMode(props: NodeChildProps & IOwnProps) {
  const focused = props.focusedState.id === props.node.id && props.focusedState.state === 'focus';
  const context = useContext(ParentWidgetContext);
  return (
    <foreignObject
      height={props.height + topExtraAreaHeight}
      width={props.width}
      x={0}
      y={-topExtraAreaHeight / 2}
      onClick={() => props.focusedStateSetter({ id: props.node.id, state: 'focus' })}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        navigateToTiddlerInDefaultLayout(props.node.id, context?.parentWidget);
      }}
      className={focused ? 'flow-chart-focused-node' : 'flow-chart-node-view-mode'}>
      <div className="flow-chart-buttons-container">
        <FlowChartAddButton tiddlerTitle={props.node.id} newTiddlerTemplate={props.newTiddlerTemplate} focusedStateSetter={props.focusedStateSetter} />
        <FlowChartEditButton tiddlerTitle={props.node.id} focusedStateSetter={props.focusedStateSetter} />
      </div>
    </foreignObject>
  );
}
