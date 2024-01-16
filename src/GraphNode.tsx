// GraphNode.tsx
import React, { useRef } from 'react';
import useDraggerSVG from './useDraggerSVG';

interface NodeProps {
  node: {
    id: string;
    x: number;
    y: number;
  };
  isSelected: boolean;
  onClick: (nodeId: string) => void;

  onContextMenu: (e: React.MouseEvent, nodeId: string) => void;
}

const Node: React.FC<NodeProps> = ({node, isSelected, onClick, onContextMenu}) => {
  const nodeRef = useRef<SVGCircleElement | null>(null);
  // Call useDragger hook to enable dragging for the node element
  useDraggerSVG(node.id, nodeRef, isSelected);


  return (
    <circle className="graph-node" 
      key = {node.id}
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
    