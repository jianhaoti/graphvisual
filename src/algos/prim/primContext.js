import React, { createContext, useContext, useState } from "react";

const primContext = createContext();

export const PrimProvider = ({ children }) => {
  const [primState, setPrimState] = useState({
    steps: [],
    currentStepIndex: 0,
    isCompleted: false,
    isVisualizationActive: false,
  });

  const primSourceNode = React.useMemo(() => {
    const nodeStatusMap = primState.steps[0]?.nodeStatus;
    if (nodeStatusMap) {
      for (let [nodeId, status] of nodeStatusMap) {
        // Directly iterate over the Map
        if (status === "processing") {
          return nodeId; // Return the first nodeId found with status "processing"
        }
      }
    }
  }, [primState.steps]);

  const goToNextStepPrim = () => {
    setPrimState((nextState) => {
      if (nextState.currentStepIndex < nextState.steps.length - 1) {
        const nextIndex = nextState.currentStepIndex + 1;

        return {
          ...nextState,
          currentStepIndex: nextIndex,
          isCompleted: nextIndex === nextState.steps.length - 1,
        };
      }
      return nextState;
    });
  };

  const goToPreviousStepPrim = () => {
    setPrimState((prevState) => {
      if (prevState.currentStepIndex > 0) {
        const prevIndex = prevState.currentStepIndex - 1;
        return {
          ...prevState,
          currentStepIndex: prevIndex,
          isCompleted: false,
        };
      }
      return prevState;
    });
  };

  const value = {
    primState,
    setPrimState,
    goToNextStepPrim,
    goToPreviousStepPrim,
    primSourceNode,
  };

  return <primContext.Provider value={value}>{children}</primContext.Provider>;
};

export const usePrim = () => useContext(primContext);
