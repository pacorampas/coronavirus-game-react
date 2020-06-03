import React, { useState, useEffect } from 'react'
import Modal from 'components/modal/Modal'
import Carousel from 'components/carousel/Carousel'
import OnBoardingSlidesActions from 'screens/onBoarding/components/onBoardingSlidesActions/OnBoardingSlidesActions'
import OnBoardingItemSlides  from 'screens/onBoarding/components/onBoardingItemSlides/OnBoardingItemSlides'
import OnBoardingWall from 'screens/onBoarding/components/onBoardingWall/OnBoardingWall'
import OnBoardingItem from 'screens/onBoarding/OnBoardingItem'
import CarouselItem from 'components/carousel/CarouselItem'
import OnBoardingReady from 'screens/onBoarding/components/onBoardingReady/OnBoardingReady'
import ContentPoints from './ContentPoints'
import AppService, { FIRST_QUESTION_COUNT, SECOND_QUESTION_COUNT } from 'services/AppService'
import ShareButton from 'components/shareButton/ShareButton'
import TranslationsService from 'services/TranslationService'
import DialogQuestion from 'components/dialogQuestion/DialogQuestion'


import styles from './ModalGameOver.module.css'


function ModalGameOver({ state, newBest, points, totalPoints, bonusTime, onAccept, onCancel, ...rest }) {
  const [slideActive, setSlideActive] = useState('points')
  const [countGames, setCountGames] = useState(0)

  useEffect(() => {
    const count = AppService.incrementCountGames()
    setCountGames(count)
  }, [])

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
    case 3:
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
            setSlideActive('wall')
          }}
        />,
        <OnBoardingWall id="wall" name="slide" />,
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
      <ShareButton className={styles.shareButton} score={totalPoints} />
      <Carousel className={styles.wrapper} active={slideActive} onChange={handleOnChange}>
        {items}        
      </Carousel>
      {console.log(countGames)}
      {countGames === FIRST_QUESTION_COUNT && <DialogQuestion state={2} />}
      {countGames === SECOND_QUESTION_COUNT && <DialogQuestion state={2} question2 />}
    </Modal>
  );
}

export default React.memo(ModalGameOver)
