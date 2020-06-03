import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import twitterIcon from '@iconify/icons-logos/twitter'
import facebookIcon from '@iconify/icons-logos/facebook'
import telegramIcon from '@iconify/icons-logos/telegram'
import whatsappIcon from '@iconify/icons-logos/whatsapp'
import bxCopy from '@iconify/icons-bx/bx-copy'

import MobileDetect from 'mobile-detect'

import c from 'classnames'
import Dialog from 'components/dialog/Dialog'
import Button from 'components/button/Button'
import useAnimationEnd, { ANIMATE_STATES } from 'utils/useAnimationEnd'
import { ReactComponent as IconShare } from './assets/icn-share.svg'
import TranslateService from 'services/TranslationService'

import styles from './ShareButton.module.css'

function ShareButton({ ...rest }) {
  const [stateModal, setStateModal] = useState(ANIMATE_STATES.waitingToEnter)
  const [stateCopied, setStateCopied] = useState(ANIMATE_STATES.waitingToEnter)
  const copyTextRef = useRef()
  const timeoutId = useRef()
  const [refCopy, animationClassCopy, animationStateCopy] = useAnimationEnd({ state: stateCopied, styles, classPrefix: 'copied' })

  useEffect(() => {
    // eslint-disable-next-line default-case
    switch(animationStateCopy) {
      case ANIMATE_STATES.entered:
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }
        timeoutId.current = setTimeout(() => {
          setStateCopied(ANIMATE_STATES.leaving)
        }, 700)
        return
    }
  }, [animationStateCopy])

  const mobileDetect = new MobileDetect(navigator.userAgent)

  const handleClick = () => {
    setStateModal(ANIMATE_STATES.entering)
  }

  const handleClose = () => {
    setStateModal(ANIMATE_STATES.leaving)
  }


  const copyToClipboard = () => {
    const copyText = copyTextRef.current
    
    copyText.select()
    copyText.setSelectionRange(0, 99999) /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand('copy')
    setStateCopied(ANIMATE_STATES.entering)
  }

  const url = TranslateService.t('shareButton.url')
  const message = TranslateService.t('shareButton.message', {
    url,
    score: 100
  })
  const message2 = TranslateService.t('shareButton.message2', {
    score: 100
  })

  return (
    <>
      <Button onClick={handleClick} smallPadding {...rest}>
        <IconShare />
      </Button>
      <Dialog
        state={stateModal}
      >
        <div className={styles.content}>
          <div ref={refCopy} className={c(styles.copied, animationClassCopy)}>{TranslateService.t('shareButton.copied')}</div>
          <h1 className={styles.title}>{TranslateService.t('shareButton.title')}</h1>

          <div className={styles.icons}>
            <a href={`https://twitter.com/intent/tweet?url=${url}&text=${message2}`} target="_blank" rel="noopener noreferrer">
              <Icon className={styles.icon} width="64px" icon={twitterIcon} />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message2}`} target="_blank" rel="noopener noreferrer">
              <Icon className={styles.icon} width="64px" icon={facebookIcon} />
            </a>
            {mobileDetect.mobile() && 
              <a href={`whatsapp://send?text=${message}`} target="_blank" rel="noopener noreferrer">
                <Icon className={styles.icon} width="64px" icon={whatsappIcon} />
              </a>
            }
            <a href={`https://t.me/share/url?url=${url}&text=${message2}`} target="_blank" rel="noopener noreferrer">
              <Icon className={styles.icon} width="64px" icon={telegramIcon} />
            </a>
            <a onClick={copyToClipboard}>
              <Icon className={styles.icon} width="64px" icon={bxCopy} />
            </a>
          </div>

          <textarea className={c(styles.text, animationClassCopy)} ref={copyTextRef} readonly>{message}</textarea>

          <Button className={styles.button} onClick={handleClose}>{TranslateService.t('shareButton.close')}</Button>
        </div>
      </Dialog>
    </>
  );
}

export default React.memo(ShareButton)
