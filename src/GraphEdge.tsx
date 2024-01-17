import React from 'react';

interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  // You can add more props for styling, like stroke color, width, etc.
}

const GraphEdge: React.FC<GraphEdgeProps> = ({ x1, y1, x2, y2 }) => {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth={2} />
    // Customize the stroke and strokeWidth as needed
  );
};

export default GraphEdge;
