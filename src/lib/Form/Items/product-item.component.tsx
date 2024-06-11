import React, { useEffect, useMemo, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { ChevronDown, Trash2, X } from 'react-feather'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import classnames from 'classnames'

import { Option } from './../../Types'
import { Cost, MasterDataRoleObject, Product, ProductLine } from '../types'
import { MultiLevelSelect } from '../../MultiLevelSelect'
import { setOptionSelected } from '../../Inputs/utils.service'

import '../custom-material-UI.scss'
import styles from './items-styles.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import { DEFAULT_CURRENCY, debounce } from '../../util'

interface ProductItemProps {
  data: ProductLine
  currency?: string
  billingOptions?: Option[]
  currencyOptions?: Option[]
  forceValidate?: boolean
  onChange?: (fieldName: string, data: ProductLine) => void
  onDelete?: () => void
  onProductSearch?: (query: string) => Promise<Array<Product>>
}

export function ProductItem (props: ProductItemProps) {
  const currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: null, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
  })

  const [nameError, setNameError] = useState<string | null>(null)
  const [quantityError, setQuantityError] = useState<string | null>(null)

  const [product, setProduct] = useState<Product>()
  const [productName, setProductName] = useState<string>('')
  const [productOptions, setProductOptions] = useState<Array<Product>>([])
  const [quantity, setQuantity] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<Cost>({ amount: '', currency: '' })
  const [currencyOptions, setCurrencyOptions] = useState<Array<Option>>([])

  function validateProduct () {
    setNameError(!(product && product.name) && !productName ? 'Product is required' : null)
    setQuantityError(!quantity ? 'Quantity is required' : null)
  }

  useEffect(() => {
    setProduct(props.data?.product || undefined)
    setQuantity(props.data?.quantity || '')
    setDescription(props.data?.description || '')
    setTotalPrice({ amount: props.data?.totalPrice?.amount, currency: props.data?.totalPrice?.currency || DEFAULT_CURRENCY })
  }, [props.data])

  useEffect(() => {
    // set 'props.currency' or 'props.data.totalPrice.currency' selected by default
    const optionsCopy = JSON.parse(JSON.stringify(props.currencyOptions || []))
    setOptionSelected(optionsCopy, [props.currency || props.data.totalPrice?.currency])
    setCurrencyOptions(optionsCopy)
    setTotalPrice({ amount: props.data?.totalPrice?.amount, currency: props.currency || props.data.totalPrice?.currency || DEFAULT_CURRENCY})
  }, [props.currencyOptions, props.data, props.currency])

  useEffect(() => {
    if (props.forceValidate) {
      validateProduct()
    }
  }, [props.forceValidate])

  function getProductData (): ProductLine {
    return {
      id: props.data.id,
      product: product || (productName ? { name: productName } : undefined),
      plan: props.data?.plan,
      unit: props.data?.unit,
      term: props.data?.term,
      quantity,
      description,
      totalPrice,
      billing: props.data?.billing
    }
  }

  function getProductDataWithUpdatedValue (fieldName: string, newValue: string | Option | Product | Cost): ProductLine {
    const productData = JSON.parse(JSON.stringify(getProductData())) as ProductLine

    switch (fieldName) {
      case 'product':
        productData.product = newValue as Product
        break
      case 'quantity':
        productData.quantity = newValue as string
        break
      case 'description':
        productData.description = newValue as string
        break
      case 'totalPrice':
        productData.totalPrice = newValue as Cost
        break
      case 'currency':
        productData.totalPrice.currency = newValue as string
        break
    }

    return productData
  }

  function handleValidation(fieldName: string, newValue: string) {
    if (!newValue) {
      switch (fieldName) {
        case 'productName':
          (!product || !product.name) && setNameError('Product is required')
          break
        case 'quantity':
          setQuantityError('Quantity is required')
          break
      }
    } else {
      switch (fieldName) {
        case 'productName':
          setNameError(null)
          break
        case 'quantity':
          setQuantityError(null)
          break
      }
    }
  }

  function handleChange (fieldName: string, newValue: string | Option | Product | Cost) {
    if (props.onChange) {
      props.onChange(fieldName, getProductDataWithUpdatedValue(fieldName, newValue))
    }
  }

  function handleQuantityChange (event) {
    setQuantity(event.target.value)
    handleValidation('quantity', event.target.value)
    handleChange('quantity', event.target.value)
  }

  function handleDescriptionChange (event) {
    setDescription(event.target.value)
    handleChange('description', event.target.value)
  }

  function handlePriceChange (event) {
    const updatedPrice = { currency: totalPrice.currency || props.currency, amount: event.target.value }
    setTotalPrice(updatedPrice)
    handleChange('totalPrice', updatedPrice)
  }

  function handleCurrencyChange (options: Option[]) {
    const updatedCurrency = options[0] || null
    setTotalPrice({ ...totalPrice, currency: updatedCurrency.path })
    handleChange('currency', updatedCurrency.path)
  }

  function searchProducts (query: string) {
    if (props.onProductSearch && query) {
      props.onProductSearch(query)
        .then(products => {
          setProductOptions(products)
        })
        .catch(err => {
          console.log(err)
          setProductOptions([])
        })
    } else {
      setProductOptions([])
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedProductSearch = useMemo(() => debounce(searchProducts), [])

  function handleProductSelection (selectedProduct: Product) {
    handleChange('product', selectedProduct)
    setProduct(selectedProduct)
    handleValidation('productName', selectedProduct?.name)
  }

  return (
    <div className={styles.productItem}>
      <div className={styles.inputs}>
        <div className={styles.name} id="materialUIAutocomplete">
          { product?.image && <img src={product.image} className={styles.logo} />}
          <div className={styles.value}>
            <Autocomplete
              className={classnames(styles.freeSolo, { [styles.error]: nameError })}
              value={product || (productName ? { name: productName } : null)}
              freeSolo
              popupIcon={<ChevronDown size={16} color="#8c8c8c"></ChevronDown>}
              forcePopupIcon
              disableClearable={false}
              options={productOptions}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              clearOnEscape={true}
              clearIcon={<X color="#8c8c8c" size={16} className="clearText"></X>}
              onInputChange={(event, newInputValue) => {
                // Don't trigger search when:
                // 1. known product is selected (newInputValue = '[object Object]')
                // 2. When user hits enter/return after typing unknown product name (newInputValue = 'undefined')
                if (newInputValue !== '[object Object]' && newInputValue !== 'undefined') {
                  debouncedProductSearch(newInputValue)
                }
              }}
              onChange={(event: any, newValue: Product | null) => {
                // When user hits enter/return after typing unknown product name,
                // input string is passed in 'newValue'. We ignore this.
                if (typeof newValue !== 'string') {
                  setProductName('')
                  handleProductSelection(newValue)
                }
              }}
              getOptionLabel={(option) => (option as MasterDataRoleObject).name || option as unknown as string }
              renderOption={(props, option: Product | null) => {
                return (
                  <li {...props}>
                    {<img src={option?.image} style={{ height: '24px', marginRight: '12px'}} />}
                    {option?.name}
                  </li>
                )
              }}
              renderInput={(params) => (
                <TextField
                  className="oro-text-input widget-level"
                  placeholder=""
                  {...params}
                  onChange={(e) => {
                    setProductName(e.target.value)
                    handleValidation('productName', e.target.value)
                  }}
                  onBlur={(e) => {
                    handleValidation('productName', e.target.value)
                    handleChange('product', e.target.value ? { ...product, name: e.target.value } : null)
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className={styles.qty} id="materialUIAutocomplete">
          <input
            type="text"
            className={classnames({ [styles.invalid]: quantityError})}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityChange}
          />
        </div>

        <div className={styles.desc} id="materialUIAutocomplete">
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionChange}
          />
        </div>

        <div className={styles.price}>
          <MaskedInput
            mask={currencyMask}
            type="text"
            value={totalPrice?.amount}
            placeholder="0.00"
            onChange={handlePriceChange}
          />
          <MultiLevelSelect
            classnames={[ styles.multilevel, styles.unit ]}
            options={currencyOptions}
            placeholder=" "
            onChange={handleCurrencyChange}
          />
        </div>

        <div className={styles.delete}>
          <Trash2 onClick={props.onDelete} size={20} color="#ABABAB" />
        </div>
      </div>

      {(nameError || quantityError) && <div className={styles.error}><img src={AlertCircle} /> {nameError || quantityError}</div>}
    </div>
  )
}
