import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from './supplier-upload-logo-dialog.module.scss'
import { X } from 'react-feather';
import { imageFileAcceptType, OROFileInput } from '../../Inputs';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';


export type UploadLogoModalProps = {
   isOpen: boolean
   logo?: string
   toggleModal?: () => void
   onImageUpload?: (document?: File) => void
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '920px',
  bgcolor: 'background.paper',
  boxShadow: '0px 4px 30px rgba(6, 3, 34, 0.15)',
  p: 4,
  outline: 'none',
  padding: '16px 24px',
  borderRadius: '8px'
}


export function UploadSupplierLogoDialog (props: UploadLogoModalProps) {

  const [previewLogo, setPreviewLogo] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File>(null)

  const { t } = useTranslationHook([NAMESPACES_ENUM.UPDATESUPPLIERCOMPANY])

  useEffect(() => {
    setPreviewLogo(props.logo)
  }, [props.logo])
   
  function toggleModal () {
    if (props.toggleModal) {
      setSelectedFile(null)
      setPreviewLogo(null)
      props.toggleModal()
    }
  }

  function handleFileSelect (file: File) {
    setPreviewLogo(URL.createObjectURL(file))
    setSelectedFile(file)
  }

  function uploadLogo () {
    if (props.onImageUpload) {
      props.onImageUpload(selectedFile)
    }
  }
 
  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={`${styles.uploadLogoModal}`}>
            <div className={styles.modalHeader}>
              <div className={styles.group}>
                {t('Upload logo')}
              </div>
              <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
            </div>

            <div className={`${styles.modalBody}`}>       
                <div className={styles.uploadDoc}>
                    {!previewLogo &&
                        <OROFileInput
                            inputFileAcceptTypes={imageFileAcceptType}
                            onFileSelected={handleFileSelect}
                        />
                    }
                    {previewLogo && <>
                      <img src={previewLogo} width="100%" alt=""/>
                    </>}
                </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={classnames(styles.buttonSecondary)} onClick={toggleModal}>
                {t('Close')}
              </button>
              <button className={classnames(styles.buttonPrimary)} onClick={uploadLogo}>
                {t('Upload')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}
 