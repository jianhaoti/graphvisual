//App.tsx
import React, {useState}from 'react';
import './App.css';
import Graph from './Graph';
import AlgoWindow from './AlgoWindow';

function App() {  
  const [isOriented, setIsOriented] = useState(true);

  const handleButtonClick = () => {
    setIsOriented(!isOriented);
  };

  return (
    <main>
        <Graph isOriented={isOriented}/> <AlgoWindow></AlgoWindow>
        <button 
        className='bottom-left-button'
        onClick = {handleButtonClick}
      >
          {isOriented ? "Set Unoriented" : "Set Oriented"}
        </button>
    </main>
  );
}

export default App;