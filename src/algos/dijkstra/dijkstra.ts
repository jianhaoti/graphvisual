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

  let prioQueue: string[] = [source];
  let processing: string = "";
  let edgeStatus: Map<string, string> = new Map();
  let currentShortest: Map<string, number> = new Map();

  // init all nodes not source to infinty, and source to 0
  // enque all nodes into queue for processing
  theNeighbors.forEach((_value, key) => {
    if (key !== source) {
      currentShortest.set(key, Infinity);
      prioQueue.push(key);
    }
  });
  currentShortest.set(source, 0);

  while (prioQueue.length > 0) {
    // find node with current shortest distance in priroity queue
  }
  return { steps };
};
