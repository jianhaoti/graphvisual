import React from "react";
import DataRoom from './DataRoom'; 
import Node from "./GraphNode";
import Edge from "./GraphEdge";

interface ControlRoomProps {
    mode: string;
    nodes: Node[];
    edges: Edge[];
    selectedNode: string | null;
    selectedEdge: string | null;
}  
  
const ControlRoom: React.FC<ControlRoomProps> = ({mode, nodes, edges, selectedNode, selectedEdge}) => {
    return (
        <div className="container container-right">
            <div className="control-room">
                {mode === "data" && 
                    <DataRoom 
                        nodes={nodes} 
                        edges={edges} 
                        selectedNode={selectedNode} 
                        selectedEdge={selectedEdge}                       
                    />}
            </div>
        </div>
    );
};


export default ControlRoom;