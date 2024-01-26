//App.tsx
import React, {useState}from 'react';
import './App.css';
import Graph from './Graph';
import ControlRoom from './ControlRoom';
import { Button, ButtonGroup } from '@mui/material';
import { ReactComponent as ArrowheadIcon } from './assets/arrowhead.svg';

function App() {  
  const [isOriented, setIsOriented] = useState(true);
  const [mode, setMode] = useState("label");

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
          variant={isOriented === true ? "contained" : "outlined"}
          >
          <ArrowheadIcon />
        </Button>
      </ButtonGroup>

      <div className = "button-group-container">
        <ButtonGroup className="control-buttons" variant="outlined" aria-label="outlined primary button group">
            <Button 
              onClick={handleLabelClick} 
              variant={mode === "label" ? "contained" : "outlined"}
              disableElevation = {true}
            >
                Graph Data
            </Button>
            <Button 
              onClick={handleAlgoClick} 
              variant={mode === "algorithm" ? "contained" : "outlined"}
              disableElevation = {true}
            >
              Algorithms
            </Button>
        </ButtonGroup>
      </div> 
      <Graph isOriented={isOriented}/> <ControlRoom/>
    </main>
  );
}

export default App;