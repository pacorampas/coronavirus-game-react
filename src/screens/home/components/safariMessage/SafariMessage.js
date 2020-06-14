/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { ReactComponent as CookieImage } from './cookies-couple.svg'
import TranslateService from 'services/TranslationService'
import MobileDetect from 'mobile-detect'
import styles from './SafariMessage.module.css'

function SafariMessage() {
  const [showMessage, setShowMessage] = useState(false)
  
  useEffect(() => {
    const mobileDetect = new MobileDetect(navigator.userAgent)
    setShowMessage(false)
    const mobile = mobileDetect.mobile()
    const agent = mobileDetect.userAgent()
    if (mobile.toLowerCase() === 'iphone' && agent.toLowerCase() !== 'safari' ) {
      setShowMessage(true)
    }
  }, [])

  
  if (!showMessage) {
    return null
  }
 
  return (
    <div className={styles.wrapper}>
      <p>
        {/* <div className={styles.cookieImgWrapper}>
          <CookieImage className={styles.cookieImg} />
        </div> */}
        <span dangerouslySetInnerHTML={{ __html: 
            TranslateService.t('safariMessage.message', { 
            interpolation: { escapeValue: false }
          }) 
        }} />
      </p>     
    </div>
  );
}

export default React.memo(SafariMessage)
