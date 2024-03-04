export type StepType = {
  visited: string[];
  queue: string[];
  processing: string;
  edgeStatus: Map<string, string>;
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
  let edgeStatus: Map<string, string> = new Map();

  while (queue.length > 0) {
    let currentLayer: string[] = [];
    let newQueue: string[] = [];
    let currentStepUselessEdges: string[] = []; // Track useless edges for the current step

    while (queue.length > 0) {
      // orange node turns white
      const node = queue.shift()!;
      processing = node;

      // edgeStatus.set(`${prevProcessing}-${processing}`, "visited");
      visited.forEach((node) => {
        if (edgeStatus.get(`${node}-${processing}`) === "queued") {
          edgeStatus.set(`${node}-${processing}`, "visited");
        }
      });

      // black + white
      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue),
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      const neighbors = graph.get(node) || [];

      for (const neighbor of neighbors) {
        // existence of undiscovered neighbors
        if (
          !visited.has(neighbor) &&
          !queue.includes(neighbor) &&
          !newQueue.includes(neighbor) // duplicates may not yet be pushed onto (the main) queue
        ) {
          newQueue.push(neighbor); //newQueue contains unique neighbors
          currentLayer.push(neighbor);
          edgeStatus.set(`${processing}-${neighbor}`, "queued"); // white + orange
        }
        // all neighbors are discovered
        else if (processing != "") {
          currentStepUselessEdges.push(`${processing}-${neighbor}`);
          edgeStatus.set(`${processing}-${neighbor}`, "useless");
        }
      }

      // added in all the neighbors, if there are any. also adds new edge status
      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue), // Reflects the current state of the queue
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      visited.add(node); // processing node turns black
      processing = "";

      // white node turns black. no change in edge status
      steps.push({
        visited: Array.from(visited),
        queue: queue.concat(newQueue),
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }

    queue = newQueue; // Prepare for the next layer
  }

  return { steps, layers };
};
