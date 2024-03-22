export type BFSStepType = {
  visited: string[];
  queue: string[];
  processing: string;
  edgeStatus: Map<string, string>;
};

// works for both the oriented and unoriented case.
// the complexity of the code is mostly due to the unoriented case, leading to more checks
// please read the oriented case to understand the logic.
// the unoriented case is a straightforward generalization

export const bfs = (
  theNeighbors: Map<string, string[]>, // {FROM, [all possible TOs]}
  source: string,
  isOriented: boolean
): { steps: BFSStepType[]; layers: string[][] } => {
  let layers: string[][] = [[source]];
  let steps: BFSStepType[] = [];

  let visited: Set<string> = new Set(); // we'll force an array structure in the return
  let queue: string[] = [source];
  let processing: string = "";
  let edgeStatus: Map<string, string> = new Map();

  while (queue.length > 0) {
    let currentLayer: string[] = [];
    let newNeighbors: string[] = [];

    while (queue.length > 0) {
      // orange node turns white
      processing = queue.shift()!;

      visited.forEach((node) => {
        if (edgeStatus.get(`${node}-${processing}`) === "queued") {
          edgeStatus.set(`${node}-${processing}`, "visited");
          if (!isOriented) {
            edgeStatus.set(`${processing}-${node}`, "visited");
          }
        }
        if (
          !isOriented &&
          edgeStatus.get(`${processing}-${node}`) === "queued"
        ) {
          edgeStatus.set(`${node}-${processing}`, "visited");
          edgeStatus.set(`${processing}-${node}`, "visited");
        }
      });

      // black + white
      steps.push({
        visited: Array.from(visited),
        queue: [...queue],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      const neighbors = theNeighbors.get(processing) || [];

      for (const neighbor of neighbors) {
        // if the neighbor is undiscovered
        if (
          !visited.has(neighbor) &&
          !queue.includes(neighbor) &&
          !newNeighbors.includes(neighbor) // duplicates may not yet be pushed onto (the main) queue!
        ) {
          newNeighbors.push(neighbor); // newQueue contains unique neighbors!
          currentLayer.push(neighbor);
          edgeStatus.set(`${processing}-${neighbor}`, "queued"); // white + orange
          if (!isOriented) {
            edgeStatus.set(`${neighbor}-${processing}`, "queued"); // white + orange
          }
        }
        // if the neighbor are discovered
        else if (
          processing !== "" &&
          !edgeStatus.get(`${processing}-${neighbor}`)
        ) {
          edgeStatus.set(`${processing}-${neighbor}`, "useless");
          if (!isOriented) {
            edgeStatus.set(`${neighbor}-${processing}`, "useless");
          }
        }
      }

      // add the new neighbors to the discovered pile
      queue = queue.concat(newNeighbors);

      // added in all the neighbors, if there are any. also adds new edge status
      steps.push({
        visited: Array.from(visited),
        queue: [...queue],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      newNeighbors = [];

      visited.add(processing); // processing node turns black
      processing = "";

      // white node turns black. no change in edge status
      steps.push({
        visited: Array.from(visited),
        queue: [...queue],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer);
    }
  }

  return { steps, layers };
};
