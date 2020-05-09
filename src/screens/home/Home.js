/* eslint-disable no-undef */
import React, { useState, useCallback } from 'react'
import { SCREENS_IDS } from 'App'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalGameOver from 'components/modalGameOver/ModalGameOver'
import styles from './Home.module.css'

function Home({ setScreenActive }) {

  const [modalState, setModalState] = useState()

  const handleClickGame = () => {
    setScreenActive(SCREENS_IDS.game)
  }

  const handleShowModal = () => {
    setModalState(ANIMATE_STATES.entering)
  }

  const handleHideModal = () => {
    setModalState(ANIMATE_STATES.leaving)
  }
 
  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClickGame}>
        Play
      </button>

      <button onClick={handleShowModal}>
        Show Modal
      </button>

      <button onClick={handleHideModal}>
        Hide Modal
      </button>

      {/* <ModalGameOver state={modalState} /> */}
    </div>
  );
}

export default React.memo(Home)
