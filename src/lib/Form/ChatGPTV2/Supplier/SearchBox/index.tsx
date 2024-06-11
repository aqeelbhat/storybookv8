import React, { useEffect, useState } from "react"
import styles from './styles.module.scss'
import { OroButton } from "../../../../controls";
import { ArrowRightCircle, Search, X } from "react-feather";
import classNames from "classnames";
import Loader from './loader.png'

export function SearchBox (props: {
  showLoading: boolean
  showDelete: boolean
  placeholder: string
  title: string
  reset: boolean
  onSearch: (value) => void
  onDelete: () => void
}) {
  const [value, setValue] = useState('')

  function handleClick () {
    value && props.onSearch(value)
  }
  function handleDelete () {
    setValue('')
    props.onDelete()
  }
  function RenderIcon () {
    return props.showLoading
      ? <div className={classNames(styles.button, styles.loader)}>
        <OroButton type='link' icon={<img src={Loader} width="20" height="20" />} />
      </div>
      : props.showDelete
        ? <div className={classNames(styles.button, styles.delete)}>
          <OroButton type='link' onClick={handleDelete} icon={<X size="20" />} />
        </div>
        : <div className={classNames(styles.button, styles.go)}>
          <OroButton type='link' onClick={handleClick} icon={<ArrowRightCircle size="28" />} />
        </div>;
  }
  useEffect(() => {
    if (props.reset) {
      setValue('')
    }
  }, [props.reset])

  return <div className={styles.main}>
    <div className={styles.title}>{props.title}</div>
    <div className={styles.searchBox}>
      <div className={styles.searchLense}><Search size='20' /></div>
      <div className={styles.inputBox}>
        <input autoComplete="off" disabled={props.showLoading || props.showDelete} value={value} onChange={(e) => setValue(e.target.value)} placeholder={props.placeholder} /></div>
      <RenderIcon />
    </div></div>
}

export default SearchBox
