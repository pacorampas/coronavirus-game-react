

import React from 'react'
import c from 'classnames'
import styles from './CarouselIndicator.module.css'

const CarouselIndicator = ({ className, activeIndex, ids }) => {
  return <div className={c(className, styles.wrapper)}>
    {ids.map((id, index) => 
      <div 
        key={id}  
        className={c(styles.indicator, index === activeIndex && styles.active)} 
      />
    )}
  </div>
}

CarouselIndicator.defaultProps = {
  ids: []
}

export default React.memo(CarouselIndicator)
