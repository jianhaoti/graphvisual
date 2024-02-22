import { useState } from "react";

// Type for a single step in BFS for demonstration. Adapt as needed.
type StepType = {
  visited: string[];
  queue: string[];
};

// Hook to manage steps
export const useStepManager = (steps: StepType[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

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
    currentStepIndex,
    goToNextStep,
    goToPreviousStep,
    isCompleted,
  };
};
