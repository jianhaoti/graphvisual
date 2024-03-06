import React from "react";

type Edge = {
  id1: string;
  x1: number;
  y1: number;
  id2: string | null;
  x2: number | null;
  y2: number | null;
  weight: number;
};

interface GraphEdgeProps {
  edge: Edge;
  isOriented: boolean;
  showWeight: boolean;
  onClick: (edgeId: string) => void;
  onDoubleClick: (edge: Edge) => void;
  onContextMenu: (e: React.MouseEvent, edgeId: string) => void;
  size: string;
  color: string;
  opacity: number;
  arrowOpacity: number;
}

const Edge: React.FC<GraphEdgeProps> = ({
  edge,
  isOriented,
  showWeight,
  onClick,
  onDoubleClick,
  onContextMenu,
  size,
  color,
  opacity,
  arrowOpacity,
}) => {
  const nodeRadius = size === "small" ? 10 : 11;
  const style = {
    stroke: color,
    opacity: opacity,
    arrowOpacity: arrowOpacity,
  };

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

  // Apply the bufferFactor to the offsetX and offsetY calculations
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
  let angleDeg = (angleRad * 180) / Math.PI;
  const isVertical = Math.abs(angleDeg) > 45 && Math.abs(angleDeg) < 135;

  // Adjust weight text position based on the angle
  const sideOffset = 5; // Distance from the edge to display the weight text
  let weightPosXAdjusted = weightPosX;
  let weightPosYAdjusted = weightPosY;
  let textAnchor = "middle"; // Default text anchor

  if (isVertical) {
    // Move the text to the side of the edge instead of above/below
    // Decide on left or right side based on the direction of the edge
    weightPosXAdjusted += (edge.x1 > edge.x2 ? -1 : 1) * sideOffset;
    weightPosYAdjusted += sideOffset / 2; // Slight vertical adjustment for better visibility
    textAnchor = edge.x1 > edge.x2 ? "end" : "start"; // Align text based on side
  }

  // Check the direction of the edge to adjust text orientation
  // If the edge is oriented from right to left, add 180 degrees to flip the text
  if (edge.x1 > edge.x2!) {
    angleDeg += 180;
  }

  const handleEdgeClick = () => {
    onClick(edgeId);
  };

  const handleEdgeDoubleClick = () => {
    onDoubleClick(edge);
  };

  const handleEdgeContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onContextMenu(e, edgeId);
  };

  const markerWidth = size === "small" ? "10" : "12.5";
  const markerHeight = size === "small" ? "7" : "8.75";
  const refX = size === "small" ? "0" : "5";
  const refY = size === "small" ? "3.5" : "4.375";

  return (
    <g>
      <defs>
        <marker
          id={arrowheadId}
          markerWidth={markerWidth}
          markerHeight={markerHeight}
          refX={refX} // Adjusted for positioning; you might need to experiment with this
          refY={refY} // Adjusted to half of markerHeight to center the arrow vertically
          orient="auto"
        >
          <polygon
            points={`0 0, ${markerWidth} ${Number(markerHeight) / 2}, 0 ${markerHeight}`}
            fill={color}
            fillOpacity={arrowOpacity}
          />
        </marker>
      </defs>
      <line
        className="graph-edge"
        x1={adjustedStartX}
        y1={adjustedStartY}
        x2={adjustedEndX}
        y2={adjustedEndY}
        strokeWidth={2.5}
        onClick={handleEdgeClick}
        onDoubleClick={handleEdgeDoubleClick}
        onContextMenu={handleEdgeContextMenu}
        style={{ ...style, cursor: "grab" }}
      />

      {isOriented && (
        <line // Add an arrowhead if the edge is oriented
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
          style={{ cursor: "pointer" }} // Set the cursor style for better UX
        />
      )}

      {showWeight && (
        <text
          x={weightPosXAdjusted}
          y={weightPosYAdjusted}
          fill={color}
          dy="0.1em"
          textAnchor={textAnchor} // Use the dynamically adjusted text anchor
          transform={`rotate(${isVertical ? 0 : angleDeg}, ${weightPosXAdjusted}, ${weightPosYAdjusted})`} // Rotate only if not vertical
          style={{
            userSelect: "none",
            pointerEvents: "none",
            fontSize: "12px",
          }} // Added fontSize for better visibility
        >
          {edge.weight}
        </text>
      )}
    </g>
  );
};

export default Edge;
