export type StepType = {
  visited: string[];
  queue: string[];
  processing: string;
  uselessEdges: string[];
};

export const bfs = (
  graph: Map<string, string[]>, // {source node, [target nodes]}
  source: string
): { steps: StepType[]; layers: string[][] } => {
  let layers: string[][] = [[source]];
  let steps: StepType[] = [];

  let visited: Set<string> = new Set(); // we'll force an array structure in the return
  let queue: string[] = [source];
  let processing: string = "";

  while (queue.length > 0) {
    let currentLayer: string[] = [];
    let newQueue: string[] = [];
    let currentStepUselessEdges: string[] = []; // Track useless edges for the current step

    while (queue.length > 0) {
      const node = queue.shift()!;
      processing = node;

      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue),
        processing: processing,
        uselessEdges: [...currentStepUselessEdges],
      });

      const neighbors = graph.get(node) || [];
      let skipNext = true;

      for (const neighbor of neighbors) {
        if (
          !visited.has(neighbor) &&
          !queue.includes(neighbor) &&
          !newQueue.includes(neighbor) // duplicates may not yet be pushed onto (the main) queue
        ) {
          //newQueue contains unique neighbors
          newQueue.push(neighbor);
          currentLayer.push(neighbor);
          skipNext = false; // flag for added in new neighbors
        } else if (processing != "") {
          currentStepUselessEdges.push(`${processing}-${neighbor}`);
        }
      }

      // added in all the neighbors, if there are any
      if (!skipNext) {
        steps.push({
          visited: Array.from(visited),
          queue: queue.concat(newQueue), // Reflects the current state of the queue
          processing: processing,
          uselessEdges: [...currentStepUselessEdges],
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
        uselessEdges: [...currentStepUselessEdges],
      });
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }

    queue = newQueue; // Prepare for the next layer
  }

  return { steps, layers };
};
