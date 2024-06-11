import React from "react";
import { Label as LabelStrap } from 'reactstrap';
import styles from './atoms.module.scss'

export function ValueLabel (props: { children: JSX.Element | string }) {
  return <LabelStrap className={styles.label}>{props.children}</LabelStrap>
}

export default ValueLabel
