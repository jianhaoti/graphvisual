import React from "react";
import { HighlightInstructions } from "./highlightInstructions"; // Ensure this path matches your project structure
import { useBFS } from "./bfsContext";

const BfsPseudocode = ({ inputValue, name }) => {
  const { bfsState } = useBFS();
  const { currentStepIndex } = bfsState;
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
      /\b(init|queue|set|string|array|Q|Visited|processing|Neighbors)\b/g;

    // Function to replace matched keywords with colored spans, excluding 'enqueue' and 'dequeue'
    const replaceFunc = (match) => {
      let color = textColor; // Default text color
      switch (match) {
        case "init":
          color = initializeColor;
          break;
        case "queue":
        case "set":
        case "string":
        case "array":
          color = typeColor;
          break;
        case "Q":
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
    `BFS (${name}, ${inputValue}):`,
    `  init queue Q = [${inputValue}]`,
    `  init set Visited = {}`,
    `  init string processing = ""`,
    ``,
    `  while (Q is nonempty)`,
    `    processing = Q.dequeue()`,
    `    set previous edge as processed`,
    `    init array Neighbors of q`,
    ``,
    `    for n in Neighbors:`,
    `      if (n is not in Visited nor in Q):`,
    `        Q.enqueue(n)`,
    `        set edge processing → n as queued`,
    `      else`,
    `        set edge processing → n as useless`,
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
        paddingTop: "20px", // Adds padding at the top
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
        // Handling for the line break before the while loop
        const isLineBreak =
          line.trim() === "" &&
          pseudocodeLines[index + 1]?.trim().startsWith("while");

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: isLineBreak ? "flex-end" : "baseline",
              opacity,
            }}
          >
            <span
              style={{
                width: "30px",
                textAlign: "right",
                paddingRight: "10px",
                textColor: "white",
                fontSize: ".75em", // Reduce font size by half
                color: "white",
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

export default BfsPseudocode;
