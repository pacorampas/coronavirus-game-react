/* eslint-disable no-undef */
import React, { useEffect, useState, useCallback } from 'react'
import c from 'classnames'
import useAnimationEnd, { ANIMATE_STATES, mapStateWithClassCSSModule } from 'utils/useAnimationEnd'
import styles from './Modal.module.css'

function Modal({ state, onLeft, children }) {
  
  const ref = useAnimationEnd({ 
    onStateChange: ({ state }) => {
      if (ANIMATE_STATES.left === state) {
        onLeft && onLeft()
      }
    }, 
    state, 
    metadata: {}
  })

  return (
    <div 
      ref={ref} 
      className={c(
        styles.modal, 
        mapStateWithClassCSSModule({ state, styles, classPrefix: 'modal' })
      )}
    >
      {children}
    </div>
  );
}

export default React.memo(Modal)
