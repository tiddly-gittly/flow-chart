import type { PortData, EdgeData, NodeData } from 'reaflow';
import type { Widget } from 'tiddlywiki';

export interface ITiddlerGraphResult {
  nodes: NodeData[];
  edges: EdgeData[];
}
export interface ITiddlerGraphOptions {
  invertArrow: boolean;
  subfilter?: string;
  widget: Widget;
}

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
 * Get nodes list and edges list, started from title (as tag for its child), arrow point to this title.
 * This means tags are parent project, and child are sub-tasks.
 * Copy from https://talk.tiddlywiki.org/t/recursive-filter-operators-to-show-all-tiddlers-beneath-a-tag-and-all-tags-above-a-tiddler/3814
 * @param title
 * @param results
 * @param options
 * @returns
 */
export function getChildTiddlersRecursively(
  title: string,
  options?: Partial<ITiddlerGraphOptions>,
  previousResults?: ITiddlerGraphResult,
): ITiddlerGraphResult {
  const results = previousResults ?? {
    edges: [] as EdgeData[],
    nodes: [{ id: title, text: title, ports: [getPort(title)] }],
  };
  // get tagging[] list at this level
  let intermediate = $tw.wiki.getTiddlersWithTag(title);
  if (options?.subfilter) {
    // filter out unwanted titles
    intermediate = $tw.wiki.filterTiddlers(options.subfilter, options.widget, $tw.wiki.makeTiddlerIterator(intermediate));
  }
  // add edges first. We are going to modify intermediate list later
  results.edges.push(
    ...intermediate.map((childTitle) =>
      options?.invertArrow
        ? {
            id: `${title}-${childTitle}`,
            to: childTitle,
            from: title,
          }
        : {
            id: `${title}-${childTitle}`,
            from: childTitle,
            to: title,
          },
    ),
  );
  // remove any that are already in the results array to avoid loops
  // and make node list without duplication
  // code adapted from $tw.utils.pushTop
  if (intermediate.length === 0) {
    // no result at this level (at leaf), just return
    return results;
  }
  if (results.nodes.length === 0) {
    // when parent result is empty, will not have duplication, skip
  }
  // loop over all elements
  else if (results.nodes.length < intermediate.length) {
    for (let tiddlerIndex = 0; tiddlerIndex < results.nodes.length; tiddlerIndex += 1) {
      const duplicationIndex = intermediate.indexOf(results.nodes[tiddlerIndex].id);
      if (duplicationIndex !== -1) {
        intermediate.splice(duplicationIndex, 1);
      }
    }
  } else {
    for (let tiddlerIndex = intermediate.length - 1; tiddlerIndex >= 0; tiddlerIndex -= 1) {
      const duplicationIndex = results.nodes.findIndex((item) => item.id === intermediate[tiddlerIndex]);

      if (duplicationIndex !== -1) {
        intermediate.splice(tiddlerIndex, 1);
      }
    }
  }
  // now we have intermediate array without duplication
  // add the remaining intermediate results and traverse the hierarchy further
  results.nodes.push(...intermediate.map((childTitle) => ({ id: childTitle, text: childTitle, ports: [getPort(childTitle)] })));

  intermediate.forEach(function (title) {
    getChildTiddlersRecursively(title, options, results);
  });
  return results;
}
