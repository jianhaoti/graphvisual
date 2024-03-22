import React, { createContext, useContext, useState } from "react";

const dijkstraContext = createContext();

export const DijkstraProvider = ({ children }) => {
  const [dijkstraState, setDijkstraState] = useState({
    steps: [],
    currentStepIndex: 0,
    isCompleted: false,
    isVisualizationActive: false,
  });

  const dijkstraSourceNode = React.useMemo(() => {
    const nodeStatusMap = dijkstraState.steps[0]?.nodeStatus;
    if (nodeStatusMap) {
      for (let [nodeId, status] of nodeStatusMap.entries()) {
        if (status === "processing") {
          return nodeId; // Return the first nodeId found with status "processing"
        }
      }
    }
  }, [dijkstraState.steps]);

  const goToNextStepDijkstra = () => {
    setDijkstraState((nextState) => {
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

  const goToPreviousStepDijkstra = () => {
    setDijkstraState((prevState) => {
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
    dijkstraState,
    setDijkstraState,
    goToNextStepDijkstra,
    goToPreviousStepDijkstra,
    dijkstraSourceNode,
  };

  return (
    <dijkstraContext.Provider value={value}>
      {children}
    </dijkstraContext.Provider>
  );
};

export const useDijkstra = () => useContext(dijkstraContext);
