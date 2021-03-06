/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react'
import c from 'classnames'
import { SCREENS_IDS } from 'App'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import AppService from 'services/AppService'
import Chart from './Chart'
import { initGame } from 'game/game'
import styles from './Game.module.css'

import MobileDetect from 'mobile-detect'

const desktopGameSize = {
  width: 900,
  height: 600,
}

function Game({ setScreenActive }) {
  const game = useRef()
  const [modalState, setModalState] = useState()
  const [showModalGameOver, setShowModalGameOver] = useState(false)
  const [exit, setExit] = useState(false)
  const [points, setPoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [bonusTime, setBonusTime] = useState(0)
  const [newBest, setNewBest] = useState(false)
  const [gameSize, setGameSize] = useState(desktopGameSize)

  const mobileDetect = new MobileDetect(navigator.userAgent)

  const showModal = () => {
    game.current.scene.pause('default')
    setModalState(ANIMATE_STATES.entering)
    setShowModalGameOver(true)
  }

  const hideModal = () => {
    setModalState(ANIMATE_STATES.leaving)
  }

  const handleCancelModal = () => {
    hideModal()
    setExit(true)
  }

  const hanldeStateChange = state => {
    // eslint-disable-next-line default-case
    switch(state) {
      case ANIMATE_STATES.entered:
        game.current.scene.stop('default')
        return
      case ANIMATE_STATES.left:
        setShowModalGameOver(false)
        !exit && game.current.scene.start('default')
        exit && setScreenActive(SCREENS_IDS.home)
        return
    }
  }

  const hanldeAcceptModal = () => {
    AppService.logEvent('restart', { 
      'event_category': 'game', 
      'event_label': 'game'
    })
    hideModal()
  }
    
  useEffect(() => {
    const handleGameOver = async ({ time, points, wave }) => {
      const newBonusPoints = Math.round(time * 2.683)
      setBonusTime(newBonusPoints)
      const newBest = await AppService.setNewPuntation({ 
        totalPoints: newBonusPoints + points,
        points,
        time,
        wave
      })
      setPoints(points)
      setTotalPoints(newBonusPoints + points)
      AppService.logEvent('gameOver', { 
        'event_category': 'game', 
        'event_label': 'game',
        value: newBonusPoints + points
      })
      setNewBest(newBest)
      showModal()
    }
    
    const gameSize = mobileDetect.mobile() ? { 
      width: window.innerWidth, 
      height: window.innerHeight 
    } : desktopGameSize

    setGameSize(gameSize)


    const urlParams = new URLSearchParams(window.location.search)
    const ballsLenghtPar = urlParams.get('balls')

    const ballsLenght = mobileDetect.mobile() ? ballsLenghtPar || 10 : ballsLenghtPar || 18
    game.current = initGame('coronavirusGame', ballsLenght, 0, false, false, handleGameOver, gameSize)

    return () => {
      game.current.destroy()
    }
  }, [])

  return (
    <div className={c(styles.game, mobileDetect.mobile() && styles.isMobile)}>

      <div 
        style={{
          width: `${gameSize.width}px`,
          height: `${gameSize.height}px`
        }} 
        className={styles.wrapper}
      >
        
        <div id="coronavirusGame" />

        {showModalGameOver && 
          <ModalGameOver
            className={styles.modal}
            state={modalState} 
            points={points}
            totalPoints={totalPoints}
            bonusTime={bonusTime}
            newBest={newBest}
            onAccept={hanldeAcceptModal} 
            onCancel={handleCancelModal}
            onStateChange={hanldeStateChange}
          />
        }
      </div>

      {/* <div className={styles.chartWrapper}>
        <Chart />
      </div> */}

    </div>
  );
}

export default React.memo(Game)
