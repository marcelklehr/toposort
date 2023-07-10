import { makeNodesHash, makeOutgoingEdges, uniqueNodes } from "./helpers.js";

export const validateEdges = (nodes: unknown[], edges: unknown[][]) => {
  const nodesHash = makeNodesHash(nodes);
  edges.forEach(function (edge) {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error(
        "Unknown node. There is an unknown node in the supplied edges."
      );
    }
  });
};

export const validateArgs = (opts: {
  edges: unknown[][];
  nodes?: unknown[];
}) => {
  if (!opts) {
    throw new Error("No parameter provided");
  }

  if (!opts.edges) {
    throw new Error("Missing edges in opts");
  }
};

export function validateDag({
  edges,
  nodes = uniqueNodes(edges),
  outgoing = makeOutgoingEdges(edges),
}: {
  edges: unknown[][];
  nodes?: unknown[];
  outgoing?: Map<any, any>;
}) {
  const visited = new Set();
  const finished = new Set();

  const dfs = (node: unknown) => {
    if (finished.has(node)) {
      return;
    }
    if (visited.has(node)) {
      throw new Error("Cyclic dependency, node was:" + node);
    }
    visited.add(node);
    outgoing.get(node).forEach((node: any) => dfs(node));
    finished.add(node);
  };
  nodes.forEach((node) => dfs(node));
}
