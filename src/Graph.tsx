import React, { useState, useRef, useEffect, useCallback } from 'react';
import Node from './GraphNode';
import Edge from './GraphEdge';
import Switch from '@material-ui/core/Switch';
import { styled } from '@mui/material/styles';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    // thumb color
    color: theme.palette.primary.main,
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#96AACD', // track color when checked
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#yourUnCheckedTrackColor', // track color when not checked
  },
}));


interface GraphProps{
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const Graph: React.FC<GraphProps>  = ({ nodes, setNodes}) => {
  // Mine
  const [edges, setEdges] = useState<Edge[]>([]);
  const currentNodeRef = useRef<SVGCircleElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  const [tempEdge, setTempEdge] = useState<Edge | null>(null);
  const clickStartTime = useRef<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [edgeClicked, setEdgeClicked] = useState(false);
  const [isOriented, setIsOriented] = useState(true);
  const switchContainerRef = useRef(null);

  const [state, setState] = React.useState({
      checkedA: true,
      checkedB: true,
    });
  
    const handleOrientationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [event.target.name]: event.target.checked });
      setIsOriented(!isOriented);
    };
  
  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== selectedNode));
      setEdges(edges => edges.filter(edge => edge.id1 !== selectedNode && edge.id2 !== selectedNode));
      setSelectedNode(null);

      // If the selected edge has its head or tail as selected node
      if(selectedEdge){
        const [edgeId1, edgeId2] = selectedEdge.split('-');
        if(edgeId1 === selectedNode || edgeId2 === selectedNode){
          setSelectedEdge(null);
        }
      }
    } 
    else if (selectedEdge) {
      setEdges(edges => edges.filter(edge => `${edge.id1}-${edge.id2}` !== selectedEdge));
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(true);
      }
      if (e.code === 'Backspace') {
        deleteSelected();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteSelected]);

  // This one is for console logging sychonously. 
  /* useEffect( () =>{
    console.log(nodes )
  }, [nodes]); */

  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    // Update the position of the dragged node
    const updatedNodes = nodes.map(node => 
      node.id === nodeId ? { ...node, x: newPosition.x, y: newPosition.y } : node
    );
  
    // Update edges if needed
    const updatedEdges = edges.map(edge => {
      if (edge.id1 === nodeId) {
        return { ...edge, x1: newPosition.x, y1: newPosition.y };
      } else if (edge.id2 === nodeId) {
        return { ...edge, x2: newPosition.x, y2: newPosition.y };
      }
      return edge;
    });
  
    // Update state and history
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };
  

  const handleEdgeCreation = (node: SVGCircleElement) => {
    const newEdge = {
      id1: node.id,
      x1: node.cx.baseVal.value,
      y1: node.cy.baseVal.value,
      id2: null,
      x2: null,
      y2: null
    }
    setTempEdge(newEdge);
  };

  const handleSpaceDown = (e: React.KeyboardEvent) => {
    console.log('test')
    if (!isSpaceDown) {
      if (e.code === 'Space' && isMouseDown && currentNodeRef.current) {
        setIsSpaceDown(true);
        handleEdgeCreation(currentNodeRef.current);
      }
    }
  };

  const handleSpaceUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpaceDown(false);
    }
  };

  const handleNodeCreation = (e: React.MouseEvent) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const newNode = {
      id: `node-${Date.now()}`,
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNode(newNode.id)
  };

  const handleEdgeCompletion = (endNode: SVGCircleElement)=>{
    const updatedEdge = {
      ...tempEdge,
      id2: endNode.id,
      x2: endNode.cx.baseVal.value,
      y2: endNode.cy.baseVal.value
    };
    setEdges((prevEdges: Edge[]) => [...prevEdges, updatedEdge] as Edge[]);   
    setTempEdge(null);          
    setSelectedNode(endNode.id);
    setSelectedEdge(null);

    // Reset the clock
    clickStartTime.current = null;
    return;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsMouseDown(true);
      // Check if the click is inside the switch container
      if (e.target instanceof Element && e.target.closest("#mySwitchContainer")) {
        return; // Do nothing if the click is on or within the switch
      }
    
      clickStartTime.current = new Date().getTime();
      if (e.target && (e.target as Element).classList.contains('graph-node')) {
        const element = e.target as SVGCircleElement;
        currentNodeRef.current = element;
        /* if(!isSpaceDown){
          setSelectedNode(element.id);
        } */
        if (isSpaceDown) {
          handleEdgeCreation(element);
        }
      }
      if (e.target && (e.target as Element).classList.contains('graph-edge')) {
        setEdgeClicked(true);
      } 
    };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      setIsMouseDown(false);
      if (e.target instanceof Element && e.target.closest("#mySwitchContainer")) {
        return; // Do nothing if the click is on or within the switch
      }
  
  
      currentNodeRef.current = null;
      const clickDuration = new Date().getTime() - (clickStartTime.current || new Date().getTime());
      if (edgeClicked) {
        setEdgeClicked(false);
        return;
      }
      if (!isSpaceDown) {
        setSelectedEdge(null);

        // If normal click on node
        if (e.target && (e.target as Element).classList.contains('graph-node')) {
          const element = e.target as SVGCircleElement;
          handleNodeClick(element.id);          
          return;
        }

        // Node creation
        if (clickDuration < 200) {
          // Reset the clock       
          clickStartTime.current = null;
          handleNodeCreation(e);
          return;
        }
      } else {
        // If we didn't come from a node, don't do anything
        if (!tempEdge) {
          setTempEdge(null);
          setSelectedNode(null);
          return;
        }
        // If we land on a node, make the edge if no self-loops
        if (e.target && (e.target as Element).classList.contains('graph-node')) {
          const endNode = e.target as SVGCircleElement;
          const edgeExists = edges.some(edge => edge.id1 === tempEdge?.id1 && edge.id2 === endNode.id);
          // No self-loops allowed
          if (tempEdge?.id1 === endNode.id) {
            setTempEdge(null);
            setSelectedNode(endNode.id);
            return;
          } 
          else {
            // All clear to make the edge
            if (!edgeExists) {
              handleEdgeCompletion(endNode);
              return;
            }
          }
        }
      }
      setSelectedNode(null);
    }
  };

  const handleContainerContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedEdge(null);
    setSelectedNode(null);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setSelectedEdge(null)
  };

  const handleEdgeClick = (edgeId: string) => {
    setSelectedNode(null);
    setSelectedEdge(edgeId);
  };

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    setEdges(edges => edges.filter(edge => edge.id1 !== nodeId && edge.id2 !== nodeId));
  };

  const handleEdgeContextMenu = (e: React.MouseEvent, edgeId: string) => {
    e.preventDefault();
    setEdges(edges => edges.filter(edge => `${edge.id1}-${edge.id2}` !== edgeId));
    setSelectedEdge(null);
  };  

  const handleEdgeDoubleClick = (reverseThisEdge: Edge) => {
    if (!reverseThisEdge.id2) return;
    const newEdges = edges.filter(e => e.id1 !== reverseThisEdge.id1 || e.id2 !== reverseThisEdge.id2);
    const reversedEdge = {
      id1: reverseThisEdge.id2 as string,
      x1: reverseThisEdge.x2 as number,
      y1: reverseThisEdge.y2 as number,
      id2: reverseThisEdge.id1 as string,
      x2: reverseThisEdge.x1 as number,
      y2: reverseThisEdge.y1 as number
    }
    setEdges([...newEdges, reversedEdge]);
    const reversedId = `${reversedEdge.id1}-${reversedEdge.id2}`;
    handleEdgeClick(reversedId);
  };

  return (
    <div className="container container-left"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleSpaceDown}
      onKeyUp={handleSpaceUp}
      onContextMenu={e => handleContainerContextMenu(e)}
      tabIndex={0}
    >
      <svg width="200" height="200">
        {nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            isSelected={node.id === selectedNode}
            isDraggable={(node.id === selectedNode) && !isSpaceDown}
            onClick={() => handleNodeClick(node.id)}
            onDrag={handleNodeDrag}
            onContextMenu={e => handleNodeContextMenu(e, node.id)}
          />
        ))}
        {edges.filter(edge => edge.x2 !== null && edge.y2 !== null).map(edge => (
          <Edge
            key={`${edge.id1}-${edge.id2}`}
            edge={edge}
            isSelected={selectedEdge === `${edge.id1}-${edge.id2}`}
            onClick={handleEdgeClick}
            onDoubleClick={handleEdgeDoubleClick}
            onContextMenu={handleEdgeContextMenu}
            isOriented={isOriented}
          />
        ))}
      </svg>
      <div className="switch-container">
        <CustomSwitch
          ref={switchContainerRef}
          id="mySwitchContainer"
          checked={state.checkedB}
          onChange={handleOrientationChange}
          name="checkedB"
          inputProps={{ 'aria-label': 'primary checkbox' }}
          style={{
            color: '#74A19E', // Changes the thumb color when 'off'
          }}
        />
      </div>
    </div>
  );
}

export default Graph;