import React from 'react'
import c from 'classnames'
import { ReactComponent as IconMask } from '../assets/icoMask.svg'
import { ReactComponent as IconMedicalKit } from '../assets/icoMedicalKit.svg'
import { ReactComponent as IconShop } from '../assets/icoShop.svg'
import { ReactComponent as IconDog } from '../assets/icoDog.svg'
import styles from './OnBoardingItemsIcons.module.css'

function OnBoardingItemsIcons({ className, actives, ...rest }) {
  const setActive = name => {
    return actives &&
      actives.some(n => n === name)
  }
  return (
    <div 
      className={c(className, styles.wrapper)}
      {...rest}
    >
      <IconMask className={c(styles.icon, setActive('mask') && styles.active)} />
      <IconMedicalKit className={c(styles.icon, setActive('medical') && styles.active)} />
      <IconShop className={c(styles.icon, setActive('shop') && styles.active)} />
      <IconDog className={c(styles.icon, setActive('dog') && styles.active)} />
    </div>
  )
}

export default React.memo(OnBoardingItemsIcons)
