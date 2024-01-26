import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Graph from './Graph';
import ControlRoom from './ControlRoom';
import { Button, ButtonGroup } from '@mui/material';
import { ReactComponent as AlgoIcon } from './assets/algoIcon.svg';
import { ReactComponent as LabelIcon } from './assets/labelIcon.svg';
import TextField from '@material-ui/core/TextField';

function App() {  
  const [mode, setMode] = useState("label");
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
    setMode("label");
  };

  const handleAlgoClick = () => {
    setMode("algorithm");
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
            <Button onClick={handleLabelClick} variant={mode === "label" ? "contained" : "outlined"} disableElevation={true}>
              <LabelIcon />
            </Button>
            <Button onClick={handleAlgoClick} variant={mode === "algorithm" ? "contained" : "outlined"} disableElevation={true}>
              <AlgoIcon />
            </Button>
          </ButtonGroup>
        </div>
      <Graph isOriented/> <ControlRoom/>
    </main>
  );
}

export default App;
