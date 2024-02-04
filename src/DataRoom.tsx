import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Node from './GraphNode';
import Edge from './GraphEdge';
import { render } from '@testing-library/react';

interface DataRoomProps {
  nodes: Node[];
  edges: Edge[]; setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: string | null; setSelectedNode: (nodeId: string | null) => void;  
  selectedEdge: string | null; setSelectedEdge: (edgeId: string | null) => void;  

  isOriented: boolean;
  onNodeIDChange: (oldId: string, newId: string) => void;
}

const DataRoom: React.FC<DataRoomProps> = ({ 
  nodes, edges, selectedNode, selectedEdge, isOriented, 
  onNodeIDChange, setSelectedNode, setSelectedEdge, setEdges
}) => {
  const maxLengthNode = 25;

  const renderNodeItem = (node: Node) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        // Logic to save changes and exit edit mode
        e.currentTarget.blur();
      }
      if (e.key === 'Backspace') {
        // Prevent backspace key from triggering higher level keydown handlers
        e.stopPropagation();
      }
    };
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };
    const handleNodeNameUpdate = (e: React.FocusEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      const isInvalidName = !newName || nodes.some(n => n.id === newName && n.id !== node.id);

      if (isInvalidName) {
      // Apply the jiggle animation
      e.target.classList.add('jiggle');

      // Remove the jiggle class after the animation ends
      setTimeout(() => {
        e.target.classList.remove('jiggle');
      }, 500); // 500ms matches the duration of the jiggle animation

      // Reset the value to the original name
      e.target.value = node.id;
      } else {
        onNodeIDChange(node.id, newName);
      }
    };
  
  
    if (node.id === selectedNode) {
      return (
        <input
          className="editableInput"
          type="text"
          defaultValue={node.id}
          onBlur={handleNodeNameUpdate}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          maxLength={maxLengthNode} // Set the maximum length
        />
      );
    }
    return <span 
            onClick={() => setSelectedNode(node.id)}
            >
            {node.id.length > maxLengthNode ? `${node.id.substring(0, maxLengthNode)}...` : node.id}
          </span>;
  };


  const renderEdgeItem = (edge: Edge) => {
    const edgeId = `${edge.id1}-${edge.id2}`;
    const displayEdgeName = `${edge.id1} ${isOriented ? '→' : '-'} ${edge.id2}:  ${edge.weight} `;
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        // Logic to save changes and exit edit mode
        e.currentTarget.blur();
      }
      if (e.key === 'Backspace') {
        // Prevent backspace key from triggering higher level keydown handlers
        e.stopPropagation();
      }
    };
  
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    const handleEdgeWeightUpdate = (e: React.FocusEvent<HTMLInputElement>, edgeId: string) => {
      const newWeight = e.target.value;
      const weight = parseInt(newWeight, 10);
    
      // Check if the input is a valid integer (including 0 and negative numbers)
      if (!isNaN(weight)) {
        // Update the weight of the selected edge
        setEdges(edges.map(edge => {
          if (`${edge.id1}-${edge.id2}` === edgeId) {
            return { ...edge, weight: weight };
          }
          return edge;
        }));
        setSelectedEdge(null); // Exit editing mode
      } else {
        // Apply the jiggle animation for invalid input
        e.target.classList.add('jiggle');
    
        // Remove the jiggle class after the animation ends
        setTimeout(() => {
          e.target.classList.remove('jiggle');
        }, 500); // Match the duration of the jiggle animation
    
        // Keep the previous value (do not update to invalid input)
        const currentEdge = edges.find(edge => `${edge.id1}-${edge.id2}` === edgeId);
        e.target.value = currentEdge ? currentEdge.weight.toString() : '1'; // Fallback to '1' if edge not found
      }
    };
  
    return (
      <div onClick={() => setSelectedEdge(edgeId)} style={{ display: 'flex', alignItems: 'center' }}>
        {selectedEdge === edgeId ? (
          <input
            className="editableInput" // Use the className for styles
            type="text"
            defaultValue={edge.weight.toString()}
            onBlur={(e) => handleEdgeWeightUpdate(e, edgeId)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span>{displayEdgeName}</span>
          )}
      </div>
    );
  };
  
  
  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', height: '100%' }}>
      <Container className="dataRoomContainer" style={{ flex: 1 }}>
        <Typography variant="h6" className="dataRoomTitle">Nodes</Typography>
        <List sx={{ overflowY: 'auto', height: 'calc(100% - 20px)', '&::-webkit-scrollbar': { width: '0.5px'}, '&::-webkit-scrollbar-track': {backgroundColor: 'inherit'}, '&::-webkit-scrollbar-thumb': {backgroundColor: '#E3C46E'}}}>
          {nodes.map((node, index) => (
            <ListItem 
              key={index} 
              className={node.id === selectedNode ? 'dataRoomTextSelected' : 'dataRoomText'}
            >
              {renderNodeItem(node)}
            </ListItem>
          ))}
        </List>
      </Container>

      <Divider 
        orientation="vertical" 
        flexItem 
        variant="middle"
        style={{ backgroundColor: '#706f6f', marginLeft: '-20px' }} 
      />

      <Container className="dataRoomContainer" style={{ flex: 1 }}>
        <Typography variant="h6" className="dataRoomTitle">Edges</Typography>
        <List sx={{ overflowY: 'auto', height: 'calc(100% - 20px)', '&::-webkit-scrollbar': { width: '0.5px'}, '&::-webkit-scrollbar-track': {backgroundColor: 'inherit'}, '&::-webkit-scrollbar-thumb': {backgroundColor: '#E3C46E'}}}>
          {edges.map((edge, index) => (
            <ListItem 
              key={index} 
              onClick={() => setSelectedEdge(`${edge.id1}-${edge.id2}`)}
              className={selectedEdge === `${edge.id1}-${edge.id2}` ? 'dataRoomTextSelected' : 'dataRoomText'}
            >
              {renderEdgeItem(edge)}
            </ListItem>
          ))}
      </List>
      </Container>
    </div>
  );
};

export default DataRoom;