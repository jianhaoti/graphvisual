import { useBFS } from "./bfsContext";
import { StepType } from "./bfs";

export const usePseudoHighlight = (steps: StepType[]) => {
  const { bfsState } = useBFS();
  const bfsSteps = bfsState.steps;
  const highlightInstructions: number[] = new Array(bfsSteps.length).fill(0); // same length as bfsSteps

  let stepIndex = 0;
  while (stepIndex < bfsSteps.length) {
    const currentStepBFS = bfsSteps[stepIndex];

    // if we're not processing something, then we're in visisted mode
    if (currentStepBFS.processing === "") {
      highlightInstructions[stepIndex] = 3;
    }
    // otherwise, check if the next guy is still processing. if so, we have new neighbors
    else {
      if (
        stepIndex + 1 < bfsSteps.length &&
        bfsSteps[stepIndex + 1].processing != "" // if two consecutive nonempty processing
      ) {
        highlightInstructions[stepIndex] = 2;
        highlightInstructions[stepIndex + 1] = 1;
        stepIndex += 1; // skip the consecutive
      }
    }
    stepIndex += 1;
  }
  return highlightInstructions;
};
