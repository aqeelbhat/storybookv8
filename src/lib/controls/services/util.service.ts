import { ItemDetails } from '../../Types'

export function changeLineItemCurrency (lineItem: ItemDetails, newCurrency?: string): ItemDetails {
  return {
    ...lineItem,
    price: { amount: lineItem?.price?.amount, currency: newCurrency },
    tax: lineItem?.tax
      ? {
          ...lineItem?.tax,
          amount: { amount: lineItem?.tax?.amount?.amount, currency: newCurrency },
          items: lineItem?.tax?.items?.filter(item => !!item)?.map(item => {
            return {
              ...item,
              taxableAmount: { amount: item?.taxableAmount?.amount, currency: newCurrency },
              amount: { amount: item?.amount?.amount, currency: newCurrency }
            }
          })
        }
      : undefined,
    totalPrice: { amount: lineItem?.totalPrice?.amount, currency: newCurrency }
  }
}
