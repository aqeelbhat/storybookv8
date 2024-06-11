/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: noopur landge
 ************************************************************/

import { Keyboard } from '../Types/common'
import { getI18Text } from '../i18n'
import { Option } from './../Types'

export type { Option }

export const HIERARCHY_DELIM = ':'
export const FIELD_TYPE_BOOL = 'bool'
export const DROPDOWN_MAX_HEIGHT = 314
export const DEFAULT_MASTERDATA_BATCH_SIZE = 1000

export enum OptionTreeData {
  category = 'category',
  entity = 'entity'
}
export type OptionTreeDataType = OptionTreeData

export function getOptionTreeDataName (type?: OptionTreeData): string | undefined {
  switch (type) {
    case OptionTreeData.category:
      return getI18Text('--category--')
    case OptionTreeData.entity:
      return getI18Text('--companyEntity--')
  }
}

export type OptionLevelProps = {
  keyboardEvent?: Keyboard;
  options?: Option[];
  selectedValues: Option[];
  isParentSelected?: boolean;
  title?: string;
  expandLeft?: boolean;
  multiSelect?: boolean;
  onlyLeafSelectable?: boolean
  optionsHeader?: string;
  activeIndex?: number;
  isClearAllVisible?: boolean;
  isBrowseAllVisible?: boolean;
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onOptionChange?: (option: Option) => void;
  onChildrenSelectionChange?: (selectedValues: Option[], deselectedValues: Option[], currentParrent?: Option) => void;
  onActiveIndexChanged?: (index: number) => void;
  onOptionsVisible?: (isOpen: boolean) => void;
  onBrowseAll?: () => void;
  onDeselectAll?: () => void;
  onLevelClose?: () => void;
}

export type SearchResultsProps = {
  options: Option[] | undefined;
  searchString: string;
  path: string;
  selectedValues: Option[];
  isParentSelected?: boolean;
  multiSelect?: boolean;
  onlyLeafSelectable?: boolean
  keyboardEvent?: Keyboard;
  activeIndex?: number;
  forceLastChildSelection?: boolean;
  isBrowseAllVisible?: boolean;
  onSelect?: (option: Option) => void
  onChildrenSelectionChange?: (selectedValues: Option[], deselectedValues: Option[], currentParrent?: Option) => void;
  onActiveIndexChanged?: (index: number, filteredItemsLength: number) => void;
  onExitLevel?: (key: Keyboard) => void;
  onBrowseAll?: () => void;
}

export type OptionTreePopupProps = {
  isOpen?: boolean
  type?: OptionTreeData
  options: Option[] | undefined
  selectedValues: Option[]
  multiSelect?: boolean
  onlyLeafSelectable?: boolean
  async?: boolean
  regionOptions?: Option[]
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onSearch?: (keyword?: string) => Promise<Option[]>
  onSubmit?: (options: Option[]) => void
  onClose?: () => void
}

export type MultiLevelSelectConfig = {
  selectMultiple?: boolean;
  typeahead?: boolean;
  enableTree?: boolean
  disableDropdown?: boolean;
  expandLeft?: boolean;
  maxLevel?: number;
  showElaborateLabel?: boolean;
  optionsHeader?: string;
  isListView?: boolean;
  showClearAllOption?: boolean
  applyFullWidth?: boolean
  hideClearButton?: boolean
  noBorder?: boolean
  backgroundColor?: string;
  fontWeight?: string;
  absolutePosition?: boolean
  onlyLeafSelectable?: boolean
  showSearchBox?: boolean
}

export type MultiLevelSelectProps = {
  id?: string
  options: Option[];
  placeholder?: string;
  type?: OptionTreeData
  config?: MultiLevelSelectConfig;
  classnames?: string[];
  disabled?: boolean;
  regionOptions?: Option[]
  inTableCell?: boolean
  onChange?: (selectedOptions: Option[]) => void;
}

export type MultiLevelAsyncSelectProps = {
  id?: string
  value?: Option[]
  options: Option[]
  placeholder?: string
  type?: OptionTreeData
  config?: MultiLevelSelectConfig
  classnames?: string[]
  disabled?: boolean
  regionOptions?: Option[]
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onSearch?: (keyword?: string) => Promise<Option[]>
  onChange?: (selectedOptions: Option[]) => void
}
