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
  x1: number;
  y1: number;
  
  id2: string| null;
  x2: number | null;
  y2: number| null;
}
  
const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([]); // Nodes list
  const [edges, setEdges] = useState<Edge[]>([]) // Edges list

  const currentNodeRef = useRef<SVGCircleElement| null>(null);
  const [tempEdge, setTempEdge] = useState<Edge|null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null); // ID which node is selected

  const clickStartTime = useRef<number | null>(null); // For detecting click vs hold
  
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false); 
  const [isDraggable, setIsDraggable] = useState(true); 

  // For debugging purposes which need synchonous data, use the following below
  /* useEffect(() => {
    console.log('Edges updated:', edges);
  }, [edges]); */
  
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

  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    setEdges(currentEdges => currentEdges.map(edge => {
      if (edge.id1 === nodeId) {
        return { ...edge, x1: newPosition.x, y1: newPosition.y };
      } else if (edge.id2 === nodeId) {
        return { ...edge, x2: newPosition.x, y2: newPosition.y };
      }
      return edge;
    }));
  };

  const handleEdgeCreation = (node: SVGCircleElement) => {
    const newEdge = {
      id1: node.id, 
      x1: node.cx.baseVal.value, // Accessing the 'cx' value for circles
      y1: node.cy.baseVal.value,  // Accessing the 'cy' value for circles
      id2: null,
      x2: null,
      y2: null        
    }
    setTempEdge(newEdge);
    setIsDraggable(false);
    // console.log("New edge starts at", newEdge.id1, "at (x,y) = (", newEdge.x1, newEdge.y1, ").");
  }       
  const handleSpaceDown = (e: React.KeyboardEvent) =>{
    if(!isSpaceDown){
      if (e.code === 'Space' && isMouseDown && currentNodeRef.current){
        setIsSpaceDown(true);
        handleEdgeCreation(currentNodeRef.current);
      }
    }
  }
  
  const handleSpaceUp = (e: React.KeyboardEvent) => {
    if(e.code ==='Space'){
      setIsSpaceDown(false);
      if(isMouseDown){
        setIsDraggable(false)
      }
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0){
      setIsMouseDown(true)
      if(!isSpaceDown){
        setIsDraggable(true)
      }
      clickStartTime.current = new Date().getTime() // 
      
      // If clicked on a node
      if(e.target && (e.target as Element).classList.contains('graph-node')){
        const element = e.target as SVGCircleElement;
        currentNodeRef.current = element;

        if (isSpaceDown){ 
          handleEdgeCreation(element); 
        }
      }
    };
  };

  // Lclick container: Selection or Node creation 
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0){
      setIsMouseDown(false);      
      currentNodeRef.current = null;

      const clickDuration = new Date().getTime() - (clickStartTime.current || new Date().getTime());

      // Node creation conditions (3)
      if (!isSpaceDown){ // Must not hold spacebar
        // Must click on canvas
        setIsDraggable(true)
        if (e.target && (e.target as Element).classList.contains('graph-node')) return;
        
        if(clickDuration < 200){ // Must be shortclick
          const svgRect = e.currentTarget.getBoundingClientRect();
          const newNode = {
            id: `node-${Date.now()}`, 
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top
          };
          // console.log("New node id is: ", newNode.id, "at (x,y) = (", newNode.x, newNode.y, ") is draggable.");
          
          setNodes(prevNodes => [...prevNodes, newNode]);
          setSelectedNode(newNode.id);
          clickStartTime.current = null;
        }
      }      
      // Edge creation if space is held and ends at another node
      else{
        // If spacebar is released before completeing the edge, reset.
         if (!tempEdge){
          setTempEdge(null);
          setIsDraggable(true);
          return;
        }  

        if (e.target && (e.target as Element).classList.contains('graph-node')){
          
          const endNode = e.target as SVGCircleElement
          const edgeExists = edges.some(edge => edge.id1 === tempEdge?.id1 && edge.id2 === endNode.id);

          // If end at the same node, reset
          if (tempEdge?.id1 === endNode.id) {
            // No self loops allowed
            setIsDraggable(true);
            setTempEdge(null);
          }
          else {
            if(!edgeExists){
              // Correctly access the properties of the SVGCircleElement
              const updatedEdge = {
                ...tempEdge,
                id2: endNode.id,
                x2: endNode.cx.baseVal.value,
                y2: endNode.cy.baseVal.value
              };
              setTempEdge(updatedEdge); // Update the temp edge
              // console.log("Edge ends at", updatedEdge.id2, "at (x,y) = (", updatedEdge.x2, updatedEdge.x1, ").");
              setEdges(edges => [...edges, updatedEdge]);
              setTempEdge(null);
              setIsDraggable(true);
            }
          }
        }
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
      
      tabIndex={0} // Makes the div focusable
      onKeyDown={handleSpaceDown}
      onKeyUp={handleSpaceUp}

      onContextMenu = {e => handleContainerContextMenu(e)}
    >
      <svg width ="200" height = "200">
        {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          
          // 1 Lclick
          
          isSelected={node.id === selectedNode}
          isDraggable = {(node.id === selectedNode) && isDraggable}

          onClick={() => handleNodeClick(node.id)}  
          onDrag={handleNodeDrag}
          onContextMenu={e => handleNodeContextMenu(e, node.id)}
        />
        ))}
        {edges.filter(edge => edge.x2 !== null && edge.y2 !== null).map(edge => (
          <Edge key={`${edge.id1}-${edge.id2}`} 
          edge={edge} />
        ))}
      </svg>
    </div>
  );
}
export default Graph;