import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import styles from './OnBoardingWall.module.css'

function OnBoardingWall({ className, variant, ...rest }) {
  return (
    <CarouselItem 
      className={c(className, styles.item)}
      {...rest}
    > 

      <div className={c(styles.ball, styles.ball1, styles.infected )} />
      <div className={c(styles.ball, styles.ball2)} />
      <div className={c(styles.ball, styles.ball3)} />
      <div className={styles.wall} />
     
    </CarouselItem>
  )
}

export default React.memo(OnBoardingWall)
