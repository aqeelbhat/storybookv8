import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { ChevronLeft, ChevronRight, X } from 'react-feather';
import styles from './sanction-result-dialog.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import { Grid } from '@mui/material';
import { Label, Separator, Title, Value } from '../../controls/atoms';
import { SanctionAdditionalAddress, SanctionEntityDetails } from '../types';
import { Contact, Option } from '../../Types';
import ALPHA2CODES_DISPLAYNAMES from '../../util/alpha2codes-displaynames';

export type SanctionResultModalProps = {
    allEntities: SanctionEntityDetails[]
    currentIndex: number
    isOpen: boolean
    shareHolder?: Contact
    roleOptions?: Option[]
    isAdverseMedia?: boolean
    toggleModal?: () => void
 }
 
 const style = {
   position: 'absolute' as const,
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '1000px',
   bgcolor: 'background.paper',
   boxShadow: '0px 4px 30px 0px rgba(6, 3, 34, 0.15)',
   p: 4,
   outline: 'none',
   padding: '24px',
   borderRadius: '12px'
}

export function SanctionResultDialog (props: SanctionResultModalProps) {
    const [sanctionResult, setSanctionResult] = useState<SanctionEntityDetails | null>(null)
    const [currentIndex, setCurrentIndex] = useState<number>(null)
    const [roleOptions, setRoleOptions] = useState<Option[]>([])
    const [formattedRemark, setFormattedRemark] = useState<Array<string>>([])
    const [isShowMore, setIsShowMore] = useState(false)
    const [expandRemark, setExpandRemark] = useState(false)
    const { t } = useTranslationHook([NAMESPACES_ENUM.SANCTIONLISTFORM])
    const isAdverseMediaResult = props.isAdverseMedia || false

    useEffect(() => {
      if (props.allEntities && props.allEntities.length) {
        setSanctionResult(props.allEntities[props.currentIndex])
        setCurrentIndex(props.currentIndex)
      }
    }, [props.allEntities, props.currentIndex])

    useEffect(() => {
      setRoleOptions(props.roleOptions)
    }, [props.roleOptions])

    useEffect(() => {
      if (sanctionResult?.remarks) {
        const splittedRemarks = sanctionResult.remarks.split("||")
        if (splittedRemarks.length > 10) {
          setFormattedRemark(splittedRemarks.slice(0, 10))
          setIsShowMore(true)
        } else {
          setFormattedRemark(splittedRemarks)
          setIsShowMore(false)
        }
      } else {
        setFormattedRemark([])
      }
    }, [sanctionResult?.remarks])

    function toggleModal () {
      if (props.toggleModal) {
        props.toggleModal()
      }
    }

    function getAddressString (addressData: SanctionAdditionalAddress): string {
        const address = [
            addressData?.address,
            addressData?.city,
            addressData?.state,
            addressData?.postalCode,
            addressData?.country
        ].filter(Boolean).join(', ')

        return address || ''
    }

    function handleMoveBack () {
      if (currentIndex && currentIndex !== props.allEntities?.length) {
        setCurrentIndex(currentIndex - 1)
        setSanctionResult(props.allEntities[currentIndex - 1])
      }
    }

    function handleMoveAhead () {
        if ((currentIndex + 1) !== props.allEntities?.length) {
           setCurrentIndex(currentIndex + 1)
           setSanctionResult(props.allEntities[currentIndex + 1])
        } 
    }

    function getRoleDisplayName (type: string): string {
        const role = roleOptions?.find(details => details.path === type)
        return role?.displayName || type
    }

    function showAllRemark (isExpanded?: boolean) {
        const splittedRemarks = sanctionResult?.remarks?.split("||")
        if (isExpanded) {
          setFormattedRemark(splittedRemarks)
          setExpandRemark(true)
        } else {
          setFormattedRemark(splittedRemarks.slice(0, 10))
          setExpandRemark(false)
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
              <div className={`${styles.santionDetailModal}`}>
                <div className={styles.modalHeader}>
                  <div className={styles.group}>
                    {t('--detailModalTitle--')}
                    <div>
                        <ChevronLeft size={24} color={currentIndex === 0 ? 'var(--warm-neutral-mid-600)' : 'var(--warm-neutral-shade-500)'} onClick={handleMoveBack}/>
                        <span className={styles.counter}>{currentIndex + 1} / {props.allEntities?.length}</span>
                        <ChevronRight size={24} color={currentIndex + 1 === props.allEntities?.length ? 'var(--warm-neutral-mid-600)' : 'var(--warm-neutral-shade-500)'} onClick={handleMoveAhead}/>
                    </div>
                  </div>
                  <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
                </div>
    
                <div className={`${styles.modalBody}`}>       
                    {props.shareHolder &&
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Title>{t('--detailContactTitle--')}</Title>
                        </Grid>
                        {props.shareHolder?.fullName && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailFullName--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{props.shareHolder.fullName}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.address?.alpha2CountryCode && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailCountry--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{ALPHA2CODES_DISPLAYNAMES[props.shareHolder.address.alpha2CountryCode] || props.shareHolder.address.alpha2CountryCode}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.operationLocation?.alpha2CountryCode && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailOprationCountry--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{ALPHA2CODES_DISPLAYNAMES[props.shareHolder.operationLocation.alpha2CountryCode] || props.shareHolder.operationLocation.alpha2CountryCode}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.email && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailEmail--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{props.shareHolder.email}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.role && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailRole--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{getRoleDisplayName(props.shareHolder.role)}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.sharePercentage && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailShare--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{props.shareHolder.sharePercentage + '%'}</Value>
                            </Grid>
                        </>}
                        {props.shareHolder?.service && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailService--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{props.shareHolder.service}</Value>
                            </Grid>
                        </>}
                    </Grid>
                    }
                    {props.shareHolder && sanctionResult && 
                    <Grid item xs={12} >
                        <Separator />
                    </Grid>}
                    {sanctionResult &&
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Title>{!isAdverseMediaResult ? t('--detailResultTitle--') : t('--adverseMediaListResults--')}</Title>
                        </Grid>
                        {sanctionResult?.fullName && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailFullName--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.fullName}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.entityType && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailEntityType--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.entityType}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.country && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailCountry--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{ALPHA2CODES_DISPLAYNAMES[sanctionResult.country] || sanctionResult.country}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.listType && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailSource--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.listType}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.guid && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailGuid--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.guid}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.score && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailScore--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>
                                    <div className={styles.matchScore}>{Math.round(Number(sanctionResult?.score))} % Positive</div>
                                </Value>
                            </Grid>
                        </>}
                        {sanctionResult?.program && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailProgram--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.program}</Value>
                            </Grid>
                        </>}
                        {formattedRemark && formattedRemark.length > 0 && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailRemark--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>
                                  <div className={styles.listValue}>
                                    {formattedRemark.map((note, index) => {
                                        return (<span key={index} className={styles.aliasName}>{note}</span> )
                                    })}
                                  </div>
                                </Value>
                                <>
                                {isShowMore && !expandRemark && <div className={styles.expandCollapse} onClick={() => showAllRemark(true)}>
                                    {t('--viewMore--')}
                                 </div>}
                                {expandRemark && <div className={styles.expandCollapse} onClick={() => showAllRemark(false)}>
                                    {t('--ViewLess--')}
                                </div>}
                                </>
                            </Grid>
                        </>}
                        {sanctionResult?.dob && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailDOB--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>{sanctionResult.dob}</Value>
                            </Grid>
                        </>}
                        {sanctionResult?.additionalAddress && sanctionResult?.additionalAddress?.length > 0 && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailAddress--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>
                                    <div className={styles.listValue}>
                                      {sanctionResult?.additionalAddress.map((address, index) => {
                                        return ( <span key={index} className={styles.aliasName}>{getAddressString(address)}</span> )
                                      })}
                                    </div>
                                </Value>
                            </Grid>
                        </>}
                        {sanctionResult?.additionalAlias && sanctionResult?.additionalAlias?.length > 0 && <>
                            <Grid item xs={4}>
                                <Label>{t('--detailAlias--')}</Label>
                            </Grid>
                            <Grid item xs={8}>
                                <Value>
                                    <div className={styles.listValue}>
                                      {sanctionResult?.additionalAlias.map((alias, index) => {
                                        return ( <span key={index} className={styles.aliasName}>{alias.fullName}</span> )
                                      })}
                                    </div>
                                </Value>
                            </Grid>
                        </>}
                    </Grid>
                    }
                </div>
              </div>
            </Box>
          </Modal>
        </>
      )
}