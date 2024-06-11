import React from "react";
import { Label as LabelStrap } from 'reactstrap';
import styles from './atoms.module.scss'

export default function Value (props: { children: JSX.Element | string }) {
  return <LabelStrap className={styles.value}>{props.children}</LabelStrap>
}
