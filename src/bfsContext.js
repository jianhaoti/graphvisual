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

  const goToNextStep = () => {
    setBfsState((prevState) => {
      if (prevState.currentStepIndex < prevState.steps.length - 1) {
        const nextIndex = prevState.currentStepIndex + 1;
        const nodeStatus = updateNodeStatus(nextIndex);

        return {
          ...prevState,
          currentStepIndex: nextIndex,
          nodeStatus,
          isCompleted: nextIndex === prevState.steps.length - 1,
        };
      }
      return prevState;
    });
  };

  const goToPreviousStep = () => {
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
    goToNextStep,
    goToPreviousStep,
    updateNodeStatus,
  };

  return <BFSContext.Provider value={value}>{children}</BFSContext.Provider>;
};

export const useBFS = () => useContext(BFSContext);
