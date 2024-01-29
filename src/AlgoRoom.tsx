import React from 'react';
import { Box, ImageList, ImageListItem } from '@mui/material';
import AlgoCard from './AlgoCard'; // Import your modified OutlinedCard component

const AlgoRoom: React.FC = () => {
    const colors = ['#8898AA', '#C7BCC8', '#F4E4EA']

    const cardData = [
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
        { title: 'Card 2', subtitle: 'Subtitle 2', description: 'Description 2' },
        { title: 'Card 1', subtitle: 'Subtitle 1', description: 'Description 1' },
    ];

    return (
        <Box sx={{  
            padding: '20px', 
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
            <ImageList cols={3} gap={8}>
                {cardData.map((item, index) => {
                    const row = Math.floor(index / colors.length);
                    const colorIndex = (index + row) % colors.length;
                    const color = colors[colorIndex];

                    return (
                        <ImageListItem key={index}>
                            <AlgoCard
                                title={item.title}
                                subtitle={item.subtitle}
                                description={item.description}
                                backgroundColor={color}
                            />
                        </ImageListItem>
                    );
                })}
            </ImageList>
        </Box>
    );

};

export default AlgoRoom;
