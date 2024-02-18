import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Graph from "./Graph";
import ControlRoom from "./ControlRoom";
import { Button, ButtonGroup } from "@mui/material";
import { ReactComponent as AlgoIcon } from "./assets/algoIcon.svg";
import { ReactComponent as DataIcon } from "./assets/dataIcon.svg";
import { ReactComponent as MovieIcon } from "./assets/movieIcon.svg";
import TextField from "@mui/material/TextField";
import Node from "./GraphNode";
import Edge from "./GraphEdge";

function App() {
  const [mode, setMode] = useState("data");
  const [value, setValue] = useState("Untitled");
  const textFieldRef = useRef<HTMLInputElement>(null);

  // Graph Data
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isOriented, setIsOriented] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus(); // Focus the input
      textFieldRef.current.select(); // Select the text
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // Blur the input field when Enter key is pressed
      textFieldRef.current?.blur();
    }
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

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFocus = () => {
    if (textFieldRef.current) {
      textFieldRef.current.select();
    }
  };

  const handleLabelClick = () => {
    setMode("data");
  };

  const handleAlgoClick = () => {
    setMode("algo");
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
    <main>
      <div className="title-container">
        <TextField
          className="whiteUnderline"
          id="standard-multiline-flexible"
          value={value}
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
            onClick={handleLabelClick}
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
      />
    </main>
  );
}

export default App;
