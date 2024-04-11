import { useDijkstra } from "./dijkstraContext";
export const HighlightInstructions = () => {
  const { dijkstraState } = useDijkstra();

  const dijkstraSteps = dijkstraState.steps;

  const highlightInstructions = new Array(dijkstraSteps.length).fill([]);

  for (
    let stepIndex = 0;
    stepIndex < highlightInstructions.length;
    stepIndex++
  ) {
    if (stepIndex % 3 === 0) {
      highlightInstructions[stepIndex] = [9, 10, 11];
    }
    if (stepIndex % 3 === 1) {
      highlightInstructions[stepIndex] = [12, 13, 14, 15, 16, 17, 18, 19];
    }
    if (stepIndex % 3 === 2) {
      highlightInstructions[stepIndex] = [20];
    }
  }

  return highlightInstructions;
};
