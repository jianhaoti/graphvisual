import React, { useState, useRef, useEffect, useCallback } from "react";
import Node from "./GraphNode";
import Edge from "./GraphEdge";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useBFS } from "./bfsContext.js";

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
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEdge: string | null;
  setSelectedEdge: React.Dispatch<React.SetStateAction<string | null>>;
  isOriented: boolean;
  setIsOriented: React.Dispatch<React.SetStateAction<boolean>>;
  showWeight: boolean;
  isGraphEditable: boolean;
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
      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== selectedNode)
      );
      setEdges((edges) =>
        edges.filter(
          (edge) => edge.id1 !== selectedNode && edge.id2 !== selectedNode
        )
      );
      setSelectedNode(null);

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
        weight: 1,
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
    (nodeId: string) => {
      // Clear any existing timer to prevent duplicate name displays
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = setTimeout(() => {
        // Access the latest nodes state directly from the ref
        const currentNodes = nodesRef.current;
        const nodeExists = currentNodes.some((n) => n.id === nodeId);
        if (!isMouseDown && nodeExists) {
          // Find the node to set as hoveredNode
          const node = currentNodes.find((n) => n.id === nodeId);
          setHoveredNode(node || null);
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

  // bfs
  const { bfsState } = useBFS();

  useEffect(() => console.log(bfsState), [bfsState]);

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
        <svg width="200" height="200">
          {nodes.map((node) => {
            let currentNodeStatus = "default";

            if (bfsState.isVisualizationActive && currentNodeStatus) {
              currentNodeStatus = bfsState.nodeStatus.get(node.id);
            }

            return (
              <Node
                key={node.id}
                node={node}
                isSelected={node.id === selectedNode}
                isDraggable={node.id === selectedNode && !isSpaceDown}
                onClick={() => handleNodeClick(node.id)}
                onDrag={handleNodeDrag}
                onDoubleClick={(nodeId) =>
                  navigator.clipboard.writeText(nodeId)
                }
                onContextMenu={(e) => handleNodeContextMenu(e, node.id)}
                onMouseEnter={() => handleMouseEnter(node.id)}
                onMouseLeave={handleMouseLeave}
                nodeStatus={currentNodeStatus} // Pass the node status here
              />
            );
          })}

          {/* Overlays text for BFS */}
          {bfsState.isVisualizationActive &&
            nodes.map((node) => {
              // text coloring logic
              let textColor = "transparent";
              if (bfsState.isVisualizationActive) {
                let currentNodeStatus =
                  bfsState.nodeStatus.get(node.id) || "default";

                // show name if white
                if (currentNodeStatus === "processing") {
                  textColor = "#EFFAF5";
                }
                // show name if orange
                else if (currentNodeStatus === "queue") {
                  textColor = "#DB380F";
                }
              }
              return (
                <text
                  key={`text-${node.id}`}
                  x={node.x + 5} // Adjust position relative to the node
                  y={node.y - 15}
                  fill={textColor}
                  fontSize="14"
                  textAnchor="start"
                  style={{
                    userSelect: "none", // Standard
                    WebkitUserSelect: "none", // Safari, Chrome and Opera
                    MozUserSelect: "none", // Firefox
                    pointerEvents: "none", // This also prevents interactions like mouse events
                  }}
                >
                  {node.id}
                </text>
              );
            })}

          {hoveredNode && !bfsState.isVisualizationActive && (
            <text
              x={hoveredNode.x + 5}
              y={hoveredNode.y - 15} // Adjust position as needed
              fill={
                hoveredNode && hoveredNode.id === selectedNode
                  ? "white"
                  : "#E3C46E"
              }
              fontSize="14"
              textAnchor="middle"
            >
              {hoveredNode.id}
            </text>
          )}

          {edges
            .filter((edge) => edge.x2 !== null && edge.y2 !== null)
            .map((edge) => {
              //life cycle of edge is default -> queued -> processing -> processed
              // let edgeStatus:
              //   | "processed"
              //   | "processing"
              //   | "queued"
              //   | "default" = "default";

              if (bfsState.isVisualizationActive) {
                // orange + white  => orange edge
                // if (
                //   currentStep?.processing === edge.id1 &&
                //   currentStep?.queue.includes(edge.id2)
                // ) {
                //   edgeStatus = "queued";
                // }
                // // orange + black  => orange edge
                // if (
                //   currentStep?.visited.includes(edge.id1) &&
                //   currentStep?.queue.includes(edge.id2)
                // ) {
                //   edgeStatus = "queued";
                // }
                // // black + white  => white edge
                // if (
                //   currentStep?.visited.includes(edge.id1) &&
                //   currentStep?.processing === edge.id2
                // ) {
                //   edgeStatus = "processing";
                // }
                // // black + black => black
                // if (
                //   edgeStatus === "processing" &&
                //   currentStep?.visited.includes(edge.id1) &&
                //   currentStep?.visited.includes(edge.id2)
                // ) {
                //   edgeStatus = "processed";
                // }
              }
              return (
                <Edge
                  key={`${edge.id1}-${edge.id2}`}
                  edge={edge}
                  isSelected={selectedEdge === `${edge.id1}-${edge.id2}`}
                  onClick={handleEdgeClick}
                  onDoubleClick={handleEdgeDoubleClick}
                  onContextMenu={handleEdgeContextMenu}
                  isOriented={isOriented}
                  showWeight={showWeight}
                  edgeStatus={"default"}
                />
              );
            })}
        </svg>
      </div>

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
    </div>
  );
};

export default Graph;
