import React, { useEffect, useRef, useState } from 'react'
import c from 'classnames'
import { useCountUp } from 'react-countup'
import lottie from 'lottie-web'
import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import { ReactComponent as IconExit } from './iconExit.svg'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import styles from './ContentPoints.module.css'
import CarouselItem from 'components/carousel/CarouselItem'
import AppService from 'services/AppService'
import TranslationsService from 'services/TranslationService'



function ContentPoints({ state, newBest, points, bonusTime, showTip, onAccept, onCancel, onTip, ...rest }) {
  const confetiRef = useRef()
  const anim = useRef()
  const [showBonusTimeWrapper, setBonusTimeWrapper] = useState(false)
  const [showNewBestText, setShowNewBestText] = useState(false)
  const [showBonusTime, setShowBonusTime] = useState(false)
  const [showLastBest, setShowLastBest] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    AppService.getBestScore().then(score => {
      setBestScore(score)
    })
  }, [])

  const { countUp } = useCountUp({ end: bonusTime, delay: 3.5, duration: 2 })

  useEffect(() => {

    setTimeout(() => {
      setBonusTimeWrapper(true)
      setShowBonusTime(true)
    }, 1500)

    if (!newBest) {
      setTimeout(() => {
        setShowBonusTime(false)
        setTimeout(() => {
          setShowLastBest(true)
        }, 100)
      }, 6500)
      return
    }

    setShowButtons(false)
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

  const hanldeClickTip = () => {
    onTip && onTip()
  }
 
  return (
    <CarouselItem className={styles.wrapper} {...rest}>
    
      <h1 className={styles.title}>{TranslationsService.t('modalGameOver.contentPoints.title')}</h1>
      
      <div className={styles.wrapperPoints}>

        <div className={styles.wrapperRecord}>
          <p className={styles.text}>score</p>
          <p className={styles.points}>
            {(points + Number(countUp))} {TranslationsService.t('modalGameOver.contentPoints.pts')}
          </p>
        </div>

        <div className={c(styles.bonusTimeWrapper, showBonusTimeWrapper && styles.show)}>

          <div className={c(styles.bonusTimeWrapperAnim, showBonusTime && styles.show)}>
            <p className={styles.text}>{TranslationsService.t('modalGameOver.contentPoints.timeBonus')}</p>
            <p className={styles.bonusPoints}>+ {bonusTime - Number(countUp)}</p>
          </div>

          <div className={c(styles.bonusTimeWrapperAnim, showLastBest && styles.show)}>
            <p className={styles.text}>{TranslationsService.t('modalGameOver.contentPoints.bestScore')}</p>
            <p className={styles.bonusPoints}>{bestScore}</p>
          </div>

          <div className={c(styles.bonusTimeWrapperAnim, showNewBestText && styles.show)}>
            <p className={styles.bonusPoints}>{TranslationsService.t('modalGameOver.contentPoints.newRecord')}</p>
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
      {!showTip ?
        <div className={c(styles.buttons, showButtons && styles.show)}>
          <Button 
            className={styles.button}
            variant="primary"
            onClick={hanldeClickRestart}
          >
            <IconPlay className={styles.icon} />{TranslationsService.t('modalGameOver.contentPoints.restart')}
          </Button>
          <Button 
            className={styles.button} 
            variant="negative"
            onClick={hanldeClickExit}
          >
            <IconExit className={styles.icon} />{TranslationsService.t('modalGameOver.contentPoints.close')}
          </Button>
        </div>
        :
        <div className={c(styles.buttons, showButtons && styles.show)}>
          <Button 
            className={styles.button}
            variant="primary"
            onClick={hanldeClickTip}
          >
            <IconPlay className={styles.icon} />{TranslationsService.t('modalGameOver.contentPoints.tip')}
          </Button>
        </div>
      }
      <div className={styles.animation} ref={confetiRef} />
    </CarouselItem>
  )
}

export default React.memo(ContentPoints)
