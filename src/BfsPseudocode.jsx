import React from "react";

const BfsPseudocode = ({ inputValue }) => {
  // Define Monokai Pro colors
  const initializeColor = "#FF6188"; // For "init"
  const typeColor = "#A9DC76"; // For types like "queue", "set", "string", "array"
  const objectColor = "#FFD866"; // For "Q", "Visited", "processing", "Neighbors(q)"
  const textColor = "#ABB2BF"; // Default text color
  const backgroundColor = "#1E1E1E"; // VSCode Dark theme background color

  const pseudocode = `
BFS (G, ${inputValue}):                   
  init queue Q = [${inputValue}].
  init set Visited = ()
  init string processing = ${inputValue}

  while (Q is nonempty)
    processing = Q.dequeue()
    init array Neighbors of q
    for n in Neighbors:
      if (n is not registered in Visited nor in Q):
        Q.enqueue(n)  
    Visited.add(processing)
  `;

  const highlightText = (text) => {
    const regex =
      /\b(init|queue|set|string|array|Q|Visited|processing|Neighbors\(q\)|\b[G]\b|\b[()]\b)\b/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (["init"].includes(part)) {
        return (
          <span key={index} style={{ color: initializeColor }}>
            {part}
          </span>
        );
      } else if (["queue", "set", "string", "array"].includes(part)) {
        return (
          <span key={index} style={{ color: typeColor }}>
            {part}
          </span>
        );
      } else if (
        ["Q", "Visited", "processing", "Neighbors(q)"].includes(part)
      ) {
        return (
          <span key={index} style={{ color: objectColor }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <pre
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
        fontFamily: '"SF Mono", "Consolas", Menlo, monospace', // Use a monospace font to preserve alignment
        whiteSpace: "pre-wrap", // Preserve whitespace
        wordWrap: "break-word", // Ensure long lines are wrapped
        textAlign: "left", // Align text to the left
      }}
    >
      {pseudocode.split("\n").map((line, index) => (
        <div
          key={index}
          style={{ paddingLeft: `${line.search(/\S|$/) * 8}px` }}
        >
          {" "}
          {/* Indent based on the first non-whitespace character */}
          {highlightText(line)}
        </div>
      ))}
    </pre>
  );
};

export default BfsPseudocode;
