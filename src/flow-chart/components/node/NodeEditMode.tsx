import { useCallback, useEffect, useState } from 'react';
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
  const [errorMessage, errorMessageSetter] = useState('');
  useEffect(() => {
    // update to latest name, if changed in wiki
    editingIDSetter(props.node.id);
  }, [props.node.id]);
  const onDone = useCallback(() => {
    const currentTiddler = $tw.wiki.getTiddler(props.node.id);
    if (currentTiddler !== undefined) {
      // rename and relink tiddler
      $tw.rootWidget.dispatchEvent({
        type: 'tm-rename-tiddler',
        paramObject: { from: props.node.id, to: editingID, renameInTags: 'yes', renameInLists: 'yes' },
      });
    } else {
      throw new Error(`"${props.node.id}" Not exist and can't be renamed to "${editingID}"`);
    }
  }, [props.node.id, editingID]);
  useEffect(() => {
    if (editingID === props.node.id) return;
    const existedTiddlerWithSameName = $tw.wiki.getTiddler(editingID);
    if (existedTiddlerWithSameName) {
      const existedText = $tw.wiki.getTiddlerText('$:/language/EditTemplate/Title/Exists/Prompt');
      errorMessageSetter(existedText ?? 'Existed');
      return;
    }
    errorMessageSetter('');
  }, [props.node.id, editingID]);
  return (
    <foreignObject
      height={props.height + topExtraAreaHeight}
      width={props.width}
      x={0}
      y={-topExtraAreaHeight / 2}
      className="flow-chart-edit-node flow-chart-mouse-event-node">
      <div>
        <input
          type="text"
          value={editingID}
          autoFocus
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            editingIDSetter(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.code === 'Enter') {
              onDone();
            }
          }}
          className="flow-chart-edit-input"
        />
        {!errorMessage && (
          <button onClick={onDone} className="flow-chart-button flow-chart-edit-done-button">
            ✓
          </button>
        )}
        {errorMessage && <span className="flow-chart-edit-error-message">{errorMessage}</span>}
      </div>
    </foreignObject>
  );
}
