import React from "react";
import { Label as LabelStrap } from 'reactstrap';
import styles from './atoms.module.scss'

export default function Title (props: { children: JSX.Element | string }) {
  return <LabelStrap className={styles.title}>{props.children}</LabelStrap>
}
