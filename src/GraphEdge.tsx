import React from 'react';
interface GraphEdgeProps{
  edge: {
    id1: string;
    x1: number;
    y1: number;

    id2: string | null;
    x2: number | null;
    y2: number | null;
  };}

const Edge: React.FC<GraphEdgeProps> = ({edge}) => {
  if (edge.x2 === null || edge.y2 === null) {
    return null; // Or some placeholder representation
  }
  
  return (
    <line 
    x1={edge.x1} 
    y1={edge.y1} 
    x2={edge.x2} 
    y2={edge.y2} 
    stroke="black" 
    strokeWidth={2} 
    />
  );
};

export default Edge;
