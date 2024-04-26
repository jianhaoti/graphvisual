import { usePrim } from "./primContext";
export const HighlightInstructions = () => {
  const { primState } = usePrim();

  const primSteps = primState.steps;

  const highlightInstructions = new Array(primSteps.length).fill([]);

  let i = 0;
  while (i < highlightInstructions.length) {
    const nodeStatus = primState.steps[primState.currentStepIndex]?.nodeStatus;
    const containsProcessing = Object.values(nodeStatus).some(
      (status) => status === "processing"
    );

    if (containsProcessing) {
      // highlight the next three entries
      highlightInstructions[i] = [10, 11, 12];
      highlightInstructions[i + 1] = [14, 15, 16, 17, 18, 19, 20];
      highlightInstructions[i + 2] = [22];
      i += 3;
    } else {
      // higlight this entries with the useless block
      highlightInstructions[i] = [10, 11, 12];

      i += 1;
    }
  }

  return highlightInstructions;
};
