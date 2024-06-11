export interface IActionsProps {
    cancelLabel: string
    submitLabel: string
    onCancel: () => void
    onSubmit: () => void
    classNames?: string,
    hideSeparate?: boolean
}
