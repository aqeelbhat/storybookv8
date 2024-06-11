import React from 'react'
import styles from './styles.module.scss'
import { matchDecorator } from './util'

export function Linkify (props: { children: any }) {
    const componentDecorator = (decoratedHref: string, decoratedText: string, key: number) => {
        return (
            <a target="blank" href={decoratedHref} key={key} rel='noreferrer' className={styles.link}>
                {decoratedText}
            </a>
        )
    }
    function parseString(string: string): React.ReactNode | string {
        if (string === '') {
          return string;
        }
    
        const matches = matchDecorator(string);
        if (!matches) {
          return string;
        }
    
        const elements = [];
        let lastIndex = 0;
        matches.forEach((match, i) => {
          // Push preceding text if there is any
          if (match.index > lastIndex) {
            elements.push(string.substring(lastIndex, match.index));
          }
    
          const decoratedHref = match.url
          const decoratedText = match.text
          const decoratedComponent = componentDecorator(decoratedHref, decoratedText, i);
          elements.push(decoratedComponent);
    
          lastIndex = match.lastIndex;
        });
    
        // Push remaining text if there is any
        if (string.length > lastIndex) {
          elements.push(string.substring(lastIndex));
        }
    
        return (elements.length === 1) ? <div>{elements[0]}</div> : <div>{elements}</div>;
      }
    function parse(children: any, key: number = 0): React.ReactNode | string {
        if (typeof children === 'string') {
          return parseString(children);
        } else if (React.isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
          return React.cloneElement(children, {key: key}, parse((children.props as any).children))
        } else if (Array.isArray(children)) {
          return children.map((child, i) => parse(child, i));
        }
    
        return children;
    }
    return (
        <React.Fragment>
            {parse(props.children)}
        </React.Fragment>
    )
}