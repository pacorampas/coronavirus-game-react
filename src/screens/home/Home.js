/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { SCREENS_IDS } from 'App'
import Button from 'components/button/Button'
import styles from './Home.module.css'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import AppService from 'services/AppService'
import MobileDetect from 'mobile-detect'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import CookiesMessage from './components/CookiesMessage'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import ModalPortraitToLandscape from 'components/modalPortraitToLandscape/ModalPortraitToLandscape'
import TranslationService from 'services/TranslationService'

function openFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen()
  } else if (document.body.mozRequestFullScreen) {
    /* Firefox */
    document.body.mozRequestFullScreen()
  } else if (document.body.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    document.body.webkitRequestFullscreen()
  } else if (document.body.msRequestFullscreen) {
    /* IE/Edge */
    document.body.msRequestFullscreen()
  }
}

function Home({ setScreenActive }) {
  const [showModalPortrait, setShowModalPortrait] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const mobileDetect = new MobileDetect(navigator.userAgent)

  useEffect(() => {
    AppService.getBestScore().then(score => {
      setBestScore(score)
    })
  }, [])

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
    mobileDetect.mobile() && openFullscreen()
    setScreenActive(SCREENS_IDS.onBorading, { showComplete: true })
  }

  const goToGame = () => {
    mobileDetect.mobile() && openFullscreen()
    if (AppService.onBoardingGameShowed) {
      AppService.logEvent('start', { 
        'event_category': 'game', 
        'event_label': 'home'
      })
      setScreenActive(SCREENS_IDS.game)
    } else {
      setScreenActive(SCREENS_IDS.onBorading, { showComplete: false })
    }
  }

  const handleModalPortraitAccept = () => {
    setShowModalPortrait(false)
    goToGame()
  }

  const handleModalPortraitCancel = () => {
    setShowModalPortrait(false)
  }
  
 
  return (
    <div className={styles.home}>
      <div className={styles.wrapper}>

        <h1 className={styles.coronaTime}>{TranslationService.t('home.name')}</h1>
        <div className={styles.bestPoints}>
          <p>{TranslationService.t('home.bestScore')}</p>
          <h2>{bestScore} {TranslationService.t('home.pts')}</h2>
        </div>
        <Button 
          className={styles.button}
          variant="primary"
          onClick={handleClickGame}
        >
          <IconPlay className={styles.icon} />{TranslationService.t('home.playNow')}
        </Button>
        <Button 
          className={styles.button}
          onClick={handleClickOnBoarding}
        >
          {TranslationService.t('home.howItWorks')}
        </Button>
        <CookiesMessage />
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
