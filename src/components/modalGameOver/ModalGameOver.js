import React, { useEffect, useRef, useState } from 'react'
import c from 'classnames'
import { useCountUp } from 'react-countup'
import lottie from 'lottie-web'
import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import { ReactComponent as IconExit } from './iconExit.svg'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import styles from './ModalGameOver.module.css'
import AppService from 'services/AppService'


function ModalGameOver({ state, newBest, points, bonusTime, onAccept, onCancel, ...rest }) {
  const confetiRef = useRef()
  const anim = useRef()
  const [showBonusTimeWrapper, setBonusTimeWrapper] = useState(false)
  const [showNewBestText, setShowNewBestText] = useState(false)
  const [showBonusTime, setShowBonusTime] = useState(false)
  const [showLastBest, setShowLastBest] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  let bestScore = AppService.getBestScore() || 0

  const { countUp } = useCountUp({ end: bonusTime, delay: 3.5, duration: 2 })

  useEffect(() => {

    setTimeout(() => {
      setBonusTimeWrapper(true)
      setShowBonusTime(true)
    }, 1500)

    if (!newBest) {
      setTimeout(() => {
        setShowBonusTime(false)
        setShowButtons(true)
        setTimeout(() => {
          setShowLastBest(true)
        }, 100)
      }, 6500)
      return
    }

    anim.current = lottie.loadAnimation({
      container: confetiRef.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      // https://assets7.lottiefiles.com/packages/lf20_aEFaHc.json'
      path: `${process.env.PUBLIC_URL}/assets/confentiAnim.json`
    })

    setTimeout(() => {
      setBonusTimeWrapper(true)
      setShowBonusTime(false)
      
      setTimeout(() => {
        anim.current.goToAndPlay(0)
        setShowNewBestText(true)
      }, 100)

      setTimeout(() => {
        setShowButtons(true)
      }, 2000)
    }, 6500)

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

          <div className={styles.wrapperRecord}>
            <p className={styles.text}>Puntuación</p>
            <p className={styles.points}>
              {(points + Number(countUp))} pts
            </p>
          </div>

          <div className={c(styles.bonusTimeWrapper, showBonusTimeWrapper && styles.show)}>

            <div className={c(styles.bonusTimeWrapperAnim, showBonusTime && styles.show)}>
              <p className={styles.text}>Bonus de tiempo</p>
              <p className={styles.bonusPoints}>+ {bonusTime - Number(countUp)}</p>
            </div>

            <div className={c(styles.bonusTimeWrapperAnim, showLastBest && styles.show)}>
              <p className={styles.text}>Tu mejor puntuación</p>
              <p className={styles.bonusPoints}>{bestScore}</p>
            </div>

            <div className={c(styles.bonusTimeWrapperAnim, showNewBestText && styles.show)}>
              <p className={styles.bonusPoints}>¡NUEVO RECORD!</p>
            </div>
          </div>

          {/* <div className={c(styles.bonusTimeWrapper, showLastBest && styles.show)}>
            <p className={styles.text}>Tu mejor puntuación</p>
            <p className={styles.bonusPoints}>{bestScore}</p>
          </div> */}

          {/* <div className={c(styles.bonusTimeWrapper, showNewBestText && styles.show)}>
            <p className={styles.bonusPoints}>¡NUEVO RECORD!</p>
          </div> */}
        </div>
        <div className={c(styles.buttons, showButtons && styles.show)}>
          <Button 
            className={styles.button}
            variant="primary"
            onClick={hanldeClickRestart}
          >
            <IconPlay className={styles.icon} />REINTENTAR
          </Button>
          <Button 
            className={styles.button} 
            variant="negative"
            onClick={hanldeClickExit}
          >
            <IconExit className={styles.icon} />SALIR
          </Button>
        </div>
        <div className={styles.animation} ref={confetiRef} />
      </div>
    </Modal>
  );
}

export default React.memo(ModalGameOver)
