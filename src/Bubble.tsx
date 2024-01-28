import React, { CSSProperties }from 'react';

interface BubbleProps {
    x: number;
    y: number;
    radius: number;
    color: string;
    label: string;
    onClick: () => void;
    expanded: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ x, y, radius, color, label, onClick, expanded }) => {
    const diameter = radius * 2; // Diameter is twice the radius
    
    const expandedStyle: CSSProperties = {
        position: 'absolute',        
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white', // Example color
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 10,
    };
    const regularStyle: CSSProperties = {
        position: 'relative',
        left: x,
        top: y,
        width: diameter, // Set width based on diameter
        height: diameter, // Set height based on diameter
        backgroundColor: color,
        borderRadius: '50%', // Makes it a circle
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    };



    const style = expanded ? expandedStyle : regularStyle;

    return (
        <div style={style} onClick={onClick}>
            {label}
        </div>
    );
};

export default Bubble;
