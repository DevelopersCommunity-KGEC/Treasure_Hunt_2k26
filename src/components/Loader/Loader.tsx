import React from 'react'
import {HashLoader}  from 'react-spinners'
import styles from './style.module.scss';

const Loader = () => {
  return (
    <div className={styles.loader__container}>
        <HashLoader color='#E86A33' />
    </div>
  )
}

export default Loader