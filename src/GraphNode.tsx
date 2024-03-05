// GraphNode.tsx
import React, { useRef, useCallback, useEffect } from "react";
import useDraggerSVG from "./useDraggerSVG";
import styles from "./GraphNode.module.css"; // Import the CSS module

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
  onDoubleClick?: (nodeId: string) => void;
  nodeStatus: string;
  createCircle: boolean;
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
  onDoubleClick,
  nodeStatus = "default",
  createCircle,
}) => {
  const nodeRef = useRef<SVGCircleElement | null>(null);
  const radius = 10;

  const getColor = (status: string) => {
    switch (status) {
      case "visited":
        return "black";
      case "queue":
        return " #DB380F";
      case "processing":
        return "#EFFAF5";
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

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick(node.id);
    }
  };

  return (
    <>
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
        onDoubleClick={handleDoubleClick}
      />
      {createCircle && (
        <>
          <circle
            cx={node.x}
            cy={node.y}
            r={20}
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity=".3"
          />
          <text
            x={node.x}
            y={node.y - 30} // Adjust based on your needs
            // className={styles.rotatingText} // controls rotation css
            style={{
              dominantBaseline: "middle",
              textAnchor: "middle",
              fill: "white",
              fontSize: "12px",
              userSelect: "none",
              transform: `rotate(0, ${node.x}, ${node.y})`,
              transformOrigin: `${node.x}px ${node.y}px`,
            }}
          >
            Source
          </text>
        </>
      )}
    </>
  );
};

export default Node;
