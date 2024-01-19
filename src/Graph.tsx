import React, { useState, useRef, useEffect, useCallback } from 'react';
import Node from './GraphNode';
import Edge from './GraphEdge';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface EdgeType {
  id1: string;
  x1: number;
  y1: number;
  id2: string | null;
  x2: number | null;
  y2: number | null;
}

const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const currentNodeRef = useRef<SVGCircleElement | null>(null);
  const [tempEdge, setTempEdge] = useState<EdgeType | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const clickStartTime = useRef<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [edgeClicked, setEdgeClicked] = useState(false);

  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes(nodes => nodes.filter(node => node.id !== selectedNode));
      setEdges(edges => edges.filter(edge => edge.id1 !== selectedNode && edge.id2 !== selectedNode));
      setSelectedNode(null);
    } else if (selectedEdge) {
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
      x1: node.cx.baseVal.value,
      y1: node.cy.baseVal.value,
      id2: null,
      x2: null,
      y2: null
    }
    setTempEdge(newEdge);
    setIsDraggable(false);
  };

  const handleSpaceDown = (e: React.KeyboardEvent) => {
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
      if (isMouseDown) {
        setIsDraggable(true);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsMouseDown(true);
      if (!isSpaceDown) {
        setIsDraggable(true);
      }
      clickStartTime.current = new Date().getTime();
      if (e.target && (e.target as Element).classList.contains('graph-node')) {
        const element = e.target as SVGCircleElement;
        currentNodeRef.current = element;
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
      currentNodeRef.current = null;
      const clickDuration = new Date().getTime() - (clickStartTime.current || new Date().getTime());
      if (edgeClicked) {
        setEdgeClicked(false);
        return;
      }
      if (!isSpaceDown) {
        setSelectedEdge(null);

        // The problem is here. If false, then a dragged node shoots to cursor upon a fast click. 
        // If true, then after edge creation, the tail node upon click enteres drag state without
        // holding down left click.
        if (e.target && (e.target as Element).classList.contains('graph-node')) {
          setIsDraggable(true);
          return;
        }


        if (clickDuration < 200) {
          const svgRect = e.currentTarget.getBoundingClientRect();
          const newNode = {
            id: `node-${Date.now()}`,
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top
          };
          setNodes(prevNodes => [...prevNodes, newNode]);
          setSelectedNode(newNode.id);
          clickStartTime.current = null;
        }
      } else {
        if (!tempEdge) {
          setTempEdge(null);
          setIsDraggable(false);
          return;
        }
        if (e.target && (e.target as Element).classList.contains('graph-node')) {
          const endNode = e.target as SVGCircleElement;
          const edgeExists = edges.some(edge => edge.id1 === tempEdge?.id1 && edge.id2 === endNode.id);
          if (tempEdge?.id1 === endNode.id) {
            setTempEdge(null);
          } else {
            if (!edgeExists) {
              const updatedEdge = {
                ...tempEdge,
                id2: endNode.id,
                x2: endNode.cx.baseVal.value,
                y2: endNode.cy.baseVal.value
              };
              setEdges(edges => [...edges, updatedEdge]);
              setTempEdge(null);
              setSelectedNode(endNode.id);
              console.log(selectedNode, "is selected")
              setIsDraggable(true)
              return;
            }
          }
        }
      }
      setIsDraggable(false);
    }
  };

  const handleContainerContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edgeId: string) => {
    setSelectedEdge(edgeId);
    setSelectedNode(null);
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

  const handleEdgeDoubleClick = (reverseThisEdge: EdgeType) => {
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
    <div className="container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      tabIndex={0}
      onKeyDown={handleSpaceDown}
      onKeyUp={handleSpaceUp}
      onContextMenu={e => handleContainerContextMenu(e)}
    >
      <svg width="200" height="200">
        {nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            isSelected={node.id === selectedNode}
            isDraggable={(node.id === selectedNode) && isDraggable}
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
          />
        ))}
      </svg>
    </div>
  );
}

export default Graph;
