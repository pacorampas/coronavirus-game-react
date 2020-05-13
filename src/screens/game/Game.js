/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react'
import { SCREENS_IDS } from 'App'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import AppService from 'services/AppService'
import Chart from './Chart'
import { initGame } from 'game/game'
import styles from './Game.module.css'

const GAME = {
  size: {
    width: 1000,
    height: 600,
  }
}

function Game({ setScreenActive }) {
  const game = useRef()
  const [modalState, setModalState] = useState()
  const [showModalGameOver, setShowModalGameOver] = useState(false)
  const [exit, setExit] = useState(false)
  const [points, setPoints] = useState(0)
  const [bonusTime, setBonusTime] = useState(0)
  const [newBest, setNewBest] = useState(false)

  const showModal = () => {
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
      case ANIMATE_STATES.left:
        setShowModalGameOver(false)
        exit && setScreenActive(SCREENS_IDS.home)
        return
    }
  }

  const hanldeAcceptModal = () => {
    game.current.scene.getScenes(true)[0].scene.restart()
    hideModal()
  }
    
  useEffect(() => {
    const handleGameOver = ({ time, points }) => {
      const newBonusPoints = Math.round(time * 3.683)
      setPoints(points)
      setBonusTime(newBonusPoints)
      const newBest = AppService.setNewPuntation(newBonusPoints + points)
      setNewBest(newBest)
      showModal()
    }

    game.current = initGame('coronavirusGame', 35, 0, false, false, handleGameOver, GAME.size)

    return () => {
      game.current.destroy()
    }
  }, [])
  
  return (
    <div className={styles.game}>

      <div className={styles.wrapper}>
        
        <div id="coronavirusGame" />

        {showModalGameOver && 
          <ModalGameOver
            className={styles.modal}
            state={modalState} 
            points={points}
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
