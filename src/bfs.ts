export type StepType = {
  visited: string[];
  queue: string[];
  processing: string;
};

// visited is a set
// queue is an array
// processing is a string

export const bfs = (
  graph: Map<string, string[]>,
  source: string
): { steps: StepType[]; layers: string[][] } => {
  let layers: string[][] = [[source]];
  let steps: StepType[] = [];
  let visited: Set<string> = new Set();
  let queue: string[] = [source];
  let processing: string = "";

  while (queue.length > 0) {
    let currentLayer: string[] = [];
    let newQueue: string[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      processing = node;

      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue),
        processing: processing,
      });

      const neighbors = graph.get(node) || [];
      let skipNext = true;

      for (const neighbor of neighbors) {
        if (
          !visited.has(neighbor) &&
          !queue.includes(neighbor) &&
          !newQueue.includes(neighbor) // bfs logic doesn't work if you don't include this. the duplicates may not yet be pushed onto queue
        ) {
          newQueue.push(neighbor);
          currentLayer.push(neighbor);
          skipNext = false; // this means we've added in some new neighbors
        }
      }

      // added in all the neighbors, if there are any
      if (!skipNext) {
        steps.push({
          visited: Array.from(visited),
          queue: queue.concat(newQueue), // Reflects the current state of the queue
          processing: processing,
        });
        skipNext = true;
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
