import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-feather'

import { Option } from './../../Types'
import { ProductItem } from './product-item.component'
import { getEmptyProductLine, Product, ProductLine } from '../types'
import { InputWrapper } from '../../Inputs/input.component'

import styles from './items-styles.module.scss'

interface ProductListProps {
  value: ProductLine[]
  label: string
  description?: string
  currency?: string
  billingOptions?: Option[]
  currencyOptions?: Option[]
  required?: boolean
  forceValidate?: boolean
  onChange?: (value: ProductLine[]) => void
  onCurrencyChange?: (currency: string) => void
  onProductSearch?: (query: string) => Promise<Array<Product>>
}

export function ProductList (props: ProductListProps) {
  const [productList, setProductList] = useState<Array<ProductLine>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceValidateOnAdd, setForceValidateOnAdd] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    const list = props.value || []
    setProductList(list)
  }, [props.value])

  useEffect(() => {
    if (props.required && productList.length < 1) {
      setError('Please add at least one product.')
    } else {
      setError(null)
    }
  }, [productList])

  function handleChange (value: ProductLine[]) {
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function triggerValidations () {
    setForceValidateOnAdd(true)
    setTimeout(() => {
      setForceValidateOnAdd(false)
    }, 1000)
  }

  function handleProductChange (index: number, fieldName: string, data: ProductLine) {
    const productListCopy = [ ...productList ]
    productListCopy[index] = data
    setProductList(productListCopy)
    handleChange(productListCopy)

    if (fieldName === 'currency' && props.onCurrencyChange) {
      props.onCurrencyChange(data.totalPrice.currency)
    }
  }

  function deleteProduct (index: number) {
    const productListCopy = [ ...productList ]
    productListCopy.splice(index, 1)
    setProductList(productListCopy)
    handleChange(productListCopy)
  }

  function addProduct () {
    const productListCopy = [ ...productList, getEmptyProductLine() ]
    setProductList(productListCopy)
    triggerValidations()
    handleChange(productListCopy)
  }

  function searchProduct (query: string) {
    if (props.onProductSearch) {
      return props.onProductSearch(query)
    } else {
      return Promise.resolve([])
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.productList}
      error={error}
    >
      <>
        {props.description &&
          <div className={styles.description}>{props.description}</div>}

        <div className={styles.header}>
          <div className={styles.name}>Product name</div>
          <div className={styles.qty}>Quantity</div>
          <div className={styles.desc}>Description</div>
          <div className={styles.price}>Total price</div>
          <div className={styles.delete}></div>
        </div>

        {productList.map((product, i) =>
          <ProductItem
            key={product.id}
            data={product}
            currency={props.currency}
            billingOptions={props.billingOptions}
            currencyOptions={props.currencyOptions}
            forceValidate={forceValidate || (forceValidateOnAdd && (i < (productList.length - 1)))}
            onChange={(fieldName, data) => handleProductChange(i, fieldName, data)}
            onDelete={() => deleteProduct(i)}
            onProductSearch={searchProduct}
          />
        )}

        <div className={styles.add} onClick={addProduct}>
          <div className={styles.icon}><PlusCircle size={28} color="#D6D6D6" /></div>
          <div className={styles.label}>Add product</div>
        </div>
      </>
    </InputWrapper>
  )
}
