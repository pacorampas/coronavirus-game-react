import React from 'react'
import c from 'classnames'
import OnBoradingItemIcons from '../onBoardingItemIcons/OnBoardingItemIcons'
import CarouselItem from 'components/carousel/CarouselItem'
import useOwnIdActive from '../../useOwnIdActive'
import TranslationsService from 'services/TranslationService'
import styles from './OnBoardingItemSlides.module.css'

function OnBoardingItemSlides({ 
  className,
  activeId,
  id,
  ...rest
}) {
  const ownIdActive = useOwnIdActive({ id, activeId })

  return (
    <CarouselItem
      className={c(className, styles.item)} 
      {...rest}
    >
      <div className={styles.titles}>
        <h1 className={styles.title}>
          {TranslationsService.t('onBoradingItemSlides.title')}
        </h1>
      </div>
      <div className={styles.content}>
        <OnBoradingItemIcons actives={[ownIdActive]} />
      </div>
      <div className={c(styles.slides, styles[`active${ownIdActive}`])}>
       
        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['mask'])}>{TranslationsService.t('onBoradingItemSlides.mask')}</h2>
          <p className={styles.text}>{TranslationsService.t('onBoradingItemSlides.maskText')}</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['medical'])}>{TranslationsService.t('onBoradingItemSlides.medicalKit')}</h2>
          <p className={styles.text}>{TranslationsService.t('onBoradingItemSlides.medicalKitText')}</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['shop'])}>
            {TranslationsService.t('onBoradingItemSlides.shop')}
          </h2>
          <p className={styles.text}>{TranslationsService.t('onBoradingItemSlides.shopText')}</p>
        </div>

        <div className={styles.slide}>
          <h2 className={c(styles.subTitle, styles['dog'])}>
            {TranslationsService.t('onBoradingItemSlides.dog')}
          </h2>
          <p className={styles.text}>{TranslationsService.t('onBoradingItemSlides.dogText')}</p>
        </div>
      </div>
    </CarouselItem>
  );
}

export default React.memo(OnBoardingItemSlides)
