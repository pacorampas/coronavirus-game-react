/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import AppService from 'services/AppService'
import Button from 'components/button/Button'
import { ReactComponent as CookieImage } from './cookies-couple.svg'
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
        <span>
          Usamos cookies de dos servicios de terceros que usamos para mejorar la experiencia para el usuario. Si quieres saber más sobre ellso visita: <a href="https://firebase.google.com/" target="_blank">Firebase</a> y <a href="https://marketingplatform.google.com/intl/es/about/analytics/" target="_blank">Google Analytics</a>   
        </span>
      </p>
     
      <Button className={styles.button} variant="primary" size="tiny" onClick={handleAcceptCookies}>Entendido</Button>
    </div>
  );
}

export default React.memo(CookiesMessage)
