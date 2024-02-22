import Node from "./GraphNode";
import Edge from "./GraphEdge";
// Converts nodes and edges array to an adjacency list representation
export const convertToAdjacencyList = (
  nodes: Node[],
  edges: Edge[],
  isOriented: boolean
): Map<string, string[]> => {
  let adjacencyList = new Map<string, string[]>();

  // Initialize adjacency list with empty arrays for each node
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  // Filter out temporary edges where id2 is null
  const completeEdges = edges.filter((edge) => edge.id2 !== null);

  // Populate the adjacency list with complete edges
  completeEdges.forEach((edge) => {
    // Since we've filtered out temporary edges, we can assert that id2 is not null here
    let id2 = edge.id2 as string;

    adjacencyList.get(edge.id1)?.push(id2);
    if (!isOriented) {
      // Add the reverse edge for undirected graphs
      adjacencyList.get(id2)?.push(edge.id1);
    }
  });

  return adjacencyList;
};
