import React from 'react'
import c from 'classnames'
import { ReactComponent as Arrows } from '../assets/arrows.svg'

import styles from './OnBoardingItemArrows.module.css'

function OnBoardingItemArrows({ className, variant, ...rest }) {
  return (
    <div 
      className={c(className, styles.wrapper)}
      {...rest}
    > 
      <Arrows className={styles.arrows} />
    </div>
  )
}

export default React.memo(OnBoardingItemArrows)
