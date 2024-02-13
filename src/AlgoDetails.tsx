import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  Divider,
  CardContent,
  Typography,
  CardActions,
  Fade,
  Button,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import caveDrilling from "./caveDrilling.jpeg";
import Node from "./GraphNode";

interface AlgoDetailsProps {
  title: string;
  onClose: () => void;
  nodes: Node[];
}

const AlgoDetails: React.FC<AlgoDetailsProps> = ({ title, onClose, nodes }) => {
  const nodeIDs = nodes.map((node) => node.id);
  const [visible, setVisible] = useState(true); // Control visibility with state
  const [parameterValues, setParameterValues] = useState<{
    [key: string]: string;
  }>({});

  const titleToImageUrl = {
    BFS: "https://images.unsplash.com/photo-1606214554814-e8a9f97bdbb0?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    DFS: caveDrilling,
    Dijkstra:
      "https://images.unsplash.com/photo-1610457642191-05328cdf34ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };
  const imageUrl = titleToImageUrl[title as keyof typeof titleToImageUrl]; //|| 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const algoParameters = {
    BFS: ["Source Node"],
    DFS: ["Source Node"],
    Dijkstra: ["Source Node"],
  };

  const validateName = (userInput: string) => {
    if (nodeIDs.includes(userInput)) {
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Logic to save changes and exit edit mode
      e.currentTarget.blur();
    }
    if (e.key === "Backspace") {
      // Dont delete node elements
      e.stopPropagation();
    }
  };

  const handleBackgroundClick = () => {
    setVisible(false); // Trigger fade-out
    setTimeout(onClose, 500); // Delay the onClose callback until after the fade-out animation completes
  };

  useEffect(() => {
    if (!visible) {
      // After setting visibility to false, wait for animation to complete before closing
      const timer = setTimeout(() => onClose(), 500); // Match this with your transition duration
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Fade in={true} timeout={500}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `rgba(0, 0, 0, ${visible ? 0.5 : 0})`, // Control the background opacity based on the state
          transition: "background-color 2s",
        }}
        onClick={handleBackgroundClick}
      >
        <Card
          sx={{
            maxWidth: "80%", // Adjust width as needed
            maxHeight: "80%", // Adjust height as needed
            minWidth: "60vh", // Minimum width
            minHeight: "40vh", // Minimum height
            position: "relative",
            "&:hover": {
              boxShadow: 6,
            },
            overflow: "auto",
            opacity: visible ? 1 : 0, // Control opacity for fade effect
            transform: visible ? "translateY(0)" : "translateY(-20px)", // Slight move up on exit
            transition: "opacity 500ms, transform 500ms", // Smooth transition for both opacity and transform
          }}
          onClick={(e) => e.stopPropagation()} // Prevent background click inside the card
        >
          <CardMedia
            component="img"
            height="240"
            image={imageUrl}
            sx={{
              height: 240, // Fixed height for the image
              objectFit: "cover", // Cover the box, might crop the image
            }}
          />
          <CardContent
            sx={{
              overflow: "auto", // Allows content to scroll if it overflows
              flexGrow: 1, // Allows content area to grow and fill available space
            }}
          >
            <div>
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="text.secondary">
                Parameters
              </Typography>
              <Typography variant="caption">
                <List>
                  {(
                    algoParameters[title as keyof typeof algoParameters] || []
                  ).map((param, index) => (
                    <ListItem key={index}>
                      {param}:
                      <TextField
                        variant="standard"
                        size="small"
                        onKeyDown={handleKeyDown}
                        InputProps={{
                          disableUnderline: false, // Keep the underline
                          sx: {
                            fontSize: "0.875rem", // Match caption size
                            "& input": {
                              color: "text.secondary", // Use theme's secondary text color
                            },
                            "&::before": {
                              // Underline styles
                              borderBottomColor: "primary.main", // Use theme's primary color
                            },
                            "&:hover:not(.Mui-disabled):before": {
                              // Hover styles
                              borderBottom: "2px solid", // Make underline thicker on hover
                            },
                          },
                        }}
                        sx={{ marginLeft: 2, width: "auto" }} // Adjust spacing and width as needed
                      />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </div>
          </CardContent>
          <Divider />
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem 1rem",
            }}
          >
            <Typography variant="body2" color="text.secondary"></Typography>
            <Button>Run</Button>
          </CardActions>{" "}
        </Card>
      </div>
    </Fade>
  );
};

export default AlgoDetails;
