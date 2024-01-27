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
  selectedNode: string | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEdge: string | null;
  isOriented: boolean;
  onNodeIDChange: (oldId: string, newId: string) => void;
}

const DataRoom: React.FC<DataRoomProps> = ({ 
  nodes, edges, selectedNode, selectedEdge, 
  isOriented, onNodeIDChange, setSelectedNode 
}) => {


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
      const isDuplicate = nodes.some(n => n.id === newName && n.id !== node.id);
  
      if (isDuplicate) {
        // Option 1: Revert to the original name
        e.target.value = node.id;
        alert("This node name already exists. Please choose a different name.");
  
        // Option 2: Alternatively, you can implement a more sophisticated error handling mechanism
        // showError("This node name already exists. Please choose a different name.");
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
        />
      );
    }
    return <span onClick={() => setSelectedNode(node.id)}>{node.id}</span>;
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', height: '100%' }}>
      <Container className="dataRoomContainer" style={{ flex: 1 }}>
        <Typography variant="h6" className="dataRoomText">Nodes</Typography>
        <List>
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

      <Divider orientation="vertical" flexItem style={{ backgroundColor: '#706f6f', margin: '0 10px' }} />

      <Container className="dataRoomContainer" style={{ flex: 1 }}>
        <Typography variant="h6" className="dataRoomText">Edges</Typography>
        <List>
          {edges.map((edge, index) => {
            const edgeText = isOriented 
              ? `Edge: ${edge.id1} → ${edge.id2}`
              : `Edge: ${edge.id1} — ${edge.id2}`;
            return (
              <ListItem 
                key={index} 
                className={edge.id1 + '-' + edge.id2 === selectedEdge ? 'dataRoomTextSelected' : 'dataRoomText'}
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
