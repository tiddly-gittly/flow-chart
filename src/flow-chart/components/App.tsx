import { Canvas } from 'reaflow';
import { getChildTiddlersRecursively } from '../utils/getNodeAndRelationship';

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
}

export function App(props: IAppProps): JSX.Element {
  // TODO: only support tags, until we have time to add config and use kin-filter later
  // const relationshipField = props.field || 'tags';
  const { nodes, edges } = getChildTiddlersRecursively(props.rootTiddler);
  return <Canvas maxWidth={props.width} maxHeight={props.height} nodes={nodes} edges={edges} />;
}
