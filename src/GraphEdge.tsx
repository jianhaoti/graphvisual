import React from 'react';
interface GraphEdgeProps{
  edge: {
    id1: string;
    x1: number;
    y1: number;

    id2: string | null;
    x2: number | null;
    y2: number | null;
  };
  isSelected: boolean;
  onClick: (edgeId: string) => void;
  onContextMenu: (e: React.MouseEvent, edgeId: string) => void;
}

const Edge: React.FC<GraphEdgeProps> = ({edge, isSelected, onClick, onContextMenu}) => {
  if (edge.x2 === null || edge.y2 === null) {
    return null; // Or some placeholder representation
  }

  const edgeId = `${edge.id1}-${edge.id2}`;
  const arrowheadId = `arrowhead-${edge.id1}-${edge.id2}`;

  // Calculate midpoint of the edge
  const midX = (edge.x1 + edge.x2) / 2;
  const midY = (edge.y1 + edge.y2) / 2;

  // Calculate offsets for a short line segment near the midpoint
  const offsetX = (edge.x2 - edge.x1) / 30; // Adjust divisor for the length of the segment
  const offsetY = (edge.y2 - edge.y1) / 30; // Adjust divisor for the length of the segment

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onClick(edgeId);
  };

  const handleEdgeContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onContextMenu(e, edgeId);
  };

  return (
    <g>
      <defs>
        <marker 
          id={arrowheadId}
          markerWidth="10" 
          markerHeight="7" 
          refX="0" 
          refY="3.5" 
          orient="auto"
        >
        <polygon 
          points="0 0, 10 3.5, 0 7" 
          fill={isSelected ? 'darkred' : 'black'} 
        />
        </marker>
      </defs>
      <line
        className="graph-edge" 
        x1={edge.x1} 
        y1={edge.y1} 
        x2={edge.x2} 
        y2={edge.y2} 
        strokeWidth={2} 
        onClick={handleEdgeClick}
        onContextMenu={handleEdgeContextMenu}  
        stroke={isSelected ? 'darkred' : 'black'}
        style={{ cursor: 'grab' }} // Set the cursor style for better UX

      />

      <line
        className="graph-edge"       
        x1={midX-offsetX}
        y1={midY-offsetY}
        x2={midX+offsetX}
        y2={midY+offsetY}
        stroke="transparent" // Make this line invisible
        strokeWidth={2}
        markerEnd={`url(#${arrowheadId})`}
        onClick={handleEdgeClick}
        onContextMenu={handleEdgeContextMenu}  
        style={{ cursor: 'grab' }} // Set the cursor style for better UX
      />
    </g>
  );
};

export default Edge;
