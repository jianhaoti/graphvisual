import React, { useEffect } from "react";
import DataRoom from "./dataRoom";
import Node from "./graphNode";
import Edge from "./graphEdge";
import AlgoRoom from "./algoRoom";
import { useBFS } from "./algos/bfs/bfsContext";
import { useDFS } from "./algos/dfs/dfsContext";
import { useDijkstra } from "./algos/dijkstra/dijkstraContext";
import { usePrim } from "./algos/prim/primContext";

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
  setIsGraphEditable: (editable: boolean) => void;
  name: string;
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
  setIsGraphEditable,
  name,
}) => {
  const { setBfsState } = useBFS();
  const { setDfsState } = useDFS();
  const { setDijkstraState } = useDijkstra();
  const { setPrimState } = usePrim();

  // stop visualization when click out of algo mode.
  // can't do this at top level
  useEffect(() => {
    if (mode !== "algo") {
      setBfsState((prevState: any) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
      setDfsState((prevState: any) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
      setDijkstraState((prevState: any) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
      setPrimState((prevState: any) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
    }
  }, [mode, setBfsState, setDfsState, setDijkstraState, setPrimState]);

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
          edges={edges}
          isOriented={isOriented}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
          setIsGraphEditable={setIsGraphEditable}
          name={name}
          showWeight={showWeight}
        />
      )}
    </div>
  );
};

export default ControlRoom;
