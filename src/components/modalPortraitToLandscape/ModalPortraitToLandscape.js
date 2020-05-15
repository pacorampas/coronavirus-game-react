import React, { useState, useEffect } from 'react'
import c from 'classnames'
import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import { ReactComponent as IconPlay } from './iconPlay.svg'
import styles from './ModalPortraitToLandscape.module.css'


function ModalPortraitToLandscape({ state, onAccept, onCancel, ...rest }) {
  const [deviceOrientation, setDeviceOrientatio] = useState(0)

  useEffect(() => {
    const handleOrientationChange = () => {
      setDeviceOrientatio(window.orientation)
    }
    window.addEventListener('orientationchange', handleOrientationChange, false)
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange, false)
    }
  }, [])
  
  const hanldeClickRestart = () => {
    onAccept && onAccept()
  }

  const hanldeClickExit = () => {
    onCancel && onCancel()
  }

  const isLandscape = deviceOrientation === 90 || deviceOrientation === -90
 
  return (
    <Modal state={state} {...rest}>
      <div className={styles.wrapper}>
  
        
        <div className={styles.wrapperPoints}>

          <div className={styles.wrapperRecord}>
            {!isLandscape ? 
              <p className={styles.title}>Úsame en vertical</p> :
              <p className={styles.title}>Perfecto, ya puedes comenzar</p>
            }
          </div>

        </div>
        <div className={c(styles.buttons, styles.show)}>
          <Button 
            className={c(styles.button, !isLandscape && styles.hide)}
            variant="primary"
            onClick={hanldeClickRestart}
          >
            <IconPlay className={styles.icon} />JUGAR
          </Button>
          <Button 
            className={styles.button} 
            variant="negative"
            onClick={hanldeClickExit}
          >
            CANCELAR
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(ModalPortraitToLandscape)
