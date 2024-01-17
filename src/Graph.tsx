// Graph.tsx
import React, { useState, useRef, useEffect } from 'react';
import Node from './GraphNode';
import Edge from './GraphEdge';

interface Node {
    id: string;
    x: number;
    y: number;
  }

interface Edge {
  id1: string;
  id2: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
  
const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([]); // Nodes list
  const [edges, setEdges] = useState<Edge[]>([]) // Edges list

  const [selectedNode, setSelectedNode] = useState<string | null>(null); // ID which node is selected

  const clickStartTime = useRef<number | null>(null); // Detecting click vs hold
  const [spaceDown, setIsSpaceDown] = useState(false); // Detecting when space bar is held down.

  // Detect if space is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0){
      clickStartTime.current = new Date().getTime() // Drag or clck info to be used
        
      if (spaceDown && (e.target && (e.target as Element).classList.contains('graph-node'))){
        const nodeElement = e.target as SVGCircleElement; // Correctly cast to SVGCircleElement
        const newEdge = {
          id1: nodeElement.id, 
          x1: nodeElement.cx.baseVal.value, // Accessing the 'cx' value for circles
          y1: nodeElement.cy.baseVal.value  // Accessing the 'cy' value for circles
        }
        // console.log("Edge starts at node: ", newEdge.id1, "at (x,y) = (", newEdge.x1, newEdge.y1, ").");
      }       
    };
  };

  // Lclick container: Selection or Node creation 
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // If click a node, don't create a new node 
    if (e.target && (e.target as Element).classList.contains('graph-node')) return;

    // Otherwise, on canvas click check if short or long click
    if (e.button === 0 && !spaceDown){
      // Node creation
      const clickDuration = new Date().getTime() - (clickStartTime.current || new Date().getTime());

      if(clickDuration < 200){ // short click creates a node
        const svgRect = e.currentTarget.getBoundingClientRect();
        const newNode = {
          id: `node-${Date.now()}`, 
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top
        };
        console.log("New node id is: ", newNode.id, "at (x,y) = (", newNode.x, newNode.y, ") is draggable.");
        
        setNodes(prevNodes => [...prevNodes, newNode]);
        setSelectedNode(newNode.id);
        clickStartTime.current = null;
      }
    }
  } 

  // Rclick container: n/a 
  const handleContainerContextMenu = (e: React.MouseEvent)=> {
      e.preventDefault();
  };

  // Lclick node: edge creation or select
  const handleNodeClick = (nodeId:string) =>{
    setSelectedNode(nodeId)
  }
  // Rclick node: delete & unhighlight
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
          
          isSpaceDown = {spaceDown}
          // 1 Lclick
          isSelected={node.id === selectedNode}
          onClick={() => handleNodeClick(node.id)}
          
          onContextMenu={e => handleNodeContextMenu(e, node.id)}
        />
        ))}
      </svg>
    </div>
  );
};

export default Graph;