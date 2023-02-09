import { useEffect, useState } from 'react';
import { NodeChildProps } from 'reaflow';
import { IFocusedState } from '../types';

/** move up a bit to make room for the add button */
const topExtraAreaHeight = 20;

interface IOwnProps {
  focusedStateSetter: (newState: IFocusedState) => void;
}

export function NodeEditMode(props: NodeChildProps & IOwnProps) {
  /** set id locally to debounce the update for performance reason */
  const [editingID, editingIDSetter] = useState(props.node.id);
  useEffect(() => {
    // update to latest name, if changed in wiki
    editingIDSetter(props.node.id);
  }, [props.node.id]);
  return (
    <foreignObject height={props.height + topExtraAreaHeight} width={props.width} x={0} y={-topExtraAreaHeight / 2}>
      <input
        type="text"
        value={editingID}
        onChange={(event) => {
          editingIDSetter(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.code === 'Enter') {
            const currentTiddler = $tw.wiki.getTiddler(props.node.id);
            if (currentTiddler !== undefined) {
              $tw.wiki.addTiddler({ ...currentTiddler.fields, title: editingID });
              $tw.wiki.deleteTiddler(props.node.id);
            } else {
              throw new Error(`"${props.node.id}" Not exist and can't be renamed to "${editingID}"`);
            }
          }
        }}
      />
    </foreignObject>
  );
}
