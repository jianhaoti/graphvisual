import React, { useState} from 'react';
import Circle from './Circle';

const TestGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);


  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleCanvasClick = (event) => {
    if (event.target.tagName === 'svg') {
      const newNode = {
        id: Date.now().toString(),
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
      setSelectedNode(newNode.id); 
    }
  };

  const handleCanvasContextMenu = (event) => {
    event.preventDefault();
  };

  const handleNodeContextMenu = (event, nodeId) => {
    event.preventDefault();
    const updatedNodes = nodes.filter((node) => node.id !== nodeId);
    setNodes(updatedNodes);
  };
  
  return (
  <div className='container'
     style={{ position: 'relative', 
              width: '800px', 
              height: '800px', 
              border: '1px solid #ccc', 
              overflow: 'hidden'}}
      onClick={handleCanvasClick}
      onContextMenu={handleCanvasContextMenu}
    >
      <svg style={{width: '100%', height: '100%'}}>
      {nodes.map((node) => (
        <Circle
          key={node.id}
          node={node}
          isSelected={node.id === selectedNode}
          onClick={handleNodeClick}
          onContextMenu={handleNodeContextMenu}
        />
      ))}
      </svg> 
  </div>
  );
};

export default Graph;
