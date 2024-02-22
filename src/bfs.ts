export type StepType = {
  visited: string[];
  queue: string[];
};

export const bfs = (
  graph: Map<string, string[]>,
  source: string
): StepType[] => {
  let steps: StepType[] = [];
  let visited: Set<string> = new Set();
  let queue: string[] = [source];

  // Enqueue the source node
  steps.push({ visited: Array.from(visited), queue: [...queue] }); // Snapshot before starting

  while (queue.length > 0) {
    const node = queue.shift()!; // Assume non-null assertion is safe here
    if (!visited.has(node)) {
      visited.add(node); // Mark the node as visited upon dequeuing

      // Snapshot after dequeuing and marking visited
      steps.push({ visited: Array.from(visited), queue: [...queue] });

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }

      // Optionally, take a snapshot here after enqueuing all unvisited neighbors
      // steps.push({ visited: Array.from(visited), queue: [...queue] });
    }
  }

  return steps;
};
