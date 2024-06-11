export interface OROFileUploadProps {
    fieldName?: string
    title?: string
    onClose?: () => void
    onFileSelected?: (file: File, filedName: string, fileName: string, note?: string) => void
}