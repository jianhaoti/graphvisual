// Graph.tsx
import React, { useState, useRef } from 'react';
import Node from './GraphNode';

interface Node {
    id:string;
    x: number;
    y: number;
  }
  
const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([]); // Node list
  const [selectedNode, setSelectedNode] = useState<string | null>(null); // ID which node is selected
  const clickStartTime = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0){
      clickStartTime.current = new Date().getTime()
    };
  };

  // Lclick container: Node creation & selection
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0){ 
        const clickDuration = new Date().getTime() - (clickStartTime.current || new Date().getTime());

      if(clickDuration < 200){
        const svgRect = e.currentTarget.getBoundingClientRect();
        const newNode = {
          id: `node-${Date.now()}`, // Example ID, ensure it's unique
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top
        };
        console.log("New node id is: ", newNode.id, "at (x,y) = (", newNode.x, newNode.y, ")");
        
        setNodes(prevNodes => [...prevNodes, newNode]);
        setSelectedNode(newNode.id);
        clickStartTime.current = null;
      }
    }
  } 

  // Rclick container: n/a 
  const handleContainerContextMenu = (e: React.MouseEvent)=> {
    console.log("Right click on canvas")
    e.preventDefault();
  };

  // Rclick node: delete & (unhighlight) 
  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault(); // Prevent the default context menu behavior
    
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    setNodes(updatedNodes);
  };

  return (
    <div className = "container" 
      onMouseDown = {handleMouseDown}
      onMouseUp = {handleMouseUp}
      onContextMenu = {e => handleContainerContextMenu(e)}
    >
      <svg width ="200" height = "200">
        {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          isSelected={node.id === selectedNode}
          onClick={() => setSelectedNode(node.id)}
          onContextMenu={e => handleNodeContextMenu(e, node.id)}
        />
        ))}
      </svg>
    </div>
  );
};

export default Graph;