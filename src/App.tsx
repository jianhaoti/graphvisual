import React, { useState, useRef } from "react";
import "./App.css";
import Graph from "./Graph";
import ControlRoom from "./ControlRoom";
import { Button, ButtonGroup } from "@mui/material";
import { ReactComponent as AlgoIcon } from "./assets/algoIcon.svg";
import { ReactComponent as DataIcon } from "./assets/dataIcon.svg";
import TextField from "@mui/material/TextField";
import Node from "./GraphNode";
import Edge from "./GraphEdge";
import { BFSProvider } from "./algos/bfs/bfsContext";
import { DFSProvider } from "./algos/dfs/dfsContext";

function App() {
  const [showWatermark, setShowWatermark] = useState(true);
  const [mode, setMode] = useState("data");
  const [name, setName] = useState("Untitled");
  const textFieldRef = useRef<HTMLInputElement>(null);

  // Controls functionality of +/- nodes and edges
  const [isGraphEditable, setIsGraphEditable] = useState(true);
  let size = "large";

  // Graph Data
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isOriented, setIsOriented] = useState(true);
  const [showWeight, setShowWeight] = useState(false);

  // name of graph
  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGraphEditable) {
      setName(event.target.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // Blur the input field when Enter key is pressed
      textFieldRef.current?.blur();
    }
    if (event.key === "Backspace") {
      event.stopPropagation(); // don't delte nodes
    }
  };

  const handleFocus = () => {
    if (textFieldRef.current) {
      textFieldRef.current.select();
    }
  };

  const handleDataClick = () => {
    setMode("data");
    setIsGraphEditable(true);
  };

  const handleAlgoClick = () => {
    setMode("algo");
  };

  const handleNodeIDChange = (oldId: string, newId: string) => {
    setNodes(
      nodes.map((node) => (node.id === oldId ? { ...node, id: newId } : node))
    );
    setEdges(
      edges.map((edge) => {
        if (edge.id1 === oldId) {
          return { ...edge, id1: newId };
        } else if (edge.id2 === oldId) {
          return { ...edge, id2: newId };
        }
        return edge;
      })
    );
  };

  const handleNodeSelection = (nodeId: string | null) => {
    setSelectedNode(nodeId);
    setSelectedEdge(null); // Clear selected edge when a node is selected
  };

  const handleEdgeSelection = (edgeId: string | null) => {
    setSelectedEdge(edgeId);
    setSelectedNode(null); // Clear selected node when an edge is selected
  };

  return (
    <DFSProvider>
      <BFSProvider>
        <main>
          <div className="title-container">
            <TextField
              className="whiteUnderline"
              id="standard-multiline-flexible"
              value={name}
              autoComplete="off"
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              inputRef={textFieldRef}
              inputProps={{ maxLength: 25 }}
              InputLabelProps={{
                style: { color: "white" }, // Change label color
              }}
              InputProps={{
                style: { color: "white" }, // Change input text color
                // Prevent animation on hover by making the underline style consistent
                sx: {
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "1px solid white", // Keep consistent with your focused state if needed
                  },
                  "&:after": {
                    borderBottom: "1.5px solid white", // Ensure this matches the default state or focused state
                  },
                },
              }}
              variant="standard"
            />
          </div>
          <div className="button-group-container">
            <ButtonGroup
              className="control-buttons"
              variant="outlined"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={handleDataClick}
                className={mode === "data" ? "activeButton" : ""}
                variant={mode === "data" ? "outlined" : "outlined"}
                disableElevation={true}
                style={{
                  backgroundColor: "#9f9f9f",
                  border: ".75px none",
                  outline: ".75px none",
                }}
              >
                <DataIcon />
              </Button>
              <Button
                onClick={handleAlgoClick}
                className={mode === "algo" ? "activeButton" : ""}
                variant={mode === "algo" ? "outlined" : "outlined"}
                disableElevation={true}
                style={{
                  backgroundColor: "#9f9f9f",
                  border: ".75px none",
                  outline: ".75px none",
                  boxShadow: "0 0 0 0px gray",
                }}
              >
                <AlgoIcon />
              </Button>
            </ButtonGroup>
          </div>
          <Graph
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            selectedEdge={selectedEdge}
            setSelectedEdge={setSelectedEdge}
            isOriented={isOriented}
            setIsOriented={setIsOriented}
            showWeight={showWeight}
            isGraphEditable={isGraphEditable}
            size={size}
          />
          <ControlRoom
            mode={mode}
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            setSelectedNode={handleNodeSelection}
            selectedEdge={selectedEdge}
            setSelectedEdge={handleEdgeSelection}
            isOriented={isOriented}
            onNodeIDChange={handleNodeIDChange}
            setEdges={setEdges}
            showWeight={showWeight}
            setShowWeight={setShowWeight}
            setIsGraphEditable={setIsGraphEditable}
            name={name}
          />
        </main>
      </BFSProvider>
    </DFSProvider>
  );
}

export default App;
