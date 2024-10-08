import React from "react";
import { HighlightInstructions } from "../dijkstra/dijkstraHighlightInstructions"; // Ensure this path matches your project structure
import { useDijkstra } from "./dijkstraContext.js";

const DijkstraPseudocode = ({ source, name }) => {
  const { dijkstraState } = useDijkstra();
  const { currentStepIndex } = dijkstraState;
  const highlightInstructions = HighlightInstructions();

  // Define colors and styles
  const initializeColor = "#FF6188";
  const typeColor = "#A9DC76";
  const objectColor = "#FFD866";
  const textColor = "#ABB2BF";
  const backgroundColor = "#1E1E1E";

  const modifiedSource = source.length > 4 ? +source.slice(-3) : source;

  const renderLineWithSyntaxHighlighting = (line) => {
    // Update the regular expression to exclude 'enqueue' and 'dequeue'
    const regex =
      /\b(init|minHeap|set|hashMap|string|array|currDist|H|Visited|processing)\b/g;

    // Function to replace matched keywords with colored spans, excluding 'enqueue' and 'dequeue'
    const replaceFunc = (match) => {
      let color = textColor; // Default text color
      switch (match) {
        case "init":
          color = initializeColor;
          break;
        case "hashMap":
        case "minHeap":
        case "set":
        case "string":
        case "array":
          color = typeColor;
          break;
        case "currDist":
        case "H":
        case "Visited":
        case "processing":
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
    `Dijkstra (${name}, ${modifiedSource}):`,
    `  init minHeap H = [${modifiedSource}]`,
    `  init hashMap currDist`,
    `  currDist[${modifiedSource}] = 0`,
    `  for node != ${modifiedSource}`,
    `    currDist[node] = ∞`,
    `  init set Visited`,
    ``,
    `  while (H is nonempty)`,
    `    processing = H.heapPop()`,
    `    if processing in Visited`,
    `      skip this iteration`,
    ``,
    `    init array Neighbors of processing`,
    `    for n in Neighbors:`,
    `      edge = (processing, n)`,
    `      weight = weight[edge]`,
    ``,
    `      // distance from source`,
    `      dist = currDist[processing]`,
    ``,
    `      // minimize distances`,
    `      if (n is not in Visited):`,
    `        newDist = dist + weight`,
    `        if (newDist < currDist[n]):`,
    `          H.heapPush(newDist, n)`,
    `          currDist[n] = newDist`,
    ``,
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
        // backgroundColor: "red",
      }}
    >
      {pseudocodeLines.map((line, index) => {
        const isComment = line.includes("//");
        const currentInstructions = highlightInstructions[currentStepIndex];
        const shouldHighlight = currentInstructions
          ? currentInstructions.includes(index)
          : false;
        let opacity = shouldHighlight ? 1 : 0.2;
        // Adjust opacity for lines 1-5
        if (index >= 0 && index <= 8) {
          opacity = 0.8;
        }

        if (isComment) {
          opacity = 0.3;
        }

        return (
          <div
            key={index}
            style={{
              display: "flex",
              opacity,
              fontSize: "1em",
              backgroundColor: "transparent",
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
            <span style={{ backgroundColor: "transparent" }}>
              {renderLineWithSyntaxHighlighting(line)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DijkstraPseudocode;
