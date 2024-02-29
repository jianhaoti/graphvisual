export type StepType = {
  visited: string[];
  queue: string[];
  processing: string;
};

export const bfs = (
  graph: Map<string, string[]>,
  source: string
): { steps: StepType[]; layers: string[][] } => {
  let layers: string[][] = [[source]];
  let steps: StepType[] = [];
  let visited: Set<string> = new Set();
  let queue: string[] = [source];
  let processing: string = source;

  while (queue.length > 0) {
    let currentLayer: string[] = [];
    let newQueue: string[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      processing = node;

      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue), // Reflects the current state of the queue
        processing: processing,
      });

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          newQueue.push(neighbor);
          currentLayer.push(neighbor);
        }
      }
      // added in all the neighbors, if there are any
      if (newQueue.length > 0) {
        steps.push({
          visited: Array.from(visited),
          queue: queue.concat(newQueue), // Reflects the current state of the queue
          processing: processing,
        });
      }

      visited.add(node);
      processing = "";

      // added in new visited
      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue), // Reflects the current state of the queue
        processing: processing,
      });
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }

    queue = newQueue; // Prepare for the next layer
  }

  return { steps, layers };
};
