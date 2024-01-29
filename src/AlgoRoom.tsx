import React, {useEffect, useState} from 'react';
import { Box, ImageList, ImageListItem } from '@mui/material';
import AlgoCard from './AlgoCard'; // Import your modified OutlinedCard component

const AlgoRoom: React.FC = () => {
    const colors = ['#8898AA', '#C7BCC8', '#F4E4EA'];

    const [isFullTitle, setIsFullTitle] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsFullTitle(window.innerWidth > 1200);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const cardData = [
        { title: 'BFS', grouping: 'Search', description: 'A Drop of Water' },
        { title: 'DFS', grouping: 'Search', description: 'Drill the Depths' },
        { title: 'Dijkstra', grouping: 'Shortest Path', description: 'Walk Radially' },
        { title: 'Prim', grouping: 'MST', description: 'Connect the Dots' },
        { title: 'Kruskal', grouping: 'MST', description: 'Thinnest Threads' },
        { title: 'Bellman-Ford', grouping: 'Shortest Path', description: 'Negative Dijkstra' },
        { title: 'A*', grouping: 'Search', description: 'A Guided Wanderer' },
        { title: 'Tarjan', grouping: 'Search', description: 'Unraveling the Knots' },
        { title: 'Ford-Fulkerson', grouping: 'Flows & Cuts', description: 'Channel the Currents' },
        { title: 'Gale-Shapley', grouping: 'Matchings', description: 'Stable Marriage' },
        { title: 'Karger', grouping: 'Cuts', description: 'Connected Minima' },

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
            <ImageList cols={3} gap={6}>
                {cardData.map((item, index) => {
                    const row = Math.floor(index / 3);
                    const colorIndex = (index + row) % colors.length;
                    const color = colors[colorIndex];

                    return (
                        <ImageListItem key={index}>
                            <AlgoCard
                                title={isFullTitle ? item.title : item.title.split(' ').map(word => word[0]).join('')}
                                grouping={item.grouping}
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

