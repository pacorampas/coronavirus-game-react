import React, { useState }  from 'react'
import c from 'classnames'
import { SCREENS_IDS } from 'App'
import Carousel from 'components/carousel/Carousel'
import CarouselItem from 'components/carousel/CarouselItem'
import OnBoardingItem from './OnBoardingItem'
import OnBoardingItemIcons from './components/onBoardingItemIcons/OnBoardingItemIcons'
import OnBoardingItemBalls from './components/onBoardingItemBalls/OnBoardingItemBalls'
import OnBoardingItemArrows from './components/onBoardingItemArrows/OnBoardingItemArrows'
import OnBoardingItemSlides from './components/onBoardingItemSlides/OnBoardingItemSlides'
import MobileDetect from 'mobile-detect'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalPortraitToLandscape from 'components/modalPortraitToLandscape/ModalPortraitToLandscape'
import AppService from 'services/AppService'
import styles from './OnBoarding.module.css'

function OnBorading({ setScreenActive }) {
  const idItems = ['1', '2', '3', '4'] 
  const [indexActive, setIndexActive] = useState(0)

  const [showModalPortrait, setShowModalPortrait] = useState(false)
  const mobileDetect = new MobileDetect(navigator.userAgent)

  const hanldeNext = () => {
    AppService.setOnBoardingGameShowed(true)
    
    if (idItems.length - 1 === indexActive) {
      const screenWindth = window.innerWidth
      const screenHeight = window.innerHeight
      const isLandscape = screenWindth > screenHeight

      if (
        !isLandscape && 
        mobileDetect.mobile()
      ) {
        setShowModalPortrait(true)
      } else {
        setScreenActive(SCREENS_IDS.game)
      }
      return
    }
    
    setIndexActive(indexActive + 1)
  }

  const handleModalPortraitAccept = () => {
    setShowModalPortrait(false)
    setScreenActive(SCREENS_IDS.game)
  }

  const handleModalPortraitCancel = () => {
    setShowModalPortrait(false)
  }

  const hanldeBack = () => {
    if (0 === indexActive) {
      return
    }
    
    setIndexActive(indexActive - 1)
  }

  const active = idItems[indexActive]
  
  return (
    <div className={styles.onBoarding}>
      <Carousel className={styles.wrapper} active={active}>

        <CarouselItem id={idItems[0]}>
          <OnBoardingItem
            title="OBJETIVO DEL JUEGO"
            text="Esquiva a las bolas infectadas para conseguir sobrevivir a la pandemia."
            content={<OnBoardingItemBalls variant="infected" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[1]}>
          <OnBoardingItem
            title="MOVIMIENTO"
            text="Usa las flechas del teclado para esquivar las bolas infectadas."
            content={<OnBoardingItemArrows />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[2]}>
          <OnBoardingItem
            title="OLEADAS"
            text="Cuando todas las bolas se recuperen puede comenzar otra oleada. Sigue alerta."
            content={<OnBoardingItemBalls variant="recovered" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[3]}>
          <OnBoardingItemSlides onNext={hanldeNext} />
        </CarouselItem>

      </Carousel>
      {/* <button onClick={hanldeBack}>Back</button>
      <button onClick={hanldeNext}>Next</button> */}

      {showModalPortrait &&
        <ModalPortraitToLandscape 
          state={ANIMATE_STATES.entering} 
          onAccept={handleModalPortraitAccept} 
          onCancel={handleModalPortraitCancel} 
        />
      }
    </div>
  );
}

export default React.memo(OnBorading)
