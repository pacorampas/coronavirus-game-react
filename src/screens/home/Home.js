/* eslint-disable no-undef */
import React from 'react'
import { SCREENS_IDS } from 'App'
import styles from './Home.module.css'

function Home({ setScreenActive }) {

  const handleClickGame = () => {
    setScreenActive(SCREENS_IDS.game)
  }
 
  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClickGame}>
        Play
      </button>
    </div>
  );
}

export default React.memo(Home)
