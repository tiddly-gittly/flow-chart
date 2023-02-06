import { Canvas, Node } from 'reaflow';
import { getChildTiddlersRecursively } from '../utils/getNodeAndRelationship';
import './App.css';

export interface IAppProps {
  /**
   * root of a flow chart
   * the whole wiki is a graph of nodes, you can select multiple node in the graph as rootTiddler, to view a sub graph of the wiki.
   */
  rootTiddler: string;
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

/** move up a bit to make room for the add button */
const topExtraAreaHeight = 20;

export function App(props: IAppProps): JSX.Element {
  const { invertArrow } = props;
  // TODO: only support tags, until we have time to add config and use kin-filter later
  // const relationshipField = props.field || 'tags';
  const { nodes, edges } = getChildTiddlersRecursively(props.rootTiddler, { invertArrow });
  return (
    <Canvas
      className="flow-chart-container"
      maxWidth={props.width}
      maxHeight={props.height}
      nodes={nodes}
      edges={edges}
      fit={true}
      node={
        <Node>
          {(nodeProps) => {
            // DEBUG: console events
            console.log(`event`, nodeProps);
            return (
              <foreignObject height={nodeProps.height + topExtraAreaHeight} width={nodeProps.width} x={0} y={-topExtraAreaHeight / 2}>
                <div className="flow-chart-add-node-container">
                  <button className="flow-chart-add-node-button">+</button>
                </div>
              </foreignObject>
            );
          }}
        </Node>
      }
      onLayoutChange={(layout) => console.log('Layout', layout)}
    />
  );
}
