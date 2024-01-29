import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface AlgoCardProps {
    title: string;
    grouping: string;
    description: string;
    backgroundColor: string;
}

const colors = ['#A0ACBB', '#BDB0BF', '#FADBE4']
const AlgoCard: React.FC<AlgoCardProps> = ({ title, grouping, description, backgroundColor }) => {

    return (
        <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined" sx={{backgroundColor}}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {grouping}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
        </Card>
        </Box>
    );
};

export default AlgoCard;
