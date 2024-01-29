import React from 'react';
import { Box, ImageList, ImageListItem } from '@mui/material';
import AlgoCard from './AlgoCard'; // Import your modified OutlinedCard component

const AlgoRoom: React.FC = () => {
    const colors = ['#A0ACBB', '#BDB0BF', '#FADBE4']
    let colorIndex = 1;

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
                    // Diagonal coloring (with 3 colors)
                    const row = Math.floor(index / 3);
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
