// GraphNode.tsx
import React, { useRef, useCallback } from 'react';
import useDraggerSVG from './useDraggerSVG';

interface NodeProps {
  node: {
    id: string;
    x: number;
    y: number;
  };
  isSelected: boolean;
  isDraggable: boolean
  onClick: (nodeId: string) => void;
  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
}

const Node: React.FC<NodeProps> = ({node, isSelected, isDraggable, onClick, onContextMenu, onDrag}) => {
  const nodeRef = useRef<SVGCircleElement | null>(null);
  
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
      id = {node.id}
      ref={nodeRef} 
      cx={node.x}
      cy={node.y}
      r={10}
      fill={isSelected ? 'darkred' : 'black'}

      onClick={() => onClick(node.id)}
      onContextMenu={e => onContextMenu(e, node.id)}

      style={{ cursor: 'grab' }} // Set the cursor style for better UX
    />
  );
};

export default Node;
    