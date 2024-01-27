import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Node from './GraphNode'; // Adjust the path as necessary
import Edge from './GraphEdge'; // Adjust the path as necessary

interface DataRoomProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  isOriented: boolean; // Indicates whether the edges are oriented
}

const DataRoom: React.FC<DataRoomProps> = ({ nodes, edges, selectedNode, selectedEdge, isOriented }) => {
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
              Node: {node.id}
            </ListItem>
          ))}
        </List>
      </Container>

      <Container className="dataRoomContainer" style={{ flex: 1 }}>
      <Typography variant="h6" className="dataRoomText">Edges</Typography>
      <List>
        {edges.map((edge, index) => {
          const edgeId = `${edge.id1}-${edge.id2}`; // Identifier for the edge
          const edgeText = isOriented 
            ? `Edge: ${edge.id1} -> ${edge.id2}`
            : `Edge: ${edge.id1} - ${edge.id2}`;
          
          // Compare edgeId with selectedEdge for highlighting
          return (
            <ListItem 
              key={index} 
              className={edgeId === selectedEdge ? 'dataRoomTextSelected' : 'dataRoomText'}
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
