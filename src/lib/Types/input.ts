export interface Option {
  id: string;
  displayName: string;
  path: string;
  customData?: any;
  icon?: string;
  selected?: boolean;
  selectable?: boolean;
  children?: Option[];
  hierarchy?: string;
  pathDisplayName?: string
}
