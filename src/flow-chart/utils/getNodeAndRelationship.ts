export interface ITiddlerGraphResult {
  nodes: {
    id: string;
    text: string;
  }[];
  edges: {
    id: string;
    from: string;
    to: string;
  }[];
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
export function getChildTiddlersRecursively(title: string, previousResults?: ITiddlerGraphResult): ITiddlerGraphResult {
  const results = previousResults ?? {
    edges: [],
    nodes: [{ id: title, text: title }],
  };
  // get tagging[] list at this level
  const intermediate = $tw.wiki.getTiddlersWithTag(title);
  // remove any that are already in the results array to avoid loops
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
  results.nodes.push(...intermediate.map((childTitle) => ({ id: childTitle, text: childTitle })));
  results.edges.push(
    ...intermediate.map((childTitle) => ({
      id: `${title}-${childTitle}`,
      from: childTitle,
      to: title,
    })),
  );

  intermediate.forEach(function (title) {
    getChildTiddlersRecursively(title, results);
  });
  return results;
}
