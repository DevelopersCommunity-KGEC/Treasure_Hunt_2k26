import React from 'react'
import styles from './style.module.scss';
import { ChangeHandler, RefCallBack } from 'react-hook-form';

type InputProps = {
    type? : string,
    placeholder? : string,
    name? : string,
    onChange? : (event : React.ChangeEvent<HTMLInputElement>) => void,
    value? : string,
    required : boolean,
    disabled? : boolean | undefined,
}

const Input = (props : InputProps) => {
  return (
    <div className={styles.input__container}>
        <input
          {...props}
        />
    </div>
  )
}

export default Input