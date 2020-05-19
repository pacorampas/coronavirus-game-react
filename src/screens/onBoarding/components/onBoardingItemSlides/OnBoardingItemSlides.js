import React from 'react'
import c from 'classnames'
import OnBoradingItemIcons from '../onBoardingItemIcons/OnBoardingItemIcons'
import CarouselItem from 'components/carousel/CarouselItem'
import styles from './OnBoardingItemSlides.module.css'

function OnBoardingItemSlides({ 
  className,
  activeId,
  ...rest
}) {
  return (
    <CarouselItem
      className={c(className, styles.item)} 
      {...rest}
    >
      <div className={styles.titles}>
        <h1 className={styles.title}>
          BONIFICACIONES
        </h1>
      </div>
      <div className={styles.content}>
        <OnBoradingItemIcons actives={[activeId]} />
      </div>
      <div className={c(styles.slides, styles[`active${activeId}`])}>
       
        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['mask'])}>Mascarilla</h2>
          <p className={styles.text}>Recógela para que puedas moverte libremente sin que las bolas infectadas te afecten. Tiene 1 solo uso.</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['medical'])}>Kit Médico</h2>
          <p className={styles.text}>Recógelo y podrás curar a las bolas infectadas. Tiene 1 solo uso.</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['shop'])}>
              Ir a Comprar
          </h2>
          <p className={styles.text}>A pesar de la pandemia hay que hacer la compra, cuando veas este objeto recógelo y obten puntos.</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['dog'])}>
              Pasear al perro
          </h2>
          <p className={styles.text}>Tu mascota sigue necesitando cuidados. Al recogerlo obtendrás puntos, igual que al ir a la compra.</p>
        </div>
      </div>
    </CarouselItem>
  );
}

export default React.memo(OnBoardingItemSlides)
