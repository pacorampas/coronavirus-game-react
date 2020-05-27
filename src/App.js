/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import HomeScreen from './screens/home/Home'
import GameScreen from './screens/game/Game'
import OnBorading from './screens/onBoarding/OnBoarding'
import AppService from 'services/AppService'
import './App.css'

export const SCREENS_IDS = {
  home: 1,
  game: 2,
  onBorading: 3
}

function App() {
  const [init, setInit] = useState(false)
  const [screenActive, setScreenActive] = useState(SCREENS_IDS.home)
  const [restProps, setRestProps] = useState()
  
  useEffect(() => {
    AppService.signInAnonymously().then(() => {
      setInit(true)
    })
  }, [])
  
  const props = {
    setScreenActive: (screenId, props) => {
      setScreenActive(screenId)
      setRestProps(props || {})
    },
    ...restProps
  }

  if (!init) {
    return null
  }

  switch(screenActive) {
    case SCREENS_IDS.home:
      return <HomeScreen {...props} />
    case SCREENS_IDS.game:
      return <GameScreen {...props} />
    case SCREENS_IDS.onBorading:
      return <OnBorading {...props} />
    default:
      return <HomeScreen {...props} />
  }
}

export default React.memo(App)
