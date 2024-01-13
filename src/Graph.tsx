// Graph.tsx
import React, { useState } from 'react';
import Node from './GraphNode';

interface Node {
    id:string;
    x: number;
    y: number;
  }
  
const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([]); // Node list
  const [selectedNode, setSelectedNode] = useState<string | null>(null); // ID which node is selected

  // Lclick container: Node creation & selection
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newNode = {
      id: `node-${Date.now()}`, // Example ID, ensure it's unique
      x: e.clientX,
      y: e.clientY
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNode(newNode.id);
  } 

  // Rclick container: n/a 
  const handleContainerContextMenu = (e: React.MouseEvent)=> {
    e.preventDefault();
  };

  // Rclick node: delete & (unhighlight) 
  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault(); // Prevent the default context menu behavior
    
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    setNodes(updatedNodes);
    setSelectedNode(null); // Optionally unselect the node if it's deleted
  };

  return (
    <div className="container" 
      onContextMenu={handleContainerContextMenu}
      onClick={handleContainerClick}
    >
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          isSelected={node.id === selectedNode}
          onClick={() => setSelectedNode(node.id)}
          onContextMenu={e => handleNodeContextMenu(e, node.id)}
        />
      ))}
    </div>
  );
};

export default Graph;
