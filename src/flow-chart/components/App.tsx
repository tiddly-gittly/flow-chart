import { useState } from 'react';
import { Canvas, Node, NodeData, NodeDragType, createEdgeFromNodes, hasLink } from 'reaflow';
import { IDefaultWidgetProps, ParentWidgetContext } from 'tw-react';

import './App.css';
import { ITiddlerGraphResult } from '../utils/getNodeAndRelationship';
import { IFocusedState } from './types';
import { NodeViewMode } from './node/NodeViewMode';
import { NodeEditMode } from './node/NodeEditMode';

export interface IAppProps extends Partial<ITiddlerGraphResult>, IDefaultWidgetProps {
  /**
   * root of a flow chart
   * the whole wiki is a graph of nodes, you can select multiple node in the graph as rootTiddler, to view a sub graph of the wiki.
   */
  rootTiddler: string;
  direction?: 'RIGHT';
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
    <ParentWidgetContext.Provider value={props.parentWidget}>
      <Canvas
        className="flow-chart-container"
        maxWidth={props.width}
        maxHeight={props.height}
        nodes={nodes}
        edges={edges}
        direction={props.direction}
        fit={true}
        onNodeLinkCheck={(_event, from: NodeData, to: NodeData) => {
          if (from.id === to.id) {
            return false;
          }

          if (hasLink(edges, from, to)) {
            return false;
          }

          return true;
        }}
        onNodeLink={(event, from, to) => {
          const tiddlerToChange = $tw.wiki.getTiddler(from.id);
          if (!tiddlerToChange) {
            return;
          }

          if (event.dragType === 'port') {
            $tw.wiki.addTiddler({ ...tiddlerToChange.fields, tags: [...tiddlerToChange.fields.tags, to.id] });
          }
        }}
        node={(props) => {
          const width = Math.max(props.width, minNodeWidth);
          const sharedNodeOptions = {
            style: { width },
            dragType: 'port' as NodeDragType,
            dragCursor: 'grab',
          };
          if (focusedState.id === props.id && focusedState.state === 'edit') {
            return (
              <Node {...props} {...sharedNodeOptions}>
                {(nodeProps) => <NodeEditMode {...nodeProps} width={width} focusedStateSetter={focusedStateSetter} />}
              </Node>
            );
          }
          return (
            <Node {...props} {...sharedNodeOptions}>
              {(nodeProps) => <NodeViewMode {...nodeProps} width={width} focusedState={focusedState} focusedStateSetter={focusedStateSetter} />}
            </Node>
          );
        }}
      />
    </ParentWidgetContext.Provider>
  );
}
