import React from 'react'
import c from 'classnames'
import { ReactComponent as IconMask } from '../assets/icoMask.svg'
import { ReactComponent as IconMedicalKit } from '../assets/icoMedicalKit.svg'
import { ReactComponent as IconShop } from '../assets/icoShop.svg'
import { ReactComponent as IconDog } from '../assets/icoDog.svg'
import styles from './OnBoardingItemsIcons.module.css'

function OnBoardingItemsIcons({ className, active, ...rest }) {
  return (
    <div 
      className={c(className, styles.wrapper)}
      {...rest}
    >
      <IconMask className={c(styles.icon, active === 'mask' && styles.active)} />
      <IconMedicalKit className={c(styles.icon, active === 'medical' && styles.active)} />
      <IconShop className={c(styles.icon, active === 'shop' && styles.active)} />
      <IconDog className={c(styles.icon, active === 'dog' && styles.active)} />
    </div>
  )
}

export default React.memo(OnBoardingItemsIcons)
