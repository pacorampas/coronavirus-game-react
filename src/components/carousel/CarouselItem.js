import React from 'react'
import c from 'classnames'
import styles from './CarouselItem.module.css'

export const DISPLAY_NAME = 'CarouselItem'

function CarouselItem({ children, className, ...rest }) {

  return (
    <div 
      className={c(
        className,
        styles.carouselItem,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

CarouselItem.displayName = DISPLAY_NAME

export default React.memo(CarouselItem)
