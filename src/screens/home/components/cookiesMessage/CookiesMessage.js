/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import AppService from 'services/AppService'
import Button from 'components/button/Button'
import { ReactComponent as CookieImage } from './cookies-couple.svg'
import TranslateService from 'services/TranslationService'
import styles from './CookiesMessage.module.css'

function CookiesMessage() {
  const [showMessage, setShowMessage] = useState(false)
  
  useEffect(() => {
    if (!AppService.getCookiesAccepted()) {
      setShowMessage(true)
    }
  }, [])

  if (!showMessage) {
    return null
  }

  const handleAcceptCookies = () => {
    AppService.setCookiesAccepted()
    setShowMessage(false)
  }
 
  return (
    <div className={styles.wrapper}>
      <p>
        <div className={styles.cookieImgWrapper}>
          <CookieImage className={styles.cookieImg} />
        </div>
        <span dangerouslySetInnerHTML={{ __html: 
            TranslateService.t('cookiesMessage.message', { 
            linkFirebase: '<a href="https://firebase.google.com/" target="_blank">Firebase</a>',
            linkAnalytics: '<a href="https://marketingplatform.google.com/intl/es/about/analytics/" target="_blank">Google Analytics</a>',
            interpolation: { escapeValue: false }
          }) 
        }} />
      </p>
     
      <Button className={styles.button} variant="primary" size="tiny" onClick={handleAcceptCookies}>{TranslateService.t('cookiesMessage.accept')}</Button>
    </div>
  );
}

export default React.memo(CookiesMessage)
