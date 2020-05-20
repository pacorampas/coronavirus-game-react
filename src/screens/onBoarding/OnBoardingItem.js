import React from 'react'
import c from 'classnames'
import Button from 'components/button/Button'
import styles from './OnBoardingItem.module.css'

function OnBoradingItem({ 
  className, 
  title, 
  text, 
  subTitle, 
  subTitleVariant, 
  content,
  onNext,
  ...rest
}) {

  return (
    <div

      className={c(className, styles.item)} 
      {...rest}
    >
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{content}</div>
      {subTitle && <h2 className={c(styles.subTitle, styles[subTitleVariant])}>{subTitle}</h2>}
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default React.memo(OnBoradingItem)
