/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/

import React, { useEffect, useRef, useState } from "react";
import { enumChapGPTRequestBotFields, ChatGPTV2FormData, ChatGPTSuggestion, IBuyingChannelResponse, ContractExtractionResponse, GPTV2Intent, IQuestion, GPTV2IntentUserQuery, GptV2Response, QuestionNumber } from "./types";
import { Option, } from "../../Inputs";
import { validateField, mapIDRefToOption } from "../util";
import { mapChatGPTSuggestionToModal } from "./utils";
import { CustomFormData, Money, RequestQuestionnaireId, Supplier, getSessionLocale, getValueFromAmount, Attachment, SegmentationDetail, ItemListType } from "../..";
import { DEFAULT_CURRENCY } from "../../util";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { ChatGPTFormV2Props } from './types'
import { useOptions } from "./customHooks";
import { ICategoryRecommFormDataV2 } from "../CategoryRecommendationV2/types";
import { getCategoryRecommendFormData, mapChatGPTResponseToFormData } from "./utils";
import { SupplierSuggestion } from "./Supplier";
import SearchQuery from "./SearchQuery";
import OroAnimator from "../../controls/OroAnimator";
import AIResponse from "./AIResponse";
import ScrollToView, { ScrollToViewHandle } from "./ScrollToView";
import CategoryWrapper from "./CategoryWrapper";
import Estimate from "./Estimate";
import ComingSoon from "./ComingSoon";
import ComplianceForm from "./ComplianceForm";
import AIGenerator from "./AIGenerator";
import Catalog from "./Catalog";
import BuyingChannels from "./BuyingChannels";
import ProposalDetails from "./ProposalDetails";
import { SupplierSegmentation } from "../../Types/vendor";
import BlockedSupplier from "./BlockedSupplier";
import BuyingChannel from "./BuyingChannels/BuyingChannel/BuyingChannel";
import AdditionalQuestion from "./AdditionalQuestion";
import PurchaseOrderList from "./PurchaseOrderList";

export function ChatGPTChatBotV2Form (props: ChatGPTFormV2Props) {
  const DEFAULTAMOUNT = { amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY }

  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false)
  const [OROAPICalled, setOROAPIcalled] = useState(false)

  // for loader varient
  const [isLoading, setIsLoading] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  // user Intent to search
  const [userSearch, setUserSearch] = useState<string>('')
  const [intentStrings, setIntentStrings] = useState<string[] | null>(null)

  // gpt form field states
  const [categories, setCategories] = useState<Option[]>([])
  const [regions, setRegions] = useState<Option[]>([])
  const [skipCategory, setSkipCategory] = useState(false)
  const [isCategoryLeafOnly, setIsCategoryLeafOnly] = useState(false)
  // PO Status
  const [showPOStatus, setShowPOStatus] = useState(false)

  // To enable category chain
  const [enableCategoryChain, setEnableCategoryChain] = useState(false)
  // Supplier
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [skipSupplier, setSkipSupplier] = useState(false)

  // compliance Form states
  const [complianceFormVisible, setComplianceFormVisible] = useState(false)
  const [complianceForm, setComplianceForm] = useState<RequestQuestionnaireId | null>(null)
  const [complianceFormData, setComplianceFormData] = useState<CustomFormData | null>(null)
  const [isComplianceFormSubmitted, setIsComplianceFormSubmitted] = useState(false)

  // estimate amount
  const [estimatedAmount, setEstimatedAmount] = useState<Money>(DEFAULTAMOUNT)
  const [estimateContinue, setEstimateContinue] = useState(false)

  // Buying Channels
  const [buyingChanneldetails, setBuyingChannelDetails] = useState<Array<IBuyingChannelResponse>>([])
  const [fallBackBuyingChannels, setFallBackBuyingChannels] = useState<Array<IBuyingChannelResponse>>([])
  const [isFallbackShown, setIsFallbackShown] = useState(false)
  // marketplace catalog
  const [catalog, setCatalog] = useState<Option>()

  // Contract Extraction from Attachment
  const [proposalAttachment, setProposalAttachment] = useState<Attachment | null>(null)
  const [contractExtractionDetails, setContractExtractionDetails] = useState<ContractExtractionResponse | null>(null)
  const [isExtractionSkipped, setIsExtractionSkipped] = useState(false)
  // Segmentations for Blocked Suppliers
  const [supplierSegmentations, setSupplierSegmentations] = useState<SegmentationDetail[]>([])

  // gpt suggestion
  const [chatGPTSuggestion, setChatGPTSuggestion] = useState<ChatGPTSuggestion>(null)
  const [productForCatalog, setProductForCatalog] = useState('')

  // gpt suggested states
  const [catalogSkipped, setCatalogSkipped] = useState<boolean>(false)
  const [suggestedCategoryOptions, setSuggestedCategoryOptions] = useState<Option[]>([])
  const [suggestedSuppliers, setSuggestedSuppliers] = useState<Supplier[]>([])
  const [nudgeSuppliers, setNudgeSuppliers] = useState<Supplier[]>([])
  const [skipNudgeSuppliers, setSkipNudgeSuppliers] = useState<boolean>(false)
  const [questionOne, setQuestionOne] = useState<IQuestion | null>(null)
  const [questionTwo, setQuestionTwo] = useState<IQuestion | null>(null)
  const [questionThree, setQuestionThree] = useState<IQuestion | null>(null)
  const [questionOneSkipped, setQuestionOneSkipped] = useState<boolean>(false)
  const [questionTwoSkipped, setQuestionTwoSkipped] = useState<boolean>(false)
  const [questionThreeSkipped, setQuestionThreeSkipped] = useState<boolean>(false)

  const [chatBotFormData, setChatBotFormData] = useState<ChatGPTV2FormData>()

  // When GPT returns nothing or get exception
  const [isComingSoon, setIsComingSoon] = useState<boolean>(false)
  // for locale
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])

  // Options master data
  const [categoryOptions,
    intentsOptions,
    regionOptions,
    departmentOptions,
    industryCodeOptions,
    currenciesOptions] = useOptions(props)
  // for scrolling into view
  const pageEndRef = useRef<ScrollToViewHandle>()

  function reStart () {
    setIsLoading(false)
    setOROAPIcalled(false)
    setChatGPTSuggestion(null)
    // Proposal Clean
    setContractExtractionDetails(null)
    setIsExtractionSkipped(false)
    // handleFileUpload(null)
    // Catalog
    setProductForCatalog('')
    setCatalogSkipped(false)
    // clean Additional Questions
    setQuestionOne(null)
    setQuestionTwo(null)
    setQuestionThree(null)
    setQuestionOneSkipped(false)
    setQuestionTwoSkipped(false)
    setQuestionThreeSkipped(false)
    // clean PO Status
    setShowPOStatus(false)
    // category clean
    setSuggestedCategoryOptions([])
    setCategories([])
    setSkipCategory(false)
    // Supplier clean
    setSuppliers([])
    setSuggestedSuppliers([])
    setSkipSupplier(false)
    setSkipNudgeSuppliers(false)
    setSupplierSegmentations([])
    // Coming Soon
    setIsComingSoon(false)
    // Amount
    setEstimateContinue(false)
    setEstimatedAmount(DEFAULTAMOUNT)
    // Compliance
    setIsComplianceFormSubmitted(false)
    // Buying Channel
    setBuyingChannelDetails([])
    setIsFallbackShown(false)
    // cleanup the form data
    cleanupFormData()
  }

  function getFormData (cleanUp: boolean): ChatGPTV2FormData {
    if (cleanUp) {
      return {
        categories: null,
        regions: null,
        amount: null,
        selectedSuppliers: null,
        proposal: proposalAttachment,
        userIntent: userSearch,
        intentStrings: null
      }
    }
    return {
      categories,
      regions,
      amount: estimatedAmount ? estimatedAmount : null,
      selectedSuppliers: suppliers,
      proposal: proposalAttachment,
      userIntent: userSearch,
      intentStrings: intentStrings
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Attachment | null | number | Option | Money | Option[] | Supplier[]): ChatGPTV2FormData {
    const formData = JSON.parse(JSON.stringify(getFormData(false))) as ChatGPTV2FormData

    switch (fieldName) {
      case enumChapGPTRequestBotFields.categories:
        formData.categories = newValue as Option[]
        break
      case enumChapGPTRequestBotFields.regions:
        formData.regions = newValue as Option[]
        break
      case enumChapGPTRequestBotFields.selectedSuppliers:
        formData.selectedSuppliers = newValue as Supplier[]
        break
      case enumChapGPTRequestBotFields.amount:
        formData.amount = newValue as Money
        break
      case enumChapGPTRequestBotFields.proposal:
        formData.proposal = newValue as Attachment | null
        break
      case enumChapGPTRequestBotFields.userIntent:
        formData.userIntent = newValue as string
        break
    }

    return formData
  }
  function runBuyingChannelFlow () {
    setIsLoading(true)
    setIsComingSoon(false)
    props.getBuyingChannel()
      .then(res => {
        setIsLoading(false)
        let _buyingChannels = []
        if (res && res.length > 0) {
          _buyingChannels = res
          setIsFallbackShown(false)
        } else {
          if (fallBackBuyingChannels.length > 0) {
            _buyingChannels = fallBackBuyingChannels
            setIsFallbackShown(true)
          }
        }
        if (_buyingChannels.length > 0) {
          setBuyingChannelDetails(_buyingChannels)
        } else {
          setIsComingSoon(true)
        }

      })
      .finally(() => {
        setIsLoading(false)
        setShouldScrollToEnd(true)
      })
  }
  function cleanupFormData () {
    const _payload = getFormData(true)
    props.onSubmit(_payload)
  }
  // Submit handler for controls
  function questionSubmit (formData: ChatGPTV2FormData, submitFieldName: enumChapGPTRequestBotFields) {
    setIsLoading(true)
    setIsCapturing(true)
    // setComplianceFormVisible(false)
    setShouldScrollToEnd(true)

    props.onSubmit(formData)
      .then(() => {
        // TODO SWITCHOFF untill got all details
        setIsCapturing(false)
        // check for compliance form if reached to estimate question
        if ((submitFieldName === enumChapGPTRequestBotFields.amount) && complianceForm.formId && props.isComplianceFormVisible) {
          setIsLoading(true)
          props.isComplianceFormVisible(complianceForm.formId)
            .then((isVisible) => {
              setIsLoading(false)
              setComplianceFormVisible(isVisible)
              setShouldScrollToEnd(true)
              if (isVisible) {
                if (props.submitComplianceForm) {
                  // submit the form first time with _new = true, and use id/formdata
                  setIsLoading(true)
                  props.submitComplianceForm({}, complianceForm.formId, complianceForm.id ? false : true, complianceForm.id || '')
                    .then(resp => {
                      setIsLoading(false)
                      // update compliance Form data
                      resp.customFormData && setComplianceFormData(resp.customFormData)
                      // update compliance form
                      resp.id && setComplianceForm({ ...complianceForm, id: resp.id })
                    }).catch(err => {
                      setIsLoading(false)
                      console.log('Error in submitting compliance form data', complianceForm.id, err)
                    })
                }
              } else {
                // run buying channel flow
                runBuyingChannelFlow()
              }
            }).catch(err => {
              setIsLoading(false)
              console.log(err)
            })
        } else if (submitFieldName === enumChapGPTRequestBotFields.categories && !chatGPTSuggestion?.companyName && !chatGPTSuggestion.preferredSuppliers) {
          setSuggestedSuppliers([])
          setIsLoading(true)
          props.refetchSuppliers()
            .then(resp => {
              setSuggestedSuppliers(resp)
              setIsLoading(false)
            })
            .catch(err => {
              console.log(err)
              setIsLoading(false)
            })
        } else {
          setIsLoading(false)
          setShouldScrollToEnd(true) // TODO
        }
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
  }

  function isFinderIntent (intent: GPTV2Intent) {
    const list = [
      GPTV2Intent.requestStatus,
      GPTV2Intent.contractStatus,
      GPTV2Intent.invoiceStatus,
      GPTV2Intent.supplierStatus,
      GPTV2Intent.poStatus,
      GPTV2Intent.extendContract,
      GPTV2Intent.renewContract,
      GPTV2Intent.cancelContract,
      GPTV2Intent.amendPO
    ]
    return (list.indexOf(intent) > -1)
  }
  function handleGptSuggestion (response: GptV2Response, options: { userIntent?: string, supplierName?: string } = {}) {
    const _suggestedCategories = response?.suggestedCategories || []
    if (response && response?.gptSuggestion) {
      const mappedSuggestion = mapChatGPTSuggestionToModal(response?.gptSuggestion)
      const GPTIntent = mappedSuggestion.intent

      if (!GPTIntent) {
        setIsComingSoon(true)
      }
      else {

        //for Known Intents
        // override companyName if supplier name found in proposal
        mappedSuggestion.companyName = options?.supplierName || mappedSuggestion.companyName

        setChatGPTSuggestion(mappedSuggestion)
        setIsComingSoon(false)

        // submit form once get response from ChatGpt
        const payload = mapChatGPTResponseToFormData({
          suggestions: mappedSuggestion,
          categories: _suggestedCategories.length === 1 ? _suggestedCategories : [],
          regions: props.formData?.regions,
          currency: props.defaultCurrency,
          proposal: proposalAttachment,
          userIntent: options?.userIntent || userSearch // TODO: Need to ask while submitting the form userIntent shall be last questions's answer or the first one
        })
        setIsLoading(true)
        props.onSubmit(payload)
          .then(() => {
            setIsLoading(false)
            setOROAPIcalled(true)

            // if intent is POSEARCH.. no need to move further
            if (GPTIntent === GPTV2Intent.poStatus) {
              setShowPOStatus(true)
              // disabled category Chaining.
              setEnableCategoryChain(false)
              return
            }
            // enable category chaining
            setEnableCategoryChain(true)
            // if product name found.. show catalog view
            if (mappedSuggestion.productName && !mappedSuggestion.disableProductSearch) {
              setProductForCatalog(mappedSuggestion.productName)
            }

            // set category options
            setSuggestedCategoryOptions(_suggestedCategories)
            // if only 1 suggested category, make it default selected
            if (_suggestedCategories.length === 1) {
              setCategories(_suggestedCategories)
            }

            // fetch supplier and nudge supplier
            // if GPT suggest suppliers then fetch supplier details
            const _supplierToSearch = mappedSuggestion.companyName
            if (_supplierToSearch) {
              const allRegions = regions?.map(region => region.displayName)
              // get by company name
              //setIsLoading(true)
              props.getNormalizedVendors && props.getNormalizedVendors([], _supplierToSearch, allRegions)
                .then((responseSuppliers) => {
                  //setIsLoading(false)
                  setSuggestedSuppliers(responseSuppliers || [])
                })
                .catch(() => {
                  //setIsLoading(false)
                })

              //  if PR supplier found... use them as Nudge List
              // fetching silently for now..
              const ids = (mappedSuggestion.preferredSuppliers || [])
                .reduce((previousValue, currentValue) => {
                  if (currentValue.erpSupplierId) {
                    previousValue.push(currentValue.erpSupplierId)
                  }
                  return previousValue
                }, [])
              if (ids.length > 0 && props.getNormalizedVendors) {
                props.getNormalizedVendors(ids, '', [])
                  .then((responseSuppliers) => {
                    // add to nudge
                    setNudgeSuppliers(responseSuppliers || [])
                  }).catch(() => {
                    setIsLoading(false)
                  })
              }

            } else {

              const _prefIds = (mappedSuggestion.preferredSuppliers || [])
                .reduce((previousValue, currentValue) => {
                  if (currentValue.erpSupplierId) {
                    previousValue.push(currentValue.erpSupplierId)
                  }
                  return previousValue
                }, [])
              const _othersIds = (mappedSuggestion.otherSuppliers || []) // Do we need Other suppliers
                .reduce((previousValue, currentValue) => {
                  if (currentValue.erpVendorId) {
                    previousValue.push(currentValue.erpVendorId)
                  }
                  return previousValue
                }, [])
              const concatIds = [..._prefIds, ..._othersIds]
              const vendorUniqueIds = Array.from(new Set(concatIds))

              if (vendorUniqueIds.length > 0) {
                //setIsLoading(true)
                props.getNormalizedVendors && props.getNormalizedVendors(vendorUniqueIds, '', [])
                  .then((responseSuppliers) => {
                    //setIsLoading(false)
                    setSuggestedSuppliers(responseSuppliers || [])
                  }).catch(() => {
                    //setIsLoading(false)
                  })
              }
            }

            // for find intents,, we skip category/supplier/amount questions
            if (isFinderIntent(GPTIntent)) {
              setSkipCategory(true)
              runBuyingChannelFlow()
            }
            setShouldScrollToEnd(true)
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
          })
      }
    } else {
      // show empty state
      setIsLoading(false)
      setIsComingSoon(true)
    }
  }

  function handleQuestionClick (value: IQuestion, questionNumber: QuestionNumber, skip?: boolean) {
    // Call new AIsuggest (Post Call)
    // If another question follow question path
    // Else call handleGptSuggestion

    let _payLoad: GPTV2IntentUserQuery = {} as GPTV2IntentUserQuery
    switch (questionNumber) {
      case QuestionNumber.proposal:
        _payLoad = {
          query: value.answer,
          conversation_state: value.conversationState,
          query_intent: false,
          analyze_proposal: true
        }
        break;
      case QuestionNumber.one:
        setQuestionOne(value)
        if (skip) setQuestionOneSkipped(skip)
        _payLoad = {
          query: skip ? '' : value.answer,
          conversation_state: userSearch,
          query_intent: skip || false,
          analyze_proposal: false
        }
        break;
      case QuestionNumber.two:
        setQuestionTwo(value)
        if (skip) setQuestionTwoSkipped(skip)
        _payLoad = {
          query: skip ? '' : value.answer,
          conversation_state: value?.conversationState,
          query_intent: skip || false,
          analyze_proposal: false
        }
        break;
      case QuestionNumber.three:
        setQuestionThree(value)
        if (skip) setQuestionThreeSkipped(skip)
        _payLoad = {
          query: skip ? '' : value.answer,
          conversation_state: value?.conversationState,
          query_intent: true,
          analyze_proposal: false
        }
        break;
    }

    if (props.onQuestionAnswered) {
      setIsLoading(true)
      setShouldScrollToEnd(true)
      props.onQuestionAnswered(_payLoad)
        .then(resp => {
          setIsLoading(false)
          setShouldScrollToEnd(true)
          setIsExtractionSkipped(true)

          const QuestionState = {
            question: resp?.gptSuggestion?.next_question,
            answer: '',
            conversationState: resp?.gptSuggestion?.conversation_state
          }
          if (resp?.gptSuggestion?.next_question && questionNumber === QuestionNumber.proposal) {
            setQuestionOne(QuestionState)
          } else if (resp?.gptSuggestion?.next_question && questionNumber === QuestionNumber.one) {
            setQuestionTwo(QuestionState)
          } else if (resp?.gptSuggestion?.next_question && questionNumber === QuestionNumber.two) {
            setQuestionThree(QuestionState)
          } else {
            handleGptSuggestion(resp, { supplierName: contractExtractionDetails?.supplier })
          }
        })
        .catch(err => {
          console.log(err)
          setIsLoading(false)
        })
    }
  }

  // Edit controls Click
  function handleSearchClick (search: string) {
    if (search && props.getAISuggestions) {
      setIsLoading(true)
      // store user search
      setUserSearch(search)
      // submit form with search
      const _payload = getFormDataWithUpdatedValue(enumChapGPTRequestBotFields.userIntent, search)
      props.onSubmit(_payload)
      // get AI result
      props.getAISuggestions(search)
        .then(resp => {
          setIsLoading(false)
          const _proposal = resp?.contractExtractionDetails
          // proposal extraction details
          if (_proposal) {
            setContractExtractionDetails(_proposal)
            setShouldScrollToEnd(true)
            // override estimate amount if extracted from proposal, only if client not manually mentioned
            const _spend = _proposal.value
            const _hasAlreadyAmount = estimatedAmount && (estimatedAmount.amount > 0)
            if (!_hasAlreadyAmount && (_spend !== null && !Number.isNaN(_spend))) {
              const _money = {
                amount: _spend,
                currency: _proposal.currency || estimatedAmount.currency
              }
              setEstimatedAmount(_money)
            }
          }
          if (resp?.gptSuggestion?.next_question) {
            setQuestionOne({
              answer: '',
              question: resp?.gptSuggestion?.next_question
            })
          } else {
            handleGptSuggestion(resp, { userIntent: search, supplierName: _proposal?.supplier })
          }
        })
        .catch(err => {
          setIsLoading(false)
          setIsComingSoon(true)
          console.log(err)
        })
    }
  }

  function handleFileUpload (file: File | null) {
    if (file && props.onFileUpload) {
      setContractExtractionDetails(null)
      props.onFileUpload(file, enumChapGPTRequestBotFields.proposal)
    } else if (props.onFileDelete) {
      setContractExtractionDetails(null)
      setProposalAttachment(null)
      props.onFileDelete(enumChapGPTRequestBotFields.proposal)
      // submit clear proposal
      const _payload = getFormDataWithUpdatedValue(enumChapGPTRequestBotFields.proposal, null)
      props.onClearProposal(_payload)
    }
  }

  function handleSearchEditClick () {
    reStart()
  }
  function handleCategorySelect (fieldName: string, updatedForm: ICategoryRecommFormDataV2) {
    const selectedCategories = (updatedForm.categories || []).map(mapIDRefToOption)
    const _payload = getFormDataWithUpdatedValue(enumChapGPTRequestBotFields.categories, selectedCategories)
    questionSubmit(_payload, enumChapGPTRequestBotFields.categories)
    setCategories(selectedCategories)
    setSkipSupplier(false)
  }
  function handleSupplierSelection (supplier: Supplier) {
    const _payload = getFormDataWithUpdatedValue(enumChapGPTRequestBotFields.selectedSuppliers, [supplier])
    questionSubmit(_payload, enumChapGPTRequestBotFields.selectedSuppliers)
    setSuppliers([supplier])
  }
  function handleEstimateContinue () {
    const _payload = getFormDataWithUpdatedValue(enumChapGPTRequestBotFields.amount, estimatedAmount)
    setEstimateContinue(true)
    questionSubmit(_payload, enumChapGPTRequestBotFields.amount)
    // check for compliance form
  }
  function handleEstimateChange (value: Money) {
    setEstimatedAmount(value)
  }
  function handleEstimateEditClick () {
    setEstimateContinue(false)
    setShouldScrollToEnd(true)
    setComplianceFormVisible(false)
    setBuyingChannelDetails([])
  }
  function handleCategoryEditClick () {
    setCategories([])
    setSuppliers([])
    setShouldScrollToEnd(true)
    setBuyingChannelDetails([])
    setEstimateContinue(false)
  }
  function handleSupplierEditClick () {
    setSuppliers([])
    setSkipSupplier(false)
    setSupplierSegmentations([])
    setShouldScrollToEnd(true)
    setBuyingChannelDetails([])
    setSkipNudgeSuppliers(false)
    setEstimateContinue(false)
  }
  function handleSupplierSkip () {
    setSkipSupplier(true)
  }
  function handleShowMoreSupplier () {
    setShouldScrollToEnd(true)
  }
  function handleSearchSuppliers (search) {
    return props.onSearchSuppliers(search)
      .then((res) => {
        setShouldScrollToEnd(true)
        return res
      })
  }
  function handleComplianceEditClick () {
    setBuyingChannelDetails([])
  }
  function handleComplianceContinueClick (formData: CustomFormData) {
    if (props.submitComplianceForm && complianceForm.id) {
      setIsLoading(true)
      setIsCapturing(true)
      setIsComplianceFormSubmitted(true)
      props.submitComplianceForm(formData, complianceForm.formId, false, complianceForm.id)
        .then((resp) => {
          setIsLoading(false)
          setIsCapturing(false)
          // // update compliance Form data
          resp.customFormData && setComplianceFormData(resp.customFormData)
          // // update compliance form ?
          // resp.id && setComplianceForm({ ...complianceForm, id: resp.id })
          runBuyingChannelFlow()
        }).catch(err => {
          setIsLoading(false)
          console.log('Error in submitting compliance form data', complianceForm.id, formData, err)
        })
    }
  }
  function handleNudgeSupplierSkip () {
    setSkipNudgeSuppliers(true)
  }
  function showNudgeSuppliers () {
    const _supplier = suppliers?.[0] || null
    if (!skipNudgeSuppliers && _supplier && nudgeSuppliers.length > 0) {
      const partofRecommendations = nudgeSuppliers.some((sup) => sup.vendorId === _supplier.vendorId)
      return !partofRecommendations
    }
    return false
  }

  function getCatalogItems (): Promise<ItemListType> {
    if (props.fetchCatalog && productForCatalog) {
      return props.fetchCatalog(productForCatalog)
    } else {
      return Promise.reject()
    }
  }
  function onCatalogLoad () {
    setShouldScrollToEnd(true)
  }

  function skipCatalog () {
    setCatalogSkipped(true)
    setShouldScrollToEnd(true)
  }

  function handleExtractionDetailsContinue () {
    setShouldScrollToEnd(true)
    // if there was already a question to ask by AI...
    // try to check AI with if proposal answer
    if (questionOne?.question) {
      // clear the previous question
      setQuestionOne(null)
      // ask AI again if can get intent with proposal
      handleQuestionClick({
        question: null,
        answer: contractExtractionDetails?.summary_paragraph || contractExtractionDetails?.summary_sentence || userSearch,
        conversationState: userSearch
      }, QuestionNumber.proposal)
    } else {
      setIsExtractionSkipped(true)
    }
  }

  function isSupplierBlocked () {
    return _supplierSelected && supplierSegmentations?.[0]?.segmentation === SupplierSegmentation.dontUse
  }
  useEffect(() => {
    props.getFallbackBuyingChannel()
      .then((res) => {
        setFallBackBuyingChannels(res || [])
      })
  }, [])


  useEffect(() => {
    if (props.fields) {
      const fieldConfig = props.fields.find(field => field.fieldName === enumChapGPTRequestBotFields.catalog)
      const catalogCode = fieldConfig?.stringValue
      if (props.dataFetchers?.searchOptions && catalogCode) {
        props.dataFetchers.searchOptions(catalogCode, 'BuyingChannel')
          .then((res: Option[]) => {
            setCatalog(res[0])
          })
          .catch(err => {
            console.log('ChatGPTChatBotV2Form: could not fetch configured catalogBuyingChannel')
          })
      }
      // check category config
      const _isLeafOnly = props.fields.find(field => field.fieldName === enumChapGPTRequestBotFields.categoryLeafOnly)?.booleanValue || false
      if (_isLeafOnly) {
        setIsCategoryLeafOnly(_isLeafOnly)
      }
    }
  }, [props.fields])

  // get form data
  useEffect(() => {
    const _formdata = props.formData
    if (_formdata) {
      setCategories(_formdata.categories || [])
      setRegions(_formdata.regions || [])
      setSuppliers(_formdata.selectedSuppliers || [])
      _formdata.amount && setEstimatedAmount(_formdata.amount)
      setChatBotFormData(_formdata)
      setProposalAttachment(_formdata.proposal || null)
      setSupplierSegmentations(_formdata.selectedSupplierSegmentations || [])
      setIntentStrings(_formdata.intentStrings || null)
      setUserSearch(_formdata.userIntent || '')
    }
  }, [props.formData])
  useEffect(() => {
    if (shouldScrollToEnd) {
      pageEndRef.current && pageEndRef.current.scroll()
      setShouldScrollToEnd(false)
    }
  }, [shouldScrollToEnd])
  useEffect(() => {
    const _form = props.complianceForm || null
    setComplianceForm(_form)
  }, [props.complianceForm])

  // Logic to show/hide controls
  // Proposal is independent, but also work as optional question(if found in original query)
  const _showContractExtractionDetails = !!contractExtractionDetails
  const _contractBypass = (isExtractionSkipped || !_showContractExtractionDetails)
  // 3 Questions are chained.
  const _showQuestionOne = !!questionOne && _contractBypass && !questionOneSkipped
  const _showQuestionTwo = !!questionTwo && _contractBypass && !questionTwoSkipped
  const _showQuestionThree = !!questionThree && _contractBypass && !questionThreeSkipped
  const _categorySelected = (categories || []).length > 0
  // coming soon is independent
  const _showComingSoon = isComingSoon && _contractBypass
  // Catalog is independent
  const _showCatalog = _contractBypass && !!catalog && !!productForCatalog
  const _catalogByPass = (!_showCatalog || catalogSkipped)
  // Category + Supplier + Amount + Compliance are chained to each other.
  // if category not shown, Supplier/Amount/Compliance will not shown
  const _showCategoryControl = OROAPICalled && enableCategoryChain && _catalogByPass && _contractBypass && !_showComingSoon && !skipCategory && (_categorySelected || !isLoading)
  const _supplierSelected = (suppliers || []).length > 0

  const _showSupplierControl = _showCategoryControl && _categorySelected && (_supplierSelected || skipSupplier || !isLoading)

  // Nudge/block should work only if user searched. To avoid showing them on refresh page.
  const _showNudgeSuppliers = OROAPICalled && showNudgeSuppliers()
  const _isSupplierBlocked = OROAPICalled && isSupplierBlocked()
  const _showEstimate = !_isSupplierBlocked && !_showNudgeSuppliers && _showSupplierControl && (_supplierSelected || skipSupplier) && (estimateContinue || !isLoading)
  const _showComplianceForm = estimateContinue && complianceFormVisible
  // Buying Channel is independent
  const _showBuyingChannel = buyingChanneldetails && buyingChanneldetails.length > 0
  return (<div>
    <SearchQuery
      title={props.title || t('--howCanWeHelp--')}
      attachLabel={t('--attach--')}
      search={userSearch}
      attachment={proposalAttachment}
      placeholder={t('--describeYourBusinessNeed--')}
      onSearch={handleSearchClick}
      onEdit={!isLoading ? handleSearchEditClick : undefined}
      onFileUpload={handleFileUpload}
      loadDocument={props.loadDocument} />
    {/* ProposalDetails */}
    <OroAnimator show={_showContractExtractionDetails} withDelay>
      <AIResponse userResponded={false}>
        <ProposalDetails
          title={t('--proposal--.--capturedDetails--')}
          details={contractExtractionDetails}
          reset={_showContractExtractionDetails}
          onContinue={handleExtractionDetailsContinue}
        />
      </AIResponse>
    </OroAnimator>
    {/* Additional Questions */}
    <AdditionalQuestion
      show={_showQuestionOne}
      userResponded={questionOne?.answer ? true : false}
      placeholder={t('--describeYourBusinessNeed--')}
      value={questionOne}
      onSearch={(value) => handleQuestionClick(value, QuestionNumber.one)}
      onQuestionSkip={(value) => handleQuestionClick(value, QuestionNumber.one, true)}
    />
    <AdditionalQuestion
      show={_showQuestionTwo}
      userResponded={questionTwo?.answer ? true : false}
      placeholder={t('--describeYourBusinessNeed--')}
      value={questionTwo}
      onSearch={(value) => handleQuestionClick(value, QuestionNumber.two)}
      onQuestionSkip={(value) => handleQuestionClick(value, QuestionNumber.two, true)}
    />
    <AdditionalQuestion
      show={_showQuestionThree}
      userResponded={questionThree?.answer ? true : false}
      placeholder={t('--describeYourBusinessNeed--')}
      value={questionThree}
      onSearch={(value) => handleQuestionClick(value, QuestionNumber.three)}
      onQuestionSkip={(value) => handleQuestionClick(value, QuestionNumber.three, true)}
    />
    {/* Catalog */}
    <OroAnimator show={_showCatalog} withDelay><AIResponse userResponded={false}><Catalog
      catalog={catalog}
      reset={_showCatalog}
      onSearch={getCatalogItems}
      hideSkip={catalogSkipped}
      onSkip={skipCatalog}
      onCatalogLoad={onCatalogLoad} /></AIResponse></OroAnimator>
    {/* Category */}
    <OroAnimator show={_showCategoryControl} withDelay>
      <AIResponse onEdit={!isLoading && _categorySelected ? handleCategoryEditClick : undefined} userResponded={_categorySelected}>
        <CategoryWrapper
          onlyLeafSelectable={isCategoryLeafOnly}
          isReadOnly={false}
          isInPortal={true}
          userResponded={_categorySelected}
          formData={getCategoryRecommendFormData(userSearch, suggestedCategoryOptions, categories)}
          // fields={data?.oroformConfiguration?.orderedFields}
          onValueChange={handleCategorySelect}
          fetchChildren={props.fetchChildren}
          onSearch={props.onSearch}
          categoryOptions={categoryOptions}
          fetchCategory={props.fetchCategory} /></AIResponse></OroAnimator>
    {/* Supplier */}
    <OroAnimator show={_showSupplierControl} withDelay>
      <AIResponse
        onEdit={(!isLoading && (_supplierSelected || skipSupplier)) ? handleSupplierEditClick : undefined}
        userResponded={_supplierSelected}>
        <SupplierSuggestion
          reset={_showSupplierControl}
          isSkipped={skipSupplier}
          companyName={chatGPTSuggestion?.companyName || ''}
          selectedSupplier={suppliers?.[0] || null}
          suggestedSuppliers={suggestedSuppliers}
          defaultCurrency={props.defaultCurrency}
          preferredSuppliersDetail={chatGPTSuggestion?.preferredSuppliers || []}
          industryCodes={industryCodeOptions}
          supplierRoles={props.supplierRoles}
          countryOption={props.countryOption}
          languageOption={props.languageOption}
          fetchNVChildrensUsingParentID={props.fetchNVChildrensUsingParentID}
          onAdvanceSearch={props.onAdvanceSearch}
          onTypeaheadSearch={props.onTypeaheadSearch}
          onSelect={handleSupplierSelection}
          onSkipSupplier={handleSupplierSkip}
          onShowMore={handleShowMoreSupplier}
          onSearchSuppliers={handleSearchSuppliers}
          getVendorDetails={props.getVendorDetails}
          onVendorSelect={props.onVendorSelect}
          onParentSelect={props.onParentSelect}
          onNotSureSupplierProceed={props.onNotSureSupplierProceed}
          fetchExistingContactList={props.fetchExistingContactList}
          fetchNVVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
          fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
        /></AIResponse></OroAnimator>
    {/* Nudge Suppliers */}
    <OroAnimator show={_showNudgeSuppliers} withDelay>
      <AIResponse
        onEdit={undefined}
        userResponded={false}>
        <SupplierSuggestion
          isNudging
          isSkipped={false}
          reset={_showNudgeSuppliers}
          companyName={chatGPTSuggestion?.companyName || ''}
          selectedSupplier={null}
          suggestedSuppliers={nudgeSuppliers}
          defaultCurrency={props.defaultCurrency}
          preferredSuppliersDetail={chatGPTSuggestion?.preferredSuppliers || []}
          industryCodes={industryCodeOptions}
          supplierRoles={props.supplierRoles}
          fetchNVChildrensUsingParentID={props.fetchNVChildrensUsingParentID}
          onAdvanceSearch={props.onAdvanceSearch}
          onTypeaheadSearch={props.onTypeaheadSearch}
          onSelect={handleSupplierSelection}
          onSkipSupplier={handleNudgeSupplierSkip}
          onShowMore={handleShowMoreSupplier}
          onSearchSuppliers={handleSearchSuppliers}
          onVendorSelect={props.onVendorSelect}
          onParentSelect={props.onParentSelect}
          onNotSureSupplierProceed={props.onNotSureSupplierProceed}
          fetchExistingContactList={props.fetchExistingContactList}
          fetchNVVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
          fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
        /></AIResponse></OroAnimator>
    {/* Blocked Supplier */}
    <OroAnimator show={_isSupplierBlocked}>
      <AIResponse userResponded={false}>
        <BlockedSupplier
          description={supplierSegmentations?.[0]?.description} >
          {fallBackBuyingChannels?.[0] && <BuyingChannel
            primaryButton={t('--buyingChannel--.--getStarted--')}
            buyerChannelDetail={fallBackBuyingChannels[0]}
            fetchProcessSteps={props.fetchProcessSteps}
            fetchPreviewSubprocess={props.fetchPreviewSubprocess}
            fetchProcessDuration={props.fetchProcessDuration}
            createRequest={props.createRequest}
          />}
        </BlockedSupplier>
      </AIResponse>
    </OroAnimator>
    {/* Estimate */}
    <OroAnimator show={_showEstimate} withDelay>
      <AIResponse onEdit={!isLoading && estimateContinue ? handleEstimateEditClick : undefined} userResponded={estimateContinue}>
        <Estimate
          isReadView={estimateContinue}
          estimateAmount={estimatedAmount}
          locale={getSessionLocale()}
          unit={estimatedAmount?.currency || props.defaultCurrency || DEFAULT_CURRENCY}
          value={estimatedAmount?.amount ? estimatedAmount.amount.toLocaleString(getSessionLocale()) : ''}
          unitOptions={currenciesOptions}
          disabled={false}
          required={true}
          validator={(amount: string) => validateField(t("--estimate--.--estimateSpend--"), amount)}
          onChange={value => { handleEstimateChange({ amount: Number(getValueFromAmount(value)), currency: estimatedAmount?.currency || props.defaultCurrency || DEFAULT_CURRENCY }) }}
          onUnitChange={value => { handleEstimateChange({ amount: estimatedAmount?.amount, currency: value || props.defaultCurrency || DEFAULT_CURRENCY }) }}
          onContinue={handleEstimateContinue}
          title={t('--estimate--.--estimateSpend--')}
          editTitle={t('--estimate--.--pleaseConfirmEstimateSpend--')}
          continue={t('--estimate--.--continue--')}
        /></AIResponse></OroAnimator>
    {/* Compliance Form.. */}
    {_showComplianceForm && <OroAnimator show={_showComplianceForm} withDelay><ComplianceForm
      onEdit={handleComplianceEditClick}
      isLoading={isLoading}
      locale={getSessionLocale()}
      customFormData={complianceFormData}
      questionnaireId={complianceForm}
      options={props.options}
      dataFetchers={props.dataFetchers}
      events={props.events}
      title={t('--compliance--.--ComplianceQuestionnaire--')}
      continue={t('--compliance--.--continue--')}
      onContinue={handleComplianceContinueClick}
    /></OroAnimator>}
    {/* Buying Channels */}
    <OroAnimator show={_showBuyingChannel} withDelay>
      <AIResponse userResponded={false}>
        <BuyingChannels
          isFallbackShown={isFallbackShown}
          primaryButton={t('--buyingChannel--.--getStarted--')}
          title={t("--buyingChannel--.--basedOnNeedYouCanStartWith--")}
          buyerChannelDetails={buyingChanneldetails}
          fetchProcessSteps={props.fetchProcessSteps}
          fetchPreviewSubprocess={props.fetchPreviewSubprocess}
          fetchProcessDuration={props.fetchProcessDuration}
          createRequest={props.createRequest}
        />
      </AIResponse>
    </OroAnimator>
    <OroAnimator show={showPOStatus}>
      <AIResponse userResponded={false}>
        <PurchaseOrderList
        regions={regions}
        poId={chatGPTSuggestion?.poNumberOrId || ''}
        supplierName={chatGPTSuggestion?.companyName || ''}
        getNormalizedVendors={props.getNormalizedVendors}
        loadList={showPOStatus}
        fetchPOList={props.fetchPOList}></PurchaseOrderList>
      </AIResponse>
    </OroAnimator>

    <OroAnimator show={_showComingSoon}><AIResponse userResponded={false}><ComingSoon
      title={t("--comingSoon--.--comingSoon--")}
      message={t("--comingSoon--.--primaryMessage--")}
      secondaryMessage={t("--comingSoon--.--secondaryMessage--")}
    >{fallBackBuyingChannels?.[0] && <BuyingChannel
      primaryButton={t('--buyingChannel--.--getStarted--')}
      buyerChannelDetail={fallBackBuyingChannels[0]}
      fetchProcessSteps={props.fetchProcessSteps}
      fetchPreviewSubprocess={props.fetchPreviewSubprocess}
      fetchProcessDuration={props.fetchProcessDuration}
      createRequest={props.createRequest}
    />}</ComingSoon></AIResponse></OroAnimator>

    <OroAnimator show={isLoading} withDelay><AIResponse userResponded={false}><AIGenerator message={t('--generating--')} /></AIResponse></OroAnimator>
    <ScrollToView ref={pageEndRef} />
  </div>)
}
