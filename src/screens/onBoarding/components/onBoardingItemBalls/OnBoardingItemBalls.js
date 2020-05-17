import React from 'react'
import c from 'classnames'
import styles from './OnBoardingItemBalls.module.css'

function OnBoardingItemBalls({ className, variant, ...rest }) {
  return (
    <div 
      className={c(className, styles.wrapper)}
      {...rest}
    > 
      <div className={c(styles.ball, variant && styles[variant])} />
      <div className={c(styles.ball, variant && styles[variant], styles.big)} />
      <div className={c(styles.ball, variant && styles[variant])} />
    </div>
  )
}

export default React.memo(OnBoardingItemBalls)
