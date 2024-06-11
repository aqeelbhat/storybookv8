import { Option } from "../../Inputs";
import { Money, Supplier } from "../../Types";
import { getSessionLocale } from "../../sessionStorage";
import { DEFAULT_CURRENCY } from "../../util";
import { ChatGPTFormData, ChatGPTSuggestion, OtherSuppliers, PreferredSuppliers, RequestBotTab, enumChapGPTRequestBotFields } from "./types";

export function mapChatGPTSuggestionToModal (data: any): ChatGPTSuggestion {
    const otherSuppliers = data?.hasOwnProperty('Other suppliers') ? data['Other suppliers'] : data.hasOwnProperty('Other Suppliers') ? data['Other Suppliers'] : []
    const preferredSuppliers = data?.hasOwnProperty('PR Suppliers') ? data['PR Suppliers'] : data.hasOwnProperty('PR suppliers') ? data['PR suppliers'] : []
    const commodityList = data['commodity_list']
    const commodityCodeList = data['commodity_code_list']
    return {
        intent: data?.Intent || '',
        productName: data?.Product_name || '',
        commodityList: commodityList || [],
        commodityCodeList: commodityCodeList || [],
        countryCode: data?.country_code || '',
        totalBudget: data?.total_budget || '',
        companyName: data?.company_names || '',
        otherSuppliers: otherSuppliers && otherSuppliers.length > 0 ? otherSuppliers.map(mapOtherSuppliers) : null,
        preferredSuppliers: preferredSuppliers && preferredSuppliers.length > 0 ? preferredSuppliers.map(mapPreferredSuppliers) : null
    }
}

export function mapOtherSuppliers (data: any): OtherSuppliers {
    return {
        erpVendorId: data['ERP Vendor ID'],
        materialGroundId: data['Material Group ID'],
        materialGroupName: data['Material Group Name'],
        supplierStatus: data['Supplier Status'],
        vendorName: data['Vendor Name'],
        countryCode: data['country_code']
    }
}

export function mapPreferredSuppliers (data: any): PreferredSuppliers {
    return {
        commodityId: data?.commodity_id || '',
        erpSupplier: data?.erp_supplier || '',
        erpSupplierId: data?.erp_supplier_id || '',
        supplierStatus: data?.supplier_status || '',
        title: data?.requisition_title || '',
        userId: data?.requester_user_id || '',
        companyCode: data?.company_code || '',
        totalSpend: data?.hasOwnProperty('sum(PO Spend)') ? data['sum(PO Spend)'] : null
    }
}

function getSplitedOption (name: string) {
    const splitedOption = name.trim().split('|')
    if (splitedOption?.length > 1) {
      const pathOptions = splitedOption.slice(0, -1)
      return {name: splitedOption[splitedOption.length - 1].trim(), path: pathOptions?.length ? pathOptions.join(', ').trim() : ''}
    } else {
      return {name: splitedOption[0].trim(), path: ''}
    }
}
// Get full path from master data options
function getFullPath (splittedCode: string, options: Option[]): string {
    const matchedOption = options?.find(option => option.path === splittedCode || option.customData?.code === splittedCode)
    return matchedOption?.path || splittedCode
}

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

export function mapSuggestedCategoryToOption (commodityList: string[], commodityCodeList: string[], categories: Option[]): Option[] {
    const flatCategoryList = getFlattenCategoryList(categories)

    const options = commodityList.map((category, index) => {
        const splitedOption = getSplitedOption(category)
        const fullPath = getFullPath(commodityCodeList[index], flatCategoryList)
        console.log(fullPath)
        return {
            id: category,
            displayName: splitedOption?.name || category,
            path: fullPath,
            selected: true,
            selectable: true,
            pathDisplayName: splitedOption?.path || ''
        }
    })

    return options
}

export function getMoneyFromSuggestion (totalBudget: string, userDefaultCurrency: string): Money {
    const amount = totalBudget.replace(/\D/g, "")
    const currency = totalBudget.replace(/[^a-zA-Z]/g,"")
    return { amount: amount ? Number(amount) : undefined, currency: userDefaultCurrency || currency || DEFAULT_CURRENCY }
}

export function buildRequestBotTabs (data: ChatGPTFormData, t: (key: string) => string, suggestedSuppliers?: Supplier[], isSkip?: boolean): RequestBotTab[] {
    const tabs: RequestBotTab[] = []

    tabs.push({id: enumChapGPTRequestBotFields.categories, name: t('--categoryTab--'), value: data?.categories?.length === 1 ? data.categories[0]?.displayName : '', isSkip: false})

    if (data.regions?.length) {
       tabs.push({id: enumChapGPTRequestBotFields.regions, name: t('--region--'), value: data.regions.map(region => region.displayName)?.join(', '), isSkip: false})
    }
    if (data.selectedSuppliers?.length || suggestedSuppliers?.length) {
       tabs.push({id: enumChapGPTRequestBotFields.suppliers, name: t('--supplierTab--'), value: data.selectedSuppliers.length === 1 ? data.selectedSuppliers[0]?.supplierName : '', isSkip: isSkip || false})
    }

    // We need to ask estimated spend wheather or not totalBudget return by GPT
    const spend = data.amount?.amount ? `${data.amount?.amount?.toLocaleString(getSessionLocale())} ${data.amount?.currency}` : ''
    tabs.push({id: enumChapGPTRequestBotFields.amount, name: t('--estimatedSpend--'), value: spend || '', isSkip: false})

    return tabs
}
