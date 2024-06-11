import React from "react";
import { Label as LabelStrap } from 'reactstrap';
import styles from './atoms.module.scss'

export default function HelpText (props: { children: JSX.Element | string }) {
  return <LabelStrap className={styles.helptext}>{props.children}</LabelStrap>
}
