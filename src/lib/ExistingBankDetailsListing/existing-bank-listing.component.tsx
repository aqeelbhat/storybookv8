import styles from './existing-bank-listing.style.module.scss'
import React, { useEffect, useState } from "react";
import { Circle } from "react-feather";
import { BankKey } from "../Types";
import { EnumsDataObject, FormBankInfo } from '../Form/types';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import radioFilledGreenIcon from '../Form/assets/radio-filled-green.png'
import classNames from 'classnames';
import { getI18Text } from "../i18n";

interface ExistingBankListingProps {
    selectedIndex: number
    showBankDetailForm?: boolean
    bankKeys?: EnumsDataObject[]
    supplierBankList?: Array<FormBankInfo>
    onSelectAddNewBank: (showNewBankForm: boolean) => void
    onSelectionOfExistingBank?: (indexOfSelectedBank: number) => void
}

export function ExistingBankListing (props: ExistingBankListingProps) {
    const [bankList, setBankList] = useState<Array<FormBankInfo>>([])
    const [showBankDetailForm, setShowBankDetailForm] = useState<boolean>(false)
    const [showBankOptionType, setShowBankOptionType] = useState<string>('bankList')

    // function addNewBank () {
    //   if (props.onSelectAddNewBank) {
    //     props.onSelectAddNewBank(showBankDetailForm)
    //   }
    // }

    useEffect(() => {
        setShowBankDetailForm(props.showBankDetailForm)
        if (!props.showBankDetailForm) {
            setShowBankOptionType('bankList')
        } else {
            setShowBankOptionType('newBank')   
        }
    }, [props.showBankDetailForm])

    function getBankKeyName (key: BankKey): string {
        return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
      }
    
    useEffect(() => {
        setBankList(props.supplierBankList)
        if (props.supplierBankList?.length > 0) {
            setShowBankDetailForm(false)
        } else {
            setShowBankDetailForm(true)
        }
    }, [props.supplierBankList])

    function handleExistingBankSelection (bankSelectedIndex: number) {
        if (props.onSelectionOfExistingBank) {
            props.onSelectionOfExistingBank(bankSelectedIndex)
        }
    }

    function handleSelectionOfBankDetails (e) {
        const id = e.target.id
        const isShowNewBankForm = (id === 'newBank')
        setShowBankDetailForm(isShowNewBankForm)
        setShowBankOptionType(id)
        if (props.onSelectAddNewBank) {
            props.onSelectAddNewBank(isShowNewBankForm)
          }
    }

return(
    <div className={styles.ebl}>
        <div className={styles.eblHeader}>
            <span className={styles.title}>{getI18Text("Select or add payment details")}</span>
            <div className={styles.addNew}>
                <RadioGroup aria-label="existingBankList" name="existingBankList" value={showBankOptionType} onChange={handleSelectionOfBankDetails} className={styles.selectionType}>
                    <FormControlLabel
                        value={showBankOptionType === 'bankList' && 'bankList'}
                        control={<Radio
                            id="bankList"
                            checkedIcon={<img src={radioFilledGreenIcon} alt="" />}
                            icon={<Circle color="#d9d9d9" size={16}></Circle>} />
                        }
                        label={getI18Text("Select from existing")}
                    />
                    <FormControlLabel
                        value={showBankOptionType === 'newBank' && 'newBank'}
                        control={<Radio
                            id="newBank"
                            checkedIcon={<img src={radioFilledGreenIcon} alt=""/>}
                            icon={<Circle color="#d9d9d9" size={16}></Circle>} />
                        }
                        label={getI18Text("Add new bank details")}
                    />
                </RadioGroup>
            </div>
        </div>
        {!showBankDetailForm && showBankOptionType === 'bankList' && <div className={styles.eblBody}>
            {bankList && bankList.map((item, index) => {
                return (
                  <div className={classNames(styles.eblBodyRow, index === props.selectedIndex ? styles.eblBodySelectedRow : '')} key={`bank_${index}`}>
                    <div className={styles.eblBodyRowRadio}>
                        <input
                            className={styles.bankRadio}
                            type="radio"
                            id={`OroRadio_${index}`}
                            name={`OroRadio`}
                            checked={index === props.selectedIndex}
                            onChange={() => handleExistingBankSelection(index)}
                            />
                    </div>
                    <div className={styles.eblBodyRowPayment}>
                        <div className={styles.eblBodyRowPaymentDetails}>
                            <div className={styles.bankDetails}>
                                <div className={styles.title}>
                                    <div className={styles.name}>{`${item.bankName}`}</div>
                                    <div className={styles.country}>{`United states`}</div>
                                </div>
                                <div className={styles.accNumber}>
                                    <label className={styles.label}>{`${getBankKeyName(item.key)}:`}</label>
                                    <span className={styles.value}>{item.bankCode || '-'}</span>
                                </div>
                                <div className={styles.accNumber}>
                                    <label className={styles.label}>{getI18Text("Account number")}:</label>
                                    <span className={styles.value}>{item.accountNumber?.maskedValue || '-'}</span>
                                </div>
                            </div>
                        </div>
                        {/* <div className={styles.eblBodyRowPaymentCreatedDate}>Created on: {getDateDisplayString(item.created)}</div> */}
                    </div>
                  </div>
                )
            })} 
        </div>}
    </div>
)
}