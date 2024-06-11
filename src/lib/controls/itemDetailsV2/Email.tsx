/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from "react";
import { ItemDetailsEmailProps } from "./types";

export function ItemDetailsControlV2Email (props: ItemDetailsEmailProps) {
  return (
    <>
      {props.value?.items.length > 0 && props.value.items.map((item, itemIndex) =>
        <div style={{ maxWidth: '511px', width: '100%', marginTop: '9px' }} key={itemIndex}>
          <table className="formSection">
            <tbody>
              {item.name
                ? (<tr><td className="tableTitle typography6">Name: </td><td className='typography6' style={{ color: '#283041' }}>{item.name}</td></tr>)
                : ''}
              {item.description
                ? (<tr><td className="tableTitle typography6">Description: </td><td className='typography6' style={{ color: '#283041' }}>{item.description}</td></tr>)
                : ''}
              {item.quantity
                ? (<tr><td className="tableTitle typography6">Quantity: </td><td className='typography6' style={{ color: '#283041' }}>{item.quantity}</td></tr>)
                : ''}
              {item.price
                ? (<tr><td className="tableTitle typography6">Price: </td><td className='typography6' style={{ color: '#283041' }}>{item.price.currency} {item.price.amount}</td></tr>)
                : ''}
              {item.totalPrice
                ? (<tr><td className="tableTitle typography6">Amount: </td><td className='typography6' style={{ color: '#283041' }}> {item.totalPrice.currency} {item.totalPrice.amount}</td></tr>)
                : ''}
            </tbody>
          </table>
        </div>)}
    </>
  )
}
