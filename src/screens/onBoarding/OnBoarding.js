import React, { useState }  from 'react'
import c from 'classnames'
import Carousel from 'components/carousel/Carousel'
import CarouselItem from 'components/carousel/CarouselItem'
import styles from './OnBoarding.module.css'

function OnBorading() {
  const idItems = ['1', '2', '3'] 
  const [indexActive, setIndexActive] = useState(0)

  const hanldeNext = () => {
    if (idItems.length - 1 === indexActive) {
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
    <>
      <Carousel className={styles.onBorading} active={active}>
        <CarouselItem id={idItems[0]}>
          Hola mundo cruel
        </CarouselItem>
        <CarouselItem id={idItems[1]}>
          Hola mundo cruel2
        </CarouselItem>
        <CarouselItem id={idItems[2]}>
          Hola mundo cruel3
        </CarouselItem>
      </Carousel>
      <button onClick={hanldeBack}>Back</button>
      <button onClick={hanldeNext}>Next</button>
    </>
  );
}

export default React.memo(OnBorading)
