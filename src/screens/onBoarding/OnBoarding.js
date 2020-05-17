import React, { useState }  from 'react'
import c from 'classnames'
import { SCREENS_IDS } from 'App'
import Carousel from 'components/carousel/Carousel'
import CarouselItem from 'components/carousel/CarouselItem'
import OnBoardingItem from './OnBoardingItem'
import OnBoardingItemIcons from './components/onBoardingItemIcons/OnBoardingItemIcons'
import OnBoardingItemBalls from './components/onBoardingItemBalls/OnBoardingItemBalls'
import OnBoardingItemArrows from './components/onBoardingItemArrows/OnBoardingItemArrows'
import styles from './OnBoarding.module.css'

function OnBorading({ setScreenActive }) {
  const idItems = ['1', '2', '3', '4', '5', '6', '7'] 
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
          <OnBoardingItem
            title="BONIFICACIONES"
            subTitle="Mascarilla"
            subTitleVariant="mask"
            text="Recógela para que puedas moverte libremente sin que las bolas infectadas te afecten. Tiene 1 solo uso."
            content={<OnBoardingItemIcons active="mask" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[4]}>
          <OnBoardingItem
            title="BONIFICACIONES"
            subTitle="Kit Médico"
            subTitleVariant="medical"
            text="Recógelo y podrás curar a las bolas infectadas. Tiene 1 solo uso."
            content={<OnBoardingItemIcons active="medical" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[5]}>
          <OnBoardingItem
            title="BONIFICACIONES"
            subTitle="Ir a la compra"
            subTitleVariant="shop"
            text="Recógelo y sumarás una bonificación de 25 puntos, además por cada oleada que consigas superar sumará 5 puntos extra."
            content={<OnBoardingItemIcons active="shop" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

        <CarouselItem id={idItems[6]}>
          <OnBoardingItem
            title="BONIFICACIONES"
            subTitle="Pasear al perro"
            subTitleVariant="dog"
            text="Recógelo y sumarás una bonificación de 25 puntos, además por cada oleada que consigas superar sumará 5 puntos extra."
            content={<OnBoardingItemIcons active="dog" />}
            onNext={hanldeNext}
          />
        </CarouselItem>

      </Carousel>
      {/* <button onClick={hanldeBack}>Back</button>
      <button onClick={hanldeNext}>Next</button> */}
    </div>
  );
}

export default React.memo(OnBorading)
