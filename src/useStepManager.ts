import { useState, useEffect } from "react";

// Assuming you have a BFS function that returns an array of steps
import { bfs } from "./bfs";

// Type for a single step in BFS for demonstration. Adapt as needed.
type StepType = {
  visited: string[];
  queue: string[];
};

// Hook to manage steps
export const stepManager = (graph: any, source: string) => {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize BFS steps on graph or source change
  useEffect(() => {
    const bfsSteps = bfs(graph, source); // Run BFS to get all steps
    setSteps(bfsSteps);
    setCurrentStepIndex(0);
    setIsCompleted(false);
  }, [graph, source]);

  // Function to move to the next step
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Function to move to the previous step
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsCompleted(false); // Not completed if we're moving back
    }
  };

  // Expose the current step and navigation functions
  return {
    currentStep: steps[currentStepIndex],
    goToNextStep,
    goToPreviousStep,
    isCompleted,
  };
};
