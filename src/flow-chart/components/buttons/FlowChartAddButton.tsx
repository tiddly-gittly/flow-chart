import type { Tiddler } from 'tiddlywiki';
import { useCallback, MouseEvent } from 'react';

import type { IFocusedState } from '../types';

interface IProps {
  tiddlerTitle: string;
  newTiddlerTemplate?: string;
  newTiddlerTags?: string;
  focusedStateSetter: (newState: IFocusedState) => void;
}
export function FlowChartAddButton(props: IProps) {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      let templateTiddler: Partial<Tiddler> | void = {};
      if (props.newTiddlerTemplate) {
        templateTiddler = $tw.wiki.getTiddler(props.newTiddlerTemplate);
      }
      const newTiddlerTitle = `${props.tiddlerTitle} 1`;
      const tagsFromTemplate = props.newTiddlerTags ? $tw.utils.parseStringArray(props.newTiddlerTags) ?? [] : [];
      $tw.wiki.addTiddler({
        title: newTiddlerTitle,
        ...templateTiddler?.fields,
        tags: [...(templateTiddler?.fields?.tags ?? []), ...tagsFromTemplate, props.tiddlerTitle],
      });
      setTimeout(() => {
        props.focusedStateSetter({ id: newTiddlerTitle, state: 'edit' });
      }, 0);
    },
    [props.tiddlerTitle, props.newTiddlerTemplate],
  );
  return (
    <button className="flow-chart-button flow-chart-add-node-button" onClick={onClick}>
      +
    </button>
  );
}
