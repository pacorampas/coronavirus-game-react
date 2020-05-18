import React, { useState } from 'react'
import c from 'classnames'
import OnBoradingItemIcons from '../onBoardingItemIcons/OnBoardingItemIcons'
import Button from 'components/button/Button'
import styles from './OnBoardingItemSlides.module.css'

function OnBoardingItemSlides({ 
  className, 
  title, 
  text, 
  subTitle, 
  subTitleVariant, 
  content,
  onNext,
  ...rest
}) {

  const [active, setActive] = useState(1)

  const mapActiveWithIcon = {
    1: ['mask'],
    2: ['medical'],
    3: ['shop', 'dog']
  }

  const handleNext = () => {
    if (active === 3) {
      onNext && onNext()
      return
    }

    setActive(active + 1)
  }

  return (
    <div

      className={c(className, styles.item)} 
      {...rest}
    >
      <div className={styles.titles}>
        <h1 className={styles.title}>
          BONIFICACIONES
        </h1>
      </div>
      <div className={styles.content}>
        <OnBoradingItemIcons actives={mapActiveWithIcon[active]} />
      </div>
      <div className={c(styles.slides, styles[`active${active}`])}>
       
        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['mask'])}>Mascarilla</h2>
          <p className={styles.text}>Recógela para que puedas moverte libremente sin que las bolas infectadas te afecten. Tiene 1 solo uso.</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['medical'])}>Kit Médico</h2>
          <p className={styles.text}>"Recógelo y podrás curar a las bolas infectadas. Tiene 1 solo uso.</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle)}>
            <span className={c(styles.shop)}>
              Comprar
            </span> o{' '}
            <span className={c(styles.dog)}>
              pasear al perro
            </span>
          </h2>
          <p className={styles.text}>Recógelo y sumarás puntos, en cada oleada el valor se incrementa. ¡No los dejes escapar!</p>
        </div>

        {/* <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['dog'])}>Pasear al perro</h2>
          <p className={styles.text}>Recógelo y sumarás puntos, en cada oleada el valor se incrementa. ¡No los dejes escapar!</p>
        </div> */}

      </div>
      <Button variant="primary" onClick={handleNext}>Next</Button>
    </div>
  );
}

export default React.memo(OnBoardingItemSlides)
