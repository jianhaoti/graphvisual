import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Graph from './Graph';
import ControlRoom from './ControlRoom';
import { Button, ButtonGroup } from '@mui/material';
import { ReactComponent as AlgoIcon } from './assets/algoIcon.svg';
import { ReactComponent as DataIcon } from './assets/dataIcon.svg';
import TextField from '@material-ui/core/TextField';

function App() {  
  const [mode, setMode] = useState("data");
  const [value, setValue] = useState('Untitled');
  const textFieldRef = useRef<HTMLInputElement>(null);
  
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
            id="standard-multiline-flexible"
            multiline
            maxRows={1}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            inputRef={textFieldRef}
            inputProps={{maxLength: 25}}
          />
        </div>
        <div className="button-group-container">
          <ButtonGroup className="control-buttons" variant="outlined" aria-label="outlined primary button group">
            <Button onClick={handleLabelClick} variant={mode === "data" ? "contained" : "outlined"} disableElevation={true}>
              <DataIcon />
            </Button>
            <Button onClick={handleAlgoClick} variant={mode === "algo" ? "contained" : "outlined"} disableElevation={true}>
              <AlgoIcon />
            </Button>
          </ButtonGroup>
        </div>
      <Graph/> 
      <ControlRoom 
        mode = {mode} 
      />
    </main>
  );
}

export default App;