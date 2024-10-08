import React from "react";
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";

import Node from "./graphNode";
import Edge from "./graphEdge";

import { ReactComponent as OpenEye } from "./assets/openEye.svg";
import { ReactComponent as ClosedEye } from "./assets/closedEye.svg";

interface DataRoomProps {
  nodes: Node[];
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  selectedEdge: string | null;
  setSelectedEdge: (edgeId: string | null) => void;

  isOriented: boolean;
  onNodeIDChange: (oldId: string, newId: string) => void;

  showWeight: boolean;
  setShowWeight: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataRoom: React.FC<DataRoomProps> = ({
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  isOriented,
  showWeight,
  onNodeIDChange,
  setSelectedNode,
  setSelectedEdge,
  setEdges,
  setShowWeight,
}) => {
  const maxLengthNode = 25;

  // console.log("test")

  const renderNodeItem = (node: Node) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Logic to save changes and exit edit mode
        e.currentTarget.blur();
      }
      if (e.key === "Backspace") {
        // Prevent backspace key from triggering higher level keydown handlers
        e.stopPropagation();
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    const handleNodeNameUpdate = (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const isInvalidName =
        !newName || // none
        nodes.some((n) => n.id === newName && n.id !== node.id) || // already present
        newName.startsWith(" ") || // starts with a space
        newName.endsWith(" "); // ends with a space

      if (isInvalidName) {
        // Apply the jiggle animation
        e.target.classList.add("jiggle");

        // Remove the jiggle class after the animation ends
        setTimeout(() => {
          e.target.classList.remove("jiggle");
        }, 500); // 500ms matches the duration of the jiggle animation

        // Reset the value to the original name
        e.target.value = node.id;
      } else {
        onNodeIDChange(node.id, newName);
      }
    };

    if (node.id === selectedNode) {
      return (
        <input
          className="editableInput"
          type="text"
          defaultValue={node.id}
          onBlur={handleNodeNameUpdate}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          maxLength={maxLengthNode} // Set the maximum length
        />
      );
    }
    return (
      <span onClick={() => setSelectedNode(node.id)}>
        {node.id.length > maxLengthNode
          ? `${node.id.substring(0, maxLengthNode)}...`
          : node.id}
      </span>
    );
  };

  const renderEdgeItem = (edge: Edge) => {
    const edgeId = `${edge.id1}-${edge.id2}`;
    const displayEdgeName = `${edge.id1} ${isOriented ? "→" : "-"} ${edge.id2}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Logic to save changes and exit edit mode
        e.currentTarget.blur();
      }
      if (e.key === "Backspace") {
        // Prevent backspace key from triggering higher level keydown handlers
        e.stopPropagation();
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    const handleEdgeWeightUpdate = (
      e: React.FocusEvent<HTMLInputElement>,
      edgeId: string
    ) => {
      if (showWeight) {
        const newWeight = e.target.value;
        const weight = parseInt(newWeight, 10);

        // Check if the input is a valid integer (including 0 and negative numbers)
        if (!isNaN(weight)) {
          // Update the weight of the selected edge
          setEdges(
            edges.map((edge) => {
              if (`${edge.id1}-${edge.id2}` === edgeId) {
                return { ...edge, weight: weight };
              }
              return edge;
            })
          );
          setSelectedEdge(null); // Exit editing mode
        } else {
          // jiggle
          e.target.classList.add("jiggle");
          setTimeout(() => {
            e.target.classList.remove("jiggle");
          }, 500); // Match the duration of the jiggle animation

          // Keep the previous value (do not update to invalid input)
          const currentEdge = edges.find(
            (edge) => `${edge.id1}-${edge.id2}` === edgeId
          );
          e.target.value = currentEdge ? currentEdge.weight.toString() : "1"; // Fallback to '1' if edge not found
        }
      }
    };

    return (
      <div
        onClick={() => setSelectedEdge(edgeId)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%", // Ensure the div takes up full width of its container
          cursor: "pointer",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayEdgeName}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            minWidth: "50px",
          }}
        >
          {selectedEdge === edgeId ? (
            <input
              className="editableInput"
              type="text"
              defaultValue={edge.weight.toString()}
              onBlur={(e) => handleEdgeWeightUpdate(e, edgeId)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "35px", // Adjust based on expected input width
                marginLeft: "5px",
                textAlign: "right",
              }}
            />
          ) : showWeight ? (
            <span style={{ marginLeft: "5px", color: "#E3C46E" }}>
              {edge.weight}
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
          height: "calc(90%)",
          backgroundColor: "inherit",
          overflow: "hidden",
        }}
      >
        <Container
          className="dataRoomContainer"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingTop: "2vh",
          }}
        >
          <Typography
            variant="h6"
            className="dataRoomTitle"
            style={{ overflow: "hidden", color: "whitesmoke" }}
          >
            Nodes
          </Typography>
          <List
            sx={{
              overflowY: "auto",
              height: "calc(100%)", // prevents it from covering up the title
              paddingTop: "1vh",
              "&::-webkit-scrollbar": { width: "0.5px" },
              "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "trasparent" },
              backgroundColor: "inherit",
              width: "85%",
            }}
          >
            {nodes.map((node, index) => (
              <ListItem
                key={index}
                className={
                  node.id === selectedNode
                    ? "dataRoomTextSelected"
                    : "dataRoomText"
                }
              >
                {renderNodeItem(node)}
              </ListItem>
            ))}
          </List>
        </Container>

        <Divider
          orientation="vertical"
          flexItem
          variant="middle"
          style={{ backgroundColor: "#706f6f", marginLeft: "-30px" }}
        />

        <Container
          className="dataRoomContainer"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingTop: "2vh",
          }}
        >
          <Typography
            variant="h6"
            className="dataRoomTitle"
            style={{ overflow: "hidden", color: "whitesmoke" }}
          >
            Edges
          </Typography>
          <List
            sx={{
              overflowY: "auto",
              height: "calc(100%)", // prevents it from covering up the title
              paddingTop: "1vh",
              "&::-webkit-scrollbar": { width: "0.5px" },
              "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "transparent" },
              backgroundColor: "inherit",
              width: "94%",
            }}
          >
            {edges.map((edge, index) => (
              <ListItem
                key={index}
                onClick={() => setSelectedEdge(`${edge.id1}-${edge.id2}`)}
                className={
                  selectedEdge === `${edge.id1}-${edge.id2}`
                    ? "dataRoomTextSelected"
                    : "dataRoomText"
                }
              >
                {renderEdgeItem(edge)}
              </ListItem>
            ))}
          </List>
        </Container>
      </div>

      <div
        style={{
          overflow: "hidden",
          position: "absolute",
          bottom: "6px",
          right: "-1px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "transparent",
          height: "calc(5%)",
        }}
      >
        {/* Button or Additional Information */}
        <Button onClick={() => setShowWeight(!showWeight)} style={{}}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor: "transparent",
            }}
          >
            {showWeight ? <ClosedEye /> : <OpenEye />}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default DataRoom;
