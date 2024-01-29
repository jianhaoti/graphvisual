import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Node from './GraphNode';
import Edge from './GraphEdge';

interface DataRoomProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null; setSelectedNode: (nodeId: string | null) => void;  // Updated to a function type
  selectedEdge: string | null; setSelectedEdge: (edgeId: string | null) => void;  // Updated to a function type

  isOriented: boolean;
  onNodeIDChange: (oldId: string, newId: string) => void;
}

const DataRoom: React.FC<DataRoomProps> = ({ 
  nodes, edges, selectedNode, selectedEdge, isOriented, 
  onNodeIDChange, setSelectedNode, setSelectedEdge
}) => {
  const maxLengthNode = 25;
  const maxLengthEdge = 40; // Maximum length for the displayed edge name

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
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
          onBlur={handleBlur}
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
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', height: '100%' }}>
      <Container className="dataRoomContainer" style={{ flex: 1 }}>
        <Typography variant="h6" className="dataRoomTitle">Nodes</Typography>
        <List
            sx={{
                overflowY: 'auto',
                height: 'calc(100% - 20px)', 
                '&::-webkit-scrollbar': {
                    width: '0.5px',
                    
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'inherit',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#E3C46E',
                },
            }}
        >
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
        <List
            sx={{
                overflowY: 'auto',
                height: 'calc(100% - 20px)', 
                '&::-webkit-scrollbar': {
                    width: '0.5px',
                    
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'inherit',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#E3C46E',
                },
            }}
        >
        {edges.map((edge, index) => {
          const edgeId = `${edge.id1}-${edge.id2}`; // Identifier for the edge
          const edgeText = isOriented 
            ? `${edge.id1} → ${edge.id2}`
            : `${edge.id1} — ${edge.id2}`;
          
          // Check if this edge is the selected one
          const isSelected = edgeId === selectedEdge;

          return (
            <ListItem 
              key={index} 
              onClick={() => setSelectedEdge(edgeId)}
              className={isSelected ? 'dataRoomTextSelected' : 'dataRoomText'}
            >
              {edgeText}
          </ListItem>
        );
      })}
      </List>
      </Container>
    </div>
  );
};

export default DataRoom;
