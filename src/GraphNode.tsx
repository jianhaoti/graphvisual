// GraphNode.tsx
import React, { useRef, useCallback } from "react";
import useDraggerSVG from "./useDraggerSVG";

interface Node {
  id: string;
  x: number;
  y: number;
}

interface NodeProps {
  node: {
    id: string;
    x: number;
    y: number;
  };
  isSelected: boolean;
  isDraggable: boolean;
  onClick: (nodeId: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  // onDoubleClick: () => void;
  nodeStatus?: "visited" | "queue" | "processing" | "default";
}

const Node: React.FC<NodeProps> = ({
  node,
  isSelected,
  isDraggable,
  onClick,
  onContextMenu,
  onDrag,
  onMouseEnter,
  onMouseLeave,
  // onDoubleClick,
  nodeStatus = "default",
}) => {
  const nodeRef = useRef<SVGCircleElement | null>(null);
  const radius = 10;

  const getColor = (status: string) => {
    switch (status) {
      case "visited":
        return "black";
      case "queue":
        return "red";
      case "processing":
        return "gray";
      default:
        return isSelected ? "white" : "#E3C46E"; // Default color
    }
  };

  const color = getColor(nodeStatus);

  const style = {
    cursor: "grab",
    // Directly use `isVisualizationActive` to conditionally set the fill color
    fill: color,
  };

  // Memoize the onDrag callback
  const memoizedOnDrag = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      onDrag(id, newPosition);
    },
    [onDrag] // Dependency array, add any other dependencies if needed
  );

  // Node is draggable if node is selected and space is not held.
  useDraggerSVG(node.id, nodeRef, isDraggable, memoizedOnDrag);

  return (
    <circle
      className="graph-node"
      id={node.id}
      ref={nodeRef}
      cx={node.x}
      cy={node.y}
      r={radius}
      onClick={() => onClick(node.id)}
      onContextMenu={(e) => onContextMenu(e, node.id)}
      style={{ ...style }} // Set the cursor style for better UX
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onDoubleClick={onDoubleClick}
    />
  );
};

export default Node;
