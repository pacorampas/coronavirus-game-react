/* eslint-disable no-undef */
import React, { useEffect } from 'react'
import c from 'classnames'
import useAnimationEnd from 'utils/useAnimationEnd'
import styles from './Dialog.module.css'

function Dialog({ className, state, onStateChange, children }) {
  const [refWrapper, animationClassWrapper] = useAnimationEnd({ state, styles, classPrefix: 'wrapper' })

  const [ref, animationClass, animationState] = useAnimationEnd({ state, styles, classPrefix: 'dialog' })

  useEffect(() => {
    onStateChange && onStateChange(animationState)
  }, [animationState, onStateChange])

  return (
    <div 
      ref={refWrapper}
      className={c(
        className,
        styles.wrapper,
        animationClassWrapper
      )}
    > 
      <div />
      <div 
        ref={ref} 
        className={c(
          className,
          styles.dialog, 
          animationClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default React.memo(Dialog)
