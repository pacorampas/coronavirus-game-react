import React from 'react'
import c from 'classnames'
import styles from './Button.module.css'

function Button({ children, className, size, variant, smallPadding, ...rest }) {
  return (
    <button 
      className={c(
        className,
        styles.button,
        styles[variant],
        styles[size],
        smallPadding && styles.smallPadding
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default React.memo(Button)
