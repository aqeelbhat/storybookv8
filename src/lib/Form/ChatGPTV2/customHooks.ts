import { useEffect, useState } from "react"
import { ChatGPTFormV2Props } from "./types"

import { Option, Radio, TypeAhead } from "../../Inputs";


export function useOptions (props: ChatGPTFormV2Props) {
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [intentsOptions, setIntentsOptions] = useState<Option[]>([])
  const [regionOptions, setRegionOptions] = useState<Option[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
  const [industryCodeOptions, setIndustryCodeOptions] = useState<Option[]>([])
  const [currenciesOptions, setCurrenciesOptions] = useState<Option[]>([])

  useEffect(() => {
    props.categoryOptions && setCategoryOptions(props.categoryOptions)
  }, [props.categoryOptions])

  useEffect(() => {
    props.intentsOptions && setIntentsOptions(props.intentsOptions)
  }, [props.intentsOptions])

  useEffect(() => {
    props.regionOptions && setRegionOptions(props.regionOptions)
  }, [props.regionOptions])

  useEffect(() => {
    props.departmentOptions && setDepartmentOptions(props.departmentOptions)
  }, [props.departmentOptions])

  useEffect(() => {
    props.industryCodes && setIndustryCodeOptions(props.industryCodes)
  }, [props.industryCodes])

  useEffect(() => {
    props.currencyOptions && setCurrenciesOptions(props.currencyOptions)
  }, [props.currencyOptions])

  return [categoryOptions,
    intentsOptions,
    regionOptions,
    departmentOptions,
    industryCodeOptions,
    currenciesOptions]
}

