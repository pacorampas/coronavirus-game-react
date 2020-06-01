import React from 'react'
import c from 'classnames'
import CarouselItem from 'components/carousel/CarouselItem'
import MobileDetect from 'mobile-detect'
import { ReactComponent as IconSprint } from '../assets/icoSprint.svg'
import { ReactComponent as IconConfination } from '../assets/icoConfination.svg'
import useOwnIdActive from '../../useOwnIdActive'
import TranslationsService from 'services/TranslationService'
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
          {TranslationsService.t('onBoradingItemSlidesActions.title')}
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
          <h2 className={c(styles.subTitle, styles.butonActionColor)}>{TranslationsService.t('onBoradingItemSlidesActions.sprint')}</h2>
          {mobileDetect.mobile() ?
            <p className={styles.text}>{TranslationsService.t('onBoradingItemSlidesActions.sprintTextMobile')}</p>
          : 
            <p className={styles.text}>{TranslationsService.t('onBoradingItemSlidesActions.sprintTextDesktop')}</p>
          }
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles.butonActionColor)}>{TranslationsService.t('onBoradingItemSlidesActions.socialDistancing')}</h2>
          {mobileDetect.mobile() ?
            <p className={styles.text}>{TranslationsService.t('onBoradingItemSlidesActions.socialDistancingMobile')}</p>
          : 
            <p className={styles.text}>{TranslationsService.t('onBoradingItemSlidesActions.socialDistancingDesktop')}</p>
        }
        </div>
      </div>
    </CarouselItem>
  );
}

export default React.memo(OnBoardingSlidesActions)
