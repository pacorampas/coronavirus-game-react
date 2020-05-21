import React, { useEffect, useState, useCallback } from 'react'

function useCarousel({ slidesId, activeId }) {
  const [idActiveInternal, setIdActiveInternal] = useState(activeId)
  const [indexActiveInternal, setIndexActiveInternal] = useState()
  const [nextDisabled, setNextDisabled] = useState(true)
  const [backDisabled, setBackDisabled] = useState(true)

  const getIndexItemById = useCallback(id => {
    const index = slidesId.findIndex(_id => _id === id)
    return index
  }, [slidesId])

  const handleClickBack = useCallback(() => {
    const index = getIndexItemById(idActiveInternal)
    if (index === 0) {
      return
    }
    
    const nextIndex = index - 1
    const nextActive = slidesId[nextIndex]
    setIdActiveInternal(nextActive)
  }, [idActiveInternal, slidesId, getIndexItemById])

  const handleClickNext = useCallback(() => {
    const index = getIndexItemById(idActiveInternal)

    if (index === slidesId.length - 1) {
      return
    }

    const nextIndex = index + 1
    const nextActive = slidesId[nextIndex]
    setIdActiveInternal(nextActive)
  }, [idActiveInternal, slidesId, getIndexItemById])

  useEffect(() => {
    setIdActiveInternal(activeId)
  }, [activeId])

  useEffect(() => {
    const indexActive = slidesId.findIndex(id => id === idActiveInternal)
    setIndexActiveInternal(indexActive)
    setNextDisabled(indexActive === slidesId.length - 1)
    setBackDisabled(indexActive === 0)
  }, [slidesId, idActiveInternal])

  return [
    idActiveInternal,
    indexActiveInternal, 
    {
      next: handleClickNext,
      nextDisabled
    }, {
      back: handleClickBack,
      backDisabled
    }
  ]
}

export default useCarousel
