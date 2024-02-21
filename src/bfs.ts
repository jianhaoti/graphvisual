// Define the type for a step in the BFS traversal
export type StepType = {
  visited: string[];
  queue: string[];
};

// BFS function that returns an array of steps for visualization
export const bfs = (
  graph: Map<string, string[]>,
  source: string
): StepType[] => {
  let steps: StepType[] = [];
  let visited: Set<string> = new Set([source]);
  let queue: string[] = [source];

  // Initial state
  steps.push({ visited: Array.from(visited), queue: [...queue] });

  while (queue.length > 0) {
    let node = queue.shift()!;
    let neighbors = graph.get(node) || [];

    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        // After adding a neighbor to the queue
        steps.push({ visited: Array.from(visited), queue: [...queue] });
      }
    }
  }

  return steps;
};
