import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface OutlinedCardProps {
    title: string;
    subtitle: string;
    description: string;
    backgroundColor: string;
}

const colors = ['#A0ACBB', '#BDB0BF', '#FADBE4']
const OutlinedCard: React.FC<OutlinedCardProps> = ({ title, subtitle, description, backgroundColor }) => {

    return (
        <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined" sx={{backgroundColor}}>
            <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {subtitle}
            </Typography>
            <Typography variant="h5" component="div">
                {title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
            </Typography>
            <Typography variant="body2">
                {description}
            </Typography>
            </CardContent>
            <CardActions>
            <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
        </Box>
    );
};

export default OutlinedCard;
