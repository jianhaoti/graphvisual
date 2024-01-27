// DataRoom.tsx
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
}

// DataRoom.tsx
const DataRoom: React.FC<DataRoomProps> = ({ nodes, edges, selectedNode, selectedEdge }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', height: '100%',       alignItems: 'stretch', // Stretch children vertically
    }}>
        <Container className="dataRoomContainer" style={{ flex: 1 }}>
          <Typography variant="h6" className="dataRoomText">Nodes</Typography>
          <List>
            {nodes.map((node, index) => (
            <ListItem 
             key={index} 
             className={node.id === selectedNode ? 'dataRoomTextSelected' : 'dataRoomText'}
            >
             {node.id}
            </ListItem>
            ))}
          </List>
        </Container>
        <Container className="dataRoomContainer" style={{ flex: 1 }}> 
          <Typography variant="h6" className="dataRoomText">Edges</Typography>
          <List>
            {edges.map((edge, index) => {
              const edgeId = `${edge.id1}-${edge.id2}`;
              return (
                <ListItem 
                 key={index} 
                 className={edgeId === selectedEdge ? 'dataRoomTextSelected' : 'dataRoomText'}
                >
                 {`Edge: ${edge.id1} to ${edge.id2}`}
                </ListItem>
              );
            })}
          </List>
        </Container>
      </div>
    );
  };
  

export default DataRoom;
