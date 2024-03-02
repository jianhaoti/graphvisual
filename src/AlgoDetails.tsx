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
import { useArrayIterator } from "./useIterator";
import { convertToAdjacencyList } from "./graphToAdjList";
import Edge from "./GraphEdge";
import { bfs } from "./bfs";
import { useBFS } from "./bfsContext.js";
import { escape } from "querystring";

interface AlgoDetailsProps {
  title: string;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  isOriented: boolean;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  setIsGraphEditable: (editable: boolean) => void;
}

const AlgoDetails: React.FC<AlgoDetailsProps> = ({
  title,
  onClose,
  nodes,
  edges,
  isOriented,
  setSelectedNode,
  setSelectedEdge,
  setIsGraphEditable,
}) => {
  const nodeIDs = nodes.map((node) => node.id);
  const [visible, setVisible] = useState(true); // Control visibility with state
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

  const [inputValue, setInputValue] = useState<string>("");
  const [isInputValid, setIsInputValid] = useState<boolean>(false);
  const [movieTime, setMovieTime] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsInputValid(true); // This resets the state so we can jiggle in sucession.
  };

  // right click is now ctrl + v
  const handleRightClick = async (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    event.preventDefault(); // Prevent the default context menu from opening

    if (navigator.clipboard) {
      // Check if Clipboard API is available
      navigator.clipboard
        .readText()
        .then((text) => {
          // Attempt to read text from the clipboard
          setInputValue(text); // Set the input value to the text from the clipboard
          setIsInputValid(true); // Assuming the pasted input is valid
        })
        .catch((err) => {
          console.error("Failed to read clipboard contents: ", err);
        });
    } else {
      // Clipboard API not available
      console.log("Clipboard API not available.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // This checks if entered value is an node!!!
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement; // Ensure you have the correct target type
      const isInvalidName = !nodeIDs.includes(target.value);

      if (isInvalidName) {
        setIsInputValid(false); // Indicate that input is invalid
        setTimeout(() => setInputValue(""), 500);
      } else {
        setIsInputValid(true);
        target.blur();
      }
    }

    if (e.key === "Backspace") {
      // Prevent deletion of selected nodes when backspace is pressed in the input
      e.stopPropagation();
    }
  };

  // Transition fade-in
  const handleBackgroundClick = () => {
    setVisible(false); // Trigger fade-out
    setIsGraphEditable(true);
    setMovieTime(false);
    setSelectedEdge(null);
    setSelectedNode(null);

    setBfsState({
      steps: [],
      currentStepIndex: 0,
      nodeStatus: new Map(), // Optionally initialize nodeStates based on the first step if needed
      isVisualizationActive: false, // Ensure visualization is active to show new steps
    });

    setTimeout(onClose, 500); // Delay the onClose callback until after the fade-out animation completes
  };

  // timer for delayed clearing
  useEffect(() => {
    if (!visible) {
      // After setting visibility to false, wait for animation to complete before closing
      const timer = setTimeout(() => onClose(), 500); // Match this with your transition duration
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  // handles jiggle and blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // Ensure you have the correct target type
    const isInvalidName = !nodeIDs.includes(target.value);

    if (isInvalidName) {
      setIsInputValid(false); // Indicate that input is invalid
      setTimeout(() => setInputValue(""), 500);
    } else {
      setIsInputValid(true);
      target.blur();
    }
  };

  const [buttonColor, setButtonColor] = useState<string>("default");
  // Graph Data avaliable here
  const adjacencyList = convertToAdjacencyList(nodes, edges, isOriented);
  const { steps: bfsSteps, layers: bfsLayers } = bfs(adjacencyList, inputValue);
  // const {
  //   currentIndex: currentIndex, // Provide direct access to the current item
  //   goToNextItem: goToNextItem,
  //   goToPreviousItem: goToPreviousItem,
  //   isCompleted: isCompleted,
  // } = useArrayIterator(bfsSteps);

  const { bfsState, setBfsState, goToNextStep, goToPreviousStep } = useBFS();

  // // Toggle function to start/stop the visualization
  // const toggleVisualization = () => {
  //   setBfsState((prevState: any) => ({
  //     ...prevState,
  //     isVisualizationActive: !prevState.isVisualizationActive,
  //   }));
  // };

  // what happens when you click "run"
  const handleRunClick = () => {
    if (!isInputValid) {
      // Change button color to red to indicate error
      setButtonColor("error");

      // After 1 second, revert button color to default
      setTimeout(() => {
        setButtonColor("default");
      }, 1000);
    } else {
      setSelectedNode(null);
      setIsGraphEditable(false);
      setMovieTime(true);

      // initalize the status
      const initializeNodeStatus = new Map();
      nodeIDs.forEach((nodeID) => {
        initializeNodeStatus.set(nodeID, "default");
      });
      // Set the source node as "visited"
      initializeNodeStatus.set(inputValue, "visited");

      // Run the algo
      setBfsState({
        steps: bfsSteps,
        currentStepIndex: 0,
        nodeStatus: initializeNodeStatus, // Optionally initialize nodeStates based on the first step if needed
        isVisualizationActive: true, // Ensure visualization is active to show new steps
      });
    }
  };

  const handleNextButtonClick = () => {
    goToNextStep();
  };

  const handlePreviousButtonClick = () => {
    goToPreviousStep();
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (movieTime) {
        switch (e.key) {
          case "ArrowLeft":
            handlePreviousButtonClick();
            break;
          case "ArrowRight":
            handleNextButtonClick();
            break;
          case "Backspace":
            setMovieTime(false);
            break;
          case "Escape":
            handleBackgroundClick();
            break;
        }
      } else {
        switch (e.key) {
          case "Escape":
            handleBackgroundClick();
            break;
        }
      }
      // switch (e.key) {
      //   case "ArrowLeft":
      //     handlePreviousButtonClick();
      //     break;
      //   case "ArrowRight":
      //     handleNextButtonClick();
      //     break;
      //   case "Escape":
      //     handleBackgroundClick();
      //     break;
      //   default:
      //     break;
      // }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePreviousButtonClick, handleNextButtonClick]);

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
          {movieTime ? (
            <CardContent
              sx={{
                overflow: "auto", // Allows content to scroll if it overflows
                flexGrow: 1, // Allows content area to grow and fill available space
              }}
            >
              <Typography variant="body1">
                Current Step:{" "}
                {JSON.stringify(bfsSteps[bfsState.currentStepIndex])}
              </Typography>

              <div>
                <button
                  onClick={handlePreviousButtonClick}
                  disabled={bfsState.currentStepIndex === 0}
                  style={{ userSelect: "none", cursor: "pointer" }}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextButtonClick}
                  disabled={bfsState.isCompleted}
                  style={{ userSelect: "none", cursor: "pointer" }}
                >
                  Next
                </button>
              </div>
            </CardContent>
          ) : (
            <div>
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
                        algoParameters[title as keyof typeof algoParameters] ||
                        []
                      ).map((param, index) => (
                        <ListItem key={index}>
                          {param}:
                          <TextField
                            className={isInputValid ? "" : "jiggle"}
                            variant="standard"
                            size="small"
                            value={inputValue}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            onContextMenu={handleRightClick}
                            onBlur={handleBlur}
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
                <Button
                  onClick={handleRunClick}
                  style={{
                    color: buttonColor === "error" ? "red" : "inherit", // Change text color based on error state
                    borderColor: buttonColor === "error" ? "red" : "inherit", // Optional: change border color for outlined buttons
                    // Add more styling as needed
                  }}
                >
                  Run
                </Button>
              </CardActions>{" "}
            </div>
          )}
        </Card>
      </div>
    </Fade>
  );
};

export default AlgoDetails;
