import { useRef, useEffect, useCallback } from 'react'

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

const useAnimationEnd = ({ onStateChange, state, metadata }) => {
  const animateRef = useRef()

  const handleStateChangeMemo = useCallback(
    event => {
      const handleStateChange = event => {
        const getNextState = state => {
          if (ANIMATE_STATES.entering === state) {
            return ANIMATE_STATES.entered
          } else if (ANIMATE_STATES.leaving === state) {
            return ANIMATE_STATES.left
          }
        }

        if (animateRef.current !== event.target) {
          return
        }

        onStateChange &&
          onStateChange({ event, state: getNextState(state), metadata })
      }

      return requestAnimationFrame(() => handleStateChange(event))
    },
    [state, onStateChange, metadata]
  )

  useEffect(() => {
    animateRef.current.addEventListener('animationend', handleStateChangeMemo)

    const selfCurrent = animateRef.current

    return () =>
      selfCurrent.removeEventListener('animationend', handleStateChangeMemo)
  }, [animateRef, handleStateChangeMemo])

  return animateRef
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
