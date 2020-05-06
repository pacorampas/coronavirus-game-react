/* eslint-disable no-undef */
import React, { useState } from 'react'
import HomeScreen from './screens/home/Home'
import GameScreen from './screens/game/Game'
import './App.css'

export const SCREENS_IDS = {
  home: 1,
  game: 2
}

function App() {
  const [screenActive, setScreenActive] = useState(SCREENS_IDS.home)

  const props = {
    setScreenActive
  }

  switch(screenActive) {
    case SCREENS_IDS.home:
      return <HomeScreen {...props} />
    case SCREENS_IDS.game:
      return <GameScreen {...props} />
    default:
      return <HomeScreen {...props} />
  }
}

export default React.memo(App)
