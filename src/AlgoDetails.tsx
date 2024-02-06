import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AlgoCard from './AlgoCard';

interface AlgoDetailsProps {
    title: string;
    onClose: () => void;
  }
  
const AlgoDetails: React.FC<AlgoDetailsProps> = ({ title, onClose }) => {
    return (
      <Paper sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center the box
        width: '80%', // Set width to 80%
        height: '80%', // Set height to 80%
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300, // Ensure it overlays the content; adjust as needed
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent
        overflow: 'hidden', // Add scroll if content exceeds the box
      }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 24, width: '100%', height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" component="h2">{title}</Typography>
          {/* More detailed content here */}
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  };
  

export default AlgoDetails;