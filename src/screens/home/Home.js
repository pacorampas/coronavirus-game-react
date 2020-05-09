/* eslint-disable no-undef */
import React from 'react'
import { SCREENS_IDS } from 'App'
import Button from 'components/button/Button'
import styles from './Home.module.css'

function Home({ setScreenActive }) {
  const handleClickGame = () => {
    setScreenActive(SCREENS_IDS.game)
  }
 
  return (
    <div>
      <h1>Home</h1>
      <Button onClick={handleClickGame}>
        PLAY
      </Button>
    </div>
  );
}

export default React.memo(Home)
