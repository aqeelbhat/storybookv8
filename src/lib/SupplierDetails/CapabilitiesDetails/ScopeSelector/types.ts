
export const HIERARCHY_DELIM = ':'

export interface ScopeSelectorProps {
  options: Option[];
  isOpen: boolean;
  isLoading?: boolean;
  toggle: () => void;
  onSubmit?: (selectedConditions: Option[]) => void;
}

export interface ScopeTypesProps {
  types: Option[];
  selectedValues: Option[];
  onSelect?: (index: number) => void;
}

export interface OptionsProps {
  data: Option;
  isSelected?: boolean;
  isParentSelected?: boolean;
  selectedValues: Option[];
  onOptionSelectionChange?: (value: Option) => void;
  onChildrenSelectionChange?: (selectedValues: Option[], deselectedValues: Option[]) => void;
}

export interface Condition {
  description?: string
  empty?: boolean
  conditions?: Condition[]
  ordering?: number;
}

export interface Option extends Condition {
  id: string;
  displayName: string;
  path: string;
  icon?: string;
  selected?: boolean;
  selectable?: boolean;
  children?: Option[];
  hierarchy?: string;
  value?: string;
}

export interface ConditionValuesMap {
  [key: string]: string[]
}

