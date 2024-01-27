import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Graph from './Graph';
import ControlRoom from './ControlRoom';
import { Button, ButtonGroup } from '@mui/material';
import { ReactComponent as AlgoIcon } from './assets/algoIcon.svg';
import { ReactComponent as DataIcon } from './assets/dataIcon.svg';
import TextField from '@material-ui/core/TextField';
import Node from './GraphNode';


function App() {  
  const [mode, setMode] = useState("data");
  const [value, setValue] = useState('Untitled');
  const textFieldRef = useRef<HTMLInputElement>(null);
  
  // Graph Data
  const [nodes, setNodes] = useState<Node[]>([]); // Moved state

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();  // Focus the input
      textFieldRef.current.select(); // Select the text
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFocus = () => {
    if (textFieldRef.current) {
      textFieldRef.current.select();
    }
  };

  const handleLabelClick = () => {
    setMode("data");
  };

  const handleAlgoClick = () => {
    setMode("algo");
  };

  return (
    <main>
        <div>
          <TextField
            className="whiteUnderline"
            id="standard-multiline-flexible"
            multiline
            maxRows={1}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            inputRef={textFieldRef}
            inputProps={{maxLength: 25}}
            InputLabelProps={{
              style: { color: 'white' } // Change label color
            }}
            InputProps={{
              style: { color: 'white' } // Change input text color
            }}
            variant="standard"
      
          />
        </div>
        <div className="button-group-container">
          <ButtonGroup 
            className="control-buttons" 
            variant="outlined" 
            aria-label="outlined primary button group"
          >
            <Button 
              onClick={handleLabelClick} 
              className={mode === "data" ? "activeButton" : ""}
              variant={mode === "data" ? "outlined" : "outlined"} 
              disableElevation={true}
              style={{ 
                border: '.75px none',
                outline: '.75px solid gray',
                boxShadow: '0 0 0 0px gray',
              }}
            >
              <DataIcon />
            </Button>
            <Button 
              onClick={handleAlgoClick} 
              className={mode === "algo" ? "activeButton" : ""}
              variant={mode === "algo" ? "outlined" : "outlined"} 
              disableElevation={true}
              style={{ 
                border: '.75px none',
                outline: '.75px solid gray',
                boxShadow: '0 0 0 0px gray',
              }}
            >
              <AlgoIcon />
            </Button>
          </ButtonGroup>
        </div>
      <Graph
        nodes={nodes}
        setNodes={setNodes}
      /> 
      <ControlRoom 
        mode = {mode} 
      />
    </main>
  );
}

export default App;