/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  linearGradient, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area 
} from 'recharts'
import './App.css';

const prepateDataToChart = data => {

  // return Object.values(data)
  let newData = []

  // agrup all repeat gameTime values
  Object.values(data).forEach(step => {
    const lastIndex = newData.length - 1
    if (lastIndex > -1 && newData[lastIndex].gameTime === step.gameTime) {
      newData.pop()
      newData.push(step)
    } else {
      newData.push(step)
    }
  })

  return newData
}

function App() {
  const [gameData, setGameData] = useState([])
    
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const game = initGame('coronavirus-game', 40, 0, false, true)

    globalCollectData.onChangeData(data => {
      const dataPrepared = prepateDataToChart(data)

      // console.log(dataPrepared)
      setGameData(dataPrepared)
    })
  }, [])
  
  return (
    <div>
      <div id="coronavirus-game" className="App">
        
      </div>

      <div className="chart-wrapper">

        <ResponsiveContainer>
          <AreaChart
            height={250} 
            data={gameData}
          >
            {/* <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs> */}
            <XAxis 
              name="time" 
              dataKey="gameTime"
              type="number" 
              domain={[0, 40]}
              allowDecimals={false}
              // allowDataOverflow={true} 
              // interval={0}  
            />
            <YAxis domain={[0, 40]}  />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            {/* <Tooltip /> */}
            <Area type="monotone" dataKey="infected" stackId="1" stroke="#8884d8" fill="#8884d8" isAnimationActive={false} />
            {/* <Area type="monotone" dataKey="infected" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
            {/* <Area type="monotone" dataKey="recovered" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default App;
