import { usePrim } from "./primContext";
export const HighlightInstructions = () => {
  const { primState } = usePrim();

  const primSteps = primState.steps;

  const highlightInstructions = new Array(primSteps.length).fill([]);

  let i = 0;
  while (i < highlightInstructions.length) {
    const nodeStatus = primState.steps[i]?.nodeStatus;
    const containsProcessing = Array.from(nodeStatus.values()).some(
      (status) => status === "processing"
    );

    if (containsProcessing) {
      // highlight the next three entries
      highlightInstructions[i] = [12, 13, 14];
      highlightInstructions[i + 1] = [16, 17, 18, 19, 20, 21, 22];
      highlightInstructions[i + 2] = [24];
      i += 3;
    } else {
      // higlight this entries with the useless block
      highlightInstructions[i] = [12, 13, 14];

      i += 1;
    }
  }

  return highlightInstructions;
};
