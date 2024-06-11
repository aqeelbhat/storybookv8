import { KeyboardEventHandler, MouseEventHandler, PropsWithChildren } from 'react'
import { ContractTypeDefinition, Field } from '..'
import { DataFetchers, Events, FieldOptions } from '../CustomFormDefinition/NewView/FormView.component'
import { ObjectSelectorConfig, ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { OptionTreeData } from '../MultiLevelSelect/types'
import { ContractDetail, IDRef, ObjectSearchVariables, ObjectValue, PurchaseOrder, Document } from '../Types/common'
import { Address, Attachment, EncryptedData, Option, User } from './../Types'

export type { Option }

export interface Input {
  id?: string
  label?: string
  disabled?: boolean
  required?: boolean
  forceValidate?: boolean
  disableSearch?: boolean
  infoText?: string
  inTableCell?: boolean
  validator?: (value?) => string | null
  onChange?: (value?) => void
}

export interface TypeAheadProps extends Input {
  options: Option[]
  placeholder?: string
  type?: OptionTreeData
  value?: Option
  showTree?: boolean
  disableTypeahead?: boolean
  applyFullWidth?: boolean
  hideClearButton?: boolean
  noBorder?: boolean
  expandLeft?: boolean
  backgroundColor?: string
  fontWeight?: string
  absolutePosition?: boolean
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onSearch?: (keyword: string) => Promise<Option[]>
}

export interface AsyncTypeAheadProps extends Input {
  placeholder?: string
  value?: Option
  taskPageSearch?: boolean
  secondaryDisplayValueKey?: string
  onSearch?: (keyword: string) => Promise<Option[]>
}

export interface AsyncMultiSelectTypeAheadProps extends Input {
  placeholder?: string
  value?: Option[]
  secondaryDisplayValueKey?: string
  onSearch?: (keyword: string) => Promise<Option[]>
}

export interface MultiSelectProps extends Input {
  options: Option[]
  placeholder?: string
  type?: OptionTreeData
  showTree?: boolean
  isListView?: boolean
  typeahead?: boolean
  showElaborateLabel?: boolean
  value?: Option[]
  showClearAllOption?: boolean
  applyFullWidth?: boolean
  expandLeft?: boolean
  noBorder?: boolean
  absolutePosition?: boolean
  showSearchBox?: boolean
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onSearch?: (keyword: string) => Promise<Option[]>
}

export interface UserIdProps extends Input {
  placeholder?: string
  value?: User
  optional?: boolean
  isReadOnly?: boolean
  onSearch?: (keyword: string) => Promise<User[]>
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
}

export interface TextBoxProps extends Input {
  placeholder?: string
  value?: string
  description?: string
  enableSameAs?: boolean
  sameAsLabel?: string
  isSameAs?: boolean
  warning?: boolean
  inTableCell?: boolean
  onSameAsChange?: (useSame: boolean) => void
}

export interface AttachmentProps extends Input {
  placeholder?: string
  value?: Attachment | File
  description?: string
  linkText?: string
  link?: string
  error?: string
  inputFileAcceptTypes?: string
  controlled?: boolean
  theme?: 'coco'
  fullWidth?: boolean
  onPreview?: () => Promise<Blob>
  onPreviewByURL?: () => Promise<Blob | string>
}

export interface EncryptedBoxProps extends Input {
  placeholder?: string
  description?: string
  value: EncryptedData
  unmaskByDefault?: boolean
  warning?: boolean
  onBlur?: (value: EncryptedData) => void
}

export interface QuantityBoxProps extends Input {
  placeholder?: string
  value?: string
  unit: string
  unitOptions?: Option[]
  disableUnit?: boolean
  onUnitChange?: (value: string) => void
  hideClearButton?: boolean
  allowNegative?: boolean
  locale: string
}

export interface NumberBoxProps extends Input {
  placeholder?: string
  value?: string
  hideDecimal?: boolean
  decimalLimit?: number
  allowNegative?: boolean
}

export interface ToggleButtonProps extends Input {
  options: Option[]
  defaultOption?: Option
  value?: Option
}

export interface RadioProps extends Input {
  options: Option[]
  defaultValue?: Option
  value?: Option
  name: string
  id?: string
  showHorizontal? : boolean
  optional? : boolean
  isReadOnly? : boolean
  showPathString?: boolean
}

export interface YesNoRadioProps extends Input {
  value?: boolean
  name: string
}

export interface YesNoButtonProps extends Input {
  value?: boolean
  description?: string
}

export interface DateRangeType {
  startDate: Date
  endDate: Date
  key: string
}

export interface DateRangeProps extends Input {
  startDate: Date
  endDate: Date
  onDateRangeChange?: (startDate: string, endDate: string) => void
}

export interface DatePickerProps extends Input {
  value: Date | null
  placeholder?: string
  disableFuture?: boolean
  disablePast?: boolean
  allowClear?: boolean
  disableDateBeforeAfter?: {
    startDate?: Date | null
    endDate?: Date | null
  }
  datePickerLabel?: string
}

export interface OROInputProps extends Input {
  name?: string
  value?: string
  placeholder?: string
  id?: string
  onFocus?: (e) => void
  optional?: boolean
  isReadOnly?: boolean
}

export interface OROAddressInputProps extends OROInputProps {
  initializeGoogleApi?: () => void // keeping this optional, so that we can use palin address component also.
}

export interface OROFileInputProps {
  inputFileAcceptTypes?: string
  onFileSelected?: (e: File) => void
}

export interface GooglePlaceSearchProps extends Input {
  id: string
  disabled?: boolean
  placeholder?: string
  readonly?: boolean
  value?: string
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
}

export interface GoogleMultilinePlaceSearchProps extends Input {
  id: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  value?: Address
  enableSameAs?: boolean
  sameAsLabel?: string
  isSameAs?: boolean
  optional?: boolean
  isReadOnly?: boolean
  countryOptions?: Option[]
  dataTestIdPrefix?: string
  warning?: boolean
  excludeAddressSuggestion?: boolean
  absolutePosition?: boolean // makes dropdown positions 'absolute'
  onChange?: (value?, countryChanged?: boolean) => void
  onSameAsChange?: (useSame: boolean) => void
  parseAddressToFill?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
}

export interface YesNoToggleProps {
  value?: boolean | null
  onSelect?: (value: boolean) => void
}
export type ObjectSelectorSearchResponse =  { objs: ObjectValue[], total: number }
export interface ObjectSelectorProps extends Input {
  placeholder?: string
  value?: IDRef
  type?: ObjectType
  description?: string
  objectSelectorConfig?: ObjectSelectorConfig
  departmentOptions?: Option[]
  showDocuments?: boolean
  showSelect?: boolean
  searchObjects?: (type: ObjectType, searchVariables: ObjectSearchVariables) => Promise<ObjectSelectorSearchResponse>
  getPO?: (id: string) => Promise<PurchaseOrder>
  getContract?: (id: string) => Promise<ContractDetail>
  onDocumentClick?: (doc: Document) => void
  onSelect?: (value: IDRef) => void
  staticOptions?: ObjectSelectorSearchResponse
  poFormConfig?: Field[]
  getContractTypeDefinition?: () => Promise<ContractTypeDefinition[]>
  getFormConfig?: (formId: string) => Promise<Field[]>
  options?: FieldOptions
  dataFetchers?: DataFetchers
  events?: Events
}

export const docFileAcceptType = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
export const textFileAcceptType = 'text/plain'
export const xlsFileAcceptType = '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export const pdfFileAcceptType = 'application/pdf,.pdf'
export const csvFileAcceptType = 'text/csv,.csv'
export const imageFileAcceptType = 'image/*,.png,.jpg,.jpeg,image/png,image/jpg,image/jpeg'
export const emlFileAcceptTypes = '.eml, message/rfc822, eml'
export const msgFileAcceptTypes = '.msg, application/octet-stream, application/vnd.ms-outlook, msg'
export const pptFileAcceptTypes = 'application/vnd.ms-powerpoint, ppt, pptx, application/vnd.openxmlformats-officedocument.presentationml.presentation'
export const videoFileAcceptTypes = 'video/*, application/x-shockwave-flash, video/x-flv, .mkv'
export const audioFileAcceptTypes = 'audio/*, .m4p'
export const jsonFileAcceptType = ['json', 'JSON', '.json', 'application/json', 'text/plain']
export const ZIP_FILE_ACCEPT_TYPE = 'application/zip, application/x-zip-compressed, multipart/x-zip, .zip, zip, application/zip-compressed'
export const inputFileAcceptType = `${docFileAcceptType},${ZIP_FILE_ACCEPT_TYPE},${xlsFileAcceptType},${pdfFileAcceptType},${csvFileAcceptType},${imageFileAcceptType},${emlFileAcceptTypes},${msgFileAcceptTypes},${pptFileAcceptTypes},${videoFileAcceptTypes},${audioFileAcceptTypes}`
export const proposalFileAcceptTypes = `${pdfFileAcceptType},${docFileAcceptType},${csvFileAcceptType},${pptFileAcceptTypes}`

export const SPACEBAR_KEY_CODE = [0,32];
export const ENTER_KEY_CODE = 13;
export const DOWN_ARROW_KEY_CODE = 40;
export const UP_ARROW_KEY_CODE = 38;
export const ESCAPE_KEY_CODE = 27;

export enum FileType {
  text = 'text',
  doc = 'doc',
  csv = 'csv',
  pdf = 'pdf',
  xls = 'xls',
  img = 'img',
  json = 'json',
  email = 'email',
  msg = 'msg',
  video = 'video',
  audio = 'audio',
  ppt = 'ppt',
  zip = 'zip'
}

export const FILE_TYPE_OPTIONS: Option[] = [
  {
    id: FileType.text,
    path: textFileAcceptType,
    displayName: 'text',
    selectable: true
  },
  {
    id: FileType.doc,
    path: docFileAcceptType,
    displayName: 'doc',
    selectable: true
  },
  {
    id: FileType.csv,
    path: csvFileAcceptType,
    displayName: 'csv',
    selectable: true
  },
  {
    id: FileType.pdf,
    path: pdfFileAcceptType,
    displayName: 'pdf',
    selectable: true
  },
  {
    id: FileType.xls,
    path: xlsFileAcceptType,
    displayName: 'xls',
    selectable: true
  },
  {
    id: FileType.img,
    path: imageFileAcceptType,
    displayName: 'image',
    selectable: true
  },
  {
    id: FileType.json,
    path: jsonFileAcceptType.join(','),
    displayName: 'json',
    selectable: true
  },
  {
    id: FileType.email,
    path: emlFileAcceptTypes,
    displayName: 'email',
    selectable: true
  },
  {
    id: FileType.msg,
    path: msgFileAcceptTypes,
    displayName: 'message',
    selectable: true
  },
  {
    id: FileType.video,
    path: videoFileAcceptTypes,
    displayName: 'video',
    selectable: true
  },
  {
    id: FileType.audio,
    path: audioFileAcceptTypes,
    displayName: 'audio',
    selectable: true
  },
  {
    id: FileType.ppt,
    path: pptFileAcceptTypes,
    displayName: 'ppt',
    selectable: true
  },
  {
    id: FileType.zip,
    path: ZIP_FILE_ACCEPT_TYPE,
    displayName: 'zip',
    selectable: true
  }
]

export type TextMaskConfig = {
  prefix: string
  suffix: string
  includeThousandsSeparator: boolean
  thousandsSeparatorSymbol: string
  allowDecimal: boolean
  decimalSymbol: string
  decimalLimit: number // props.decimalLimit || 2, // how many digits allowed after the decimal
  integerLimit: number | null // limit length of integer numbers
  allowNegative: boolean
  allowLeadingZeroes: boolean
}
