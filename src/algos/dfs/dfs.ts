export type DFSStepType = {
  visited: string[];
  stack: string[];
  processing: string;
  edgeStatus: Map<string, string>;
};

export const dfs = (
  theNeighbors: Map<string, string[]>, // {FROM, [all possible TOs]}
  source: string,
  isOriented: boolean
): { steps: DFSStepType[] } => {
  let steps: DFSStepType[] = [];

  let visited: Set<string> = new Set(); // we'll force an array structure in the return
  let stack: string[] = [source];
  let processing: string = "";
  let edgeStatus: Map<string, string> = new Map();

  while (stack.length > 0) {
    let newNeighbors: string[] = [];

    while (stack.length > 0) {
      // orange node turns white
      processing = stack.pop()!;

      visited.forEach((node) => {
        if (edgeStatus.get(`${node}-${processing}`) === "stacked") {
          edgeStatus.set(`${node}-${processing}`, "visited");
          if (!isOriented) {
            edgeStatus.set(`${processing}-${node}`, "visited");
          }
        }
        if (
          !isOriented &&
          edgeStatus.get(`${processing}-${node}`) === "stacked"
        ) {
          edgeStatus.set(`${node}-${processing}`, "visited");
          edgeStatus.set(`${processing}-${node}`, "visited");
        }
      });

      // black + white
      steps.push({
        visited: Array.from(visited),
        stack: [...stack],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      const neighbors = theNeighbors.get(processing) || [];

      for (const neighbor of neighbors) {
        // if the neighbor is undiscovered
        if (
          !visited.has(neighbor) &&
          !stack.includes(neighbor) &&
          !newNeighbors.includes(neighbor) // duplicates may not yet be pushed onto (the main) stack!
        ) {
          newNeighbors.push(neighbor);
          edgeStatus.set(`${processing}-${neighbor}`, "stacked"); // white + orange
          if (!isOriented) {
            edgeStatus.set(`${neighbor}-${processing}`, "stacked"); // white + orange
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

      stack = stack.concat(newNeighbors); // prepare for the next round
      newNeighbors = []; // prevents infinite loop

      // added in all the neighbors, if there are any. also adds new edge status
      steps.push({
        visited: Array.from(visited),
        stack: [...stack],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });

      visited.add(processing); // processing node turns black
      processing = "";

      // white node turns black. no change in edge status
      steps.push({
        visited: Array.from(visited),
        stack: [...stack],
        processing: processing,
        edgeStatus: new Map(edgeStatus),
      });
    }
  }

  return { steps };
};
