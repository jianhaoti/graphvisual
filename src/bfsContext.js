import React, { createContext, useContext, useState } from "react";

const BFSContext = createContext();

export const BFSProvider = ({ children }) => {
  const [bfsState, setBfsState] = useState({
    steps: [],
    currentStepIndex: 0,
    nodeStates: new Map(), // Map node IDs to states ('visited', 'queue', 'processing')
    isVisualizationActive: false,
  });

  // Function to update the current step index and node states
  const setCurrentStepIndex = (index) => {
    const step = bfsState.steps[index];
    if (!step) return;

    const nodeStates = new Map();
    step.visited.forEach((id) => nodeStates.set(id, "visited"));
    step.queue.forEach((id) => nodeStates.set(id, "queue"));
    if (step.processing) nodeStates.set(step.processing, "processing");

    setBfsState((prev) => ({
      ...prev,
      currentStepIndex: index,
      nodeStates,
    }));
  };

  const value = {
    bfsState,
    setBfsState,
    setCurrentStepIndex,
  };

  return <BFSContext.Provider value={value}>{children}</BFSContext.Provider>;
};

export const useBFS = () => useContext(BFSContext);
