import React, { useEffect, useState, useCallback } from 'react'
import c from 'classnames'
import { DISPLAY_NAME as DISPLAY_NAME_CAROUSEL_ITEM } from './CarouselItem'
import useCarousel from './useCarousel'
import styles from './Carousel.module.css'

function Carousel({ children, className, active, ...rest }) {
  const [items] = useCarousel({ children, active })

  return (
    <div 
      className={c(
        className,
        styles.carousel,
      )}
      {...rest}
    >
      {items}
    </div>
  );
}

export default React.memo(Carousel)
