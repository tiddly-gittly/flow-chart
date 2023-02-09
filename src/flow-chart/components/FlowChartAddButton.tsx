import type { Tiddler } from 'tiddlywiki';
import { useCallback } from 'react';

import type { IFocusedState } from './types';

interface IProps {
  tiddlerTitle: string;
  newTiddlerTemplate?: string;
  focusedStateSetter: (newState: IFocusedState) => void;
}
export function FlowChartAddButton(props: IProps) {
  const onClick = useCallback(() => {
    let templateTiddler: Partial<Tiddler> | void = {};
    if (props.newTiddlerTemplate) {
      templateTiddler = $tw.wiki.getTiddler(props.newTiddlerTemplate);
    }
    const newTiddlerTitle = `${props.tiddlerTitle} 1`;
    $tw.wiki.addTiddler({
      title: newTiddlerTitle,
      ...templateTiddler?.fields,
      tags: [...(templateTiddler?.fields?.tags ?? []), props.tiddlerTitle],
    });
    props.focusedStateSetter({ id: newTiddlerTitle, state: 'edit' });
  }, [props.tiddlerTitle, props.newTiddlerTemplate]);
  return (
    <button className="flow-chart-add-node-button" onClick={onClick}>
      +
    </button>
  );
}
