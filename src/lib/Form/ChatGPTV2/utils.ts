import { ICategoryRecommFormDataV2 } from "../CategoryRecommendationV2/types";
import { mapOptionToIDRef, mapStringToOption } from "../util";
import { Option, } from "../../Inputs";
import { Attachment, Money } from "../../Types";
import { ChatGPTV2FormData, ChatGPTSuggestion, OtherSuppliers, PreferredSuppliers, ChatGPTApiSuggestion, GPTV2Intent, OtherSupplierAPI, PreferredSupplierAPI } from "./types";
import { DEFAULT_CURRENCY } from "../../util";
import moment from "moment";

function getFlattenCategoryList (options: Option[]) {
  let children = [];

  const flattenMembers = options.map(option => {
    if (option.children && option.children.length) {
      children = [...children, ...option.children];
    }
    return option;
  });

  return flattenMembers.concat(children.length ? getFlattenCategoryList(children) : children);
}

// Get full path from master data options
function getFullPath (splittedCode: string, options: Option[]): string {
  const matchedOption = options?.find(option => option.path === splittedCode || option.customData?.code === splittedCode)
  return matchedOption?.path || splittedCode
}
function getSplittedOption (name: string) {
  const splittedOption = name.trim().split('|')
  if (splittedOption?.length > 1) {
    const pathOptions = splittedOption.slice(0, -1)
    return { name: splittedOption[splittedOption.length - 1].trim(), path: pathOptions?.length ? pathOptions.join(', ').trim() : '' }
  } else {
    return { name: splittedOption[0].trim(), path: '' }
  }
}
export function mapSuggestedCategoryToOption (commodityList: string[], commodityCodeList: string[], categories: Option[]): Option[] {
  const flatCategoryList = getFlattenCategoryList(categories)

  const options = commodityList.map((category, index) => {
    const splittedOption = getSplittedOption(category)
    const fullPath = getFullPath(commodityCodeList[index], flatCategoryList)
    return {
      id: category,
      displayName: splittedOption?.name || category,
      path: fullPath,
      selected: true,
      selectable: true,
      pathDisplayName: splittedOption?.path || ''
    }
  })

  return options
}

export function getMoneyFromSuggestion (totalBudget: string, userDefaultCurrency: string): Money {
  const amount = totalBudget.replace(/\D/g, "")
  const currency = totalBudget.replace(/[^a-zA-Z]/g, "")
  return { amount: amount ? Number(amount) : undefined, currency: userDefaultCurrency || currency || DEFAULT_CURRENCY }
}


export function getCategoryRecommendFormData (summary: string, suggestedCategoryOptions: Option[], selectedCategories: Option[]): ICategoryRecommFormDataV2 {
  return {
    "summary": summary,
    "categories": selectedCategories ? selectedCategories.map(mapOptionToIDRef) : null,
    "recommendation": {
      categoryRecommendation: {
        codes: (suggestedCategoryOptions || []).map(mapOptionToIDRef),
        parents: []
      }
    }
  }
}
type Options = {
  suggestions: ChatGPTSuggestion
  categories: Option[]
  currency: string
  regions: Option[]
  proposal: Attachment | File | null
  userIntent
}
export function mapChatGPTResponseToFormData (options: Options): ChatGPTV2FormData {
  const { suggestions, categories, regions, currency, proposal, userIntent } = options
  return {
    categories: categories?.length > 0 ? suggestions?.commodityList?.length ? mapSuggestedCategoryToOption(suggestions?.commodityList, suggestions?.commodityCodeList, categories) : [] : [],
    regions: suggestions?.countryCode ? [mapStringToOption(suggestions?.countryCode)] : regions?.length ? regions : [],
    intentStrings: suggestions?.intent ? [suggestions?.intent] : [],
    amount: suggestions?.totalBudget ? getMoneyFromSuggestion(suggestions?.totalBudget, currency) : null,
    selectedSuppliers: [],
    proposal: proposal,
    userIntent: userIntent
  }
}


export function mapPreferredSuppliers (data: PreferredSupplierAPI): PreferredSuppliers {
  return {
    commodityId: data?.commodity_id || '',
    erpSupplier: data?.erp_supplier || '',
    erpSupplierId: data?.erp_supplier_id || '',
    supplierStatus: data?.supplier_status || '',
    title: data?.requisition_title || '',
    userId: data?.requester_user_id || '',
    companyCode: data?.company_code || '',
    created: data?.created || '',
    totalSpend: data?.hasOwnProperty('sum(PO Spend)') ? data['sum(PO Spend)'] : null
  }
}
export function mapOtherSuppliers (data: OtherSupplierAPI): OtherSuppliers {
  return {
    erpVendorId: data['ERP Vendor ID'],
    materialGroundId: data['Material Group ID'],
    materialGroupName: data['Material Group Name'],
    supplierStatus: data['Supplier Status'],
    vendorName: data['Vendor Name'],
    countryCode: data['country_code']
  }
}
export function mapChatGPTSuggestionToModal (data: ChatGPTApiSuggestion): ChatGPTSuggestion {
  const otherSuppliers = data?.hasOwnProperty('Other suppliers') ? data['Other suppliers'] : data.hasOwnProperty('Other Suppliers') ? data['Other Suppliers'] : []
  const preferredSuppliers = data?.hasOwnProperty('PR Suppliers') ? data['PR Suppliers'] : data.hasOwnProperty('PR suppliers') ? data['PR suppliers'] : []
  const commodityList = data['commodity_list']
  const commodityCodeList = data['commodity_code_list']
  return {
    intent: (data?.Intent || '') as GPTV2Intent,
    productName: data?.product_names || '',
    commodityList: commodityList || [],
    commodityCodeList: commodityCodeList || [],
    countryCode: data?.country_code || '',
    totalBudget: data?.total_budget || '',
    companyName: data?.company_names || '',
    otherSuppliers: otherSuppliers && otherSuppliers.length > 0 ? otherSuppliers.map(mapOtherSuppliers) : null,
    preferredSuppliers: preferredSuppliers && preferredSuppliers.length > 0 ? preferredSuppliers.map(mapPreferredSuppliers) : null,
    disableProductSearch: data?.disable_product_search || false,
    poNumberOrId: data?.PO_number_or_id || ''
  }
}
export function getFormattedDate (date: string, isUTC?: boolean): string {
  if (date) {
    return isUTC ? moment.utc(date).format('MMM DD, yyyy') : moment(date).format('MMM DD, yyyy')
  } else {
    return ''
  }
}