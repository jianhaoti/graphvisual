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
  const nodeRadius = 6;

  if (edge.x2 === null || edge.y2 === null) {
    return null; // Or some placeholder representation
  }

  const edgeId = `${edge.id1}-${edge.id2}`;
  const arrowheadId = `arrowhead-${edge.id1}-${edge.id2}`;

  /*
  // Calculate midpoint of the edge
  const midX = (edge.x1 + edge.x2) / 2;
  const midY = (edge.y1 + edge.y2) / 2;

  // Calculate offsets for a short line segment near the midpoint
  const offsetX = (edge.x2 - edge.x1) / 30; // Adjust divisor for the length of the segment
  const offsetY = (edge.y2 - edge.y1) / 30; // Adjust divisor for the length of the segment */

  // Calculate direction vector
  const dirX = edge.x2 - edge.x1;
  const dirY = edge.y2 - edge.y1;
  const length = Math.sqrt(dirX * dirX + dirY * dirY);

  // Normalize the direction vector
  const normX = dirX / length;
  const normY = dirY / length;

  // Scale the vector by the node radius
  const offsetX = normX * nodeRadius;
  const offsetY = normY * nodeRadius;

  // Adjust start and end points
  const adjustedStartX = edge.x1 + offsetX;
  const adjustedStartY = edge.y1 + offsetY;
  const adjustedEndX = edge.x2 - offsetX;
  const adjustedEndY = edge.y2 - offsetY;

  // Calculate midpoint for arrow placement
  const arrowPlacementFactor = 0.4; // Adjust this value to move the arrow along the edge
  const arrowMidX = adjustedStartX + dirX * arrowPlacementFactor;
  const arrowMidY = adjustedStartY + dirY * arrowPlacementFactor;

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
        x1={adjustedStartX} 
        y1={adjustedStartY} 
        x2={adjustedEndX} 
        y2={adjustedEndY} 
        strokeWidth={1} 
        onClick={handleEdgeClick}
        onContextMenu={handleEdgeContextMenu}  
        stroke={isSelected ? 'darkred' : 'black'}
        style={{ cursor: 'grab' }} // Set the cursor style for better UX

      />

      <line
        className="graph-edge"       
        x1={arrowMidX - offsetX}
        y1={arrowMidY - offsetY}
        x2={arrowMidX + offsetX}
        y2={arrowMidY + offsetY}
        stroke="transparent" // Make this line invisible
        strokeWidth={1}
        markerEnd={`url(#${arrowheadId})`}
        onClick={handleEdgeClick}
        onContextMenu={handleEdgeContextMenu}  
        style={{ cursor: 'grab' }} // Set the cursor style for better UX
      />
    </g>
  );
};

export default Edge;
