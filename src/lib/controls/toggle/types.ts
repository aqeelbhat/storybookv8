import { Input } from "../../Inputs/types"

export interface ToggleSwitchProps extends Input {
  falsyLabel?: string
  truthyLabel?: string
  value: boolean
  className?: string
}