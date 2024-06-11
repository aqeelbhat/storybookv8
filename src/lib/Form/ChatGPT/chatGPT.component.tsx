import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, LinearProgress } from "@mui/material";
import { Sun, X, Zap } from "react-feather";
import { BotQuestionProps, ChatGPTFormData, ChatGPTFormProps, ChatGPTSuggestion, Intent, RequestBotTab, enumChapGPTRequestBotFields } from "./types";
import { Field } from "../types";
import { Option, Radio, TypeAhead } from "../../Inputs";
import { getFormFieldsMap, isArrayOfOptions, areOptionsSame, areObjectsSame, isRequired, isEmpty, isFieldDisabled, isFieldRequired, validateField, mapStringToOption } from "../util";
import Actions from '../../controls/actions';
import { buildRequestBotTabs, getMoneyFromSuggestion, mapChatGPTSuggestionToModal, mapSuggestedCategoryToOption } from "./util";
import { Currency, CustomFormData, Money, QuestionnaireId, Supplier } from "../..";

import { CategorySuggestion } from "./components/category-suggestion.component";
import { OroButton } from "../../controls";
import { ChatGPTReadOnlyForm } from "./chatGPT-readOnly.component";
import styles from './style.module.scss'
import GPTSuggestion from './../assets/gpt-suggestion.svg'
import GPTEnter from './../assets/gpt-enter.svg'
import GPTEmptyState from './../assets/gpt-empty-state.svg'
import { SupplierSuggestion } from "./components/supplier-suggestion.component";
import { getValueFromAmount } from "../../Inputs/utils.service";
import { DEFAULT_CURRENCY } from "../../util";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { getSessionLocale } from "../../sessionStorage";
import { CustomFormExtension } from "../../CustomFormDefinition/CustomFormExtension/Index";

export function RenderBotQuestion (props: BotQuestionProps) {
    const [tabs, setTabs] = useState<RequestBotTab[]>([])
    const [selectedTab, setSelectedTab] = useState<RequestBotTab>()
    const [suggestedCategories, setSuggestedCategories] = useState<Option[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Option[]>([])
    const [region, setRegion] = useState<Option>()
    const [chatBotFormData, setChatBotFormData] = useState<ChatGPTFormData>()
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier>()
    const [suggestedSuppliers, setSuggestedSuppliers] = useState<Supplier[]>([])
    const [estimatedSpend, setEstimatedSpend] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
    const [spend, setSpend] = useState<Option>()
    const [spendOption, setSpendOption] = useState<Option[]>([])

    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

    // function buildSpendOptions (suggestedAmount: string, fieldMap: { [key: string]: Field }) {
    //   const extractedAmount = suggestedAmount.match(/\d/g).join('')
    //   if (fieldMap['upperAmount'] && fieldMap['lowerAmount']) {
    //     if (Number(extractedAmount) >= fieldMap['lowerAmount'].intValue && Number(extractedAmount) <= fieldMap['upperAmount'].intValue) {
    //       setSpendOption([{
    //         id: 'between',
    //         displayName: `Between ${fieldMap['lowerAmount'].intValue} and ${fieldMap['upperAmount'].intValue}`,
    //         path: 'between'
    //       }])
    //     } else if (Number(extractedAmount) <= fieldMap['lowerAmount'].intValue) {
    //       setSpendOption([{
    //         id: 'lowerLessThan',
    //         displayName: `Less than ${fieldMap['lowerAmount'].intValue}`,
    //         path: 'lowerLessThan'
    //       }])
    //     } else if (Number(extractedAmount) >= fieldMap['uppperAmount'].intValue) {
    //       setSpendOption([{
    //         id: 'upperGreaterThan',
    //         displayName: `More than ${fieldMap['uppperAmount'].intValue}`,
    //         path: 'upperGreaterThan'
    //       }])
    //     }
    //   } else if (fieldMap['lowerAmount']) {
    //     setSpendOption([{
    //       id: 'lowerLessThan',
    //       displayName: `Less than ${fieldMap['lowerAmount'].intValue}`,
    //       path: 'lowerLessThan'
    //     }, {
    //       id: 'lowerGreaterThan',
    //       displayName: `More than ${fieldMap['lowerAmount'].intValue}`,
    //       path: 'lowerGreaterThan'
    //     }])
    //   } else if (fieldMap['upperAmount']) {
    //     setSpendOption([{
    //       id: 'upperLessThan',
    //       displayName: `Less than ${fieldMap['upperAmount'].intValue}`,
    //       path: 'upperLessThan'
    //     }, {
    //       id: 'uppperGreaterThan',
    //       displayName: `More than ${fieldMap['upperAmount'].intValue}`,
    //       path: 'uppperGreaterThan'
    //     }])
    //   }
    // }

    useEffect(() => {
      if (props.formData) {
        setSelectedCategories(props.formData?.categories)
        setSuggestedCategories(props.formData?.categories)
        setRegion(props.formData?.regions?.[0])
        setSelectedSupplier(props.formData?.selectedSuppliers?.[0])
        setEstimatedSpend(props.formData.amount)
        setChatBotFormData(props.formData)
        const questionTabs = buildRequestBotTabs(props.formData, t, props.suggestedSuppliers, props.isQuestionSkip)
        setTabs(questionTabs)
        if (questionTabs?.length) {
          const currentTab = questionTabs.find(tab => !tab.value && !tab.isSkip)
          setSelectedTab(currentTab)
        }
      }
      setSuggestedSuppliers(props.suggestedSuppliers || [])
    }, [props.formData, props.suggestedSuppliers])

    function handleCategorySelection (categories: Option[]) {
      setSelectedCategories(categories)
      setChatBotFormData({...chatBotFormData, categories: categories})
      setSelectedTab({...selectedTab, value: categories?.map(option => option.displayName).join(',')})
      setTabs(tabs.map(tab => {
        if (tab.id === enumChapGPTRequestBotFields.categories) {
          return {...tab, value: categories?.map(option => option.displayName).join(',')}
        } else {
          return tab
        }
      }))
    }

    function handleRegionSelection (value: Option) {
      setRegion(value)
      setChatBotFormData({...chatBotFormData, regions: value ? [value] : []})
      setSelectedTab({...selectedTab, value: value?.displayName || ''})
      setTabs(tabs.map(tab => {
        if (tab.id === enumChapGPTRequestBotFields.regions) {
          return {...tab, value: value?.displayName || ''}
        } else {
          return tab
        }
      }))
    }

    function handleSupplierSelection (value: Supplier) {
      setSelectedSupplier(value)
      setChatBotFormData({...chatBotFormData, selectedSuppliers: value ? [value] : []})
      setSelectedTab({...selectedTab, value: value?.supplierName || ''})
      setTabs(tabs.map(tab => {
        if (tab.id === enumChapGPTRequestBotFields.suppliers) {
          return {...tab, value: value?.supplierName || ''}
        } else {
          return tab
        }
      }))
    }

    function handleSpendChange (value: Money) {
      setEstimatedSpend(value)
      setChatBotFormData({...chatBotFormData, amount: value})
      setSelectedTab({...selectedTab, value: value?.amount ? `${value?.amount?.toLocaleString(getSessionLocale())} ${value?.currency || props.defaultCurrency || ''}` : ''})
      setTabs(tabs.map(tab => {
        if (tab.id === enumChapGPTRequestBotFields.amount) {
          return {...tab, value: value?.amount?.toLocaleString(getSessionLocale()) || ''}
        } else {
          return tab
        }
      }))
    }

    // function handleEstimateSpendChange (value: Option) {
    //   setSpend(value)
    //   const extractedAmount = props.gptResponse?.totalBudget?.match(/\d/g).join('')
    //   setChatBotFormData({...chatBotFormData,
    //     upperAmount: value.id === 'upperLessThan' || value.id === 'uppperGreaterThan' ? Number(extractedAmount) : props.fieldMap['upperAmount'].intValue,
    //     lowerAmount: value.id === 'lowerLessThan' || value.id === 'lowerGreaterThan' ? Number(extractedAmount) : props.fieldMap['lowerAmount'].intValue
    //   })
    // }

    function handleProceed () {
      if (props.onChange) {
        const nextTab = tabs.find(tab => !tab.value && !tab.isSkip)
        if (nextTab) {
          setSelectedTab(nextTab)
        } else {
          const supplierTab = tabs.find(tab => tab.id === enumChapGPTRequestBotFields.suppliers)
          props.onChange(chatBotFormData, supplierTab?.isSkip)
        }
      }
    }

    function handleSupplierSkip () {
      if (props.onChange) {
        const nextTab = tabs.find(tab => tab.id !== enumChapGPTRequestBotFields.suppliers && !tab.value)
        if (nextTab) {
          setSelectedTab(nextTab)
          setTabs(tabs.map(tab => {
            if (tab.id === enumChapGPTRequestBotFields.suppliers) {
              return {...tab, isSkip: true}
            } else {
              return tab
            }
          }))
        } else {
          props.onChange(chatBotFormData, true)
        }
      }
    }

    function handleTabClick (tab: RequestBotTab) {
      setSelectedTab(tab)
    }

    function handleOnClose () {
      setSelectedTab(null)
    }

    return (<div className={styles.requestBotForm}>
        <div className={styles.requestBotFormInfoBar}>
            <div className={styles.icon}>
                <img src={GPTSuggestion}/>
            </div>
            <div className={styles.helpText}>
              {t("--detailsTip--")}
            </div>
        </div>

        {tabs?.length > 0 && <div className={styles.tabContainer}>
          {props.gptResponse?.productName && <div className={styles.token}>
            <div className={styles.key}>{t("--product--")}:</div>
            <div className={styles.value}>{props.gptResponse?.productName}</div>
          </div>}
          {tabs.map((tab, index) => {
            return (<div key={index} className={`${styles.token} ${(tab?.id === selectedTab?.id) ? styles.selectedTab : ''}`} onClick={() => handleTabClick(tab)}>
              <div className={styles.key}>{tab.name}:</div>
              <div className={styles.value}>{tab.value || ''}</div>
            </div>)
          })}
        </div>}

        {selectedTab && <div className={styles.requestBotFormContainer}>
            {selectedTab.id === enumChapGPTRequestBotFields.categories && <>
              <div className={styles.questionContainer}>
                <CategorySuggestion
                  suggestedCategories={suggestedCategories}
                  categoryOptions={props.categoryOptions}
                  fetchChildren={props.fetchChildren}
                  onSearch={props.onSearch}
                  onChange={handleCategorySelection}
                  onProceed={handleProceed}
                  onClose={handleOnClose}/>
              </div>
            </>}
            {
              selectedTab.id === enumChapGPTRequestBotFields.regions && <>
                <div className={styles.requestBotFormHeaderContainer}>
                    <div className={styles.title}>
                        {t("--businessRegion--")}
                    </div>
                  <div className={styles.closeBtn} onClick={() => handleOnClose()}><X size={20} color="var(--warm-neutral-shade-300)"/></div>
                </div>
                <div className={styles.questionContainer}>
                    <div className={styles.question}>{t("--region--")}</div>
                    <Grid container spacing={2} pb={2}>
                      <Grid item md={6} xs={12}>
                        <TypeAhead
                          placeholder={'Select'}
                          value={props.formData?.regions?.length ? region : mapStringToOption(props.gptResponse?.countryCode)}
                          options={props.regionOptions}
                          disabled={isFieldDisabled(props.fieldMap, enumChapGPTRequestBotFields.regions)}
                          required={isFieldRequired(props.fieldMap, enumChapGPTRequestBotFields.regions)}
                          validator={(value) => validateField(t("--region--"), value)}
                          onChange={(value: Option) => { handleRegionSelection(value) }}
                          hideClearButton={true}
                        />
                      </Grid>
                    </Grid>
                </div>
                <div>
                  <OroButton className={styles.proceed} label={t("--save--")} type='primary'
                    fontWeight='semibold' radiusCurvature='medium' onClick={handleProceed} />
                </div>
              </>
            }
            {
              selectedTab.id === enumChapGPTRequestBotFields.suppliers && <>
                <div className={styles.questionContainer}>
                  <SupplierSuggestion
                    selectedSupplier={selectedSupplier}
                    suggestedSuppliers={suggestedSuppliers}
                    defaultCurrency={props.defaultCurrency}
                    preferredSuppliersDetail={props.gptResponse?.preferredSuppliers || []}
                    industryCodes={props.industryCodeOptions}
                    onSelect={handleSupplierSelection}
                    onProceed={handleProceed}
                    onSkipSupplier={handleSupplierSkip}
                    onClose={handleOnClose}
                  />
                </div>
              </>
            }
            {
              selectedTab.id === enumChapGPTRequestBotFields.amount && <>
              <div className={styles.requestBotFormHeaderContainer}>
                <div className={styles.title}>
                  {t("--spendTip--")}
                </div>
                  <div className={styles.closeBtn} onClick={() => handleOnClose()}><X size={20} color="var(--warm-neutral-shade-300)"/></div>
              </div>
              <div className={styles.questionContainer}>
                <div className={styles.question}>{t("--estimatedSpend--")}</div>
                <Grid container spacing={2} pb={2}>
                  <Grid item md={6} xs={12}>
                    <Currency
                        locale={getSessionLocale()}
                        unit={estimatedSpend?.currency || props.defaultCurrency || DEFAULT_CURRENCY}
                        value={estimatedSpend?.amount ? estimatedSpend.amount.toLocaleString(getSessionLocale()) : ''}
                        unitOptions={props.currenciesOptions}
                        disabled={isFieldDisabled(props.fieldMap, enumChapGPTRequestBotFields.amount)}
                        required={isFieldRequired(props.fieldMap, enumChapGPTRequestBotFields.amount)}
                        validator={(amount: string) => validateField(t("--estimatedSpend--"), amount)}
                        onChange={value => { handleSpendChange({amount: Number(getValueFromAmount(value)), currency: estimatedSpend?.currency || props.defaultCurrency || DEFAULT_CURRENCY}) }}
                        onUnitChange={value => { handleSpendChange({amount: estimatedSpend?.amount, currency: value || props.defaultCurrency || DEFAULT_CURRENCY}) }}
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                <OroButton className={styles.proceed} label={t("--next--")} type='primary'
                  fontWeight='semibold' radiusCurvature='medium' onClick={handleProceed} />
              </div>
              </>
            }
            {/* {
              selectedTab.id === enumChapGPTRequestBotFields.estimatedSpend && <>
              <div className={styles.title}>
                Knowing the estimated spend / spend range helps us guide you to the right channel
              </div>
              <div className={styles.questionContainer}>
                <Grid container spacing={2} pb={2}>
                  <Grid item md={6} xs={12}>
                    <Radio
                      name='Estimated Spend'
                      id='estimatedSpend'
                      label={'Estimated Spend'}
                      value={spend || undefined}
                      options={spendOption}
                      disabled={false}
                      required={true}
                      validator={(value) => isEmpty(value) ? 'Estimated Spend is a required field' : ''}
                      onChange={value => { handleEstimateSpendChange(value) }}
                    />
                  </Grid>
                </Grid>
              </div>
              </>
            } */}
        </div>}
    </div>)
}

export function ChatGPTChatBotForm (props: ChatGPTFormProps) {
    const [searchQuery,  setSearchQuery] = useState<string>('')
    const [chatGPTSuggestion, setChatGPTSuggestion] = useState<ChatGPTSuggestion>(null)
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const [customFormData, setCustomFormData] = useState<CustomFormData | null>(null)

    const [categories, setCategories] = useState<Option[]>([])
    const [intents, setIntents] = useState<Option[]>([])
    const [regions, setRegions] = useState<Option[]>([])
    const [departments, setDepartments] = useState<Option[]>([])
    const [spendUpperLimit, setSpendUpperLimit] = useState<number>()
    const [spendLowerLimit, setSpendLowerLimit] = useState<number>()
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [spend, setSpend] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
    const [instructionForm, setInstructionForm] = useState<QuestionnaireId>(null)

    const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
    const [intentsOptions, setIntentsOptions] = useState<Option[]>([])
    const [regionOptions, setRegionOptions] = useState<Option[]>([])
    const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
    const [industryCodeOptions, setIndustryCodeOptions] = useState<Option[]>([])
    const [currenciesOptions, setCurrenciesOptions] = useState<Option[]>([])
    const [filteredCategoryOptions, setFilteredCategoryOptions] = useState<Option[]>([])

    const [suggestedSuppliers, setSuggestedSuppliers] = useState<Supplier[]>([])
    const [chatBotFormData, setChatBotFormData] = useState<ChatGPTFormData>()
    const [loading, setLoading] = useState<boolean>(false)
    const [intentNotAvailable, setIntentNotAvailable] = useState<boolean>(false)
    const [isQuestionSkip, setIsQuestionSkip] = useState<boolean>(false)

    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (fieldName: string, node: HTMLDivElement) {
      fieldRefMap.current[fieldName] = node
    }
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        if (props.fields) {
          const fieldList = [enumChapGPTRequestBotFields.categories, enumChapGPTRequestBotFields.intents,
            enumChapGPTRequestBotFields.regions, enumChapGPTRequestBotFields.departments,
            enumChapGPTRequestBotFields.upperAmount, enumChapGPTRequestBotFields.lowerAmount,
            enumChapGPTRequestBotFields.instructionForm, enumChapGPTRequestBotFields.amount
          ]
          setFieldMap(getFormFieldsMap(props.fields, fieldList))
        }
    }, [props.fields])

    useEffect(() => {
      if (fieldMap) {
        setInstructionForm(fieldMap['buyingChannelInstructionForm']?.questionnaireId)
      }
    }, [fieldMap])

    useEffect(() => {
        if (props.formData) {
          setCategories(props.formData.categories || [])
          setIntents(props.formData.intents || [])
          setRegions(props.formData.regions || [])
          setDepartments(props.formData.departments || [])
          setSpendUpperLimit(props.formData.upperAmount)
          setSpendLowerLimit(props.formData.lowerAmount)
          setSuppliers(props.formData.selectedSuppliers || [])
          props.formData.amount && setSpend(props.formData.amount)
          setChatBotFormData(props.formData)
        }
    }, [props.formData])

    function getInstructionFormUpdatedData (formId: string) {
      if (formId) {
        setLoading(true)
        props.events?.refreshExtensionCustomFormData(formId, {}, increaseProgress)
        .then(resp => {
          setLoading(false)
          setProgress(0)
          console.log('Instruction form data ', resp)
          setCustomFormData(resp as CustomFormData || null)
        })
        .catch(err => {
          setLoading(false)
          setProgress(0)
          console.log('Item Details: Error in fetching custom form data', err)
        })
      }
    }

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

    function mapChatGPTResponseToFormData (suggestions: ChatGPTSuggestion, categories: Option[]): ChatGPTFormData {
       return {
          categories: suggestions?.commodityList?.length ? mapSuggestedCategoryToOption(suggestions?.commodityList, suggestions?.commodityCodeList, categories): [],
          regions: suggestions?.countryCode ? [mapStringToOption(suggestions?.countryCode)] : props.formData?.regions?.length ? props.formData?.regions : [],
          intents: suggestions?.intent ? [mapStringToOption(suggestions.intent)] : [],
          amount: suggestions?.totalBudget ? getMoneyFromSuggestion(suggestions?.totalBudget, props.defaultCurrency) : null,
          departments: [],
          selectedSuppliers: [],
          buyingChannelInstructionForm: fieldMap['buyingChannelInstructionForm']?.questionnaireId || null,
          userIntent: searchQuery
       }
    }

    function getBuyingChannelByRequest () {
      if (props.getBuyingChannel) {
        setLoading(true)
        setCustomFormData(null)
        props.getBuyingChannel(undefined, increaseProgress)
          .then(resp => {
            // buying channel by requestId
            setLoading(false)
            setProgress(0)
            console.log('buying channel by request ', resp)
            if (resp && resp.length > 0) {
              const formConfig = fieldMap['buyingChannelInstructionForm']
              getInstructionFormUpdatedData(formConfig?.questionnaireId?.formId)
            }
          })
          .catch(err => {
            setLoading(false)
            setProgress(0)
            console.log('Error while getting buying channel by request', err)
          })
      }
    }

    function getBuyingChannelBySupplier (normalizedVendorId: string) {
      if (props.getBuyingChannel) {
        setLoading(true)
        setCustomFormData(null)
        props.getBuyingChannel(normalizedVendorId, increaseProgress)
          .then(resp => {
            // buying channel by supplier
            setLoading(false)
            setProgress(0)
            console.log('buying channel by supplier ', resp)
            if (resp && resp.length > 0) {
              const formConfig = fieldMap['buyingChannelInstructionForm']
              getInstructionFormUpdatedData(formConfig?.questionnaireId?.formId)
            } else {
              getBuyingChannelByRequest()
            }
          })
          .catch(err => {
            setLoading(false)
            setProgress(0)
            console.log('Error while getting buying channel by supplier', err)
          })
      }
    }

    function getSuggestedSuppliers (vendorIds: string[], gptSuggestion: ChatGPTSuggestion, regions?: string[], categoryOptions?: Option[]) {
      if (props.getNormalizedVendors) {
        setLoading(true)
        props.getNormalizedVendors(vendorIds, gptSuggestion.companyName, regions, increaseProgress)
          .then(resp => {
            setLoading(false)
            setProgress(0)
            setSuggestedSuppliers(resp)

            const formData = {...chatBotFormData,
              categories: mapSuggestedCategoryToOption(gptSuggestion?.commodityList, gptSuggestion?.commodityCodeList, categoryOptions),
              amount: gptSuggestion?.totalBudget ? getMoneyFromSuggestion(gptSuggestion?.totalBudget, props.defaultCurrency) : null}

            if(resp && resp.length === 0) {
              const updatedFormData = {...formData, selectedSuppliers: []}
              setChatBotFormData(updatedFormData)
              // If no supplier available then get buying channel by request
              if (updatedFormData?.categories?.length === 1 && updatedFormData?.amount) {
                getBuyingChannelByRequest()
              }
            }
          })
          .catch(err => {
            setLoading(false)
            setProgress(0)
            console.log('Error while getting buying channel by supplier', err)
          })
      }
    }

    function increaseSuggestionProgress (event: any) {
      let value = Math.round((100 * event.loaded) / event.total)
      if (value === 100) {
        value = (value / 2)
        setTimeout(() => {
          value += 5
          setProgress(value)
        }, 1000)
      }
      setProgress(value)
    }

    function increaseProgress (event: any) {
      setProgress(Math.round((100 * event.loaded) / event.total))
    }

    function getQueryDetails () {
        if (searchQuery && props.getAISuggestions) {
            setLoading(true)
            setCustomFormData(null)
            setSuggestedSuppliers([])
            setIsQuestionSkip(false)

            props.getAISuggestions(searchQuery, increaseSuggestionProgress)
             .then(resp => {
                setProgress(80)
                setFilteredCategoryOptions(resp?.suggestedCategories || [])
                if (resp && resp.gptSuggestion) {
                  const mappedSuggestion = mapChatGPTSuggestionToModal(resp.gptSuggestion)
                  if (mappedSuggestion.intent === Intent.createPO || mappedSuggestion.intent === Intent.createContract) {
                    setChatGPTSuggestion(mappedSuggestion)
                    setIntentNotAvailable(false)
                    // submit form once get response from ChatGpt
                    const payload = mapChatGPTResponseToFormData(mappedSuggestion, resp?.suggestedCategories)
                    setProgress(90)
                    props.onSubmit(payload)
                      .then((res) => {
                        setProgress(100)
                        setLoading(false)
                        setProgress(0)
                        setChatBotFormData(payload)

                        if ((mappedSuggestion.commodityList?.length === 1 && mappedSuggestion.totalBudget) && (!mappedSuggestion.preferredSuppliers && !mappedSuggestion.otherSuppliers && !mappedSuggestion.companyName)) {
                          getBuyingChannelByRequest()
                        } else {
                          // if GPT suggest suppliers then fetch supplier details
                          if (mappedSuggestion.companyName) {
                            const allRegions = regions?.map(region => region.displayName)
                            getSuggestedSuppliers([], mappedSuggestion, allRegions, resp?.suggestedCategories)
                          } else {
                            const uniquePreferredSuppliersId = new Set(mappedSuggestion.preferredSuppliers?.map(item => item.erpSupplierId))
                            const uniqueOtherSuppliersId = new Set(mappedSuggestion.otherSuppliers?.map(item => item.erpVendorId))
                            const vendorIds = [Array.from(uniquePreferredSuppliersId), Array.from(uniqueOtherSuppliersId)]
                            const combinedVendorIds = vendorIds.filter(vendor => vendor && vendor.length > 0)

                            if (combinedVendorIds?.length > 0) {
                              getSuggestedSuppliers(combinedVendorIds.reduce((a, b) => a.concat(b), []), mappedSuggestion, [], resp?.suggestedCategories)
                            }
                          }
                        }
                      })
                      .catch(err => {
                        setLoading(false)
                        setProgress(0)
                        console.log(err)
                      })
                  } else {
                    // show empty state
                    setLoading(false)
                    setProgress(0)
                    setIntentNotAvailable(true)
                  }
                } else {
                  // show empty state
                  setLoading(false)
                  setProgress(0)
                  setIntentNotAvailable(true)
                }
             })
             .catch(err => {
                setLoading(false)
                setProgress(0)
                console.log(err)
            })
        }
    }

    function onSearchKeyPress () {
        const event: any = window!.event
        const key = event.keyCode
        if (key === 13) {
          getQueryDetails()
        }
    }

    function clearSearch () {
        setChatGPTSuggestion(null)
        setSearchQuery('')
        setCustomFormData(null)
        setSuggestedSuppliers([])
        setIsQuestionSkip(false)
    }

    function getFormData (): ChatGPTFormData {
        return {
          categories,
          intents,
          regions,
          departments,
          amount: spend ? spend : null,
          upperAmount: spendUpperLimit,
          lowerAmount: spendLowerLimit,
          selectedSuppliers: suppliers,
          buyingChannelInstructionForm: instructionForm,
          userIntent: props.formData?.userIntent || searchQuery
        }
    }

    function fetchData (skipValidation?: boolean): ChatGPTFormData {
        if (skipValidation) {
          return getFormData()
        } else {
          const invalidFieldId = isFormInvalid()

          if (invalidFieldId) {
            triggerValidations(invalidFieldId)
          }

          return invalidFieldId ? null : getFormData()
        }
    }

    useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
    }, [categories, intents, regions, departments, spendUpperLimit, spendLowerLimit, suppliers, spend, instructionForm])

    function isFormInvalid (): string {
        let invalidFieldId = ''
        const invalidFound = Object.keys(fieldMap).some(fieldName => {

          if (isRequired(fieldMap[fieldName])) {
            switch (fieldName) {
              case enumChapGPTRequestBotFields.categories:
                invalidFieldId = fieldName
                return !(categories && categories.length)
              case enumChapGPTRequestBotFields.regions:
                invalidFieldId = fieldName
                return !(regions && regions.length)
              case enumChapGPTRequestBotFields.departments:
                invalidFieldId = fieldName
                return !(departments && departments.length)
              case enumChapGPTRequestBotFields.amount:
                invalidFieldId = fieldName
                return isEmpty(spend.amount === 0 ? '0' : spend.amount)
              case enumChapGPTRequestBotFields.upperAmount:
                invalidFieldId = fieldName
                return isEmpty(spendUpperLimit === 0 ? '0' : spendUpperLimit)
              case enumChapGPTRequestBotFields.lowerAmount:
                invalidFieldId = fieldName
                return isEmpty(spendLowerLimit === 0 ? '0' : spendLowerLimit)
            }
          }
        })

        return invalidFound ? invalidFieldId : ''
      }

      function triggerValidations (invalidFieldId?: string) {
        setForceValidate(true)
        setTimeout(() => {
          setForceValidate(false)
        }, 1000)

        const input = fieldRefMap.current[invalidFieldId]

        if (input?.scrollIntoView) {
          input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
        }
      }

    function handleFormSubmit () {
        const invalidFieldId = isFormInvalid()

        if (invalidFieldId) {
          triggerValidations(invalidFieldId)
        } else if (props.onSubmit) {
          props.onSubmit(getFormData())
        }
    }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: number | Option | Money | Option[] | Supplier[]): ChatGPTFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as ChatGPTFormData

        switch (fieldName) {
          case 'categories':
            formData.categories = newValue as Option[]
            break
          case 'intents':
            formData.intents = newValue as Option[]
            break
          case 'regions':
            formData.regions = newValue as Option[]
            break
          case 'suppliers':
            formData.selectedSuppliers = newValue as Supplier[]
            break
          case 'departments':
            formData.departments = newValue as Option[]
            break
          case 'amount':
            formData.amount = newValue as Money
            break
          case 'spendUpperLimit':
            formData.upperAmount = newValue as number
            break
          case 'spendLowerLimit':
            formData.lowerAmount = newValue as number
            break
        }

        return formData
    }

    function handleFieldValueChange(
        fieldName: string,
        oldValue: number | Option | Option[],
        newValue: number | Option | Option[]
    ) {
        if (props.onValueChange) {
          if ((typeof newValue === 'number') && oldValue !== newValue) {
            props.onValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          } else if (isArrayOfOptions(oldValue) && isArrayOfOptions(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
            props.onValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          } else if (!areObjectsSame(oldValue, newValue)) {
            props.onValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          }
        }
    }

    function handleFormCancel () {
        if (props.onCancel) {
          props.onCancel()
        }
    }

    function handleBotQuestionChange (updatedFormData: ChatGPTFormData, isSkip?: boolean) {
        setChatBotFormData(updatedFormData)
        setCategories(updatedFormData.categories)
        setRegions(updatedFormData.regions)
        setDepartments(updatedFormData.departments || [])
        setSpendUpperLimit(updatedFormData.upperAmount)
        setSpendLowerLimit(updatedFormData.lowerAmount)
        setSuppliers(updatedFormData.selectedSuppliers || [])
        setSpend(updatedFormData.amount)
        setIsQuestionSkip(isSkip)

        const formData = {...updatedFormData, buyingChannelInstructionForm: instructionForm || null, userIntent: updatedFormData.userIntent || searchQuery}
        setLoading(true)
        setProgress(0)
        props.onSubmit(formData, increaseProgress)
          .then(resp => {
            setLoading(false)
            setProgress(0)
            if (formData?.selectedSuppliers?.length) {
              getBuyingChannelBySupplier(formData?.selectedSuppliers[0]?.legalEntity?.vendorId)
            } else {
              getBuyingChannelByRequest()
            }
          })
          .catch(err => {
            setLoading(false)
            setProgress(0)
            console.log(err)
          })
    }

    function canShowInstructionForm (): boolean {
      return searchQuery && customFormData && !!(instructionForm && instructionForm?.formId)
    }

    return (<>
        <div className={styles.containerDefault}>
            <div className={styles.containerDefaultSearch}>
                {/* <div className={`${styles.title} ${chatGPTSuggestion && Object.keys(chatGPTSuggestion).length > 0 ? styles.restrict : ''}`}>
                {t("--title--")}
                <div className={styles.info}>
                    <img src={GPTSuggestion} />
                    <span>{t("--subTitle--")}</span>
                </div>
                </div>
                <div className={styles.tip}>
                  {t("--tip--")}
                </div> */}
                <div className={styles.textareadiv}>
                    <textarea id="textareabig" className={styles.textareabig} onKeyPress={onSearchKeyPress} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Describe your business need"></textarea>
                    <div className={styles.action}>
                    {searchQuery && <div className={styles.close} onClick={clearSearch}>
                        <X size={20} color={'var(--warm-neutral-shade-300)'}/>
                    </div>}
                    <div onClick={getQueryDetails}>
                        <img src={GPTEnter} />
                    </div>
                    </div>
                </div>
                {/* <div className={styles.tip}>
                  <Zap size={16} color={"var(--warm-neutral-shade-100)"}/>
                  {t("--subTitle--")}
                </div> */}
            </div>
        </div>
        {!loading && !searchQuery && <div className={styles.tipContainer}>
          <div className={styles.tipContainerInfo}>
            <Sun size={16} color="var(--warm-stat-mint-regular)"/>
            {t("--proTip--")}
          </div>
          <div className={styles.tipContainerSubInfo}>{t("--proTipText--")}</div>
        </div>}
        {!loading && (chatGPTSuggestion && Object.keys(chatGPTSuggestion).length > 0 && !intentNotAvailable) &&
            <RenderBotQuestion
              formData={chatBotFormData}
              gptResponse={chatGPTSuggestion}
              suggestedSuppliers={suggestedSuppliers}
              fieldMap={fieldMap}
              defaultCurrency={props.defaultCurrency}
              isQuestionSkip={isQuestionSkip}
              categoryOptions={categoryOptions}
              regionOptions={regionOptions}
              industryCodeOptions={industryCodeOptions}
              currenciesOptions={currenciesOptions}
              onChange={handleBotQuestionChange}
              fetchChildren={props.fetchChildren}
              onSearch={props.onSearch}/>
        }

        {loading && progress > 0 && <div className={styles.loadingContainer}>
          {/* <span className={styles.loader}></span> */}
          <Box sx={{ width: '100%' }}>
          <LinearProgress sx={{
                  backgroundColor: 'white',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'var(--warm-stat-mint-mid)'
                  }
                }}
            variant="determinate" value={progress} />
            </Box>
            {/* <div className={`${styles.icon}`}>
                <img src={GPTSuggestion}/>
            </div>
            {t("--loaderText--")}<span className={styles.loading}></span> */}
        </div>}
        {
          !loading && canShowInstructionForm() &&
          <div className={styles.instructionFormContainer}>
            {/* <div className={styles.title}>
              {t("--suggestedChannel--")}
            </div> */}
            <>
            <CustomFormExtension
              locale={getSessionLocale()}
              customFormData={customFormData}
              questionnaireId={instructionForm}
              options={props.options}
              dataFetchers={props.dataFetchers}
              events={props.events}
            />
            </>
          </div>
        }
        {
          !loading && searchQuery && intentNotAvailable && <div className={styles.extractedSection}>
            <div className={styles.extractedSectionTitle}>
            {t("--comingSoon--")}
            </div>
            <div className={styles.extractedSectionInfo}>{t("--noSuggestionText--")}</div>
            <div>
              <img src={GPTEmptyState}/>
            </div>
          </div>
        }
        <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
            cancelLabel={props.cancelLabel}
            submitLabel={props.submitLabel}
        />
    </>)

}
