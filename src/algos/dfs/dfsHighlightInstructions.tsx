import { useDFS } from "./dfsContext";
export const HighlightInstructions = () => {
  const { dfsState } = useDFS();

  const dfsSteps = dfsState.steps;

  const highlightInstructions = new Array(dfsSteps.length).fill([]);

  let stepIndex = 0;
  while (stepIndex < dfsSteps.length) {
    const currentStepDFS = dfsSteps[stepIndex];

    if (currentStepDFS.processing === "") {
      highlightInstructions[stepIndex] = [13]; //black
    } else if (
      stepIndex + 1 < dfsSteps.length &&
      dfsSteps[stepIndex + 1].processing !== ""
    ) {
      highlightInstructions[stepIndex + 1] = [8, 9, 10, 11]; // orange
      highlightInstructions[stepIndex] = [6]; // white
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
