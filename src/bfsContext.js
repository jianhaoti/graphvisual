import React, { createContext, useContext, useState } from "react";

const BFSContext = createContext();

export const BFSProvider = ({ children }) => {
  const [bfsState, setBfsState] = useState({
    steps: [],
    currentStepIndex: 0,
    nodeStatus: new Map(), // Map node IDs to states ('visited', 'queue', 'processing', default)
    edgeStatus: new Map(), // Map edge IDs to states in the lifecycle (default -> queued -> processing -> processed)
    isVisualizationActive: false,
    isCompleted: false,
  });

  const updateEdgeStatus = (currentStepIndex) => {
    const newStatus = new Map();
    const step = bfsState.steps[currentStepIndex];

    // handle beginning case as edge case
    if (currentStepIndex === 0) {
      // newStatus.set(edgeID, "default");
    } else {
    }
  };

  const updateNodeStatus = (currentStepIndex) => {
    const newStatus = new Map();
    const step = bfsState.steps[currentStepIndex];

    step.visited.forEach((nodeID) => newStatus.set(nodeID, "visited"));
    step.queue.forEach((nodeID) => newStatus.set(nodeID, "queue"));
    if (step.processing !== "") {
      newStatus.set(step.processing, "processing");
    }
    return newStatus;
  };

  const goToNextStep = () => {
    setBfsState((prevState) => {
      if (prevState.currentStepIndex < prevState.steps.length - 1) {
        const nextIndex = prevState.currentStepIndex + 1;
        const nodeStatus = updateNodeStatus(nextIndex);
        const edgeStatus = updateEdgeStatus(nextIndex);

        return {
          ...prevState,
          currentStepIndex: nextIndex,
          nodeStatus,
          edgeStatus,
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
        const edgeStatus = updateEdgeStatus(prevIndex);
        return {
          ...prevState,
          currentStepIndex: prevIndex,
          nodeStatus,
          edgeStatus,
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
