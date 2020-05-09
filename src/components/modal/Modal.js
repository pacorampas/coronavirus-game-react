/* eslint-disable no-undef */
import React, { useEffect } from 'react'
import c from 'classnames'
import useAnimationEnd from 'utils/useAnimationEnd'
import styles from './Modal.module.css'

function Modal({ className, state, onStateChange, children }) {
  const [ref, animationClass, animationState] = useAnimationEnd({ state, styles, classPrefix: 'modal' })

  useEffect(() => {
    onStateChange && onStateChange(animationState)
  }, [animationState, onStateChange])

  return (
    <div 
      ref={ref} 
      className={c(
        className,
        styles.modal, 
        animationClass
      )}
    >
      {children}
    </div>
  );
}

export default React.memo(Modal)
