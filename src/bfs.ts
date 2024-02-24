export type StepType = {
  visited: string[];
  queue: string[];
};

export const bfs = (
  graph: Map<string, string[]>,
  source: string
): { steps: StepType[]; layers: string[][] } => {
  let layers: string[][] = [[source]];
  let steps: StepType[] = [];
  let visited: Set<string> = new Set();
  let queue: string[] = [source];

  // this temp is to give a sense of "steps = layers of bfs"
  let temp: string[] = [];

  while (queue.length > 0) {
    // get the current layers' neighbors, then push them into visited
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
    const currentLayer: string[] = [];
    while (temp.length > 0) {
      const qItem = temp.pop();
      if (qItem && !currentLayer.includes(qItem)) {
        queue.push(qItem);
        currentLayer.push(qItem);
      }
    }
    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }
  }

  return { steps, layers };
};
