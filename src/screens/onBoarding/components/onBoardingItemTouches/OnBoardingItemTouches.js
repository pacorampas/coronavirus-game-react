import React from 'react'
import c from 'classnames'
import { ReactComponent as Arrows } from '../assets/iconArrows.svg'
import { ReactComponent as TouchesRight } from '../assets/touchesRight.svg'
import { ReactComponent as TouchesLeft } from '../assets/touchesLeft.svg'

import styles from './OnBoardingItemTouches.module.css'

function onBoardingItemTouches({ className, variant, ...rest }) {
  return (
    <div 
      className={c(className, styles.wrapper)}
      {...rest}
    > 
      <TouchesRight className={styles.touchesRight} />
      <Arrows />
      <TouchesLeft className={styles.touchesLeft} />
    </div>
  )
}

export default React.memo(onBoardingItemTouches)
