import { useBFS } from "./bfsContext";

export const HighlightInstructions = () => {
  const { bfsState } = useBFS();
  const bfsSteps = bfsState.steps;
  const highlightInstructions = new Array(bfsSteps.length).fill([]);

  let stepIndex = 0;
  while (stepIndex < bfsSteps.length) {
    const currentStepBFS = bfsSteps[stepIndex];

    if (currentStepBFS.processing === "") {
      highlightInstructions[stepIndex] = [11]; //black
    } else if (
      stepIndex + 1 < bfsSteps.length &&
      bfsSteps[stepIndex + 1].processing !== ""
    ) {
      highlightInstructions[stepIndex + 1] = [7, 8, 9, 10];
      highlightInstructions[stepIndex] = [6];
      stepIndex += 1;
    }
    stepIndex += 1;
  }

  // need to manually take care of the end
  highlightInstructions.forEach((instruction, index) => {
    if (instruction.length === 0 || instruction.includes(0)) {
      highlightInstructions[index] = [6]; // Default to processing = Q.dequeue() if no specific instructions
    }
  });
  return highlightInstructions;
};
