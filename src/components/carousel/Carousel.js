import React from 'react'
import c from 'classnames'
import useCarousel from './useCarousel'
import { ReactComponent as IconArrow } from './arrow.svg'
import styles from './Carousel.module.css'

function Carousel({ children, className, active, ...rest }) {
  let indicator 
  let ids = []

  React.Children.forEach(children, child => {
    // eslint-disable-next-line default-case
    switch(child.props.name) {
      case 'slide':
        ids.push(child.props.id)
        return
      case 'indicator':
        indicator = child
        return
    }
  })

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
      
      {indicator && 
        <div className={styles.indicatorWrapper}>
          {React.cloneElement(
            indicator,
            {
              ...indicator.props,
              activeId,
              activeIndex,
              ids
            }
          )}
        </div>
      }

      <div className={styles.slidesWrapper}>
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
      </div>

      {!backDisabled && 
        <div className={c(styles.back)} onClick={back}>
          <IconArrow className={c(styles.iconBack)} />
        </div>
      }
      {!nextDisabled && 
        <div className={c(styles.next)} onClick={next}>
          <IconArrow className={c(styles.iconNext)} />
        </div>
      }
    </div>
  );
}

export default React.memo(Carousel)
