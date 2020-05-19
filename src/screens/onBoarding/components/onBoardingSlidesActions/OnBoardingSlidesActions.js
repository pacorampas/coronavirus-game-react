import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import MobileDetect from 'mobile-detect'
import styles from './OnBoardingSlidesActions.module.css'

function OnBoardingSlidesActions({ 
  className, 
  activeId,
  ...rest
}) {

  const mobileDetect = new MobileDetect(navigator.userAgent)

  return (
    <CarouselItem
      className={c(className, styles.item)} 
      {...rest}
    >
      <div className={styles.titles}>
        <h1 className={styles.title}>
          ACCIONES
        </h1>
      </div>
      <div className={styles.content}>
        <button className={c(styles.powerUp, 'power-up', activeId === 'sprint' && 'big')} />
        <button className={c(styles.powerUp, 'power-up', activeId === 'socialDistancing' && 'big')} />
      </div>
      <div className={c(styles.slides, styles[`active${activeId}`])}>
       
        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles.butonActionColor)}>Sprint</h2>
          {mobileDetect.mobile() ?
            <p className={styles.text}>Para sprintar pulsa este botón o haz un doble toque hacia una dirección. Depués no podrás usarlo por un tiempo.</p>
          : 
            <p className={styles.text}>Para sprintar haz un doble toque hacia una dirección. Depués no podrás usarlo por un tiempo.</p>
          }
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles.butonActionColor)}>Distancia social</h2>
          {mobileDetect.mobile() ?
            <p className={styles.text}>Al pulsarlo algunas de las bolas quedarán quietas. Úsalo con cabeza, puedes hacerlo solo una vez po oleada.</p>
          : 
            <p className={styles.text}>Usa la tecla E para parar algunas bolas. Solo un uso por oleada.</p>
        }
        </div>
      </div>
    </CarouselItem>
  );
}

export default React.memo(OnBoardingSlidesActions)
