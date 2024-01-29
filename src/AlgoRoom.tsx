import React from 'react';
import { Box, ImageList, ImageListItem } from '@mui/material';
import AlgoCard from './AlgoCard'; // Import your modified OutlinedCard component

const AlgoRoom: React.FC = () => {
    const cardData = [
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },


        // ... Add more card data as needed
    ];

    return (
        <Box sx={{  padding: '20px', 
                    maxHeight: '60vh',
                    overflow: 'auto', 
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

                    }}>
            <ImageList cols={3} gap={8} style={{ height: 'auto'}}>
                {cardData.map((item, index) => (
                    <ImageListItem key={index}>
                        <AlgoCard
                            title={item.title}
                            subtitle={item.subtitle}
                            description={item.description}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
};

export default AlgoRoom;
