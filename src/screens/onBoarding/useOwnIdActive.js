import React, { useEffect, useCallback, useRef } from 'react'

export default ({ id, activeId }) => {
  const lastActive = useRef(activeId)

  const ownId = useCallback(() => {
    return id.some(i => i === activeId)
  }, [activeId, id])

  useEffect(() => {
    if (!ownId()) {
      return
    }
    lastActive.current = activeId
  }, [activeId])

  return lastActive.current
}
