import React, { useState } from 'react';
import Bubble from './Bubble';

const AlgoRoom: React.FC = () => {
    const [expandedBubble, setExpandedBubble] = useState<string | null>(null);

    const handleBubbleClick = (label: string) => {
        setExpandedBubble(label);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px', border: '1px solid red' }}>
            <Bubble x={100} y={150} radius={50} color="red" label="BFS" onClick={() => handleBubbleClick("BFS")} expanded={expandedBubble === "BFS"} />
            <Bubble x={200} y={250} radius={60} color="blue" label="DFS" onClick={() => handleBubbleClick("DFS")} expanded={expandedBubble === "DFS"} />
            {/* Add more bubbles as needed */}
        </div>
    );
};

export default AlgoRoom;
