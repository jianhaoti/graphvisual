export type DijkstraStepType = {
  visited: string[];
  queue: string[];
  processing: string;
  edgeStatus: Map<string, string>;
};

export const dijkstra = (
  theNeighbors: Map<string, string[]>, // {FROM, [all possible TOs]}
  edgeWeights: Map<string, number>, // (edge id, edgeWeight)./[]
  source: string,
  isOriented: boolean
): { steps: DijkstraStepType[] } => {
  let steps: DijkstraStepType[] = [];

  let visited: Set<string> = new Set(); // we'll force an array structure in the return
  let queue: string[] = [source];
  let processing: string = "";
  let edgeStatus: Map<string, string> = new Map();
  let currentShortest: Map<string, number> = new Map();

  // init all nodes not source to infinty
  theNeighbors.forEach((_value, key) => {
    if (key !== source) {
      currentShortest.set(key, Infinity);
    }
  });

  // init the source to distnace 0
  currentShortest.set(source, 0);

  // end condition is when all nodes have been visisted
  while (queue.length > 0) {
    processing = queue.shift()!;
    // filter in all unvisited neighbors
    let neighbors = theNeighbors.get(processing) || [];

    const unvisitedNeighbors = neighbors.filter(
      (neighbor) => !visited.has(neighbor)
    );

    // for processing useless edges
    const uselessTargets = neighbors.filter((neighbor) =>
      visited.has(neighbor)
    );

    visited.add(processing);
    processing = "";

    // update the shortest if needed
    unvisitedNeighbors.forEach((neighbor) => {
      const currentDistance = currentShortest.get(neighbor)!;
      const competitor =
        currentShortest.get(processing)! +
        edgeWeights.get(`${processing}-${neighbor}`)!; // source -> processing -> neighbor
      currentShortest.set(neighbor, Math.min(currentDistance, competitor));
    });

    // update processing node to
  }
  return { steps };
};
