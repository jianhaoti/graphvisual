//App.tsx
import React, {useState}from 'react';
import './App.css';
import Graph from './Graph';
import ControlRoom from './ControlRoom';
import { Button, ButtonGroup } from '@mui/material';

function App() {  
  const [isOriented, setIsOriented] = useState(true);
  const [mode, setMode] = useState("default");

  const handleOrientationClick = () => {
    setIsOriented(!isOriented);
  };

  const handleLabelClick = () => {
      setMode("label");
  };

  const handleAlgoClick = () => {
      setMode("algorithm");
  };

  return (
    <main>
      <ButtonGroup className = "graph-buttons" variant="outlined" aria-label="outlined primary button group">
        <Button
          onClick={handleOrientationClick}
        >
        {isOriented ? "Set Unoriented" : "Set Oriented"}
        </Button>
      </ButtonGroup>

      <div className = "button-group-container">
        <ButtonGroup className="control-buttons" variant="outlined" aria-label="outlined primary button group">
            <Button 
              onClick={handleLabelClick} 
              variant={mode === "label" ? "contained" : "outlined"}
              disableElevation = {true}
            >
                Label Graph
            </Button>
            <Button 
              onClick={handleAlgoClick} 
              variant={mode === "algorithm" ? "contained" : "outlined"}
              disableElevation = {true}
            >
              Run Algorithm
            </Button>
        </ButtonGroup>
      </div> 
      <Graph isOriented={isOriented}/> <ControlRoom/>
    </main>
  );
}

export default App;