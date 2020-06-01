import React from 'react'
import c from 'classnames'
import styles from './Button.module.css'

function Button({ children, className, size, variant, ...rest }) {
  return (
    <button 
      className={c(
        className,
        styles.button,
        styles[variant],
        styles[size]
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default React.memo(Button)
