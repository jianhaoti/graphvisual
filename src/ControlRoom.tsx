import React from "react";
import DataRoom from "./DataRoom";
import Node from "./GraphNode";
import Edge from "./GraphEdge";
import AlgoRoom from "./AlgoRoom";

interface ControlRoomProps {
  mode: string;
  nodes: Node[];
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void; // Updated to a function type
  selectedEdge: string | null;
  setSelectedEdge: (edgeId: string | null) => void; // Updated to a function type

  isOriented: boolean;
  onNodeIDChange: (oldId: string, newId: string) => void;

  showWeight: boolean;
  setShowWeight: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlRoom: React.FC<ControlRoomProps> = ({
  mode,
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  isOriented,
  showWeight,
  onNodeIDChange,
  setSelectedNode,
  setSelectedEdge,
  setEdges,
  setShowWeight,
}) => {
  return (
    <div
      className="container container-right"
      style={{ backgroundColor: "#2F2D37" }}
    >
      {mode === "data" && (
        <DataRoom
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          selectedEdge={selectedEdge}
          setSelectedEdge={setSelectedEdge}
          isOriented={isOriented}
          onNodeIDChange={onNodeIDChange}
          setEdges={setEdges}
          showWeight={showWeight}
          setShowWeight={setShowWeight}
        />
      )}
      {mode === "algo" && (
        <AlgoRoom
          selectedNode={selectedNode}
          nodes={nodes}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
        />
      )}
    </div>
  );
};

export default ControlRoom;
