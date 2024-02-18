import React, { useEffect, useState } from "react";
import { Box, ImageList, ImageListItem } from "@mui/material";
import AlgoCard from "./AlgoCard";
import AlgoDetails from "./AlgoDetails";
import Node from "./GraphNode";

interface AlgoRoomProps {
  nodes: Node[];
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void; // Updated to a function type
  setSelectedEdge: (edgeId: string | null) => void; // Updated to a function type
  setIsGraphEditable: (editable: boolean) => void;
}

const AlgoRoom: React.FC<AlgoRoomProps> = ({
  selectedNode,
  nodes,
  setSelectedNode,
  setSelectedEdge,
  setIsGraphEditable,
}) => {
  const colors = ["#8693AB", "#BDD4E7", "#5d617c"];
  const [isFullTitle, setIsFullTitle] = useState(true);
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsFullTitle(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (title: string) => {
    setSelectedAlgo(title);
  };

  const handleClose = () => {
    setSelectedAlgo(null);
  };

  const cardData = [
    { title: "BFS", grouping: "Search", description: "A Drop of Water" },
    { title: "DFS", grouping: "Search", description: "Drill the Depths" },
    {
      title: "Dijkstra",
      grouping: "Shortest Path",
      description: "Walk Radially",
    },

    { title: "Prim", grouping: "MST", description: "Connect the Dots" },
    { title: "Kruskal", grouping: "MST", description: "Thinnest Threads" },
    { title: "A*", grouping: "Search", description: "A Guided Wanderer" },

    {
      title: "Tarjan",
      grouping: "Search",
      description: "Unraveling the Knots",
    },
    { title: "Karger", grouping: "Cuts", description: "Connected Minima" },
    { title: "TBD", grouping: "TBD", description: "TBD" },

    { title: "TBD", grouping: "TBD", description: "TBD" },
    { title: "TBD", grouping: "TBD", description: "TBD" },
    { title: "TBD", grouping: "TBD", description: "TBD" },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      onContextMenu={(e) => handleContextMenu(e)}
      sx={{
        height: "85%",
        backgroundColor: "transparent",
        padding: "40px",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "1px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "inherit",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#E3C46E",
        },
      }}
    >
      <ImageList cols={3} gap={6}>
        {cardData.map((item, index) => {
          // Color generator
          const row = Math.floor(index / 3);
          const colorIndex = (index + row) % colors.length;
          const color = colors[colorIndex];

          return (
            <ImageListItem key={index}>
              <AlgoCard
                title={
                  isFullTitle
                    ? item.title
                    : item.title
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                }
                grouping={item.grouping}
                description={item.description}
                backgroundColor={color}
                onClick={() => handleCardClick(item.title)}
              />
            </ImageListItem>
          );
        })}
      </ImageList>
      {selectedAlgo && (
        <AlgoDetails
          title={selectedAlgo}
          onClose={handleClose}
          nodes={nodes}
          setSelectedNode={setSelectedNode}
          setSelectedEdge={setSelectedEdge}
          setIsGraphEditable={setIsGraphEditable}
        />
      )}
    </Box>
  );
};

export default AlgoRoom;
