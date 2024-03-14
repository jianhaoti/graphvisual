import React from "react";
import { HighlightInstructions } from "../dfs/dfsHighlightInstructions"; // Ensure this path matches your project structure
import { useDFS } from "./dfsContext";

const DfsPseudocode = ({ inputValue, name }) => {
  const { dfsState } = useDFS();
  const { currentStepIndex } = dfsState;
  const highlightInstructions = HighlightInstructions();

  // Define colors and styles
  const initializeColor = "#FF6188";
  const typeColor = "#A9DC76";
  const objectColor = "#FFD866";
  const textColor = "#ABB2BF";
  const backgroundColor = "#1E1E1E";

  const renderLineWithSyntaxHighlighting = (line) => {
    // Update the regular expression to exclude 'enqueue' and 'dequeue'
    const regex =
      /\b(init|stack|set|string|array|S|Visited|processing|Neighbors)\b/g;

    // Function to replace matched keywords with colored spans, excluding 'enqueue' and 'dequeue'
    const replaceFunc = (match) => {
      let color = textColor; // Default text color
      switch (match) {
        case "init":
          color = initializeColor;
          break;
        case "stack":
        case "set":
        case "string":
        case "array":
          color = typeColor;
          break;
        case "S":
        case "Visited":
        case "processing":
        case "Neighbors":
          color = objectColor;
          break;
        default:
          color = textColor; // This keeps 'enqueue' and 'dequeue' in default text color
      }
      return `<span style="color:${color}">${match}</span>`;
    };

    // Apply the replacement to the line
    const highlightedLine = line.replace(regex, replaceFunc);

    // Use dangerouslySetInnerHTML to render the line with HTML formatting
    return <div dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
  };

  // Pseudocode lines
  const pseudocodeLines = [
    `DFS (${name}, ${inputValue}):`,
    `  init stack S = [${inputValue}]`,
    `  init set Visited = {}`,
    `  init string processing = ""`,
    ``,
    `  while (S is nonempty)`,
    `    processing = S.destack()`,
    `    init array Neighbors of q`,
    `    for n in Neighbors:`,
    `      if (n is not in Visited nor in S):`,
    `        S.enstack(n)`,
    `    Visited.add(processing)`,
  ];

  return (
    <div
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
        fontFamily: '"SF Mono", "Consolas", Menlo, monospace',
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        textAlign: "left",
        paddingTop: "20px",
      }}
    >
      {pseudocodeLines.map((line, index) => {
        // Determine the opacity based on the highlightInstructions for this line
        const shouldHighlight =
          highlightInstructions[currentStepIndex].includes(index);
        let opacity = shouldHighlight ? 1 : 0.2;
        // Adjust opacity for lines 1-5
        if (index >= 0 && index <= 5) {
          opacity = 0.8;
        }

        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row", // Ensures line number and code are in the same row
              alignItems: "flex-start", // Aligns items to the start, respecting top alignment
              opacity,
            }}
          >
            <span
              style={{
                minWidth: "30px", // Ensures a minimum width for the line number
                textAlign: "right",
                paddingRight: "10px",
                color: "white",
                fontSize: ".75em", // Adjusted for overall size, can be customized
                userSelect: "none",
              }}
            >
              {index + 1}
            </span>
            <span>{renderLineWithSyntaxHighlighting(line)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DfsPseudocode;
