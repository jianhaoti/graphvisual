import React, { createContext, useContext, useState } from "react";

const dfsContext = createContext();

export const DFSProvider = ({ children }) => {
  const [dfsState, setDfsState] = useState({
    steps: [],
    currentStepIndex: 0,
    nodeStatus: new Map(), // Map node IDs to states ('visited', 'stack', 'processing', default)
    isVisualizationActive: false,
    isCompleted: false,
  });

  const dfsSourceNode = dfsState.steps[0]?.processing;

  const updateNodeStatus = (currentStepIndex) => {
    const newNodeStatus = new Map();
    const step = dfsState.steps[currentStepIndex];

    step.visited.forEach((nodeID) => newNodeStatus.set(nodeID, "visited"));
    step.stack.forEach((nodeID) => newNodeStatus.set(nodeID, "stack"));
    if (step.processing !== "") {
      newNodeStatus.set(step.processing, "processing");
    }
    return newNodeStatus;
  };

  const goToNextStepDFS = () => {
    setDfsState((prevState) => {
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

  const goToPreviousStepDFS = () => {
    setDfsState((prevState) => {
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
    dfsState,
    setDfsState,
    goToNextStepDFS,
    goToPreviousStepDFS,
    updateNodeStatus,
    dfsSourceNode,
  };

  return <dfsContext.Provider value={value}>{children}</dfsContext.Provider>;
};

export const useDFS = () => useContext(dfsContext);
