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

  const updateStatus = (currentStepIndex) => {
    const newStatus = new Map();
    const step = bfsState.steps[currentStepIndex];

    step.visited.forEach((nodeID) => newStatus.set(nodeID, "visited"));
    step.queue.forEach((nodeID) => newStatus.set(nodeID, "queue"));
    if (step.processing != "") {
      newStatus.set(step.processing, "processing");
    }
    return newStatus;
  };

  const goToNextStep = () => {
    setBfsState((prevState) => {
      if (prevState.currentStepIndex < prevState.steps.length - 1) {
        const nextIndex = prevState.currentStepIndex + 1;
        const nodeStatus = updateStatus(nextIndex);
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
        const nodeStatus = updateStatus(prevIndex);
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
    updateStatus,
  };

  return <BFSContext.Provider value={value}>{children}</BFSContext.Provider>;
};

export const useBFS = () => useContext(BFSContext);
