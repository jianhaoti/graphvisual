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
    } else {
      // hilight the next two entries
    }
  }

  return highlightInstructions;
};
