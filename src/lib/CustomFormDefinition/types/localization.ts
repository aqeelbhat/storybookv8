export interface CommonLocalConfig {
    labelPrefix?: string
    choices?: LocalChoices
}
export interface LocalChoices {
  [value: string]: string
}
export interface  CommonLocalLabels extends CommonLocalConfig {
    title?: string,
    name?: string,
    description?: string,
    helpText?: string
}

export interface LocalLabels {
    [id: string]: CommonLocalLabels
}
