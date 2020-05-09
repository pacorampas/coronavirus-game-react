/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react'
import { SCREENS_IDS } from 'App'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import Chart from './Chart'
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
  const [exit, setExit] = useState(false)
  const [points, setPoints] = useState(0)

  const showModal = () => {
    setModalState(ANIMATE_STATES.entering)
  }

  const hideModal = () => {
    setModalState(ANIMATE_STATES.leaving)
  }

  const handleCancelModal = () => {
    hideModal()
    setExit(true)
  }

  const hanldeStateChange = state => {
    if (!exit) {
      return
    }
    // eslint-disable-next-line default-case
    switch(state) {
      case ANIMATE_STATES.left:
        setScreenActive(SCREENS_IDS.home)
        return
    }
  }

  const hanldeAcceptModal = () => {
    game.current.scene.getScenes(true)[0].scene.restart()
    hideModal()
  }
    
  useEffect(() => {
    const handleGameOver = ({ time }) => {
      setPoints(time * 7.683)
      showModal()
    }

    game.current = initGame('coronavirusGame', 40, 0, false, true, handleGameOver, GAME.size)

    return () => {
      game.current.destroy()
    }
  }, [])
  
  return (
    <div className={styles.game}>

      <div className={styles.wrapper}>
        
        <div id="coronavirusGame" />

        <ModalGameOver
          className={styles.modal}
          state={modalState} 
          points={points}
          onAccept={hanldeAcceptModal} 
          onCancel={handleCancelModal}
          onStateChange={hanldeStateChange}
        />
      </div>

      {/* <div className={styles.chartWrapper}>
        <Chart />
      </div> */}

    </div>
  );
}

export default React.memo(Game)
