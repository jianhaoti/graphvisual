import React, { createContext, useContext, useState } from "react";

const BFSContext = createContext();

export const BFSProvider = ({ children }) => {
  const [bfsState, setBfsState] = useState({
    steps: [],
    currentStepIndex: 0,
    nodeStates: new Map(), // Map node IDs to states ('visited', 'queue', 'processing')
    isVisualizationActive: false,
  });

  // Method to toggle visualization status
  const toggleVisualizationActive = () => {
    setBfsState((prevState) => ({
      ...prevState,
      isVisualizationActive: !isVisualizationActive,
    }));
  };

  const value = { bfsState, setBfsState, toggleVisualizationActive };

  return <BFSContext.Provider value={value}>{children}</BFSContext.Provider>;
};

export const useBFS = () => useContext(BFSContext);
