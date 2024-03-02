import { useBFS } from "./bfsContext";

export const useHighlightInstructions = () => {
  const { bfsState } = useBFS();
  const bfsSteps = bfsState.steps;
  const highlightInstructions = new Array(bfsSteps.length).fill(0);

  let stepIndex = 0;
  while (stepIndex < bfsSteps.length) {
    const currentStepBFS = bfsSteps[stepIndex];

    if (currentStepBFS.processing === "") {
      highlightInstructions[stepIndex] = 3;
    } else if (
      stepIndex + 1 < bfsSteps.length &&
      bfsSteps[stepIndex + 1].processing !== ""
    ) {
      highlightInstructions[stepIndex] = 2;
      highlightInstructions[stepIndex + 1] = 1;
      stepIndex += 1;
    }
    stepIndex += 1;
  }

  return highlightInstructions;
};
