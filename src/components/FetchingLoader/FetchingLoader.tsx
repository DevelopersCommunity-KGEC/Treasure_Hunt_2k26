import React from 'react'
import { PuffLoader } from 'react-spinners'

import styles from './style.module.scss';

const FetchingLoader = () => {
  return (
    <div className={styles.main__container}>
      <PuffLoader color="currentColor"
        className={`dark:text-primary_light text-primary_dark`} />
    </div>
  )
}

export default FetchingLoader;