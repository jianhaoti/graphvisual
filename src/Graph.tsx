import React, { useState, useRef, useEffect, useCallback } from "react";
import Node from "./GraphNode";
import Edge from "./GraphEdge";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useBFS } from "./bfsContext.js";
import { Watermark } from "antd";
import type { WatermarkProps } from "antd";
import styles from "./Graph.module.css";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    // thumb color
    color: theme.palette.primary.main,
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#96AACD", // track color when checked
    },
  },
}));

interface GraphProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void; // Updated to a function type
  selectedEdge: string | null;
  setSelectedEdge: (edgeIs: string | null) => void; // Updated to a function type
  isOriented: boolean;
  setIsOriented: React.Dispatch<React.SetStateAction<boolean>>;
  showWeight: boolean;
  isGraphEditable: boolean;
  size: string;
  showWatermark: boolean;
  setShowWatermark: React.Dispatch<React.SetStateAction<boolean>>;
}

const Graph: React.FC<GraphProps> = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNode,
  setSelectedNode,
  selectedEdge,
  setSelectedEdge,
  isOriented,
  setIsOriented,
  showWeight,
  isGraphEditable,
  size,
  showWatermark,
  setShowWatermark,
}) => {
  // Mine
  const currentNodeRef = useRef<SVGCircleElement | null>(null);
  const clickStartTime = useRef<number | null>(null);
  const switchContainerRef = useRef(null);

  const [tempEdge, setTempEdge] = useState<Edge | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isEdgeClicked, setIsEdgeClicked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleOrientationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isGraphEditable) {
      setIsSwitchOn({
        ...isSwitchOn,
        [event.target.name]: event.target.checked,
      });
      setIsOriented(!isOriented);
    }
  };

  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setHoveredNode(null);
      setSelectedNode(null);

      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== selectedNode)
      );
      setEdges((edges) =>
        edges.filter(
          (edge) => edge.id1 !== selectedNode && edge.id2 !== selectedNode
        )
      );

      // If the selected edge has its head or tail as selected node
      if (selectedEdge) {
        const [edgeId1, edgeId2] = selectedEdge.split("-");
        if (edgeId1 === selectedNode || edgeId2 === selectedNode) {
          setSelectedEdge(null);
        }
      }
    } else if (selectedEdge) {
      setEdges((edges) =>
        edges.filter((edge) => `${edge.id1}-${edge.id2}` !== selectedEdge)
      );
      setSelectedEdge(null);
    }
  }, [
    selectedNode,
    selectedEdge,
    setNodes,
    setEdges,
    setSelectedEdge,
    setSelectedNode,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpaceDown(true);
      }
      if (e.code === "Backspace" && isGraphEditable) {
        deleteSelected();
      }
      // Check if Ctrl+C or Cmd+C is pressed and there is a selected node
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyC" && selectedNode) {
        // Copy selectedNode ID to clipboard
        navigator.clipboard
          .writeText(selectedNode)
          .then(() => {
            console.log(`Node ID ${selectedNode} copied to clipboard.`);
          })
          .catch((error) => {
            console.error("Error copying text: ", error);
          });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpaceDown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [deleteSelected, isGraphEditable, selectedNode]);

  const handleNodeDrag = (
    nodeId: string,
    newPosition: { x: number; y: number }
  ) => {
    // Update the position of the dragged node
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId
        ? { ...node, x: newPosition.x, y: newPosition.y }
        : node
    );

    // Update edges if needed
    const updatedEdges = edges.map((edge) => {
      if (edge.id1 === nodeId) {
        return { ...edge, x1: newPosition.x, y1: newPosition.y };
      } else if (edge.id2 === nodeId) {
        return { ...edge, x2: newPosition.x, y2: newPosition.y };
      }
      return edge;
    });

    // Update state and history
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const handleEdgeCreation = (node: SVGCircleElement) => {
    const newEdge = {
      id1: node.id,
      x1: node.cx.baseVal.value,
      y1: node.cy.baseVal.value,
      id2: null,
      x2: null,
      y2: null,
      weight: 1,
    };
    setTempEdge(newEdge);
  };

  const handleSpaceDown = (e: React.KeyboardEvent) => {
    if (!isSpaceDown) {
      if (e.code === "Space" && isMouseDown && currentNodeRef.current) {
        setIsSpaceDown(true);
        if (isGraphEditable) {
          handleEdgeCreation(currentNodeRef.current);
        }
      }
    }
  };

  const handleSpaceUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space") {
      setIsSpaceDown(false);
    }
  };

  const handleNodeCreation = (e: React.MouseEvent) => {
    setShowWatermark(false);
    const svgRect = e.currentTarget.getBoundingClientRect();
    const newNode = {
      id: `${Date.now()}`,
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const handleEdgeCompletion = (endNode: SVGCircleElement) => {
    const updatedEdge = {
      ...tempEdge,
      id2: endNode.id,
      x2: endNode.cx.baseVal.value,
      y2: endNode.cy.baseVal.value,
      weight: 1,
    };
    setEdges((prevEdges: Edge[]) => [...prevEdges, updatedEdge] as Edge[]);
    setTempEdge(null);
    setSelectedNode(endNode.id);
    setSelectedEdge(null);

    // Reset the clock
    clickStartTime.current = null;
    return;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsMouseDown(true);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      setHoveredNode(null);
      // Check if the click is inside the switch container
      if (
        e.target instanceof Element &&
        e.target.closest("#mySwitchContainer")
      ) {
        return; // Do nothing if the click is on or within the switch
      }

      clickStartTime.current = new Date().getTime();
      if (e.target && (e.target as Element).classList.contains("graph-node")) {
        const element = e.target as SVGCircleElement;
        currentNodeRef.current = element;
        /* if(!isSpaceDown){
          setSelectedNode(element.id);
        } */
        if (isSpaceDown && isGraphEditable) {
          handleEdgeCreation(element);
        }
      }
      if (e.target && (e.target as Element).classList.contains("graph-edge")) {
        setIsEdgeClicked(true);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      setIsMouseDown(false);
      if (
        e.target instanceof Element &&
        e.target.closest("#mySwitchContainer")
      ) {
        return; // Do nothing if the click is on or within the switch
      }

      currentNodeRef.current = null;
      const clickDuration =
        new Date().getTime() - (clickStartTime.current || new Date().getTime());
      if (isEdgeClicked) {
        setIsEdgeClicked(false);
        return;
      }
      if (!isSpaceDown) {
        setSelectedEdge(null);

        // If normal click on node
        if (
          e.target &&
          (e.target as Element).classList.contains("graph-node")
        ) {
          const element = e.target as SVGCircleElement;
          handleNodeClick(element.id);
          return;
        }

        // Node creation
        if (clickDuration < 200 && isGraphEditable) {
          // Reset the clock
          clickStartTime.current = null;
          handleNodeCreation(e);
          return;
        }
      } else {
        // If we didn't come from a node, don't do anything
        if (!tempEdge) {
          setTempEdge(null);
          setSelectedNode(null);
          return;
        }
        // If we land on a node, make the edge if no self-loops
        if (
          e.target &&
          (e.target as Element).classList.contains("graph-node")
        ) {
          const endNode = e.target as SVGCircleElement;

          // Check if the edge already exists, only allow one direction if oriented
          const edgeExists = edges.some(
            (edge) =>
              (edge.id1 === tempEdge?.id1 && edge.id2 === endNode.id) ||
              (edge.id1 === endNode.id && edge.id2 === tempEdge?.id1)
          );

          // No self-loops allowed
          if (tempEdge?.id1 === endNode.id) {
            setTempEdge(null);
            setSelectedNode(endNode.id);
            return;
          } else {
            // All clear to make the edge
            if (!edgeExists && isGraphEditable) {
              handleEdgeCompletion(endNode);
              return;
            }
            if (edgeExists) {
              setTempEdge(null);
              setSelectedNode(endNode.id);
              return;
            }
          }
        }
      }
      setSelectedNode(null);
    }
  };

  const handleContainerContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedEdge(null);
    setSelectedNode(null);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edgeId: string) => {
    setSelectedNode(null);
    setSelectedEdge(edgeId);
  };

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    if (isGraphEditable) {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) =>
        edges.filter((edge) => edge.id1 !== nodeId && edge.id2 !== nodeId)
      );
      setSelectedNode(null);
    }
    setHoveredNode(null);
  };

  const handleEdgeContextMenu = (e: React.MouseEvent, edgeId: string) => {
    e.preventDefault();
    if (isGraphEditable) {
      setEdges((edges) =>
        edges.filter((edge) => `${edge.id1}-${edge.id2}` !== edgeId)
      );
      setSelectedEdge(null);
    }
  };

  const handleEdgeDoubleClick = (reverseThisEdge: Edge) => {
    // exit on trying to reverse temp edge
    if (!reverseThisEdge.id2 || !isOriented) return;

    // otherwise, check if editable then reverse
    if (isGraphEditable) {
      const newEdges = edges.filter(
        (e) => e.id1 !== reverseThisEdge.id1 || e.id2 !== reverseThisEdge.id2
      );
      const reversedEdge = {
        id1: reverseThisEdge.id2 as string,
        x1: reverseThisEdge.x2 as number,
        y1: reverseThisEdge.y2 as number,
        id2: reverseThisEdge.id1 as string,
        x2: reverseThisEdge.x1 as number,
        y2: reverseThisEdge.y1 as number,
        weight: reverseThisEdge.weight,
      };
      setEdges([...newEdges, reversedEdge]);
      const reversedId = `${reversedEdge.id1}-${reversedEdge.id2}`;
      handleEdgeClick(reversedId);
    }
  };

  // State to track hovered node details
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep a reference of the current nodes. This will be useful
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const handleMouseEnter = useCallback(
    (enteredNode: string) => {
      // Clear any existing timer to prevent duplicate name displays
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = setTimeout(() => {
        // Access the latest nodes state directly from the ref
        const currentNodes = nodesRef.current;
        const nodeExists = currentNodes.some((node) => node.id === enteredNode);
        if (!isMouseDown && nodeExists) {
          // Find the node to set as hoveredNode
          const hoveredNode = currentNodes.find(
            (node) => node.id === enteredNode
          );
          setHoveredNode(hoveredNode || null);
        }
      }, 1000); // Wait for 1 second before showing the name
    },
    [isMouseDown]
  );

  const handleMouseLeave = useCallback(() => {
    // Clear the timer if the mouse leaves before the timeout
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setHoveredNode(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // Watermark
  interface WatermarkConfig {
    content: string;
    color: string;
    fontSize: number;
    rotate: number;
    gap: [number, number];
  }
  const [config] = useState<WatermarkConfig>({
    content: "Click Me",
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: 16,
    rotate: -22,
    gap: [100, 100],
  });
  const { content, color, fontSize, rotate, gap } = config;

  const watermarkProps: WatermarkProps = {
    content,
    rotate,
    gap,
    font: {
      color,
      fontSize,
    },
  };

  // bfs
  const { bfsState, bfsSourceNode } = useBFS();

  const whiteCircleRadius = size === "small" ? 20 : 21;
  const whiteTextAlignment = size === "small" ? 30 : 31;

  return (
    <div
      className="container container-left"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleSpaceDown}
      onKeyUp={handleSpaceUp}
      onContextMenu={(e) => handleContainerContextMenu(e)}
      tabIndex={0}
    >
      <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <div
          className={`${styles.watermarkTransition} ${!showWatermark ? styles.watermarkHidden : ""}`}
        >
          {showWatermark && (
            <Watermark {...watermarkProps}>
              <div style={{ height: 1000 }} />
            </Watermark>
          )}{" "}
        </div>

        <svg width="200" height="200">
          {nodes.map((node) => {
            const nodeIsSelected = node.id === selectedNode;

            // default value
            let color = nodeIsSelected ? "white" : "#E3C46E";

            // bfs
            if (bfsState.isVisualizationActive) {
              color = "E3C46E"; // disable white for selection
              let nodeStatus = bfsState.nodeStatus?.get(node.id);
              switch (nodeStatus) {
                case "visited":
                  color = "black";
                  break;
                case "queue":
                  color = " #DB380F";
                  break;
                case "processing":
                  color = "#EFFAF5";
                  break;
              }
            }
            return (
              <Node
                key={node.id}
                node={node}
                isDraggable={nodeIsSelected && !isSpaceDown}
                onClick={() => handleNodeClick(node.id)}
                onDrag={handleNodeDrag}
                onDoubleClick={(nodeId) =>
                  navigator.clipboard.writeText(nodeId)
                }
                onContextMenu={(e) => handleNodeContextMenu(e, node.id)}
                onMouseEnter={() => handleMouseEnter(node.id)}
                onMouseLeave={handleMouseLeave}
                color={color} // Pass the node status here
                size={size}
              />
            );
          })}

          {edges
            .filter((edge) => edge.x2 !== null && edge.y2 !== null)
            .map((edge) => {
              const edgeID = `${edge.id1}-${edge.id2}`;
              const edgeIsSelected = edgeID === selectedEdge;

              // default values
              let color = edgeIsSelected ? "white" : "#E3C46E";
              let opacity = 1;
              let arrowOpacity = 1;
              let weightColor = "white";

              // bfs
              if (bfsState.isVisualizationActive) {
                weightColor = "#E3C46E"; // blend weight color in with nodes, since it doesnt matter
                const edgeStatus =
                  bfsState.steps[bfsState.currentStepIndex].edgeStatus.get(
                    edgeID
                  );
                switch (edgeStatus) {
                  case "visited":
                    color = "black";
                    weightColor = "black";
                    break;
                  case "queued":
                    color = "#DB380F";
                    weightColor = "#DB380F";

                    break;
                  case "useless":
                    opacity = 0.2;
                    arrowOpacity = 0.3;

                    weightColor = "transparent";
                    break;
                }
              }

              return (
                <Edge
                  key={edgeID}
                  edge={edge}
                  onClick={handleEdgeClick}
                  onDoubleClick={handleEdgeDoubleClick}
                  onContextMenu={handleEdgeContextMenu}
                  isOriented={isOriented}
                  showWeight={showWeight}
                  size={size}
                  color={color}
                  opacity={opacity}
                  arrowOpacity={arrowOpacity}
                  weightColor={weightColor}
                />
              );
            })}

          {/* overlay for bfs. needs to be done seperately */}
          <svg>
            {bfsState.isVisualizationActive &&
              nodes.map((node) => {
                let textColor = "transparent";
                if (bfsState.isVisualizationActive) {
                  let currentNodeStatus =
                    bfsState.nodeStatus.get(node.id) || "default";

                  if (currentNodeStatus === "processing") {
                    textColor = "#EFFAF5";
                  } else if (currentNodeStatus === "queue") {
                    textColor = "#DB380F";
                  }
                }
                return (
                  <g key={node.id}>
                    {" "}
                    {/* Use a group to wrap related SVG elements */}
                    <text
                      x={node.x + 5}
                      y={node.y - 15}
                      fill={textColor}
                      fontSize="14"
                      textAnchor="start"
                      pointerEvents="none"
                      style={{ userSelect: "none", WebkitUserSelect: "none" }}
                    >
                      {node.id}
                    </text>
                    {/* logic for white circle to appear at end of bfs */}
                    {node.id === bfsSourceNode && bfsState.isCompleted && (
                      <>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={whiteCircleRadius}
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          opacity=".3"
                        />
                        <text
                          x={node.x}
                          y={node.y - whiteTextAlignment}
                          fill="white"
                          fontSize="12"
                          textAnchor="middle"
                          pointerEvents="none"
                          style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                          }}
                        >
                          Source
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
          </svg>

          {/* logic for text to appear at end of bfs */}
          {hoveredNode && !bfsState.isVisualizationActive && (
            <text
              x={hoveredNode.x + 5}
              y={hoveredNode.y - 15} // Adjust position as needed
              fill={"white"}
              fontSize="14"
              textAnchor="middle"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              {hoveredNode.id}
            </text>
          )}
        </svg>
      </div>

      {!showWatermark && (
        <div style={{ position: "absolute", bottom: "2px", right: "10px" }}>
          <CustomSwitch
            ref={switchContainerRef}
            id="mySwitchContainer"
            checked={isSwitchOn.checkedB}
            onChange={handleOrientationChange}
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
            style={{
              color: "#74A19E", // Changes the thumb color when 'off'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Graph;
