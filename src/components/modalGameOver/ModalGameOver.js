import React, { useState } from 'react'
import Modal from 'components/modal/Modal'
import Carousel from 'components/carousel/Carousel'
import OnBoardingSlidesActions from 'screens/onBoarding/components/onBoardingSlidesActions/OnBoardingSlidesActions'
import OnBoardingItemSlides  from 'screens/onBoarding/components/onBoardingItemSlides/OnBoardingItemSlides'
import OnBoardingReady from 'screens/onBoarding/components/onBoardingReady/OnBoardingReady'
import ContentPoints from './ContentPoints'
import AppService from 'services/AppService'

import styles from './ModalGameOver.module.css'


function ModalGameOver({ state, newBest, points, bonusTime, onAccept, onCancel, ...rest }) {
  const [slideActive, setSlideActive] = useState('points')

  const handleOnChange = ({ activeId }) => {
    setSlideActive(activeId)
  }

  const showTip = newBest ? -1 : AppService.showTip()

  const handleOnPlay = () => {
    AppService.setOnBoardingGameShowed(showTip + 1)
    onAccept && onAccept()
  }

  const items = []

  // eslint-disable-next-line default-case
  switch(showTip) {
    case 1:
      items.push(
        <ContentPoints
          name="slide"
          key="points"
          id="points"
          showTip={!!String(showTip)}
          newBest={newBest} 
          points={points} 
          bonusTime={bonusTime} 
          onTip={() => {
            setSlideActive('sprint')
          }}
        />,
        <OnBoardingSlidesActions
          key="sprint"
          name="slide"
          id={['sprint', 'socialDistancing']} 
        />,
        <OnBoardingReady id="ready" name="slide" onPlay={handleOnPlay} />
      )
      break
    case 2:
      items.push(
        <ContentPoints
          name="slide"
          key="points"
          id="points"
          showTip={!!String(showTip)}
          newBest={newBest} 
          points={points} 
          bonusTime={bonusTime} 
          onTip={() => {
            setSlideActive('mask')
          }}
        />,
        <OnBoardingItemSlides
          key="mask"
          id={['mask', 'medical', 'shop', 'dog']} 
          name="slide" 
        />,
        <OnBoardingReady id="ready" name="slide" onPlay={handleOnPlay} />
      )
      break
    default:
      items.push(<ContentPoints
        key="points"
        name="slide"
        id="points"
        newBest={newBest} 
        points={points} 
        bonusTime={bonusTime} 
        onAccept={onAccept}
        onCancel={onCancel} 
      />)
  }

  return (
    <Modal state={state} {...rest}>
      <Carousel className={styles.wrapper} active={slideActive} onChange={handleOnChange}>
        {items}        
      </Carousel>
    </Modal>
  );
}

export default React.memo(ModalGameOver)
