import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Fade,
  Button,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import Node from "./graphNode";
import { convertToAdjacencyList } from "./graphToAdjList";
import Edge from "./graphEdge";
import { bfs, BFSStepType } from "./algos/bfs/bfs";
import { useBFS } from "./algos/bfs/bfsContext.js";
import BfsPseudocode from "./algos/bfs/bfsPseudocode";

import { dfs, DFSStepType } from "./algos/dfs/dfs";
import { useDFS } from "./algos/dfs/dfsContext";
import DfsPseudocode from "./algos/dfs/dfsPseudocode";

import { ReactComponent as RightArrow } from "./assets/rightArrow.svg";
import { ReactComponent as LeftArrow } from "./assets/leftArrow.svg";

import impressionSunrise from "./monet-impressionSunrise.jpeg";
import sunflowers from "./vanGogh-sunflowers.jpeg";
import Julanite1 from "./Julanite1.jpeg";
import Julanite3 from "./Julanite3.jpeg";
import Julanite4 from "./Julanite4.jpeg";
import Julanite5 from "./Julanite5.jpeg";

import { Carousel } from "antd";

interface AlgoDetailsProps {
  algoTitle: string;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  isOriented: boolean;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  setIsGraphEditable: (editable: boolean) => void;
  name: string;
}
interface BFSStateType {
  steps: BFSStepType[];
  currentStepIndex: number;
  nodeStatus: Map<string, string>;
  isVisualizationActive: boolean;
}

interface DFSStateType {
  steps: DFSStepType[];
  currentStepIndex: number;
  nodeStatus: Map<string, string>;
  isVisualizationActive: boolean;
}

const AlgoDetails: React.FC<AlgoDetailsProps> = ({
  algoTitle,
  onClose,
  nodes,
  edges,
  isOriented,
  setSelectedNode,
  setSelectedEdge,
  setIsGraphEditable,
  name,
}) => {
  // Card sizing
  const cardSizing = {
    height: "55vh",
    width: "30vw",
  };

  // Artwork
  const titleToImage = {
    BFS: Julanite1,
    DFS: Julanite5,
    Dijkstra: sunflowers,
    Prim: Julanite4,
    Kruskal: Julanite3,
    TBD: impressionSunrise,
  };
  const image = titleToImage[algoTitle as keyof typeof titleToImage];

  const artWork = {
    BFS: ["Julanite", " by Brookfield"],
    DFS: ["Julanite", " by Brookfield"],
    Dijkstra: ["Sunflower", " by van Gogh"],
    Prim: ["Julanite", " by Brookfield"],
    Kruskal: ["Julanite", " by Brookfield"],
    TBD: ["Impression, Sunrise", " by Monet"],
  };

  // State data
  const [visible, setVisible] = useState(true); // control background dim or not
  const [movieTime, setMovieTime] = useState<boolean>(false);

  // Graph Data
  const adjacencyList = convertToAdjacencyList(nodes, edges, isOriented);
  const algoParameters = {
    BFS: ["Source Node"],
    DFS: ["Source Node"],
    Dijkstra: ["Source Node"],
    Prim: ["TBD"],
    Kruskal: ["TBD"],
    TBD: ["TBD"],
  };
  const nodeIDs = nodes.map((node) => node.id);
  const edgeIDs = edges.map((edge) => `${edge.id1}-${edge.id2}`);

  //Algorithm information
  const [inputValue, setInputValue] = useState<string>("");
  const [isInputValid, setIsInputValid] = useState<boolean>(true);

  const algoComponentMap = {
    BFS: BfsPseudocode,
    DFS: DfsPseudocode,
  };

  const AlgoPseudocode =
    algoComponentMap[algoTitle as keyof typeof algoComponentMap] || null; // Default to null or a fallback component

  // BFS
  const { steps: bfsSteps } = bfs(adjacencyList, inputValue, isOriented);
  const { bfsState, setBfsState, goToNextStepBFS, goToPreviousStepBFS } =
    useBFS();

  // DFS
  const { steps: dfsSteps } = dfs(adjacencyList, inputValue, isOriented);

  const { dfsState, setDfsState, goToNextStepDFS, goToPreviousStepDFS } =
    useDFS();

  // Logic and constants for handling L/R buttons
  const [LeftIsHovered, setLeftIsHovered] = useState(false);
  const [isLeftClicked, setIsLeftClicked] = useState(false);

  const [RightIsHovered, setRightIsHovered] = useState(false);
  const [isRightClicked, setIsRightClicked] = useState(false);

  let atStart = true;
  let atEnd = false;

  if (algoTitle === "BFS" && bfsState) {
    // at start
    if (bfsState.currentStepIndex === 0) {
      atStart = true;
    } else {
      atStart = false;
    }
    // at end
    if (bfsState.isCompleted) {
      atEnd = true;
    } else {
      atEnd = false;
    }
  }

  if (algoTitle === "DFS" && dfsState) {
    // at start
    if (dfsState.currentStepIndex === 0) {
      atStart = true;
    } else {
      atStart = false;
    }
    // at end
    if (dfsState.isCompleted) {
      atEnd = true;
    } else {
      atEnd = false;
    }
  }
  // Rest of code
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
    setSelectedEdge(null);
    setSelectedNode(null);
    atStart = true;
    atEnd = false;

    if (algoTitle === "BFS") {
      setBfsState((prevState: BFSStateType) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
    }
    if (algoTitle === "DFS") {
      setDfsState((prevState: DFSStateType) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
    }
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
      // don't jiggle if it's a space. run will handle that separately
      if (inputValue !== "") {
        setIsInputValid(false); // Indicate that input is invalid
        setTimeout(() => setInputValue(""), 500);
      }
    } else {
      setIsInputValid(true);
      target.blur();
    }
  };

  const [buttonColor, setButtonColor] = useState<string>("default");
  // what happens when you click "run"
  const handleRunClick = () => {
    // we need this second conditional or else get jiggle/free run bug
    if (!isInputValid || inputValue === "") {
      setButtonColor("error");

      // After 1 second, revert button color to default
      setTimeout(() => {
        setButtonColor("default");
      }, 1000);
    } else {
      setSelectedNode(null);
      setIsGraphEditable(false);
      setMovieTime(true);

      if (algoTitle === "BFS") {
        // initalize the statuses
        const initNodeStatus = new Map();
        initNodeStatus.set(inputValue, "processing");

        // Run the algo
        setBfsState({
          steps: bfsSteps,
          currentStepIndex: 0,
          nodeStatus: initNodeStatus, // Optionally initialize nodeStates based on the first step if needed
          isVisualizationActive: true, // Ensure visualization is active to show new steps
        });
      }

      if (algoTitle === "DFS") {
        const initNodeStatus = new Map();
        initNodeStatus.set(inputValue, "processing");
        setDfsState({
          steps: dfsSteps,
          currentStepIndex: 0,
          nodeStatus: initNodeStatus, // Optionally initialize nodeStates based on the first step if needed
          isVisualizationActive: true, // Ensure visualization is active to show new steps
        });
      }
    }
  };

  const handleNextButtonClick = () => {
    if (algoTitle === "BFS") {
      goToNextStepBFS();
    }
    if (algoTitle === "DFS") {
      goToNextStepDFS();
    }
  };

  const handlePreviousButtonClick = () => {
    if (algoTitle === "BFS") {
      goToPreviousStepBFS();
    }
    if (algoTitle === "DFS") {
      goToPreviousStepDFS();
    }
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
            atStart = true;
            atEnd = false;
            setMovieTime(false);
            setIsGraphEditable(true);

            if (algoTitle === "BFS") {
              setBfsState({
                steps: bfsSteps,
                currentStepIndex: 0,
                nodeStatus: new Map(), // Optionally initialize nodeStates based on the first step if needed
                isVisualizationActive: false, // Ensure visualization is active to show new steps
              });
            }
            if (algoTitle === "DFS") {
              setDfsState({
                steps: dfsSteps,
                currentStepIndex: 0,
                nodeStatus: new Map(), // Optionally initialize nodeStates based on the first step if needed
                isVisualizationActive: false, // Ensure visualization is active to show new steps
              });
            }

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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePreviousButtonClick, handleNextButtonClick, algoTitle, movieTime]);

  const handleCarouselClick = () => {
    // Use a timeout to ensure the blur action takes place after the click event has been fully processed
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 0);
  };

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
            // height: "55vh",
            // width: "60vh",
            backgroundColor: movieTime === false ? "#424541" : "#1E1E1E",
            position: "relative",
            overflow: "auto", // this does NOT control the overflow in the pseudococde
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 500ms, transform 500ms",
            // hide the scrollbar
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent", // Makes scrollbar transparent
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent", // Makes scrollbar thumb transparent
            },
          }}
          onClick={(e) => e.stopPropagation()} // Prevent background click inside the card
        >
          {movieTime ? (
            <div style={cardSizing} className="hideScrollbar">
              <CardContent
                sx={{
                  display: "flex", // Use flex layout
                  flexDirection: "column", // Stack children vertically
                  height: "50vh", // Fixed height for the container
                  flexGrow: 1, // Allows content area to grow and fill available space
                  backgroundColor: "#1E1E1E",
                  justifyContent: "space-between", // Push content to start and buttons to end
                  overflow: "hidden",
                  position: "relative", // Needed for absolute positioning of children
                }}
              >
                <div
                  style={{
                    overflowX: "auto",
                    width: "100%",
                    height: "100%",
                    position: "relative", // Ensure positioning context is correct
                  }}
                  onClick={handleCarouselClick}
                >
                  {/* putting the fade animation makes resizing not bug out */}
                  {/* otherwise, multiple contents are shown at once for a bit as you go from sm to big */}
                  <Carousel dotPosition="bottom" effect="fade">
                    <div>
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{
                          height: "40vh",
                          width: "40vw",
                          backgroundColor: "inherit",
                        }}
                      >
                        {AlgoPseudocode ? (
                          <AlgoPseudocode inputValue={inputValue} name={name} />
                        ) : (
                          <Typography sx={{ color: "white" }}>
                            Coming soon.
                          </Typography>
                        )}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "white",
                          height: "40vh",
                          width: "40vw",
                        }}
                      >
                        Test
                      </Typography>
                    </div>
                  </Carousel>
                </div>
                <div
                  style={{
                    backgroundColor: "transparent",
                    position: "fixed",
                    bottom: "2.5vh",
                    right: "1vw",
                    zIndex: "20",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onMouseEnter={() => setLeftIsHovered(true)}
                    onMouseLeave={() => setLeftIsHovered(false)}
                    onMouseDown={() => setIsLeftClicked(true)}
                    onMouseUp={() => setIsLeftClicked(false)}
                    onClick={handlePreviousButtonClick}
                    disabled={atStart}
                    style={{
                      userSelect: "none",
                      cursor: "pointer",
                      backgroundColor: "inherit",
                      border: "none",
                      outline: "none",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <LeftArrow
                      style={{
                        filter: atStart
                          ? "brightness(75%)"
                          : isLeftClicked
                            ? "brightness(200%)"
                            : LeftIsHovered
                              ? "brightness(130%)"
                              : "none", // Increase brightness on hover and click
                      }}
                    />
                  </button>
                  <button
                    onMouseEnter={() => setRightIsHovered(true)}
                    onMouseLeave={() => setRightIsHovered(false)}
                    onMouseDown={() => setIsRightClicked(true)}
                    onMouseUp={() => setIsRightClicked(false)}
                    onClick={handleNextButtonClick}
                    disabled={atEnd}
                    style={{
                      userSelect: "none",
                      cursor: "pointer",
                      backgroundColor: "inherit",
                      border: "none",
                      outline: "none",
                      overflow: "hidden",
                    }}
                  >
                    <RightArrow
                      style={{
                        filter: atEnd
                          ? "brightness(75%)"
                          : isRightClicked
                            ? "brightness(200%)"
                            : RightIsHovered
                              ? "brightness(130%)"
                              : "none", // Increase brightness on hover and click
                      }}
                    />
                  </button>
                </div>
              </CardContent>
            </div>
          ) : (
            <div style={cardSizing}>
              <div
                className="artwork-container"
                style={{ position: "relative", height: "230px" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  sx={{
                    height: 230, // This is how much of the image you can see
                    objectFit: "cover",
                  }}
                />{" "}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute", // absolute relative to artwork
                    top: 200,
                    right: 10,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "2px 5px",
                    borderRadius: "4px",
                    zIndex: 1000, // puts this above the artwork
                  }}
                >
                  {artWork[algoTitle as keyof typeof titleToImage].map(
                    (part, index) => (
                      <span
                        key={index}
                        style={{ color: index === 0 ? "white" : "#FABD2F" }}
                      >
                        {part}
                      </span>
                    )
                  )}
                </Typography>
              </div>
              <CardContent
                sx={{
                  overflow: "hidden", // Allows content to scroll if it overflows
                  flexGrow: 1, // Allows content area to grow and fill available space
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color="white"
                  >
                    {algoTitle}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="white" fontSize="10px">
                    Parameters
                  </Typography>
                  <Typography variant="caption" color="white">
                    <List>
                      {(
                        algoParameters[
                          algoTitle as keyof typeof algoParameters
                        ] || []
                      ).map((param, index) => (
                        <ListItem key={index}>
                          {param}:
                          <TextField
                            className={isInputValid ? "" : "jiggle"}
                            variant="standard"
                            autoComplete="off"
                            size="small"
                            value={inputValue}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            onContextMenu={handleRightClick}
                            onBlur={handleBlur}
                            InputProps={{
                              style: { color: "white" }, // Change input text color
                              inputProps: {
                                style: { fontSize: "10px" }, // Set font size for the input
                              },
                              sx: {
                                "&:before": {
                                  borderBottom: "1px solid lightgray", // Set underline to light gray when not focused
                                },
                                "&:hover:not(.Mui-disabled):before": {
                                  borderBottom: "1px solid white", // Keep consistent with your focused state if needed
                                },
                                "&:after": {
                                  borderBottom: "1.5px solid white", // Ensure this matches the default state or focused state
                                },
                              },
                            }}
                            sx={{ marginLeft: 1.5, width: "auto" }} // Adjust spacing and width as needed
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Typography>
                </div>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 1rem",
                }}
              >
                <Typography variant="body2" color="white"></Typography>
                <Button
                  onClick={handleRunClick}
                  style={{
                    color: buttonColor === "error" ? "#BA2D0B" : "white", // Change text color based on error state
                    borderColor: buttonColor === "error" ? "#BA2D0B" : "white", // Optional: change border color for outlined buttons
                    border:
                      buttonColor === "error"
                        ? "1px solid #BA2D0B"
                        : "1px solid white", // Ensure border is visible
                    padding: "6px 10px", // Reduce padding
                    fontSize: "0.65rem", // Reduce font size
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
