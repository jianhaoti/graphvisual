import { useDijkstra } from "./dijkstraContext";
export const HighlightInstructions = () => {
  const { dijkstraState } = useDijkstra();

  const dijkstraSteps = dijkstraState.steps;

  const highlightInstructions = new Array(dijkstraSteps.length).fill([]);

  let stepIndex = 0;
  while (stepIndex < dijkstraSteps.length) {
    const currentStepDijkstra = dijkstraSteps[stepIndex];

    if (currentStepDijkstra.processing === "") {
      highlightInstructions[stepIndex] = [20]; //black
    } else if (
      stepIndex + 1 < dijkstraSteps.length &&
      dijkstraSteps[stepIndex + 1].processing !== ""
    ) {
      highlightInstructions[stepIndex + 1] = [12, 13, 14, 15, 16, 17, 18, 19]; // orange
      highlightInstructions[stepIndex] = [11]; // white
      stepIndex += 1;
    }
    stepIndex += 1;
  }

  // need to manually take care of the end
  highlightInstructions.forEach((instruction, index) => {
    if (instruction.length === 0 || instruction.includes(0)) {
      highlightInstructions[index] = [11]; // Default to processing = Q.dequeue() if no specific instructions
    }
  });
  return highlightInstructions;
};
