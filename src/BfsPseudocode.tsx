import React from "react";

interface BfsPseudocodeProps {
  inputValue: string;
}

const BfsPseudocode: React.FC<BfsPseudocodeProps> = ({ inputValue }) => {
  // Monokai Pro colors
  const initializeColor = "#FF6188"; // Monokai Pro color for "init"
  const typeColor = "#A9DC76"; // Monokai Pro color for types like "queue", "set", "string", "array"
  const objectColor = "#FFD866"; // Monokai Pro color for objects like "Q", "Visited", etc.

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

  return (
    <pre style={{ color: "#ABB2BF", backgroundColor: "#1E1E1E" }}>
      {" "}
      {/* Default text color and VSCode Dark theme background color */}
      {pseudocode.split("\n").map((line, index) => (
        <div key={index}>
          {line.split(/\b/).map((word, wordIndex) => {
            // Split by word boundary for better matching
            if (word.includes("init")) {
              return (
                <span key={wordIndex} style={{ color: initializeColor }}>
                  {word}
                </span>
              );
            } else if (["queue", "set", "string", "array"].includes(word)) {
              return (
                <span key={wordIndex} style={{ color: typeColor }}>
                  {word}
                </span>
              );
            } else if (
              ["Q", "Visited", "processing", "Neighbors"].includes(word)
            ) {
              return (
                <span key={wordIndex} style={{ color: objectColor }}>
                  {word}
                </span>
              );
            } else {
              return <span key={wordIndex}>{word}</span>;
            }
          })}
        </div>
      ))}
    </pre>
  );
};

export default BfsPseudocode;
