import React from 'react';
import { Card, CardMedia, Divider, CardContent, Typography, CardActions } from '@mui/material';
import caveDrilling from '/Users/ptee/graphvisual/src/assets/caveDrilling.jpeg'

interface AlgoDetailsProps {
  title: string;
  onClose: () => void;
}

const AlgoDetails: React.FC<AlgoDetailsProps> = ({ title, onClose }) => {
  const titleToImageUrl = {
    'BFS': 'https://images.unsplash.com/photo-1606214554814-e8a9f97bdbb0?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'DFS': caveDrilling,
    'Dijkstra': 'https://images.unsplash.com/photo-1610457642191-05328cdf34ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
  const imageUrl = titleToImageUrl[title as keyof typeof titleToImageUrl] || 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
          overflow: 'hidden'

        }}
        onClick = {onClose}
    >
      <Card sx={{
        maxWidth: '80%', // Adjust width as needed
        maxHeight: '80%', // Adjust height as needed
        minWidth: '40vh', // Minimum width
        minHeight: '40vh', // Minimum height
        position: 'relative',
        '&:hover': {
          boxShadow: 6, // Optional: Change shadow on hover
        },
        overflow: 'auto'
      }}
          onClick={(e) => e.stopPropagation()} // Prevent background click inside the card
          
      >
      <CardMedia
        component="img"
        height="240"
        image={imageUrl}

      />
      <CardContent sx={{
        overflow: 'auto', // Allows content to scroll if it overflows
        flexGrow: 1, // Allows content area to grow and fill available space
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Parameters
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <Typography variant="body2" color="text.secondary">
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Run
        </Typography>
      </CardActions>      </Card>
    </div>
  );
};

export default AlgoDetails;