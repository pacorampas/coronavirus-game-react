/* eslint-disable no-undef */
import React from 'react'
import { SCREENS_IDS } from 'App'
import Button from 'components/button/Button'
import styles from './Home.module.css'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import AppService from 'services/AppService'

import ModalGameOver from 'components/modalGameOver/ModalGameOver'

function Home({ setScreenActive }) {
  const handleClickGame = () => {
    setScreenActive(SCREENS_IDS.game)
  }

  let bestScore = AppService.getBestScore()
  bestScore = (bestScore && bestScore.points) || 0
 
  return (
    <div className={styles.home}>
      <div className={styles.wrapper}>

        <h1 className={styles.coronaTime}>CORONA-TIME</h1>
        <div className={styles.bestPoints}>
          <p>MEJOR PUNTUACIÓN</p>
          <h2>{bestScore} pts</h2>
        </div>
        <Button 
          className={styles.button}
          variant="primary"
          onClick={handleClickGame}
        >
          <IconPlay className={styles.icon} />JUGAR AHORA
        </Button>
        <Button 
          className={styles.button}
          onClick={() => alert('Esto está WIP, ;)')}
        >
          ¿CÓMO FUNCIONA?
        </Button>
        {/* <ModalGameOver state={2} points={3000} bonusTime={376} /> */}
      </div>
    </div>
  );
}

export default React.memo(Home)
