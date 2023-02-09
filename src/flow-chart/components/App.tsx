import { useState } from 'react';
import { Canvas, Node } from 'reaflow';

import './App.css';
import { ITiddlerGraphResult } from '../utils/getNodeAndRelationship';
import { IFocusedState } from './types';
import { NodeViewMode } from './node/NodeViewMode';
import { NodeEditMode } from './node/NodeEditMode';

export interface IAppProps extends Partial<ITiddlerGraphResult> {
  /**
   * root of a flow chart
   * the whole wiki is a graph of nodes, you can select multiple node in the graph as rootTiddler, to view a sub graph of the wiki.
   */
  rootTiddler: string;
  /**
   * The title of a template tiddler, that will be used to create a new tiddler
   */
  newTiddlerTemplate?: string;
  /**
   * Field to get relationship between nodes, default to `tags` field
   */
  field?: string;
  height?: number;
  width?: number;
  /**
   * By default, the arrow is childTiddler-[tagWith]->TagTiddler
   * But you can invert the arrow by passing "yes" to this
   */
  invertArrow: boolean;
}

/** need to add two button with width 27px */
const minNodeWidth = 27 * 2 + 16;

export function App(props: IAppProps): JSX.Element {
  const { nodes, edges } = props;
  if (!nodes || !edges) {
    return <div>Loading...</div>;
  }
  // TODO: only support tags, until we have time to add config and use kin-filter later
  // const relationshipField = props.field || 'tags';

  const [focusedState, focusedStateSetter] = useState<IFocusedState>({ id: undefined, state: undefined });
  return (
    <Canvas
      className="flow-chart-container"
      maxWidth={props.width}
      maxHeight={props.height}
      nodes={nodes}
      edges={edges}
      fit={true}
      node={(props) => {
        const width = Math.max(props.width, minNodeWidth);
        if (focusedState.id === props.id && focusedState.state === 'edit') {
          return (
            <Node {...props} style={{ width }}>
              {(nodeProps) => <NodeEditMode {...nodeProps} width={width} focusedStateSetter={focusedStateSetter} />}
            </Node>
          );
        }
        return (
          <Node {...props} style={{ width }}>
            {(nodeProps) => <NodeViewMode {...nodeProps} width={width} focusedState={focusedState} focusedStateSetter={focusedStateSetter} />}
          </Node>
        );
      }}
    />
  );
}
