import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from './attribute-modal-styles.module.scss'
import { X } from 'react-feather';
import { Attribute } from './engagement-listing.component';
import { CallbackOutcome } from '../Form';

const popUpDialogStyle = {
    position: 'absolute' as const,
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 343,
    minHeight: 93,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    padding: '16px 16px',
    background: '#FFFFFF',
    borderRadius: '4px'
}

export interface PopUpPros {
  attribute: Array<Attribute>
  isOpen?: boolean
  onClose?: () => void
}

const OUTCOME = 'Callback Status'

export function Popup (props: PopUpPros) {

    function handleModalClose(e?) {
      if (props.onClose) props.onClose()
    }

    function getCallbackoucome(outcomes: CallbackOutcome[]) {
      return (<>
         {
            outcomes.map((outcome, index) => {
              return (<div key={index}>
                <span className={styles.value}>
                    Bank Account {outcomes.length > 1 ? index + 1 : ''} ({outcome.accountNumber.maskedValue}) - {outcome.codeRef?.name}
                </span>
              </div>
              )
            })
         }
      </>)
    }

    return (<>
      <Modal
          open={props.isOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description">
          <Box sx={popUpDialogStyle}>
            <div className={styles.attributeModal}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        {props.attribute && props.attribute.length && props.attribute.map((item, index) => {
                            return ( <div key={index}>
                                <div className={styles.item}>
                                    <span className={styles.key}>{item.label}</span>
                                    {!item.outcome && <span className={styles.value}>{item.value}</span>}
                                    {item.outcome && getCallbackoucome(item.outcome)}
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                <div>
                  <X size={20} className={styles.closeBtn} onClick={handleModalClose} />
                </div>
            </div>
          </Box>
      </Modal>
  </>)
  }