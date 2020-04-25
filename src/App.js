/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const game = initGame('coronavirus-game')

    setInterval(() => {
      console.log(globalCollectData.getData())
    }, 1000)
  }, [])
  return (
    <div id="coronavirus-game" className="App">
      
    </div>
  );
}

export default App;
