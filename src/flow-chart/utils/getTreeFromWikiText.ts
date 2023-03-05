import type { PortData, EdgeData } from 'reaflow';
import type { IParseTreeNode } from 'tiddlywiki';
import type { ITiddlerGraphResult } from './getNodeAndRelationship';

const PORT_SUFFIX = '-port';
export function getPort(tiddlerTitle: string): PortData {
  return {
    id: `${tiddlerTitle}${PORT_SUFFIX}`,
    width: 10,
    height: 10,
    side: 'SOUTH',
  };
}

/**
 * Get nodes list and edges list, from wikiast
 * @param title
 * @returns
 */
export function getTreeFromWikiText(title: string): ITiddlerGraphResult {
  const results = {
    edges: [] as EdgeData[],
    nodes: [{ id: title, text: title, ports: [getPort(title)] }],
  };
  let wikiAst: IParseTreeNode[];
  try {
    const content = $tw.wiki.getTiddlerText(title) ?? '{}';
    wikiAst = $tw.wiki.parseText('text/vnd.tiddlywiki', content).tree;
  } catch {
    return results;
  }

  let counter = 0;
  const getId = () => {
    counter += 1;
    return String(counter);
  };

  // DFS the wikiast, for each node, append them to the nodes list
  const dfs = (node: IParseTreeNode, parentId?: string): void => {
    const currentNodeId = getId();
    results.nodes.push({ id: currentNodeId, text: node, ports: [getPort(title)] });
    if (parentId) {
      results.edges.push({
        id: `${parentId}-${currentNodeId}`,
        to: currentNodeId,
        from: parentId,
      });
    }
  };

  dfs(wikiAst);

  return results;
}

function getNodeText(node: IParseTreeNode): string {
  try {
    switch (node.type) {
      case 'element':
        switch (node.tag) {
          case 'ol':
          case 'ul':
            return '';
          case 'li':
            return node.children;
          default:
            break;
        }
        return $tw.wiki.makeWidget({ tree: [node] });
      default:
        return '';
    }
  } catch (error) {
    console.error(`$:/plugins/linonetwo/flow-chart/App/ListMindMapChartApp getNodeText Error: ${(error as Error).message}`);
    return '';
  }
}
