import React from "react";
import DataRoom from './DataRoom'; 
import Node from "./GraphNode";
import Edge from "./GraphEdge";

interface ControlRoomProps {
    mode: string;
    nodes: Node[];
    edges: Edge[];
    selectedNode: string | null; setSelectedNode: (nodeId: string | null) => void;  // Updated to a function type
    selectedEdge: string | null; setSelectedEdge: (edgeId: string | null) => void;  // Updated to a function type

    isOriented: boolean; 
    onNodeIDChange: (oldId: string, newId: string) => void;
}  
  
const ControlRoom: React.FC<ControlRoomProps> = ({mode, nodes, edges, selectedNode, selectedEdge, isOriented, onNodeIDChange, setSelectedNode, setSelectedEdge}) => {
    return (
        <div className="container container-right">
            <div className="control-room">
                {mode === "data" && 
                    <DataRoom 
                        nodes={nodes} 
                        edges={edges} 
                        selectedNode={selectedNode} setSelectedNode = {setSelectedNode}
                        selectedEdge={selectedEdge} setSelectedEdge = {setSelectedEdge}       
                        isOriented={isOriented}   
                        onNodeIDChange={onNodeIDChange}
                    />}
            </div>
        </div>
    );
};


export default ControlRoom;