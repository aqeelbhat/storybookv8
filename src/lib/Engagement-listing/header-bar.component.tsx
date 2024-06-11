import React, { useEffect, useRef, useState } from 'react'
import { Popover } from 'reactstrap'
import { ChevronLeft, Info, Trash2 } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'

import style from './header-bar.module.scss'
import { Engagement, EngagementStatus, IDRef, ImageMetadata, NormalizedVendorRef } from '../Types'
import { createImageFromInitials, mapAlpha2codeToDisplayName, mapCurrencyToSymbol } from '../util'
import { OroButton } from '../controls'
import { ConfirmationDialog } from '../Modals'
import { isEngagementIdInSubmittedRequestCache, unRegisterSubmittedRequestInCache } from './service'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { Keyboard } from '../Types/common'
import { getSessionLocale } from '../sessionStorage'

const ORO_ASSETS_BASE = process.env.REACT_APP_ORO_ASSETS_BASE

export interface HeaderBarProps {
  data: Engagement,
  mode?: 'full' | 'shrink'
  readMode?: boolean
  onBarPressed?: (engagement: Engagement) => void
  onBackPressed?: () => void
  onContinuePressed?: (engagement: Engagement) => void
  onDelete?: (engagementId: string) => void
}

function Suppliers (props: { data: Array<NormalizedVendorRef>, popoverTargetElem: HTMLDivElement | null}) {
  const MAX_LOGO_REEL_LENGTH = 2
  const [suppliersLogoReel, setSuppliersLogoReel] = useState<Array<NormalizedVendorRef>>([])
  const [suppliersDropdownList, setSuppliersDropdownList] = useState<Array<NormalizedVendorRef>>([])
  const [popoverOpen, setPopoverOpen] = useState(false)

  function setSuppliersLogoReelAndDropdown (suppliers: Array<NormalizedVendorRef>): void {
    const suppliersWithLogo = suppliers.filter(supplier => {
      let imageUrl = ''
      supplier.legalEntityLogo.metadata.forEach(metadata => {
        if (metadata.path) {
          imageUrl = metadata.path
        }
      })

      return imageUrl
    })

    const suppliersWithoutLogo = suppliers.filter(supplier => {
      let imageUrl = ''
      supplier.legalEntityLogo.metadata.forEach(metadata => {
        if (metadata.path) {
          imageUrl = metadata.path
        }
      })

      return !imageUrl
    })

    setSuppliersLogoReel(suppliersWithLogo.slice(0, MAX_LOGO_REEL_LENGTH))
    setSuppliersDropdownList(suppliersWithLogo.slice(MAX_LOGO_REEL_LENGTH, suppliersWithLogo.length).concat(suppliersWithoutLogo))
  }

  useEffect(() => {
    setSuppliersLogoReelAndDropdown(props.data)
  }, [props.data])

  function getSupplierLogo (metadata: Array<ImageMetadata>): string | undefined {
    let imagePath = ''
    metadata.forEach(metadata => {
      if (!imagePath && metadata.path) {
        imagePath = metadata.path
      }
    })

    return imagePath ? `${ORO_ASSETS_BASE}/${imagePath}` : imagePath
  }

  function isOnlySupplierWithLogo (): boolean {
    return suppliersLogoReel.length === 1
  }

  function isMoreThanOneSupplierWithLogo (): boolean {
    return suppliersLogoReel.length > 1
  }

  function isAllSuppliersWithoutLogo (): boolean {
    return suppliersLogoReel.length === 0
  }

  function isDropdownSuppliersList (): boolean {
    return suppliersDropdownList.length > 0
  }

  function isOnlyDropdownSupplier (): boolean {
    return suppliersDropdownList.length === 1
  }

  function isMoreThanOneDropdownSupplier (): boolean {
    return suppliersDropdownList.length > 1
  }

  function togglePopover (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setPopoverOpen(!popoverOpen)
  }

  function hidePopover () {
    setPopoverOpen(false)
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  function getMoreSupplierJsx (): React.ReactNode {
    return <>
      { suppliersDropdownList.length > 0 && <div className={style.roleMoreSuppliers} onClick={togglePopover}>+{suppliersDropdownList.length}</div>}
      { props.popoverTargetElem && <Popover target={props.popoverTargetElem} placement="bottom" isOpen={popoverOpen} hideArrow={false}>
        <div className={style.supplierPopoverContainer} onClick={(evt) => evt.stopPropagation()}>
          { suppliersDropdownList.map((supplier, index) =>
            <div className={style.roleUserDetailsContainer} key={index}>
              { getSupplierLogo(supplier.legalEntityLogo.metadata) && <img className={style.roleUserDP} src={getSupplierLogo(supplier.legalEntityLogo.metadata)} alt="" /> }
              <div className={style.roleDetails}>
                <Tooltip title={supplier.name}>
                  <span className={style.roleSupplierName}>{supplier.name}</span>
                </Tooltip>
                <Tooltip title={mapAlpha2codeToDisplayName(supplier.countryCode)}>
                  <span className={style.roleUserTitle}>{mapAlpha2codeToDisplayName(supplier.countryCode)}</span>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </Popover> }
    </>
  }

  return <>
  { isOnlySupplierWithLogo() && !isDropdownSuppliersList() && <div className={style.roleUserDetailsContainer}>
      <img className={style.roleUserDP} src={getSupplierLogo(suppliersLogoReel[0].legalEntityLogo.metadata)} alt="" />
      <div className={style.roleDetails}>
        <Tooltip title={suppliersLogoReel[0].name}>
          <span className={style.roleSupplierName}>{suppliersLogoReel[0].name}</span>
        </Tooltip>
        <Tooltip title={mapAlpha2codeToDisplayName(suppliersLogoReel[0].countryCode)}>
          <span className={style.roleUserTitle}>{mapAlpha2codeToDisplayName(suppliersLogoReel[0].countryCode)}</span>
        </Tooltip>
      </div>
    </div>
  }

  { isOnlySupplierWithLogo() && isDropdownSuppliersList() && <div className={style.roleUserDetailsContainer}>
      { suppliersLogoReel.map((supplier, index) =>
        <img className={style.roleUserDP} src={getSupplierLogo(supplier.legalEntityLogo.metadata)} key={index} alt="" />
      )}
      {getMoreSupplierJsx()}
    </div>
  }

  { isMoreThanOneSupplierWithLogo() && <div className={style.roleUserDetailsContainer}>
      { suppliersLogoReel.map((supplier, index) =>
        <img className={style.roleUserDP} src={getSupplierLogo(supplier.legalEntityLogo.metadata)} key={index} alt="" />
      )}
      {getMoreSupplierJsx()}
    </div>
  }

  { isAllSuppliersWithoutLogo() && isOnlyDropdownSupplier() && <div className={style.roleUserDetailsContainer}>
      <div className={style.roleDetails}>
        <Tooltip title={suppliersDropdownList[0].name}>
          <span className={style.roleSupplierName}>{suppliersDropdownList[0].name}</span>
        </Tooltip>
        <Tooltip title={mapAlpha2codeToDisplayName(suppliersDropdownList[0].countryCode)}>
          <span className={style.roleUserTitle}>{mapAlpha2codeToDisplayName(suppliersDropdownList[0].countryCode)}</span>
        </Tooltip>
      </div>
    </div>
  }

  { isAllSuppliersWithoutLogo() && isMoreThanOneDropdownSupplier() && <div className={style.roleUserDetailsContainer}>
      {getMoreSupplierJsx()}
    </div>
  }
  </>
}

export function HeaderBar (props: HeaderBarProps) {
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.data.status !== EngagementStatus.Draft) {
      unRegisterSubmittedRequestInCache(props.data.currentRequest.id)
    }
  }, [props.data])

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  function isShrinkMode (): boolean {
    return props.mode === 'shrink'
  }

  function isDraftStatus (): boolean {
    return props.data.status === EngagementStatus.Draft
  }

  function onBarClick () {
    if (props.onBarPressed && typeof props.onBarPressed === 'function' && !isDraftStatus()) {
      props.onBarPressed(props.data)
    }
  }

  function onBack () {
    if (props.onBackPressed && typeof props.onBackPressed === 'function') {
      props.onBackPressed()
    }
  }

  function onContinuePressed () {
    if (props.onContinuePressed && typeof props.onContinuePressed === 'function') {
      props.onContinuePressed(props.data)
    }
  }

  function getRegionsCompanyEntities (): Array<IDRef> {
    return props.data.variables.regions.concat(props.data.variables.companyEntities)
  }

  function getNameInitialsImage (name: string) {
    const splitName = name.split(' ')
    return createImageFromInitials(splitName[0], splitName[1])
  }

  function isEngagementCreationInProgress (requestId: string): boolean {
    return isEngagementIdInSubmittedRequestCache(requestId)
  }

  function handleDeleteClick () {
    setDeleteModal(true)
  }

  function onDeleteConfirmation () {
    setDeleteModal(false)
    if (props.onDelete && typeof props.onDelete === 'function') {
      props.onDelete(props.data.currentRequest.id)
    }
  }

  function prepareTrashComponent () {
    return <Trash2
      className={style.statusIcon}
      size={22} color='#8C8C8C'
    />
  }

  function handleItemKeydown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return false
    }

    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    switch (event.key) {
      case Keyboard.Enter:
      case Keyboard.Return:
        onBarClick()
      default: break
    }
  }

  return (
    <div className={`${style.header} ${isShrinkMode() && style.headerShrink} ${isDraftStatus() && style.headerStatusDraft}`} onClick={onBarClick} tabIndex={0} onKeyDown={handleItemKeydown}>
      {isShrinkMode() && <div className={style.goBack} onClick={onBack}>
        <ChevronLeft size={20} color='#575F70' />
      </div>}
      <div className={`${style.row1} ${isShrinkMode() && style.row1Shrink}`}>
        {props.data.name && <>
          <span className={style.programLabel}>{props.data.name}</span>
          <span className={style.verticalSeparator}></span>
        </>}
        {props.data.engagementId && <span className={style.capsule}>{props.data.engagementId}</span>}
        {props.data.variables.activityId && <span className={style.capsule}>{t('--allocadiaID--')}: {props.data.variables.activityId}</span>}
        {props.data.variables.po && props.data.variables.po.poNumber && <span className={style.capsule}>{t('--PO--')} {props.data.variables.po.poNumber}</span>}
        {props.data.status === EngagementStatus.Draft &&
          !isEngagementCreationInProgress(props.data.currentRequest.id) &&
          <span className={`${style.capsule} ${style.capsuleDraftEngagement}`}>{t('--draft--')}</span>
        }
        {props.data.status === EngagementStatus.Completed && <span className={`${style.capsule} ${style.capsuleCompletedEngagement}`}>{t('--completed--')}</span>}
      </div>
      <div className={`${style.row2} ${isShrinkMode() && style.row2Shrink}`}>
        <div className={style.col1}>
          {props.data.status !== EngagementStatus.Draft && <h3 className={style.title}>{props.data.variables.activityName}</h3>}
          {props.data.status === EngagementStatus.Draft &&
            !isEngagementCreationInProgress(props.data.currentRequest.id) &&
            <h3 className={`${style.title} ${style.titleClick}`} onClick={onContinuePressed}>{props.data.variables.activityName ? props.data.variables.activityName : t('--untitled--')}</h3>
          }
          {props.data.status === EngagementStatus.Draft &&
            isEngagementCreationInProgress(props.data.currentRequest.id) &&
            <h3 className={style.title}>{props.data.variables.activityName}</h3>
          }
          <div className={style.titleSublist}>
            {props.data.variables && props.data.variables?.projectAmountMoney?.amount > 0 && <span className={style.titleSublistBudgetItem}>
              {mapCurrencyToSymbol(props.data.variables?.projectAmountMoney?.currency)}
              {Number(props.data.variables?.projectAmountMoney?.amount).toLocaleString(getSessionLocale())} {props.data.variables.projectAmountMoney.currency}
            </span>}
            {props.data.variables && props.data.variables?.projectAmountMoney?.amount > 0 && getRegionsCompanyEntities().length > 0 && <span className={style.verticalSeparator}></span>}
            {getRegionsCompanyEntities().map((region, index) =>
              <div className={style.titleSublistContainer} key={index}>
                <span className={style.titleSublistItem}>{region?.name}</span>
                {index < getRegionsCompanyEntities().length - 1 && <span className={style.dotSeperator}></span>}
              </div>
            )}
          </div>
        </div>
        <div className={`${style.col2} ${isShrinkMode() && style.col2Shrink}`}>
          {(props.data.status !== EngagementStatus.Draft || isEngagementCreationInProgress(props.data.currentRequest.id)) && <div className={style.role}>
            <span className={style.roleLabel}>'{t('--requester--')}</span>
            <div className={style.roleUserDetailsContainer}>
              <img className={style.roleUserDP} src={getNameInitialsImage(props.data.requester?.name)} alt="" />
              <div className={style.roleDetails}>
                <Tooltip title={props.data.requester?.name}>
                  <span className={style.roleUserName}>{props.data.requester?.name}</span>
                </Tooltip>
                <span className={style.roleUserTitle}>{props.data.requester?.department}</span>
              </div>
            </div>
          </div>}
          {!props.readMode && <div className={style.role}>
            <span className={style.roleLabel}>{t('--supplier--')}</span>
            {props.data.variables.partners.length > 0 && <>
              <Suppliers data={props.data.variables?.partners} popoverTargetElem={popoverTargetElem} />
              <div ref={popoverTargetRef} />
            </>}
          </div>}

          {props.data.status === EngagementStatus.Draft && !isEngagementCreationInProgress(props.data.currentRequest.id) &&
            <div className={style.statusDraft}>
              <OroButton
                className={style.statusButton}
                type="link"
                icon={prepareTrashComponent()}
                onClick={handleDeleteClick}
                radiusCurvature="low"
                fontWeight="semibold"
              />
              <OroButton
                className={style.statusButton}
                label={t('--Continue--')}
                type="primary"
                onClick={onContinuePressed}
                radiusCurvature="low"
                fontWeight="semibold"
              />
            </div>}
        </div>
      </div>
      {props.data.status === EngagementStatus.Draft && isEngagementCreationInProgress(props.data.currentRequest.id) && <div className={`${style.row3} ${isShrinkMode() && style.row3Shrink}`}>
        <Info className={style.statusIcon} size={18} color='#8C8C8C' />
        <span>{t('--youHaveUpdatedDetails--')}</span>
      </div>}
      <ConfirmationDialog
        isOpen={deleteModal}
        title={t('--deleteEngagement--')}
        description={t('--areYouSure--')}
        actionType='danger'
        primaryButton={t('--delete--')}
        secondaryButton={t('--cancel--')}
        onPrimaryButtonClick={onDeleteConfirmation}
        onSecondaryButtonClick={() => setDeleteModal(false)}
      />
    </div>
  )
}
