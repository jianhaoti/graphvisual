import React, { createContext, useContext, useState } from "react";

const BFSContext = createContext();

export const BFSProvider = ({ children }) => {
  const [bfsState, setBfsState] = useState({
    steps: [],
    currentStepIndex: 0,
    nodeStatus: new Map(), // Map node IDs to states ('visited', 'queue', 'processing', default)
    isVisualizationActive: false,
    isCompleted: false,
  });

  const bfsSourceNode = bfsState.steps[0]?.processing;

  const updateNodeStatus = (currentStepIndex) => {
    const newNodeStatus = new Map();
    const step = bfsState.steps[currentStepIndex];

    step.visited.forEach((nodeID) => newNodeStatus.set(nodeID, "visited"));
    step.queue.forEach((nodeID) => newNodeStatus.set(nodeID, "queue"));
    if (step.processing !== "") {
      newNodeStatus.set(step.processing, "processing");
    }
    return newNodeStatus;
  };

  const goToNextStepBFS = () => {
    setBfsState((nextState) => {
      if (nextState.currentStepIndex < nextState.steps.length - 1) {
        const nextIndex = nextState.currentStepIndex + 1;
        const nodeStatus = updateNodeStatus(nextIndex);

        return {
          ...nextState,
          currentStepIndex: nextIndex,
          nodeStatus,
          isCompleted: nextIndex === nextState.steps.length - 1,
        };
      }
      return nextState;
    });
  };

  const goToPreviousStepBFS = () => {
    setBfsState((prevState) => {
      if (prevState.currentStepIndex > 0) {
        const prevIndex = prevState.currentStepIndex - 1;
        const nodeStatus = updateNodeStatus(prevIndex);
        return {
          ...prevState,
          currentStepIndex: prevIndex,
          nodeStatus,
          isCompleted: false,
        };
      }
      return prevState;
    });
  };

  const value = {
    bfsState,
    setBfsState,
    goToNextStepBFS,
    goToPreviousStepBFS,
    updateNodeStatus,
    bfsSourceNode,
  };

  return <BFSContext.Provider value={value}>{children}</BFSContext.Provider>;
};

export const useBFS = () => useContext(BFSContext);
