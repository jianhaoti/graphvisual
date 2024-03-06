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
  isDraggable: boolean;
  onClick: (nodeId: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDoubleClick?: (nodeId: string) => void;
  color: string;
  size: string;
}

const Node: React.FC<NodeProps> = ({
  node,
  isDraggable,
  onClick,
  onContextMenu,
  onDrag,
  onMouseEnter,
  onMouseLeave,
  onDoubleClick,
  color,
  size,
}) => {
  const nodeRef = useRef<SVGCircleElement | null>(null);

  const style = {
    cursor: "grab",
    fill: color,
  };
  const radius = size === "small" ? 10 : 11;

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
    <circle
      className="graph-node"
      id={node.id}
      ref={nodeRef}
      cx={node.x}
      cy={node.y}
      r={radius}
      onClick={() => onClick(node.id)}
      onContextMenu={(e) => onContextMenu(e, node.id)}
      style={{ ...style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default Node;
