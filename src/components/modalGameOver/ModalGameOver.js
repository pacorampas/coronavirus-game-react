import React from 'react'
import Modal from 'components/modal/Modal'
import Button from 'components/button/Button'
import styles from './ModalGameOver.module.css'

function ModalGameOver({ state, onAccept, onCancel, ...rest }) {
  
  const hanldeClickRestart = () => {
    onAccept && onAccept()
  }

  const hanldeClickExit = () => {
    onCancel && onCancel()
  }
 
  return (
    <Modal state={state} {...rest}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>¡SE ACABÓ!</h1>
        <p className={styles.text}>Tu puntuación</p>
        <p className={styles.points}>3000 pts</p>
        <div className={styles.buttons}>
          <Button 
            className={styles.button}
            onClick={hanldeClickRestart}
          >
            REINTENTAR
          </Button>
          <Button 
            className={styles.button} 
            variant="negative"
            onClick={hanldeClickExit}
          >
            SALIR
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(ModalGameOver)
