import React from 'react';

type Edge = {
  id1: string;
  x1: number;
  y1: number;
  id2: string | null;
  x2: number | null;
  y2: number | null;
  weight: number;
};

interface GraphEdgeProps{
  edge: Edge;
  isSelected: boolean;
  isOriented: boolean;
  onClick: (edgeId: string) => void;
  onDoubleClick: (edge: Edge) => void;
  onContextMenu: (e: React.MouseEvent, edgeId: string) => void;
}

const Edge: React.FC<GraphEdgeProps> = ({edge, isSelected, isOriented, onClick, onDoubleClick, onContextMenu}) => {
  const nodeRadius = 10;
  const color = isSelected ? 'white' : '#E3C46E';

  // Only return fully constructed edges
  if (edge.x2 === null || edge.y2 === null) {
    return null; 
  }

  const edgeId = `${edge.id1}-${edge.id2}`;
  const arrowheadId = `arrowhead-${edge.id1}-${edge.id2}`;

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

  // Calculate the position for displaying the edge weight
  // Adjust these values to position the text above the arrowhead or the line
  const weightPosX = (edge.x1 + edge.x2!) / 2;
  const weightPosY = (edge.y1 + edge.y2!) / 2 - 10; // Move text above by 10 units. Adjust as needed.

  // Calculate angle for text rotation to align with edge direction
  const angleRad = Math.atan2(edge.y2! - edge.y1, edge.x2! - edge.x1);
  let angleDeg = angleRad * 180 / Math.PI;

  // Check the direction of the edge to adjust text orientation
  // If the edge is oriented from right to left, add 180 degrees to flip the text
  if (edge.x1 > edge.x2!) {
    angleDeg += 180;
  }

  const handleEdgeClick = () => {
    onClick(edgeId)
  };

  const handleEdgeDoubleClick = () => {
    onDoubleClick(edge);
  
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
          fill={color} 
        />
        </marker>
      </defs>
      <line
        className="graph-edge" 
        x1={adjustedStartX} 
        y1={adjustedStartY} 
        x2={adjustedEndX} 
        y2={adjustedEndY} 
        strokeWidth={2} 
        onClick={handleEdgeClick}
        onDoubleClick={handleEdgeDoubleClick}
        onContextMenu={handleEdgeContextMenu}  
        stroke={color}
        style={{ cursor: 'pointer' }} // Set the cursor style for better UX

      />

      {isOriented && 
      (<line // Add an arrowhead if the edge is oriented
        className="graph-edge"       
        x1={arrowMidX - offsetX}
        y1={arrowMidY - offsetY}
        x2={arrowMidX + offsetX}
        y2={arrowMidY + offsetY}
        stroke="transparent" // Make this line invisible
        strokeWidth={1}
        markerEnd={`url(#${arrowheadId})`}
        onClick={handleEdgeClick}
        onDoubleClick={handleEdgeDoubleClick}
        onContextMenu={handleEdgeContextMenu}  
        style={{ cursor: 'pointer' }} // Set the cursor style for better UX
      />)} 

      <text
        x={weightPosX}
        y={weightPosY}
        fill={color}
        dy="5"
        textAnchor="middle"
        transform={`rotate(${angleDeg}, ${weightPosX}, ${weightPosY})`}
        style={{ userSelect: 'none', pointerEvents: 'none', fontSize: '12px' }} // Added fontSize for better visibility
      >
        {edge.weight}
      </text>

    </g>
  );
};

export default Edge;
