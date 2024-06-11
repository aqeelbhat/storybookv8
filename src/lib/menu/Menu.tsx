import React from 'react'
import { useState, useEffect, RefObject, useRef } from 'react'
import styles from './Menu.module.scss'

import { MenuProps } from './types'

type AnyEvent = MouseEvent | TouchEvent;

function Menu (props: MenuProps) {
  const [toggle, setToggle] = useState(false)
  const ref = useRef(null)

  function showHide () {
    setToggle(!toggle)
  }

  function handleClick (event: any) {
    props.getAction(event.target.id, event.target.innerHTML)
    setToggle(!toggle)
  }

  function useOnClickOutside<T extends HTMLElement = HTMLElement> (
    ref: RefObject<T>,
    handler: (event: AnyEvent) => void
  ) {
    useEffect(() => {
      const listener = (event: AnyEvent) => {
        const el = ref?.current

        if (!el || el.contains(event.target as Node)) {
          return
        }

        handler(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    }, [ref, handler])
  }

  useOnClickOutside(ref, showHide)

  return (
        <div className={styles.menu}>
            <button className={styles.menuCircleBtn} data-testid="menu-button" onClick={showHide}>
                <div
                    className={
                        toggle ? `${styles.menuCircleBtnDiv} ${styles.menuClicked}` : `${styles.menuCircleBtnDiv}`
                    }
                >
                    ...
                </div>
            </button>
            {toggle && (
                <div className={styles.menuBox} data-testid="menu-box" ref={ref}>
                    {props.menuList.map((items, index) => {
                      return (
                            <ul className={styles.menuBoxul} key={index}>
                                {items.map((subItems, index) => {
                                  return (
                                        <li
                                            key={index}
                                            className={styles.menuBoxulLi}
                                            data-testid={`menu-item-${subItems.id}`}
                                            id={subItems.id}
                                            onClick={handleClick}
                                        >
                                            {subItems.value}
                                        </li>
                                  )
                                })}
                            </ul>
                      )
                    })}
                </div>
            )}
        </div>
  )
}

export default Menu
