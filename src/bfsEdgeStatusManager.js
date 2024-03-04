// life cycle of edge is
// 1. default -> queued -> processing -> processed
// or
// 2. default -> useless
const updateEdgeStatus = (currentStepIndex, edges) => {
  const edgeIDs = edges.map((edge) => `${edge.id1}-${edge.id2}`);
  const newEdgeStatus = new Map();
  const currStep = bfsState.steps[currentStepIndex];

  // edge case
  if (currentStepIndex === 0) {
    edgeIDs.forEach((edgeID) => newEdgeStatus.set(edgeID, "default"));
  }
  // main logic
  else {
    const prevStep = bfsState.steps[currentStepIndex - 1];

    edges.forEach((edge) => {
      const prevStatus = prevStep.edgeStatus.get(edge.id);
      // if it was useless OR if it's now useless, then then it's useless
      if (prevStatus === "useless" || currStep.uselessEdges.includes(edge.id)) {
        newEdgeStatus.set((edge.id, "useless"));
      }

      // otherwise check if status change is necessary
      else {
        const processing = currStep.processing;
        const visited = currStep.visited;
        const queue = currStep.queue;

        // white -> orange = orange edge
        if (
          prevStatus === "default" &&
          processing == edge.id1 &&
          queue.includes(edge.id2)
        ) {
          newEdgeStatus.set((edge.id, "queued"));
        }

        // black -> orange = orange edge
        else if (
          prevStatus === "queued" &&
          visited.inclusde(edge.id1) &&
          queue.includes(edge.id2)
        ) {
          newEdgeStatus.set((edge.id, "queued"));
        }

        // black -> white = white edge
        else if (
          prevStatus === "queued" &&
          visited.includes(edge.id1) &&
          processing === edge.id2
        ) {
          newEdgeStatus.set((edge.id, "processing"));
        }

        // black -> black = black edge
        else if (
          prevStatus === "processing" &&
          visited.includes(edge.id1) &&
          visited.includes(edge.id2)
        ) {
          newEdgeStatus.set((edge.id, "visited"));
        } else {
          // Carry over the previous status if no condition matches
          newEdgeStatus.set(edge.id, prevStatus);
        }
      }
    });
  }
};
