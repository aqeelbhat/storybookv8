
import React, { ReactElement, useEffect, useState } from 'react'
import { Info, Trash2 } from 'react-feather'
import moment from 'moment'
import { OroButton } from '../controls'
import { ApplicationMode, CallbackOutcome, RibbonView } from '../Form'
import { formatCurrency, isLate, getUserDisplayName, mapIDRefToOption } from '../Form/util'
import { Engagement, EngagementStatus, IDRef, MilestoneInfo, ProcessRequestMeta, ProcessType, ProgressStatus, UserId, Option } from '../Types'
import { createImageFromInitials, mapCurrencyToSymbol } from '../util'
import styles from './engagement-listing-styles.module.scss'
import defaultUserPic from '../Form/assets/default-user-pic.png'
import { StandardPriority } from '../Form/types'
import { Popup } from './attribute-modal.component'
import BranchIcon from './assets/Branch.svg'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { PrioritySelector } from './prioritySelector.component'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { RequestFieldLocaleConfig } from '../Types/engagement'

export interface EngagementListingProps {
  data?: Engagement
  isMobileView?: boolean
  currentApp: ApplicationMode
  currentView: RibbonView
  breadcrumbs?: string[]
  isEngagementCreationInProgress?: boolean
  canSetPriority?: boolean
  priorityOptions?: Option[]
  onPriorityChange?: (val: Option) => void
  onViewMeasure?: (engagement: Engagement) => void
  onCrumbClick?: (name: string, index: number) => void
  handleDeleteClick?: () => void
  onContinuePressed?: (engagement: Engagement) => void
  onEngagementClick?: (engagementId: string) => void
}
export const EBIT = 'EBIT'

export interface EngagementRibbonProps extends EngagementListingProps {
  engagement: Engagement
  requestHeaderLocalizaiton?: RequestFieldLocaleConfig
  onParentRequestClick?: (id: string) => void
}

export interface Attribute {
  label: string
  value: any
  outcome?: CallbackOutcome[]
}

export interface AttributeProps {
  request: ProcessRequestMeta
  engagement: Engagement
  isMobileView: boolean
  canSetPriority?: boolean
  priorityOptions?: Option[]
  onPriorityChange?: (val: Option) => void
  onViewMeasure?: (engagementId: string) => void
  onEngagementAttribute?: (attribute: Array<Attribute>) => void
  requestHeaderLocalizaiton?: RequestFieldLocaleConfig
  onParentRequestClick?: (id: string) => void
}

function GetProjectRelatedAttributes (props: AttributeProps): JSX.Element {
  const [projectAttributes, setProjectAttributes] = useState<Array<Attribute>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  function getRiskLevelDispalyName (level: string): string {
    switch (level) {
      case 'low':
        return t('--low--')
      case 'medium':
        return t('--medium--')
      case 'high':
        return t('--high--')
      default: {
        return '-'
      }
    }
  }

  function getOutcomesTooltipTitleJsx (outcomes: Array<CallbackOutcome>): ReactElement {
    return (
      <>
       {outcomes.map((item, index) =>
         <div key={index}>{t('--bankAccount--')} {outcomes.length > 1 ? index + 1 : ''} ({item.accountNumber.maskedValue}) - {item.codeRef?.name}</div>
       )}
      </>
    )
  }

  function getOutcomesJsx (): ReactElement {
    return <>
      <OroTooltip title={getOutcomesTooltipTitleJsx(props.engagement.variables?.callbackOutcomes || [])} placement="bottom" arrow>
        <span>{props.engagement.variables?.callbackOutcomes[0]?.codeRef?.name}
        {props.engagement.variables?.callbackOutcomes?.length > 1 ? '...' : ''}</span>
      </OroTooltip>
    </>
  }

  function goToMeasure (e: React.MouseEvent<HTMLElement>, engagementIDRef: IDRef) {
    e.preventDefault()
    e.stopPropagation()

    if (props.onViewMeasure) {
      props.onViewMeasure(engagementIDRef.id)
    }
  }

  function getEngagemetLinkText (engagementRef: IDRef): string {
    return engagementRef.refId || engagementRef.name || engagementRef.id || ''
  }

  function getRelatedMeasures (data: IDRef[]): ReactElement {
    return (<>
      {data.map((engagementRef, i) => {
        return (
        <span key={i}>
          <span key={engagementRef.id} className={styles.link} onClick={(e) => goToMeasure(e, engagementRef)}>{getEngagemetLinkText(engagementRef)}</span>
          {(data.length && (i < data.length - 1)) && <span>, </span>}
        </span> )
        }
      )}
    </>)
  }

  function getEngagementAttributes (): Attribute[] {
    const _projectAttributes: Attribute[] = []
    if (props.engagement && props.engagement?.engagementAttributes && props.engagement?.engagementAttributes.length > 0) {
      props.engagement?.engagementAttributes.map(attribute => {
        if (attribute.displayValue) {
          _projectAttributes.push({
            label: attribute.reportName || attribute.name,
            value: attribute.displayValue
          })
        }
      })
    }
    return _projectAttributes
  }

  useEffect(() => {
    let _projectAttributes = []
    const defaultAttributes = getEngagementAttributes()
    
    switch (props.request.type) {
      case ProcessType.marketingProject : {
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && ((props.engagement.variables?.projectAmountMoney?.amount && props.engagement.variables?.projectAmountMoney?.amount !== 0) || (props.engagement.variables?.contractAmountMoney?.amount && props.engagement.variables?.contractAmountMoney?.amount !== 0))) {
          const projectAmout = props.engagement.variables?.contractAmountMoney?.amount !== 0 ? props.engagement.variables?.contractAmountMoney : props.engagement.variables?.projectAmountMoney
          _projectAttributes.push({
            label: t('--amount--'),
            value: `${mapCurrencyToSymbol(projectAmout?.currency || '')} ${formatCurrency(projectAmout?.amount || 0)|| '--'}`
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.overallScore?.level) {
          _projectAttributes.push({
            label: t('--risk--'),
            value: `${getRiskLevelDispalyName(props.engagement.variables?.overallScore?.level?.toLowerCase() || '')}`
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.started) {
          _projectAttributes.push({
            label: t('--expectedPurchase--'),
            value: `${moment(props.engagement.started).format('MMM DD, YYYY')}`
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.regions && props.engagement.variables?.regions?.length > 0) {
          _projectAttributes.push({
            label: t('--Region--'),
            value: props.engagement.variables?.regions?.map(region => region.name).join(', ')
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.companyEntities && props.engagement.variables?.companyEntities?.length > 0) {
          _projectAttributes.push({
            label: t('--companyEntity--'),
            value: props.engagement.variables?.companyEntities?.map(entity => entity.name).join(', ')
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.onboarding : {
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.regions && props.engagement.variables?.regions?.length > 0) {
          _projectAttributes.push({
            label: t('--Region--'),
            value: props.engagement.variables?.regions?.map(region => region.name).join(', ')
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.companyEntities && props.engagement.variables?.companyEntities?.length > 0) {
          _projectAttributes.push({
            label: t('--companyEntity--'),
            value: props.engagement.variables?.companyEntities?.map(entity => entity.name).join(', ')
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.supplierUpdate : {
        if (props.engagement && props.engagement.variables?.requestId) {
          _projectAttributes.push({
            label: t('--requestId--'),
            value: props.engagement.variables.requestId
          })
        }
        if (props.engagement && props.engagement.variables?.vendorClassification && props.engagement.variables?.vendorClassification?.name) {
          _projectAttributes.push({
            label: t('--supplierType--'),
            value: props.engagement.variables?.vendorClassification?.name || '-'
          })
        }
        if (props.engagement && props.engagement.variables?.callbackOutcomes?.length > 0) {
          _projectAttributes.push({
            label: t('--callbackStatus--'),
            value: getOutcomesJsx(),
            outcome: props.engagement.variables?.callbackOutcomes
          })
        }
        if (props.engagement && props.engagement.variables?.overallScore?.level && (!props.engagement.variables?.callbackOutcomes || props.engagement.variables?.callbackOutcomes?.length === 0)) {
          _projectAttributes.push({
            label: t('--risk--'),
            value: `${getRiskLevelDispalyName(props.engagement.variables?.overallScore?.level?.toLowerCase() || '')}`
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.development : {
        if (props.engagement && props.engagement?.variables?.projectAmountMoney && props.engagement?.variables?.projectAmountMoney?.amount > 0) {
          _projectAttributes.push({
            label: EBIT + `${props.engagement?.kpiUnit || props.engagement?.currencyCode ? `(${props.engagement?.kpiUnit || ''} ${props.engagement?.currencyCode || ''})` : ''}`,
            value: `${formatCurrency(props.engagement?.variables?.projectAmountMoney?.amount) || ''}`
          })
        }
        if (props.engagement && props.engagement.variables?.sites && props.engagement?.variables?.sites.length > 0) {
          _projectAttributes.push({
            label: t('--Site--'),
            value: props.engagement?.variables?.sites.map(site => site.name).join(', ')
          })
        }
        if (props.engagement && props.engagement.variables?.segment && props.engagement?.variables.segment?.name) {
          _projectAttributes.push({
            label: t('--businessSegment--'),
            value: props.engagement?.variables?.segment?.name
          })
        }
        if (props.engagement && props.engagement.relatedEnagements && props.engagement.relatedEnagements.length > 0) {
          _projectAttributes.push({
            label: t('--relatedMeasures--'),
            value: getRelatedMeasures(props.engagement.relatedEnagements)
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.softwareDataPurchase : {
        if (props.engagement && ((props.engagement.variables?.projectAmountMoney?.amount && props.engagement.variables?.projectAmountMoney?.amount !== 0) || (props.engagement.variables?.contractAmountMoney?.amount && props.engagement.variables?.contractAmountMoney?.amount !== 0))) {
          const projectAmout = props.engagement.variables?.contractAmountMoney?.amount !== 0 ? props.engagement.variables?.contractAmountMoney : props.engagement.variables?.projectAmountMoney
          _projectAttributes.push({
            label: t('--amount--'),
            value: `${mapCurrencyToSymbol(projectAmout?.currency || '')} ${formatCurrency(projectAmout?.amount || 0)|| '--'}`
          })
        }
        if (props.engagement && props.engagement.variables?.overallScore?.level) {
          _projectAttributes.push({
            label: t('--risk--'),
            value: `${getRiskLevelDispalyName(props.engagement.variables?.overallScore?.level?.toLowerCase() || '')}`
          })
        }
        if (props.engagement && props.engagement.variables?.spendType) {
          _projectAttributes.push({
            label: t('--typeOfPurchase--'),
            value: props.engagement.variables?.spendType
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.procurementIntake : {
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && ((props.engagement.variables?.projectAmountMoney?.amount && props.engagement.variables?.projectAmountMoney?.amount !== 0) || (props.engagement.variables?.contractAmountMoney?.amount && props.engagement.variables?.contractAmountMoney?.amount !== 0))) {
          const projectAmout = props.engagement.variables?.contractAmountMoney?.amount !== 0 ? props.engagement.variables?.contractAmountMoney : props.engagement.variables?.projectAmountMoney
          _projectAttributes.push({
            label: t('--amount--'),
            value: `${mapCurrencyToSymbol(projectAmout?.currency || '')} ${formatCurrency(projectAmout?.amount || 0)|| '--'}`
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.po && props.engagement.variables?.po?.poNumber) {
          _projectAttributes.push({
            label: t('--poNumber--'),
            value: props.engagement.variables?.po?.poNumber
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.categories && props.engagement.variables?.categories.length > 0) {
          _projectAttributes.push({
            label: t('--category--'),
            value: props.engagement?.variables?.categories.map(category => category.name).join(', ')
          })
        }
        if (props.engagement && !props.engagement.disableDefaultEngagementAttributes && props.engagement.variables?.companyEntities && props.engagement.variables?.companyEntities.length > 0) {
          _projectAttributes.push({
            label: t('--companyEntity--'),
            value: props.engagement?.variables?.companyEntities.map(entity => entity.name).join(', ')
          })
        }
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }

      case ProcessType.invoiceIntake : {
        if (props.engagement && props.engagement.variables?.invoices && props.engagement.variables?.invoices?.length > 0) {
          const invoice = props.engagement.variables?.invoices[0]
          _projectAttributes.push({
            label: t('--invoiceNumber--'),
            value: invoice.refId || ''
          })
        }
        if (props.engagement && ((props.engagement.variables?.projectAmountMoney?.amount && props.engagement.variables?.projectAmountMoney?.amount !== 0))) {
          const projectAmout = props.engagement.variables?.projectAmountMoney
          _projectAttributes.push({
            label: t('--Total--'),
            value: `${mapCurrencyToSymbol(projectAmout?.currency || '')}${formatCurrency(projectAmout?.amount || 0) || '--'} ${projectAmout?.currency || ''}`
          })
        }
        break;
      }

      case ProcessType.emailIntake : {
        _projectAttributes.push({
          label: t('--Email--'),
          value: props.engagement?.variables?.emailFrom || '-'
        })
        _projectAttributes.push({
          label: t('--expectedPurchase--'),
          value: props.engagement?.started ? moment(props.engagement.started).format('MMM DD, YYYY') : '-'
        })
        _projectAttributes.push({
          label: t('--type--'),
          value: t('--invoice--')
        })
        break;
      }

      case ProcessType.serviceRequest: {
        _projectAttributes = _projectAttributes.concat(defaultAttributes)
        break;
      }
    }

    setProjectAttributes(_projectAttributes)
  }, [props.engagement, props.request?.type])

  function showAttributePopUp (e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.preventDefault()
    e.stopPropagation()
    props.onEngagementAttribute && props.onEngagementAttribute(projectAttributes)
  }

  function onParentLinkClick (e: React.MouseEvent<HTMLElement>, id: string) {
    e.preventDefault()
    e.stopPropagation()
    if (props.onParentRequestClick) {
      props.onParentRequestClick(id)
    }
  }

  function getLocalizedDisplayName (name: string) {
    if (props.requestHeaderLocalizaiton && props.requestHeaderLocalizaiton?.engagementAttributes) {
      return props.requestHeaderLocalizaiton?.engagementAttributes[name] ||  name
    }
    return name
  }

  return ( 
    <>
      {(props.engagement?.variables?.priorityRank || props.canSetPriority) &&
        <div className={styles.details}>
          <PrioritySelector
            options={props.priorityOptions}
            value={props.engagement?.variables?.priorityRank ? mapIDRefToOption(props.engagement.variables.priorityRank) : undefined}
            readOnly={!props.canSetPriority}
            onChange={props.onPriorityChange}
          />
        </div>
      }
      {!props.isMobileView && projectAttributes.map((attribute, index) =>
        <div className={styles.details} key={index}>
          <span className={styles.label}>{getLocalizedDisplayName(attribute.label)}:</span>
          <span className={styles.text}>{attribute.value}</span>
        </div>
      )
      }
      {
        props.engagement?.parent?.engagementReference &&
        <div className={styles.details}>
          <span className={styles.label}>{t('--Parent--')}:</span>
          <span className={styles.link} onClick={(e) => onParentLinkClick(e, props.engagement?.parent?.engagementReference?.id)}>{props.engagement?.parent?.engagementReference?.refId}</span>
        </div>
      }
      {props.isMobileView && projectAttributes.slice(0, 2).map((attribute, index) =>
        <div className={styles.details} key={index}>
          <span className={styles.attributeValue}>{attribute.value}</span>
        </div>)
      }
      {
        props.isMobileView &&
        <Info size={18} color="var(--warm-neutral-shade-200)" onClick={(e) => showAttributePopUp(e)} />
      }
    </>
  );
}

export function EngagementMobileRibbon (props: EngagementRibbonProps) {

  const [attributes, setAttributes] = useState<Array<Attribute>>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [requestor, setRequestor] = useState<string>('')
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.engagement) {
      setRequestor(getUserDisplayName(props.engagement?.requester))
    }
  }, [props.engagement])

  function handleEngegementAttribute (attribute: Array<Attribute>) {
    setAttributes(attribute)
    attribute?.length && setIsOpen(true)
  }

  function togglePopup () {
    setIsOpen(false)
  }

  return (
    <>
      <div className={styles.engagementListingMeasuresCardRowWrapperMobileView}>
        { props.engagement?.engagementId && props.currentView === RibbonView.taskListMobile &&
          <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemEngagementId}>{props.engagement.engagementId}</div>
        }
        <div className={styles.engagementListingMeasuresCardRowWrapperMobileViewItem}>
          <div className={styles.engagementListingMeasuresCardRowWrapperMobileViewItemName}>
            { props.currentView !== RibbonView.taskListMobile && props.engagement.status !== EngagementStatus.Draft &&
              <h3 className={styles.title}>{props.engagement?.variables?.activityName || props.engagement?.currentRequest?.processName}</h3> }
            { props.currentView === RibbonView.taskListMobile &&
              <h3 className={styles.title}>{props.engagement.variables.activityName || props.engagement.name || ''}</h3> }
          </div>
        </div>
        { props.engagement && props.currentView !== RibbonView.taskListMobile &&
            <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemAttributes}>
                {props.engagement.status !== EngagementStatus.Draft &&
                  <GetProjectRelatedAttributes request={props.engagement.currentRequest} engagement={props.engagement} isMobileView={true} requestHeaderLocalizaiton={props.requestHeaderLocalizaiton}
                                              onEngagementAttribute={handleEngegementAttribute}/>}
            </div>
        }
        { props.engagement && props.engagement.status !== EngagementStatus.Draft && props.currentView !== RibbonView.taskListMobile &&
          <div className={styles.engagementListingMeasuresCardRowWrapperMobileViewItemMoreDetails}>
            <ul className={styles.engagementListingMeasuresCardRowWrapperMobileViewItemMoreDetailsList}>
            {requestor &&
              <li>
                <div className={styles.item}>
                  <span className={styles.label}>{t('--requester--')}</span>
                  <span className={styles.value}>{requestor}</span>
                </div>
              </li>}
            {props.engagement?.variables?.partners.length > 0 &&
              <li>
                <div className={styles.item}>
                  <span className={styles.label}>{t('--supplier--')}</span>
                  <span className={styles.value}>{props.engagement?.variables?.partners[0].name}</span>
                </div>
              </li>}
            </ul>
          </div> }
        { props.engagement && props.currentView === RibbonView.taskListMobile &&
          <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemAttributes}>
            <div className={styles.details}>
              <span className={styles.detailsItem}>{t('--requester--')}:
              <span className={styles.text}>{props.engagement?.requester?.name}</span></span>
            </div>
          </div>
        }
        <Popup isOpen={isOpen} attribute={attributes} onClose={togglePopup} />
      </div>
    </>
  )
}

// TODO: Localize EngagementRibbon
// Monday ticket: #6145972584

export function EngagementRibbon (props: EngagementRibbonProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  function goToMeasure (engagementId: string) {
    if (props.onEngagementClick) {
      props.onEngagementClick(engagementId)
    }
  }

  function ShowProgressStatus (props: {status: ProgressStatus | string}): JSX.Element | null {
    switch (props.status) {

        case ProgressStatus.stopped: {
          return <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemStatusCompleted}>{t('--completed--')}</span>
        }

        case ProgressStatus.onhold: {
          return <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemStatusHold}>{t('--onHold--')}</span>
        }

        case ProgressStatus.closed: {
          return <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemStatusClosed}>{t('--closed--')}</span>
        }

        case ProgressStatus.completed: {
            return <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemStatusCompleted}>{t('--completed--')}</span>
        }

        default: {
          return null
        }
    }
}

  function getProfilePic (user: UserId) {
    const [firstName, lastName] = user?.name ? user.name.split(' ') : ['', '']
    return user?.picture || createImageFromInitials(firstName, lastName)
  }

  function viewMeasureDetails (e: React.MouseEvent<HTMLElement>) {
    if (props.currentApp === ApplicationMode.runner) {
      if (props.onViewMeasure) {
        props.onViewMeasure(props.engagement)
      }
    } else if (props.currentApp === ApplicationMode.supplier) {
      if (props.onEngagementClick) {
        props.onEngagementClick(props.engagement.id)
      }
    }
  }

  function getCurrentILIndex (currentMilestone: string, milestones: Array<MilestoneInfo>): string | number {
    const findMilestone = milestones.find(milestone => currentMilestone === milestone.processName)
    return findMilestone ? findMilestone.index : ''
  }

  function showHighPriority () {
    return (props.currentApp === ApplicationMode.supplier && props.currentView === RibbonView.supplierProfile &&
            props.engagement && props.engagement.variables && props.engagement.variables.priority && props.engagement.variables.priority === StandardPriority.high)
  }

  function canShowRequestor (): boolean {
    return (props.engagement.status !== EngagementStatus.Draft) ||
      (props.isEngagementCreationInProgress || props.engagement.processing)
  }

  function canShowSupplier (): boolean {
    return (props.currentApp === ApplicationMode.runner) &&
      (props.currentView !== RibbonView.supplierProfile) &&
      (
        (props.engagement.status !== EngagementStatus.Draft) ||
        (props.isEngagementCreationInProgress || props.engagement.processing)
      ) &&
      (props.engagement && props.engagement?.variables?.partners.length > 0)
  }

  function canContinueRequestCreation (): boolean {
    return (props.currentApp === ApplicationMode.runner) &&
      (props.currentView === RibbonView.engagementList) &&
      (props.engagement.status === EngagementStatus.Draft) &&
      (!props.isEngagementCreationInProgress && !props.engagement.processing)
  }

  function onParentRequestClick (id: string) {
    if (props.currentApp === ApplicationMode.runner) {
      if (props.onParentRequestClick) {
        props.onParentRequestClick(id)
      }
    }
  }

  function handleDeleteClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (props.handleDeleteClick) {
      props.handleDeleteClick()
    }
  }

  function onContinuePressed(e: React.MouseEvent<HTMLElement>, engagement: Engagement) {
    e.preventDefault()
    e.stopPropagation()
    if(props.onContinuePressed) {
      props.onContinuePressed(engagement)
    }
  }

  function showCoOwners(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDetailsOpen(true)
  }

  function canShowMoreSupplier () {
    return (props.currentApp === ApplicationMode.runner && (props.currentView === RibbonView.engagementList || props.currentView === RibbonView.engagementDetails) &&
           !props.engagement?.variables?.partnerSelected && props.engagement?.variables?.partners?.length > 1)
  }

  function getAllSuppliersName () {
    const partners = props.engagement?.variables?.partners?.slice(1)
    return partners?.map(supplier => supplier.name)?.join(', ')
  }

  function getUserImage (firstName: string, lastName: string,  userName: string): string {
    if (firstName && lastName) {
      return createImageFromInitials(firstName, lastName)
    } else {
      const [firstName, lastName] = userName.split(' ')
      return createImageFromInitials(firstName, lastName)
    }
  }

  function getCoOwnersCount (): number {
    if (props.engagement?.coOwnersMembers) {
      return props.engagement?.coOwnersMembers.length
    }
    return 0
  }

  function prepareTrashComponent() {
    return <Trash2
      className={styles.statusIcon}
      size={22} color='#8C8C8C'
    />
  }

  return (
    <>
      <div className={`${styles.engagementListingMeasuresCardRowWrapperInfo} ${props.currentApp === ApplicationMode.runner && props.currentView === RibbonView.engagementDetails ? styles.spread : ''}`}>
       { props.currentApp === ApplicationMode.runner && props.currentView !== RibbonView.engagementDetails &&
          <div className={styles.engagementListingMeasuresCardRowWrapperInfoItem}>
            { props.engagement?.engagementId &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemEngagementId}>{props.engagement.engagementId}</div>}

            { props.engagement?.engagementId &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoSeparator}></div> }
            { props.engagement?.currentRequest &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemProjectType}>{props.requestHeaderLocalizaiton?.requestName || props.engagement.name}</div>}

            { props.currentView === RibbonView.supplierProfile &&
              <div>
                { isLate(props.engagement?.pendingTasks[0]?.lateTime) && props.engagement.status === EngagementStatus.Pending &&
                  <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemPendingLate}>{t('--late--')}</div> }
                { props.engagement.status === EngagementStatus.Completed &&
                  <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemPendingCompleted}>{t('--completed--')}</div>}
                { !isLate(props.engagement?.pendingTasks[0]?.lateTime) && props.engagement.status === EngagementStatus.Pending &&
                  <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemPendingInProgress}>{t('--inProgress--')}</div>}
              </div>}

            { props.currentView === RibbonView.engagementList && props.engagement.status === EngagementStatus.Draft && !props.engagement.processing && !props.isEngagementCreationInProgress &&
              <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemPendingDraft}>{t('--draft--')}</span>}
            { props.currentView === RibbonView.engagementList && props.engagement.status === EngagementStatus.Draft && props.engagement.processing && !props.isEngagementCreationInProgress &&
              <span className={styles.engagementListingMeasuresCardRowWrapperInfoItemPendingProcessing}>{t('--processingRequest--')}</span>}
          </div>
        }
        { props.currentApp === ApplicationMode.supplier && props.currentView === RibbonView.supplierProfile &&
          <div className={styles.engagementListingMeasuresCardRowWrapperInfoItem}>
            { props.engagement?.engagementId &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemEngagementId}>{props.engagement.engagementId}</div>}
            { props.engagement?.engagementId &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoSeparator}></div> }
            { props.engagement?.currentRequest &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemProjectType}>{props.engagement.currentRequest.processName}</div>}
            { props.engagement?.currentMilestone &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemIL}>IL{getCurrentILIndex(props.engagement?.currentMilestone, props.engagement?.milestones)}</div>}
            { props.engagement.progress?.status && props.engagement.progress?.status !== ProgressStatus.ok && props.engagement.status !== EngagementStatus.Draft &&
              <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemStatus}><ShowProgressStatus status={props.engagement.progress?.status} /></div>}
          </div>
        }
        <div className={styles.engagementListingMeasuresCardRowWrapperInfoItem}>
          <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemName}>
            { props.engagement.status !== EngagementStatus.Draft && showHighPriority() &&
              <OroTooltip title={t('--highPriorityMeasure--')} placement="bottom-start" arrow>
                <span className={styles.priority}>{t('--h--')}</span>
              </OroTooltip>
            }
            { props.engagement.status !== EngagementStatus.Draft &&
              <h3 className={styles.title} onClick={(e) => viewMeasureDetails(e)}>{props.engagement?.variables?.activityName || props.engagement?.currentRequest?.processName}</h3> }
            { props.engagement?.parent?.engagementReference && props.currentApp === ApplicationMode.runner &&
              <OroTooltip title={t('--thisRequestWasPartOf--', {engagement: props.engagement?.parent?.engagementReference?.refId || '', name: props.engagement?.parent?.engagementReference?.name || ''})} placement="right">
                <div className={styles.parent}>
                  <img src={BranchIcon} alt=""/>
                  <span className={styles.sec}>{t('--createdFrom--')}</span>
                  <span className={styles.id}>{props.engagement?.parent?.engagementReference?.refId || ''}</span>
                  <Info size={16} color='var(--warm-neutral-shade-200)'/>
                </div>
              </OroTooltip>
              }
            { props.engagement.status === EngagementStatus.Draft && props.currentApp === ApplicationMode.runner &&
              <h3 className={styles.title} onClick={(e) => onContinuePressed(e, props.engagement)}>{props.engagement?.variables?.activityName || props.engagement?.currentRequest?.processName || ''}</h3> }
          </div>
        </div>
        <div className={styles.engagementListingMeasuresCardRowWrapperInfoItemAttributes}>
            {props.currentView !== RibbonView.supplierProfile && props.engagement && props.engagement.status !== EngagementStatus.Draft &&
              <GetProjectRelatedAttributes
                request={props.engagement.currentRequest}
                engagement={props.engagement}
                isMobileView={false}
                priorityOptions={props.priorityOptions}
                canSetPriority={props.canSetPriority}
                requestHeaderLocalizaiton={props.requestHeaderLocalizaiton}
                onPriorityChange={props.onPriorityChange}
                onViewMeasure={goToMeasure}
                onParentRequestClick={(id) => onParentRequestClick(id)}
              />}
            {props.currentView === RibbonView.supplierProfile && <div className={styles.details}>
              <span className={styles.text}>{moment(props.engagement.started).format('MMM DD, YYYY')}</span>
            </div>}
        </div>
      </div>
    { canShowRequestor() &&
      <div className={`${props.currentApp === ApplicationMode.runner ? styles.engagementListingMeasuresCardRowWrapperMoreDetails : styles.engagementListingMeasuresCardRowWrapperOwnerDetails } ${props.currentApp === ApplicationMode.runner && props.currentView === RibbonView.engagementDetails ? styles.compact : ''}`}>
        <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsContainer}>
          <div>
              <span className={styles.label}>{props.currentApp === ApplicationMode.runner ? t("--requester--", `Requester` ): t("--owner--", `Owner`)}</span>
          </div>
          <div className={styles.requester}>
            <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsRow}>
              <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsRowProfile}>
                <img src={getProfilePic(props.engagement?.requester) || defaultUserPic} alt="User profile" />
              </div>
              <OroTooltip title={getUserDisplayName(props.engagement?.requester)} >
                <span className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsText}>{getUserDisplayName(props.engagement?.requester)}</span>
              </OroTooltip>
              {
                props.currentApp === ApplicationMode.runner && getCoOwnersCount() > 0 && <span className={styles.coOwnerListCount} onClick={(e) => {showCoOwners(e)}}>, +{getCoOwnersCount()}</span>
              }
            </div>
          </div>
          { isDetailsOpen && (props.engagement?.coOwnersMembers?.length > 0) &&
            <>
              <div className={styles.popUp} onClick={(e) => {e.preventDefault(); e.stopPropagation();}}>
                <span className={styles.title}>{t('--coOwners--', 'Co-owner(s)')}</span>
                {props.engagement?.coOwnersMembers && <div className={styles.itemContainer}>
                  {
                  props.engagement?.coOwnersMembers.map((owner, key) => {
                            return <div className={styles.item} key={key}>
                            <img className={styles.userImg} src={getUserImage(owner?.firstName, owner?.lastName, owner?.name)} alt=""/>
                              <div className={styles.details}>
                                <div className={styles.userName}>{owner.name}</div>
                                {
                                  owner.email &&
                                  <div className={styles.email}>
                                    <div>{owner.email}</div>
                                  </div>
                                }
                              </div>
                            </div>
                          })
                        }
                  </div>}
              </div>
              <div className={styles.backdrop} onClick={(e) => {e.stopPropagation(); e.preventDefault(); setIsDetailsOpen(false) }}></div>
            </>
          }
        </div>
      </div>}
    { canShowSupplier() &&
      <div className={`${styles.engagementListingMeasuresCardRowWrapperMoreDetails} ${props.currentApp === ApplicationMode.runner && props.currentView === RibbonView.engagementDetails ? styles.compact : ''}`}>
        <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsContainer}>
          <span className={styles.label}>{t('--supplier--')}</span>
          <div className={styles.supplierContainer}>
            <OroTooltip title={props.engagement?.variables?.partners[0].name} >
              <span >{props.engagement?.variables?.partners[0].name}</span>
            </OroTooltip>
            { canShowMoreSupplier() &&
              <OroTooltip title={getAllSuppliersName()} placement="bottom-start" arrow>
                <span className={styles.more}>{t('--countMore--',{count:props.engagement.variables.partners.length - 1})}</span>
              </OroTooltip>
            }
          </div>
        </div>
      </div>}
    { canContinueRequestCreation() &&
      <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetails}>
        <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsDraft}>
        <div className={styles.engagementListingMeasuresCardRowWrapperMoreDetailsDraftContainer}>
              <OroButton
                className={styles.statusButton}
                type="link"
                icon={prepareTrashComponent()}
                onClick={handleDeleteClick}
                radiusCurvature="low"
                fontWeight="semibold" />
              <OroButton
                className={styles.continueButton}
                label={t('--Continue--')}
                type="primary"
                onClick={(e) => onContinuePressed(e, props.engagement)}
                radiusCurvature="low" />
          </div>
        </div>
      </div>}
    </>
  )
}

/**
 * @description This component is used in supplier profile to show engagements
 * @package Toolkit
 * @param EngagementListingProps
 * */

export function SupplierEngagementListing (props: EngagementListingProps) {
    function onViewMeasure (engagement: Engagement) {
      if (props.onViewMeasure) {
        props.onViewMeasure(engagement)
      }
    }

    function onCrumbClick (name: string, index: number) {
      if (props.onCrumbClick) {
        props.onCrumbClick(name, index)
      }
    }

    function goToMeasure (engagementId: string) {
      if (props.onEngagementClick) {
        props.onEngagementClick(engagementId)
      }
    }

    function prepareComponentClasses() {
      return `${styles.engagementListingMeasuresCardRowWrapper}
      ${
        props.currentApp === ApplicationMode.supplier &&
        props.currentView === RibbonView.supplierProfile ?
        styles.engagementListingMeasuresCardRowWrapperList : ''
      }`
    }

    return (
      <div className={styles.engagementListing}>
        <div className={styles.engagementRibbonMeasuresCardList}>
          <div className={styles.engagementListingMeasuresCardRow}>
            <div className={prepareComponentClasses()}>
              <EngagementRibbon
                engagement={props.data}
                currentApp={props.currentApp}
                currentView={props.currentView}
                breadcrumbs={props.breadcrumbs}
                isEngagementCreationInProgress={props.isEngagementCreationInProgress}
                onViewMeasure={onViewMeasure}
                onEngagementClick={goToMeasure}
                onCrumbClick={onCrumbClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
}

