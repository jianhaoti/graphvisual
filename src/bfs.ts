export type StepType = {
  visited: string[];
  queue: string[];
};

export const bfs = (
  graph: Map<string, string[]>,
  source: string
): { steps: StepType[]; layers: string[][] } => {
  let layers: string[][] = [];
  let steps: StepType[] = [];
  let visited: Set<string> = new Set();
  let queue: string[] = [source];

  // this temp is to give a sense of "steps = layers of bfs"
  let temp: string[] = [];

  while (queue.length > 0) {
    // empty out queue to get unique neighbors for the next layer
    while (queue.length > 0) {
      const node = queue.shift()!; // Assume non-null assertion is safe here
      if (!visited.has(node)) {
        visited.add(node); // Mark the node as visited upon dequeuing

        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            temp.push(neighbor);
          }
        }
      }
    }
    // repopulate, if possible, the empty queue with the next layer from temp
    const currentLayer = [];
    while (temp.length > 0) {
      const qItem = temp.pop();

      if (qItem) {
        currentLayer.push(qItem);
      }
    }
    layers.push(currentLayer);
  }

  return { steps, layers };
};
