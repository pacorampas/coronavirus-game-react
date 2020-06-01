import React, { useState }  from 'react'
import c from 'classnames'
import { SCREENS_IDS } from 'App'
import Carousel from 'components/carousel/Carousel'
import CarouselItem from 'components/carousel/CarouselItem'
import OnBoardingItem from './OnBoardingItem'
import OnBoardingItemIcons from './components/onBoardingItemIcons/OnBoardingItemIcons'
import OnBoardingItemBalls from './components/onBoardingItemBalls/OnBoardingItemBalls'
import OnBoardingItemArrows from './components/onBoardingItemArrows/OnBoardingItemArrows'
import OnBoardingItemTouches from './components/onBoardingItemTouches/OnBoardingItemTouches'
import OnBoardingItemSlides from './components/onBoardingItemSlides/OnBoardingItemSlides'
import OnBoardingSlidesActions from './components/onBoardingSlidesActions/OnBoardingSlidesActions'
import OnBoardingWall from './components/onBoardingWall/OnBoardingWall'
import OnBoardingReady from './components/onBoardingReady/OnBoardingReady'
import CarouselIndicator from 'components/carousel/CarouselIndicator'
import MobileDetect from 'mobile-detect'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import ModalPortraitToLandscape from 'components/modalPortraitToLandscape/ModalPortraitToLandscape'

import styles from './OnBoarding.module.css'
import AppService from 'services/AppService'
import TranslationsService from 'services/TranslationService'

function openFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen()
  } else if (document.body.mozRequestFullScreen) {
    /* Firefox */
    document.body.mozRequestFullScreen()
  } else if (document.body.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    document.body.webkitRequestFullscreen()
  } else if (document.body.msRequestFullscreen) {
    /* IE/Edge */
    document.body.msRequestFullscreen()
  }
}

function OnBorading({ setScreenActive, showComplete }) {
  const [showModalPortrait, setShowModalPortrait] = useState(false)
  const mobileDetect = new MobileDetect(navigator.userAgent)


  const handleModalPortraitAccept = () => {
    setShowModalPortrait(false)
    setScreenActive(SCREENS_IDS.game)
  }

  const handleModalPortraitCancel = () => {
    setShowModalPortrait(false)
  }

  const handleOnPlay = () => {
    const screenWindth = window.innerWidth
    const screenHeight = window.innerHeight
    const isLandscape = screenWindth > screenHeight

    if (
      !isLandscape && 
      mobileDetect.mobile()
    ) {
      setShowModalPortrait(true)
    } else {
      AppService.logEvent('start', { 
        'event_category': 'game', 
        'event_label': 'onBoarding'
      })
      !showComplete && AppService.setOnBoardingGameShowed(1)
      mobileDetect.mobile() && openFullscreen()
      setScreenActive(SCREENS_IDS.game)
    }
  }

  const handleOnChange = ({ activeId }) => {
    AppService.logEvent('onBoarding', { 
      'event_category': 'onBoarding', 
      'event_label': 'onBoarding', 
      'value': activeId
    })
  }

  const slides = [
    <CarouselItem id="goal" name="slide">
      <OnBoardingItem
        title={TranslationsService.t('onBoarding.goal.title')}
        text={TranslationsService.t('onBoarding.goal.text')}
        content={<OnBoardingItemBalls variant="infected" />}
      />
    </CarouselItem>,
    (mobileDetect.mobile() ?
      <CarouselItem id="directions" name="slide">
        <OnBoardingItem
          title={TranslationsService.t('onBoarding.directions.mobile.title')}
          text={TranslationsService.t('onBoarding.directions.mobile.text')}
          content={<OnBoardingItemTouches />}

        />
      </CarouselItem>
      :
      <CarouselItem id="directions" name="slide">
        <OnBoardingItem
          title={TranslationsService.t('onBoarding.directions.desktop.title')}
          text={TranslationsService.t('onBoarding.directions.desktop.text')}
          content={<OnBoardingItemArrows />}

        />
      </CarouselItem>
    ),
    <CarouselItem id="waves" name="slide">
      <OnBoardingItem
        title={TranslationsService.t('onBoarding.waves.title')}
        text={TranslationsService.t('onBoarding.waves.text')}
        content={<OnBoardingItemBalls variant="recovered" />}
      />
    </CarouselItem>
  ]

  if (showComplete) {
    slides.push([
      <OnBoardingSlidesActions id={['sprint', 'socialDistancing']} name="slide" />,
      <OnBoardingItemSlides id={['mask', 'medical', 'shop', 'dog']} name="slide" />,
      <OnBoardingWall id="wall" name="slide" />
    ])
  }

  slides.push(<OnBoardingReady id="ready" name="slide" onPlay={handleOnPlay} />)
  
  return (
    <div className={styles.onBoarding}>
      <Carousel className={styles.wrapper} active="goal" onChange={handleOnChange}>

        <CarouselIndicator name="indicator" />
        {slides}

      </Carousel>

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
