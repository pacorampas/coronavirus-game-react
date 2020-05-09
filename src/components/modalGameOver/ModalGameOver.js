import React, { useEffect, useRef, useState } from 'react'
import { useCountUp } from 'react-countup'
import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import styles from './ModalGameOver.module.css'
import lottie from 'lottie-web'

function ModalGameOver({ state, newBest, points, bonusTime, onAccept, onCancel, ...rest }) {
  const confetiRef = useRef()
  const anim = useRef()
  const [showNewBestText, setShowNewBestText] = useState(false)

  const { countUp } = useCountUp({ end: bonusTime, delay: 1, duration: 5 })

  useEffect(() => {
    if (!newBest) {
      return
    }

    anim.current = lottie.loadAnimation({
      container: confetiRef.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'https://assets7.lottiefiles.com/packages/lf20_aEFaHc.json'
    })

    setTimeout(() => {
      anim.current.goToAndPlay(0)
      setShowNewBestText(true)
    }, 4000)

  }, [])
  
  const hanldeClickRestart = () => {
    onAccept && onAccept()
  }

  const hanldeClickExit = () => {
    onCancel && onCancel()
  }
 
  return (
    <Modal state={state} {...rest}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>¡SE ACABÓ!</h1>
        
        <div className={styles.wrapperPoints}>
          {showNewBestText ? 
            <p className={styles.text}>¡Nuevo record personal!</p> :
            <p className={styles.text}>Tu puntuación</p>
          }
          
          <p className={styles.points}>
            {(points + Number(countUp))} pts
          </p>

          <p className={styles.text}>Bonus de tiempo</p>
          <p className={styles.bonusPoints}>+ {bonusTime - Number(countUp)}</p>
        </div>
        <div className={styles.buttons}>
          <Button 
            className={styles.button}
            onClick={hanldeClickRestart}
          >
            REINTENTAR
          </Button>
          <Button 
            className={styles.button} 
            variant="negative"
            onClick={hanldeClickExit}
          >
            SALIR
          </Button>
        </div>
        <div className={styles.animation} ref={confetiRef} />
      </div>
    </Modal>
  );
}

export default React.memo(ModalGameOver)
