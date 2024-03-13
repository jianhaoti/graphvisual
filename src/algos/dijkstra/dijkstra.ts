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
  let processing: string = source;
  let edgeStatus: Map<string, string> = new Map();
  let currentShortest: Map<string, number> = new Map();
  let pathLength = 0;

  // init all nodes not source to infinty
  theNeighbors.forEach((_value, key) => {
    if (key !== source) {
      currentShortest.set(key, Infinity);
    }
  });

  // init the source to distnace 0
  currentShortest.set(source, 0);

  // initializing the while loop
  let processingNeighbors = theNeighbors.get(source) || [];

  // end condition is when all nodes have been visisted
  while (processingNeighbors.some((neighbor) => !visited.has(neighbor))) {
    // filter in all unvisited neighbors
    const unvisitedNeighbors = processingNeighbors.filter(
      (neighbor) => !visited.has(neighbor)
    );

    // update the shortest if needed
    unvisitedNeighbors.forEach((neighbor) => {
      const currentDistance = currentShortest.get(neighbor);
      const competitor = pathLength + edgeWeights.get(neighbor)!;
    });

    visited.add(processing);
  }
  return { steps };
};
