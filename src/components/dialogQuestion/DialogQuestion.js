import React, { useState, useEffect } from 'react'
import c from 'classnames'
import Dialog from 'components/dialog/Dialog'
import { ANIMATE_STATES } from 'utils/useAnimationEnd'
import TranslateService from 'services/TranslationService'
import AppService from 'services/AppService'

import styles from './DialogQuestion.module.css'

function DialogQuestion({ state, question2, ...rest }) {
  const [stateModal, setStateModal] = useState(state)
  const [answered, setAnswered] = useState(0)

  useEffect(() => {
    setStateModal(state)
  }, [state])


  const handleClick = value => {
    const event = question2 ? 'difficulty2' : 'difficulty1'
    AppService.logEvent(event, {
      value
    })
    setAnswered(value)
    setTimeout(() => {
      setStateModal(ANIMATE_STATES.leaving)
    }, 2000)
  }


  return (
    <Dialog
      state={stateModal}
      {...rest}
    >
      <div className={styles.content}>
        
        {!question2 ?
          <>
            <h1 className={styles.title}>{TranslateService.t('dialogQuestion.title')}</h1>
            <p>{TranslateService.t('dialogQuestion.text')}</p>
          </>
        :
        <>
          <h1 className={styles.title}>{TranslateService.t('dialogQuestion.title2')}</h1>
          <p>{TranslateService.t('dialogQuestion.text2')}</p>
        </>
        }

        <div className={styles.items}>
          <div 
            onClick={() => handleClick(1)} 
            className={c(styles.item, 1 === answered && styles.itemActive)}
          >
              {TranslateService.t('dialogQuestion.option1')}
          </div>
          <div 
            onClick={() => handleClick(2)} 
            className={c(styles.item, 2 === answered && styles.itemActive)}

          >
            {TranslateService.t('dialogQuestion.option2')}
          </div>
          <div 
            onClick={() => handleClick(3)} 
            className={c(styles.item, 3 === answered && styles.itemActive)}

          >
            {TranslateService.t('dialogQuestion.option3')}
          </div>
          <div 
            onClick={() => handleClick(4)} 
            className={c(styles.item, 4 === answered && styles.itemActive)}

          >
            {TranslateService.t('dialogQuestion.option4')}
          </div>
          <div 
            onClick={() => handleClick(4)} 
            className={c(styles.item, 5 === answered && styles.itemActive)}

          >
            {TranslateService.t('dialogQuestion.option5')}
          </div>
        </div>
        {answered > 0 &&
          <div className={styles.thankWrapper}>
            <div className={styles.thank}>
              <span>{TranslateService.t('dialogQuestion.thanks')}</span>
            </div>
          </div>
        }
      </div>
    </Dialog>
  )
}

export default React.memo(DialogQuestion)
