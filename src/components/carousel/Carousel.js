import React from 'react'
import c from 'classnames'
import useCarousel from './useCarousel'
import styles from './Carousel.module.css'

function Carousel({ children, className, active, ...rest }) {
  let ids = []
  React.Children.forEach(children, child => ids.push(child.props.id))
  const idsFlatten = ids.reduce((total, currentValue) => {
    if (Array.isArray(currentValue)) {
      return [...total, ...currentValue]
    }
    return [...total, currentValue]
  }, [])

  const [activeId,, { next, nextDisabled }, { back, backDisabled }] = useCarousel({ 
    children, 
    activeId: active,
    slidesId: idsFlatten
  })

  const isActive = ({ id, activeId }) => {
    if (Array.isArray(id)) {
      return id.some(i => i === activeId)
    }
    return id === activeId
  }

  const getActiveIndex = activeId => 
    ids.findIndex(id => 
      isActive({ id, activeId })
    )
  
  const activeIndex = getActiveIndex(activeId)

  return (
    <div 
      className={c(
        className,
        styles.carousel,
      )}
      {...rest}
    >
      {React.Children.map(children, child => {
        const { props } = child

        const nextProps = {
          ...props,
          active: isActive({ id: props.id, activeId }),
          activeId,
          key: props.id,
          style: {
            ...props.style,
            transform: `translate3d(${activeIndex * -100}%, 0, 0)`
          }
        }

        return React.cloneElement(
          child,
          nextProps
        )
      })}

      {!backDisabled && <div className={c(styles.back)} onClick={back} />}
      {!nextDisabled && <div className={c(styles.next)} onClick={next} />}
    </div>
  );
}

export default React.memo(Carousel)
