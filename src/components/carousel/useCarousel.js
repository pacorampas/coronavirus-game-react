import React, { useEffect, useState, useCallback } from 'react'
import { DISPLAY_NAME as DISPLAY_NAME_CAROUSEL_ITEM } from './CarouselItem'

function useCarousel({ children, active }) {
  const [items, setItems] = useState([]) 

  const getActiveStyle = useCallback(({ items }) => {
    const indexActive = items.findIndex(childItem => childItem.props.id === active)

    return items.map(child => {
      const { props } = child

      const nextProps = {
        ...props,
        style: {
          ...props.style,
          transform: `translate3d(${indexActive * -100}%, 0, 0)`
        }
      }

      return React.cloneElement(
        child,
        nextProps
      )
    })
  }, [active])

  const handleChangeChildrens = useCallback(() => {
    const nextItems = React.Children.map(children, child => {

      if (child.type.type.displayName === DISPLAY_NAME_CAROUSEL_ITEM) {
        const hasId = child.props.id || child.props.id === 0
        if (!hasId) {
          console.error('[Carousel] CarouselItem not handled because not have id')
          return null
        }

        const childItem = items.find(item => item.props.id === child.props.id)
        
        let nextProps = childItem ? {
          ...childItem.props, 
          ...child.props
        } : child.props

        return React.cloneElement(
          child,
          { 
            ...nextProps,
            key: nextProps.id
          }
        )
      }
    })

    const nextItemWithStyles = getActiveStyle({ items: nextItems })
    setItems(nextItemWithStyles)

  }, [children, items])

  useEffect(() => {
    handleChangeChildrens()
  }, [children, active])

  return [items]
}

export default useCarousel
