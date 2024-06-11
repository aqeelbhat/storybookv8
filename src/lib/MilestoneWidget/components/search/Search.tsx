/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

 import React, { useEffect, useState } from 'react'
 import {
   Search as SearchIcon, X
 } from 'react-feather'
 
 import './search.css'
 
 function Search (props: {
    keyword?: string,
    placeholder?: string,
    boxed?: boolean,
    autoFocus?: boolean
    onInputChange?: (text: string) => void,
    onSubmit?: (input: string) => void
  }) {
   const [inputValue, setInputValue] = useState('')
 
   useEffect(() => {
     setInputValue(props.keyword || '')
   }, [props.keyword])
 
   const handleInputChange = (event) => {
     setInputValue(event.target.value)
     props.onInputChange && props.onInputChange(event.target.value)
   }
 
   const clearInput = (event) => {
     setInputValue('')
     props.onInputChange && props.onInputChange('')
     props.onSubmit && props.onSubmit('')
   }
 
   const handleKeyPress = (event) => {
     const keyCode = event.code || event.key
     if (keyCode === 'Enter' || keyCode === 'NumpadEnter') {
       // Enter pressed
       props.onSubmit && props.onSubmit(inputValue)
     }
   }
 
   return (
      <div className={`search-box ${props.boxed ? 'boxed' : ''}`}>
        <SearchIcon size={20} color={'var(--warm-neutral-shade-300)'} className='search-box-icon' />
        <input autoFocus={props.autoFocus} className={`search-box-input ${inputValue ? 'search-box-input-filled' : ''}`} type="text" value={inputValue} placeholder={props.placeholder || 'Search by name'} onChange={handleInputChange} onKeyPress={handleKeyPress} />
        { inputValue && <X className='search-box-clear' size={20} color="var(--warm-neutral-shade-300)" onClick={clearInput} />}
      </div>
   )
 }
 
 export default Search
 