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
import styles from './OnBoarding.module.css'

function OnBorading({ setScreenActive }) {
  const idItems = ['1', '2', '3', '4'] 
  const [indexActive, setIndexActive] = useState(0)

  const hanldeNext = () => {
    if (idItems.length - 1 === indexActive) {
      setScreenActive(SCREENS_IDS.game)
      return
    }
    
    setIndexActive(indexActive + 1)
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
            text="Esquiva a las bolas infectadas para conseguir sobrevivir a la epidemia."
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
    </div>
  );
}

export default React.memo(OnBorading)
