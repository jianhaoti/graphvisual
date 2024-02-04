// AlgoDetails.tsx
import React from 'react';
import { IconButton, Paper, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface AlgoDetailsProps {
  title: string;
  onClose: () => void;
}
const AlgoDetails: React.FC<AlgoDetailsProps> = ({ title, onClose }) => {
  return (
        <Paper sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2, // Ensure it overlays over the Graph
        }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CloseIcon />
            </IconButton>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="h5">{title}</Typography>
                <Typography>{title}</Typography>
                {/* More content as needed */}
            </Box>
        </Paper>
    );
};

export default AlgoDetails;
