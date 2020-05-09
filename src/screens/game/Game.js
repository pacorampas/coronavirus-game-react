/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
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

function Game() {
  const game = useRef()
  const [modalState, setModalState] = useState()

  const showModal = () => {
    setModalState(ANIMATE_STATES.entering)
  }

  const hideModal = () => {
    setModalState(ANIMATE_STATES.leaving)
  }

  const hanldeAcceptModal = () => {
    console.log(game.current)
    game.current.scene.getScenes(true)[0].scene.restart()
    hideModal()
  }
    
  useEffect(() => {
    const handleGameOver = () => {
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
          onAccept={hanldeAcceptModal} 
          onCancel={hideModal} 
        />
      </div>

      {/* <div className={styles.chartWrapper}>
        <Chart />
      </div> */}

    </div>
  );
}

export default React.memo(Game)
