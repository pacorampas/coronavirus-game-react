import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import Button from 'components/button/Button'
import styles from './OnBoardingReady.module.css'

function OnBoardingReady({ 
  className, 
  activeId,
  onPlay,
  ...rest
}) {

  const handleClickPlay = () => {
    onPlay && onPlay()
  }

  return (
    <CarouselItem
      className={c(className, styles.item)} 
      {...rest}
    >
      <h1 className={styles.title}>
        ¡YA ESTÁ TODO LISTO!
      </h1>
      <Button 
        className={c(styles.button)}
        variant="primary"
        onClick={handleClickPlay}
      >
        <IconPlay className={styles.icon} />JUGAR
      </Button>

    </CarouselItem>
  );
}

export default React.memo(OnBoardingReady)
