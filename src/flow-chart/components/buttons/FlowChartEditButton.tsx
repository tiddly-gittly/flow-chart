import { useCallback, MouseEvent } from 'react';

import type { IFocusedState } from '../types';

interface IProps {
  tiddlerTitle: string;
  focusedStateSetter: (newState: IFocusedState) => void;
}
export function FlowChartEditButton(props: IProps) {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      props.focusedStateSetter({ id: props.tiddlerTitle, state: 'edit' });
    },
    [props.tiddlerTitle],
  );
  return (
    <button className="flow-chart-button flow-chart-edit-node-button" onClick={onClick}>
      ✎
    </button>
  );
}
