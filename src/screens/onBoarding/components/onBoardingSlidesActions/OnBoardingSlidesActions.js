import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import MobileDetect from 'mobile-detect'
import { ReactComponent as IconSprint } from '../assets/icoSprint.svg'
import { ReactComponent as IconConfination } from '../assets/icoConfination.svg'
import useOwnIdActive from '../../useOwnIdActive'
import styles from './OnBoardingSlidesActions.module.css'

function OnBoardingSlidesActions({ 
  className, 
  activeId,
  id,
  ...rest
}) {

  const ownIdActive = useOwnIdActive({ id, activeId })

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
        <button className={c(styles.powerUp, 'power-up', ownIdActive === 'sprint' && 'big')}>
          <IconSprint className={styles.icon} />
        </button>
        <button className={c(styles.powerUp, 'power-up',  ownIdActive === 'socialDistancing' && 'big')}>
          <IconConfination className={styles.icon} />
        </button>
      </div>
      <div className={c(styles.slides, styles[`active${ownIdActive}`])}>
       
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
