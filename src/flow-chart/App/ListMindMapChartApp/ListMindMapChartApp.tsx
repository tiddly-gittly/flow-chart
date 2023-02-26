import { useState, MouseEvent } from 'react';
import { IDefaultWidgetProps } from 'tw-react';
import type { NodeData, NodeDragType } from 'reaflow';

import { navigateToTiddlerInDefaultLayout } from 'src/flow-chart/utils/navigateToTiddlerInDefaultLayout';
import { NodeEditMode } from 'src/flow-chart/components/node/NodeEditMode';
import { NodeViewMode } from 'src/flow-chart/components/node/NodeViewMode';
import { IFocusedState } from 'src/flow-chart/components/types';
import { ITiddlerGraphResult } from 'src/flow-chart/utils/getNodeAndRelationship';
import * as ReaFlowLibrary from '$:/plugins/linonetwo/flow-chart/components/ReaFlowLibrary';

import './style.css';

const { Canvas, Edge, Node, hasLink } = ReaFlowLibrary;

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
   * The title of a template tiddler, that will be used to create a new tiddler, this overwrites newTiddlerTemplate. Also work if not providing newTiddlerTemplate
   */
  newTiddlerTags?: string;
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
  const [focusedState, focusedStateSetter] = useState<IFocusedState>({ id: undefined, state: undefined });

  if (!nodes || !edges) {
    return <div>Loading...</div>;
  }
  // TODO: only support tags, until we have time to add config and use kin-filter later
  // const relationshipField = props.field || 'tags';

  return (
    <Canvas
      className="flow-chart-container"
      maxWidth={props.width}
      maxHeight={props.height}
      nodes={nodes}
      edges={edges}
      selections={focusedState.id ? [focusedState.id] : []}
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
      node={(nodeProps) => {
        const width = Math.max(nodeProps.width, minNodeWidth);
        const sharedNodeOptions = {
          style: { width },
          dragType: 'port' as NodeDragType,
          dragCursor: 'grab',
          removable: false,
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (focusedState.id === nodeProps.id) {
              // if already focused, jump to tiddler like being double clicked
              navigateToTiddlerInDefaultLayout(nodeProps.id, props.parentWidget);
            } else {
              focusedStateSetter({ id: nodeProps.id, state: 'focus' });
            }
          },
        };
        if (focusedState.id === nodeProps.id && focusedState.state === 'edit') {
          return (
            <Node {...nodeProps} {...sharedNodeOptions}>
              {(nodeCallbackProps) => <NodeEditMode {...nodeCallbackProps} width={width} focusedStateSetter={focusedStateSetter} />}
            </Node>
          );
        }
        return (
          <Node {...nodeProps} {...sharedNodeOptions}>
            {(nodeCallbackProps) => (
              <NodeViewMode
                {...nodeCallbackProps}
                width={width}
                focusedState={focusedState}
                focusedStateSetter={focusedStateSetter}
                newTiddlerTags={props.newTiddlerTags}
                newTiddlerTemplate={props.newTiddlerTemplate}
              />
            )}
          </Node>
        );
      }}
      edge={
        <Edge
          onClick={(event, edge) => {
            focusedStateSetter({ id: edge.id, state: 'focus' });
          }}
          onRemove={(event, edge) => {
            if (edge.from === undefined) return;
            const tiddlerToChange = $tw.wiki.getTiddler(edge.from);
            if (tiddlerToChange === undefined) return;

            const tagsWithoutEdgeTo = tiddlerToChange.fields.tags.filter((tag) => tag !== edge.to);

            $tw.wiki.addTiddler({ ...tiddlerToChange.fields, tags: tagsWithoutEdgeTo });
          }}
        />
      }
      onCanvasClick={(_event) => {
        focusedStateSetter({ id: undefined, state: undefined });
      }}
    />
  );
}

exports.App = App;
