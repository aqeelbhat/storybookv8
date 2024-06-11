
import React, { useEffect, useRef, useState } from 'react'
import menuStyle from './style.module.scss'
import { AlertCircle, Copy, CornerDownRight, Minimize2, Trash2 } from 'react-feather'
import { IInlineMenuProps, MenuActionType, IMenuProps } from './types'
import { OroTooltip } from '../../../Tooltip/tooltip.component'

import { createPortal } from 'react-dom';

export function BoxMenu (props: IMenuProps) {
  const rootNode = useRef<HTMLUListElement | null>(null)
  const [myWidth, setMyWidth] = useState<number>(0)
  function handleViewDetails (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.view, e)
  }
  function handleDuplicate (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.duplicate, e)
  }
  function handleDelete (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.delete, e)
  }
  function handleAddItem (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.addItem, e)
  }
  function handleAddSection (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.addSection, e)
  }
  useEffect(()=>{
    setMyWidth(rootNode?.current?.offsetWidth || 0)
  },[rootNode])

  const LEFT = props.X - myWidth
  const TOP = props.Y + 5

  return createPortal(<ul ref={rootNode} className={menuStyle.menu} style={{ top: (TOP) + 'px', left: (LEFT) + 'px' }}>
    {props.addItem && <li title={props.addItem} className={menuStyle.menuItem} onClick={handleAddItem} data-testid={`line-item-${props.id}-add-btn`}>
      <CornerDownRight size={18} color="var(--warm-neutral-shade-200)" />
      <span>{props.addItem}</span>
    </li>}
    {props.addSection && <li title={props.addItem} className={menuStyle.menuItem} onClick={handleAddSection} data-testid={`line-item-${props.id}-add-section`}>
      <CornerDownRight size={18} color="var(--warm-neutral-shade-200)" />
      <span>{props.addSection}</span>
    </li>}
    {(props.addItem || props.addSection) && <div className={menuStyle.seperator}/>}
    {props.view && <li title={props.view} className={menuStyle.menuItem} onClick={handleViewDetails} data-testid={`line-item-${props.id}-view-btn`}>
      <AlertCircle size={18} color="var(--warm-neutral-shade-200)" />
      <span>{props.view}</span>
    </li>}
    {props.duplicate && <li title={props.duplicate} className={menuStyle.menuItem} onClick={handleDuplicate} data-testid={`line-item-${props.id}-copy-btn`}>
      <Copy size={18} color="var(--warm-neutral-shade-200)" />
      <span>{props.duplicate}</span>
    </li>}
    {props.delete && <li title={props.delete} className={menuStyle.menuItem} onClick={handleDelete} data-testid={`line-item-${props.id}-delete-btn`}>
      <Trash2 size={18} color="var(--warm-neutral-shade-200)" />
      <span>{props.delete}</span>
    </li>}
  </ul>, document.body)
}

export function InlineMenu (props: IInlineMenuProps) {
  function handleCollapse (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.collapse, e)
  }
  function handleDuplicate (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.duplicate, e)
  }
  function handleDelete (e: React.MouseEvent<HTMLElement>) {
    props.onClick(MenuActionType.delete, e)
  }
  return <ul className={menuStyle.inlineMenu}>
    {props.delete &&
      <li className={menuStyle.inlineMenuItem} data-testid={`line-item-${props.id}-delete-btn`}>
        <OroTooltip title={props.delete} onClick={handleDelete}><Trash2 size={18} /></OroTooltip>
      </li>}
    {props.duplicate &&
      <li className={menuStyle.inlineMenuItem} data-testid={`line-item-${props.id}-copy-btn`}>
        <OroTooltip title={props.duplicate} onClick={handleDuplicate}><Copy size={18} /></OroTooltip>
      </li>}
    {props.collapse && <li className={menuStyle.inlineMenuItem} data-testid={`line-item-${props.id}-collapsed-btn`}>
      <OroTooltip title={props.collapse} onClick={handleCollapse} ><Minimize2 size={18} /></OroTooltip>
    </li>}
  </ul>
}
