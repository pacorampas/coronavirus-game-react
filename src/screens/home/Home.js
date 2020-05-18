/* eslint-disable no-undef */
import React, { useState } from 'react'
import { SCREENS_IDS } from 'App'
import Button from 'components/button/Button'
import styles from './Home.module.css'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import AppService from 'services/AppService'
import MobileDetect from 'mobile-detect'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import ModalPortraitToLandscape from 'components/modalPortraitToLandscape/ModalPortraitToLandscape'

function Home({ setScreenActive }) {
  const [showModalPortrait, setShowModalPortrait] = useState(false)
  const mobileDetect = new MobileDetect(navigator.userAgent)

  const handleClickGame = () => {
    const screenWindth = window.innerWidth
    const screenHeight = window.innerHeight
    const isLandscape = screenWindth > screenHeight

    if (
      !isLandscape && 
      mobileDetect.mobile()
    ) {
      setShowModalPortrait(true)
    } else {
      goToGame()
    }
  }

  const handleClickOnBoarding = () => {
    setScreenActive(SCREENS_IDS.onBorading)
  }

  const goToGame = () => {
    console.log(AppService.onBoardingGameShowed)
    if (AppService.onBoardingGameShowed) {
      setScreenActive(SCREENS_IDS.game)
    } else {
      setScreenActive(SCREENS_IDS.onBorading)
    }
  }

  const handleModalPortraitAccept = () => {
    setShowModalPortrait(false)
    goToGame()
  }

  const handleModalPortraitCancel = () => {
    setShowModalPortrait(false)
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
          onClick={handleClickOnBoarding}
        >
          ¿CÓMO FUNCIONA?
        </Button>
        {showModalPortrait &&
          <ModalPortraitToLandscape 
            state={ANIMATE_STATES.entering} 
            onAccept={handleModalPortraitAccept} 
            onCancel={handleModalPortraitCancel} 
          />
        }
        {/* <ModalGameOver state={2} points={3000} bonusTime={376} newBest={false} /> */}
        {/* <ModalPortraitToLandscape state={2} /> */}
      </div>
    </div>
  );
}

export default React.memo(Home)
