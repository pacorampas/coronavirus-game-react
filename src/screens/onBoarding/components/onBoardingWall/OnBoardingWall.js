import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import OnBoardingItem from '../../OnBoardingItem'
import TranslationsService from 'services/TranslationService'
import styles from './OnBoardingWall.module.css'

function OnBoardingWall({ className, variant, ...rest }) {

  const Content = () => <div className={styles.item}>
    <div className={c(styles.ball, styles.ball1, styles.infected )} />
    <div className={c(styles.ball, styles.ball2)} />
    <div className={c(styles.ball, styles.ball3)} />
    <div className={styles.wall} />
  </div>

  return (
    <CarouselItem {...rest}>
      <OnBoardingItem
        title={TranslationsService.t('onBoardingWall.title')}
        text={TranslationsService.t('onBoardingWall.text')}
        content={<Content />}
      />
    </CarouselItem>
  )
}

export default React.memo(OnBoardingWall)
