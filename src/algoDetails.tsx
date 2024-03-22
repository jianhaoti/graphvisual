import React, { useState, useEffect } from "react";
import { Carousel, ConfigProvider, Checkbox } from "antd";
import CustomPagination from "./customPagination.js";
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

import { useDijkstra } from "./algos/dijkstra/dijkstraContext.js";
import DijkstraPseudocode from "./algos/dijkstra/dijkstraPseudocode.jsx";

import { ReactComponent as RightArrow } from "./assets/rightArrow.svg";
import { ReactComponent as LeftArrow } from "./assets/leftArrow.svg";

import impressionSunrise from "./assets/monet-impressionSunrise.jpeg";
import sunflowers from "./assets/vanGogh-sunflowers.jpeg";
import Julanite1 from "./assets/Julanite1.jpeg";
import Julanite4 from "./assets/Julanite4.jpeg";
import Julanite5 from "./assets/Julanite5.jpeg";
import fish from "./assets/goya-GoldenBream.jpg";

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
  showWeight: boolean;
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

interface DijkstraStateType {
  currentStepIndex: number;
  isCompleted: boolean;
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
  showWeight,
}) => {
  // Card sizing
  const cardSizing = {
    height: "55vh",
    width: "30vw",
  };

  /* #region Artwork */
  const titleToImage = {
    BFS: Julanite1,
    DFS: Julanite5,
    Dijkstra: fish,
    Prim: Julanite4,
    Kruskal: impressionSunrise,
    TBD: sunflowers,
  };
  const image = titleToImage[algoTitle as keyof typeof titleToImage];

  const artWork = {
    BFS: ["Julanite", " by Brookfield"],
    DFS: ["Julanite", " by Brookfield"],
    Dijkstra: ["Golden Bream", " by Goya"],
    Prim: ["Julanite", " by Brookfield"],
    Kruskal: ["Impression, Sunrise", " by Monet"],
    TBD: ["Sunflower", " by van Gogh"],
  };
  /* #endregion */

  /* #region State data */
  const [backgroundDimmed, setBackgroundDimmed] = useState(false); // control background dim or not
  const [isAlgoRunning, setIsAlgoRunning] = useState<boolean>(false);
  const [source, setSource] = useState<string>("");
  const [isSourceValid, setIsSourcevalid] = useState<boolean>(true);
  /* #endregion */

  /* #region Graph Data */
  const algoParameters = {
    BFS: ["Source Node"],
    DFS: ["Source Node"],
    Dijkstra: ["Source Node", "Show Weights", "Weights ≥ 0"],
    Prim: ["TBD"],
    Kruskal: ["TBD"],
    TBD: ["TBD"],
  };
  const theNeighbors = convertToAdjacencyList(nodes, edges, isOriented);
  const nodeIDs = nodes.map((node) => node.id);
  const edgeWeightMap = new Map();
  edges.forEach((edge) =>
    edgeWeightMap.set(`${edge.id1}-${edge.id2}`, edge.weight)
  );

  const hasNegativeWeight = edges.some((edge) => edge.weight < 0);
  /* #endregion */

  /* #region BFS */
  const { steps: bfsSteps } = bfs(theNeighbors, source, isOriented);
  const { bfsState, setBfsState, goToNextStepBFS, goToPreviousStepBFS } =
    useBFS();

  const { queue: bfsQueue, processing: bfsProcessing } = bfsSteps[
    bfsState.currentStepIndex
  ] || { queue: [] };
  /* #endregion */

  /* #region DFS */
  const { steps: dfsSteps } = dfs(theNeighbors, source, isOriented);

  const { dfsState, setDfsState, goToNextStepDFS, goToPreviousStepDFS } =
    useDFS();
  const { stack: dfsStack, processing: dfsProcessing } = dfsSteps[
    dfsState.currentStepIndex
  ] || { queue: [] };
  /* #endregion */

  /* #region Dijkstra */
  const {
    dijkstraState,
    setDijkstraState,
    goToNextStepDijkstra,
    goToPreviousStepDijkstra,
    dijkstraSourceNode,
  } = useDijkstra();
  /* #endregion */

  /* #region Algo Info */
  const algoPseudocodeMap = {
    BFS: BfsPseudocode,
    DFS: DfsPseudocode,
  };

  const AlgoPseudocode =
    algoPseudocodeMap[algoTitle as keyof typeof algoPseudocodeMap] || null; // Default to null or a fallback component

  /* #endregion */
  /* #region Left/Right Button  */
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

  if (algoTitle === "Dijkstra" && dijkstraState) {
    // at start
    if (dijkstraState.currentStepIndex === 0) {
      atStart = true;
    } else {
      atStart = false;
    }
    // at end
    if (dijkstraState.isCompleted) {
      atEnd = true;
    } else {
      atEnd = false;
    }
  }

  /* #endregion */
  /* #region Main Logic */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
    setIsSourcevalid(true); // This resets the state so we can jiggle in sucession.
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
          setSource(text); // Set the input value to the text from the clipboard
          setIsSourcevalid(true); // Assuming the pasted input is valid
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
        setIsSourcevalid(false); // Indicate that input is invalid
        setTimeout(() => setSource(""), 500);
      } else {
        setIsSourcevalid(true);
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
    setBackgroundDimmed(true); // Trigger fade-out
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
    if (algoTitle === "Dijkstra") {
      setDijkstraState((prevState: DijkstraStateType) => ({
        ...prevState,
        isVisualizationActive: false,
      }));
    }
    setTimeout(onClose, 500); // Delay the onClose callback until after the fade-out animation completes
  };

  // timer for delayed clearing
  useEffect(() => {
    if (backgroundDimmed) {
      // After setting visibility to false, wait for animation to complete before closing
      const timer = setTimeout(() => onClose(), 500); // Match this with your transition duration
      return () => clearTimeout(timer);
    }
  }, [backgroundDimmed, onClose]);

  // handles jiggle and blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // Ensure you have the correct target type
    const isInvalidName = !nodeIDs.includes(target.value);

    if (isInvalidName) {
      // don't jiggle if it's a space. run will handle that separately
      if (source !== "") {
        setIsSourcevalid(false); // Indicate that input is invalid
        setTimeout(() => setSource(""), 500);
      }
    } else {
      setIsSourcevalid(true);
      target.blur();
    }
  };

  const [buttonColor, setButtonColor] = useState<string>("default");
  // what happens when you click "run"
  const handleRunClick = async () => {
    const handleRunClickError = () => {
      console.log(`Source node is invalid for ${algoTitle}.`);
      setButtonColor("error");

      // After 1 second, revert button color to default
      setTimeout(() => {
        setButtonColor("default");
      }, 1000);
    };

    //! GENERAL: failure becuase of source node
    if (!isSourceValid || source === "") {
      handleRunClickError();
    }

    //! DIJKSTRAS: check if edge weights are shown/nonnegative
    if (algoTitle === "Dijkstra" && (hasNegativeWeight || !showWeight)) {
      handleRunClickError();
    }

    //* SUCCESS
    else {
      setSelectedNode(null);
      setIsGraphEditable(false);
      setIsAlgoRunning(true);

      const initNodeStatus = new Map();
      initNodeStatus.set(source, "processing");

      switch (algoTitle) {
        case "BFS":
          setBfsState({
            steps: bfsSteps,
            currentStepIndex: 0,
            nodeStatus: initNodeStatus,
            isVisualizationActive: true,
          });
          break;

        case "DFS":
          setDfsState({
            steps: dfsSteps,
            currentStepIndex: 0,
            nodeStatus: initNodeStatus,
            isVisualizationActive: true,
          });
          break;

        case "Dijkstra":
          // prepping the data to send to backend
          const edgeWeights = Array.from(edgeWeightMap.entries());
          const graphAdjacencyList = Object.fromEntries(theNeighbors);

          // package it up
          const requestData = JSON.stringify({
            graphAdjacencyList,
            edgeWeightMap: edgeWeights,
            isOriented,
            source,
          });

          fetch("http://localhost:3001/dijkstra", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((dijkstraReturn) => {
              console.log("Dijkstra Steps:", dijkstraReturn.steps);
              setDijkstraState({
                steps: dijkstraReturn.steps,
                currentStepIndex: 0,
                isCompleted: false,
                isVisualizationActive: true,
              });
            })
            .catch((error) =>
              console.error(
                "There was a problem with your fetch operation:",
                error
              )
            );
          break;

        default:
          console.error("Unsupported algorithm");
          break;
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
    if (algoTitle === "Dijkstra") {
      goToNextStepDijkstra();
    }
  };

  const handlePreviousButtonClick = () => {
    if (algoTitle === "BFS") {
      goToPreviousStepBFS();
    }
    if (algoTitle === "DFS") {
      goToPreviousStepDFS();
    }
    if (algoTitle === "Dijkstra") {
      goToPreviousStepDijkstra();
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAlgoRunning) {
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
            setIsAlgoRunning(false);
            setIsGraphEditable(true);

            if (algoTitle === "BFS") {
              setBfsState({
                steps: [],
                currentStepIndex: 0,
                nodeStatus: new Map(),
                isVisualizationActive: false, // Ensure visualization is active to show new steps
              });
            }
            if (algoTitle === "DFS") {
              setDfsState({
                steps: [],
                currentStepIndex: 0,
                nodeStatus: new Map(),
                isVisualizationActive: false, // Ensure visualization is active to show new steps
              });
            }
            if (algoTitle === "Dijkstra") {
              setDijkstraState({
                steps: [],
                currentStepIndex: 0,
                isCompleted: false,
                isVisualizationActive: false,
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
  }, [
    handlePreviousButtonClick,
    handleNextButtonClick,
    algoTitle,
    isAlgoRunning,
  ]);

  const handleCarouselClick = () => {
    // * Use a timeout to ensure the blur action takes place after the click event has been fully processed
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 0);
  };

  /* #endregion */

  /* #region Debugging */
  // useEffect(() => console.log(bfsProcessing), [bfsState]);
  /* #endregion */
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
          backgroundColor: `rgba(0, 0, 0, ${!backgroundDimmed ? 0.5 : 0})`, // Control the background opacity based on the state
          transition: "background-color 2s",
        }}
        onClick={handleBackgroundClick}
      >
        <Card
          sx={{
            backgroundColor: isAlgoRunning === false ? "#424541" : "#1E1E1E",
            position: "relative",
            overflow: "auto", // this does NOT control the overflow in the pseudococde
            opacity: !backgroundDimmed ? 1 : 0,
            transform: !backgroundDimmed
              ? "translateY(0)"
              : "translateY(-20px)",
            transition: "opacity 500ms, transform 500ms",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent background click inside the card
        >
          {isAlgoRunning ? (
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
                {/* carousel */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative", // Ensure positioning context is correct
                    backgroundColor: "transparent",
                  }}
                  onClick={handleCarouselClick}
                >
                  <ConfigProvider
                    theme={{
                      components: {
                        Carousel: {
                          colorBgContainer: "white",
                          // dotHeight: 5,
                          // dotWidth: 20,
                          // dotActiveWidth: 30,
                        },
                      },
                    }}
                  >
                    <Carousel dotPosition="bottom" effect="fade">
                      <div>
                        <Typography
                          component="div"
                          variant="body2"
                          sx={{
                            height: "40vh",
                            width: "40vw",
                          }}
                        >
                          {AlgoPseudocode ? (
                            <AlgoPseudocode source={source} name={name} />
                          ) : (
                            <Typography sx={{ color: "white" }}>
                              Coming soon.
                            </Typography>
                          )}
                        </Typography>
                      </div>
                      {algoTitle === "BFS" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "3vh",
                              marginLeft: "3vh",
                            }}
                          >
                            <div
                              style={{ minWidth: "100px", textAlign: "left" }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                                sx={{
                                  color: "white",
                                  userSelect: "none",
                                  fontSize: ".9em",
                                }}
                              >
                                Queue:
                              </Typography>
                            </div>
                            <CustomPagination
                              arr={bfsQueue}
                              borderColor="#DB380F"
                              textColor="#DB380F"
                              selectedFontWeight="bold"
                              showArrows={true}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "1vh",
                              marginLeft: "3vh",
                            }}
                          >
                            <div
                              style={{ minWidth: "100px", textAlign: "left" }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                                sx={{
                                  color: "white",
                                  userSelect: "none",
                                  fontSize: ".9em",
                                }}
                              >
                                Processing:
                              </Typography>
                            </div>
                            <CustomPagination
                              arr={[bfsProcessing]}
                              borderColor="white"
                              textColor="white"
                              selectedFontWeight="normal"
                              showArrows={false}
                            />
                          </div>
                        </div>
                      )}
                      {algoTitle === "DFS" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "3vh",
                              marginLeft: "3vh",
                            }}
                          >
                            <div
                              style={{ minWidth: "100px", textAlign: "left" }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                                sx={{
                                  color: "white",
                                  userSelect: "none",
                                  fontSize: ".9em",
                                }}
                              >
                                Stack:
                              </Typography>
                            </div>
                            <CustomPagination
                              arr={dfsStack}
                              borderColor="#DB380F"
                              textColor="#DB380F"
                              selectedFontWeight="bold"
                              showArrows={true}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "1vh",
                              marginLeft: "3vh",
                            }}
                          >
                            <div
                              style={{ minWidth: "100px", textAlign: "left" }}
                            >
                              <Typography
                                component="div"
                                variant="body2"
                                sx={{
                                  color: "white",
                                  userSelect: "none",
                                  fontSize: ".9em",
                                }}
                              >
                                Processing:
                              </Typography>
                            </div>
                            <CustomPagination
                              arr={[dfsProcessing]}
                              borderColor="white"
                              textColor="white"
                              selectedFontWeight="normal"
                              showArrows={false}
                            />
                          </div>
                        </div>
                      )}
                      {algoTitle === "Dijkstra" && (
                        <div style={{ minWidth: "100px", textAlign: "left" }}>
                          <Typography
                            component="div"
                            variant="body2"
                            sx={{
                              color: "white",
                              userSelect: "none",
                              fontSize: ".9em",
                            }}
                          >
                            Current Step:
                          </Typography>
                          <div>
                            {dijkstraState.steps[
                              dijkstraState.currentStepIndex
                            ] ? (
                              <pre style={{ color: "white" }}>
                                {JSON.stringify(
                                  dijkstraState.steps[
                                    dijkstraState.currentStepIndex
                                  ],
                                  null,
                                  2
                                )}
                              </pre>
                            ) : (
                              "No steps available"
                            )}
                          </div>
                        </div>
                      )}
                    </Carousel>
                  </ConfigProvider>
                </div>

                {/* buttons */}
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
            <div style={cardSizing} className="hideScrollbar">
              <div
                className="artwork-container"
                style={{
                  position: "relative",
                  height: "230px",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  sx={{
                    height: 230, // This is how much of the image you can see
                    objectFit: "cover",
                    userSelect: "none",
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
                    sx={{ userSelect: "none" }}
                  >
                    {algoTitle}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="body2"
                    color="white"
                    fontSize="10px"
                    sx={{ userSelect: "none" }}
                  >
                    Parameters
                  </Typography>
                  <Typography
                    variant="caption"
                    color="white"
                    sx={{ userSelect: "none" }}
                  >
                    <List>
                      {(
                        algoParameters[
                          algoTitle as keyof typeof algoParameters
                        ] || []
                      ).map((param, index) => (
                        <ListItem key={index}>
                          {param}:
                          {param === "Source Node" && (
                            <TextField
                              className={isSourceValid ? "" : "jiggle"}
                              variant="standard"
                              autoComplete="off"
                              size="small"
                              value={source}
                              onKeyDown={handleKeyDown}
                              onChange={handleInputChange}
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
                          )}
                          {param === "Show Weights" && (
                            <ConfigProvider
                              theme={{
                                token: {
                                  colorBgContainer: "#B2BEB5",
                                  colorBorder: "dark gray",
                                  colorPrimary: "black",
                                },
                              }}
                            >
                              <Checkbox
                                checked={showWeight}
                                style={{ paddingLeft: ".5vw" }}
                              />
                            </ConfigProvider>
                          )}
                          {param === "Weights ≥ 0" && (
                            <ConfigProvider
                              theme={{
                                token: {
                                  colorBgContainer: "#B2BEB5",
                                  colorBorder: "dark gray",
                                  colorPrimary: "black",
                                },
                              }}
                            >
                              <Checkbox
                                checked={!hasNegativeWeight}
                                style={{ paddingLeft: ".5vw" }}
                              />
                            </ConfigProvider>
                          )}
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
                <div></div>
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
                    position: "relative", // Keeps the button fixed during scrolling
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
