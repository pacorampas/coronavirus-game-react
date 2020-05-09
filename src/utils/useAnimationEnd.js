import { useRef, useState, useEffect, useCallback } from 'react'

export const ANIMATE_STATES = {
  waitingToEnter: 1,
  entering: 2,
  entered: 3,
  leaving: 4,
  left: 5
}

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame
window.requestAnimationFrame = requestAnimationFrame

const useAnimationEnd = ({ onStateChange, state, metadata, styles, classPrefix }) => {
  const animateRef = useRef()
  const [stateInternal, setStateInternal] = useState(state ? state : ANIMATE_STATES.waitingToEnter)

  useEffect(() => {
    const stateTemp = state ? state : ANIMATE_STATES.waitingToEnter
    setStateInternal(stateTemp)
  }, [state])

  const handleStateChangeMemo = useCallback(
    event => {
      const handleStateChange = event => {
        const getNextState = state => {
          if (ANIMATE_STATES.entering === state) {
            setStateInternal(ANIMATE_STATES.entered)
            return ANIMATE_STATES.entered
          } else if (ANIMATE_STATES.leaving === state) {
        
            setStateInternal(ANIMATE_STATES.left)
            return ANIMATE_STATES.left
          }
        }

        if (animateRef.current !== event.target) {
          return
        }

        const nextState = getNextState(stateInternal)

        onStateChange &&
          onStateChange({ event, state: nextState, metadata })
      }

      return requestAnimationFrame(() => handleStateChange(event))
    },
    [stateInternal, onStateChange, metadata]
  )

  useEffect(() => {
    animateRef.current.addEventListener('animationend', handleStateChangeMemo)

    const selfCurrent = animateRef.current

    return () =>
      selfCurrent.removeEventListener('animationend', handleStateChangeMemo)
  }, [animateRef, handleStateChangeMemo])

  const getCSSClass = useCallback(() => {
    return styles && mapStateWithClassCSSModule({ state, styles, classPrefix })
  }, [state, styles, classPrefix])

  const animationClass = getCSSClass()

  return [
    animateRef, 
    animationClass,
    stateInternal
  ]
}

export default useAnimationEnd

export const mapStateWithClass = ({ state, classPrefix }) => {
  let classPrefixPar = classPrefix

  if (!classPrefixPar) {
    classPrefixPar = 'spark-animation'
  }

  switch (state) {
    case ANIMATE_STATES.waitingToEnter:
      return `${classPrefixPar}--waiting-to-enter`
    case ANIMATE_STATES.entering:
      return `${classPrefixPar}--entering`
    case ANIMATE_STATES.entered:
      return `${classPrefixPar}--entered`
    case ANIMATE_STATES.leaving:
      return `${classPrefixPar}--leaving`
    case ANIMATE_STATES.left:
      return `${classPrefixPar}--left`
    default:
      return classPrefixPar
  }
}

export const mapStateWithClassCSSModule = ({ state, styles, classPrefix }) => {
  if (!styles) {
    console.error('[mapStateWithClassCSSModule] you should pass an css module styles object')
    return
  }

  let classPrefixPar = classPrefix
  if (!classPrefixPar) {
    classPrefixPar = 'spark-animation'
  }
  switch (state) {
    case ANIMATE_STATES.waitingToEnter:
      return styles[`${classPrefixPar}--waiting-to-enter`]
    case ANIMATE_STATES.entering:
      return styles[`${classPrefixPar}--entering`]
    case ANIMATE_STATES.entered:
      return styles[`${classPrefixPar}--entered`]
    case ANIMATE_STATES.leaving:
      return styles[`${classPrefixPar}--leaving`]
    case ANIMATE_STATES.left:
      return styles[`${classPrefixPar}--left`]
    default:
      return classPrefixPar
  }
}
