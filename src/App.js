import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const game = initGame('coronavirus-game')
  }, [])
  return (
    <div id="coronavirus-game" className="App">
      
    </div>
  );
}

export default App;
