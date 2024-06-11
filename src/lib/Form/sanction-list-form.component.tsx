import React, { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, ChevronRight, ChevronUp, ThumbsUp, X } from 'react-feather'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useMediaQuery } from 'react-responsive'
import { SanctionEntityDetails, SanctionListFormData, SanctionListFormProps} from './types'
import styles from './sanction-list-form-styles.module.scss'
import { MAX_WIDTH_FOR_MOBILE_VIEW } from '../util'
import { Contact, NormalizedVendorRef, Option } from '../Types'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { SanctionResultDialog } from './components/sanction-result-dialog.component'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'
import { OroButton } from '../controls'

export interface SanctionSource {
    name: string
    link: string
}

const mockSanctionSourceList: SanctionSource[] = [
    {
      "name": "Bureau of Industry and Security",
      "link": "https://www.bis.doc.gov/",
    },
    {
      "name": "Excluded Parties List System (EPLS)",
      "link": "https://sam.gov/content/home"
    },
    {
      "name": "EU Consolidated List",
      "link": "https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions?locale=en    "
    },
    {
        "name": "FATF Financial Action Task Force",
        "link": "https://www.fatf-gafi.org/en/home.html"
    },
    {
        "name": "HM Treasury Sanctions",
        "link": "https://www.gov.uk/government/publications/the-uk-sanctions-list"
    },
    {
        "name": "OFAC Non-SDN Entities",
        "link": "https://ofac.treasury.gov/consolidated-sanctions-list-non-sdn-lists"
    },
    {
        "name": "OFAC Sanctions",
        "link": "https://sanctionssearch.ofac.treas.gov/"
    },
    {
        "name": "OFAC SDN",
        "link": "https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists"
    },
    {
        "name": "OSFI Consolidated List",
        "link": "https://sanctionssearchapp.ofsi.hmtreasury.gov.uk/"
    },
    {
        "name": "OFSI Country",
        "link": "https://www.gov.uk/government/organisations/office-of-financial-sanctions-implementation"
    },
    {
        "name": "Primary Money Laundering Concern",
        "link": "https://www.fincen.gov/resources/statutes-and-regulations/311-and-9714-special-measures"
    },
    {
        "name": "Primary Money Laundering Concern - Jurisdictions",
        "link": "https://www.fincen.gov/news/news-releases/financial-action-task-force-identifies-jurisdictions-anti-money-laundering-and"
    },
    {
        "name": "UK HM Treasury List",
        "link": "https://www.gov.uk/government/publications/the-uk-sanctions-list"
    },
    {
        "name": "UN Consolidated List",
        "link": "https://www.un.org/securitycouncil/content/un-sc-consolidated-list"
    }
]

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

enum SantionEntityType {
    Entity = 'Entity',
    Individual = 'Individual',
    Business = 'Business'
}

enum SanctionListSection {
    shareHolder = 'shareHolder',
    subsidiaries = 'subsidiaries',
    subContractors = 'subContractors',
    boardOfDirectors = 'boardOfDirectors'
}

interface SanctionScreeningDetailsProps {
    sectionTitle: string
    sanctionEntityType: SantionEntityType
    selectedSupplier: NormalizedVendorRef
    section?: SanctionListSection
    sanctionDetail?: SanctionEntityDetails[]
    roleOptions?: Option[]
    isAdverseMedia?: boolean
}

interface SanctionResultProps {
    sanctionEntityType: SantionEntityType
    allEntities: SanctionEntityDetails[]
    selectedSupplier: NormalizedVendorRef
    shareHolder?: Contact
    roleOptions?: Option[]
    isAdverseMedia?: boolean
}

function SanctionResult (props: SanctionResultProps) {
    const [selectedResult, setSelectedResult] = useState<SanctionEntityDetails | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [showSanctionResultModal, setShowSanctionResultModal] = useState<boolean>(false)
    const [allEntities, setAllEntites] = useState<SanctionEntityDetails[]>([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [detailsToShow, setDetailsToShow] = useState<number>(10)
    const { t } = useTranslationHook([NAMESPACES_ENUM.SANCTIONLISTFORM])

    useEffect(() => {
      setAllEntites(props.allEntities)
    }, [props.allEntities])

    function onExpandIconClick () {
      setIsExpanded(!isExpanded)
    }

    function showSanctionResultDetail (sanctionEntity: SanctionEntityDetails, index: number) {
        setSelectedResult(sanctionEntity)
        setSelectedIndex(index)
        setShowSanctionResultModal(true)
    }

    function onModalClose() {
        setSelectedResult(null)
        setSelectedIndex(null)
        setShowSanctionResultModal(false)
    }
   
    return (<>
        <div className={styles.sanctionListFormContainerDetail}>
            <div className={styles.titleRow} onClick={onExpandIconClick}>
                { !isExpanded && <ChevronRight size={16} color='var(--warm-neutral-shade-200)' cursor='pointer' /> }
                { isExpanded && <ChevronDown size={16} color='var(--warm-neutral-shade-200)' cursor='pointer' /> }
                {props.sanctionEntityType === SantionEntityType.Business && <div className={styles.name}>
                    {props.selectedSupplier?.name} <span className={styles.count}>({props.selectedSupplier?.sanctionList?.length})</span>
                </div>}
                {props.sanctionEntityType === SantionEntityType.Individual && <div className={styles.name}>
                    {props.shareHolder?.fullName} <span className={styles.count}>({props.shareHolder?.sanctionList?.length})</span>
                </div>}
            </div>
        </div>
        {isExpanded && <>
            <div className={styles.header}>
                <span className={`${styles.sanctionListFormContainerColumnW1} ${styles.text}`}>#</span>
                <span className={`${styles.sanctionListFormContainerColumnW4} ${styles.text}`}>{t('--name--')}</span>
                <span className={`${styles.sanctionListFormContainerColumnW3} ${styles.text}`}>{t('--country--')}</span>
                <span className={`${styles.sanctionListFormContainerColumnW2} ${styles.text}`}>{t('--score--')}</span>
                {/* <span className={`${styles.sanctionListFormContainerColumnW4} ${styles.text}`}>{t('--source--')}</span> */}
            </div>
            <div className={styles.row}>
                { allEntities?.slice(0, detailsToShow).map((entity, key) => {
                        return (
                        <div key={key} className={styles.rowContent}>
                            <div className={`${styles.sanctionListFormContainerColumnW1} ${styles.value}`}>{key + 1}</div>
                            <div className={`${styles.sanctionListFormContainerColumnW4} ${styles.name}`} onClick={() => showSanctionResultDetail(entity, key)}>{entity.fullName}</div>
                            <div className={`${styles.sanctionListFormContainerColumnW3} ${styles.value}`}>{ALPHA2CODES_DISPLAYNAMES[entity.country] || entity.country || '-'}</div>
                            <div className={`${styles.sanctionListFormContainerColumnW2} ${styles.score}`}>{entity.score ? `${Math.round(Number(entity.score))} % Positive` : '-'}</div>
                            {/* <div className={`${styles.sanctionListFormContainerColumnW4} ${styles.value}`}>{entity.listType || ''}</div> */}
                        </div>
                        )
                    })
                }
            </div>
            { allEntities?.length > 10 &&
                <div className={styles.btnContainer}>
                    {(detailsToShow === 10) ? 
                    <OroButton className={`${styles.actionBtn}`} label={t("--viewAll--", {count: allEntities?.length})} type="link" fontWeight="semibold" icon={<ChevronDown size={16} color='var(--warm-prime-azure)' />} iconOrientation="right" radiusCurvature="medium" onClick={e => setDetailsToShow(allEntities?.length)} /> 
                    : <OroButton className={`${styles.actionBtn}`} label={t("--viewLess--")} type="link" fontWeight="semibold" radiusCurvature="medium" icon={<ChevronUp size={16} color='var(--warm-prime-azure)' />} iconOrientation="right" onClick={e => setDetailsToShow(10)} />}
                </div>
            }
        </>}

        <SanctionResultDialog
          isOpen={showSanctionResultModal}
          allEntities={allEntities}
          currentIndex={selectedIndex}
          shareHolder={props.shareHolder}
          roleOptions={props.roleOptions}
          isAdverseMedia={props.isAdverseMedia}
          toggleModal={onModalClose}
        />
    </>
    )
}

function SanctionScreeningDetails (props: SanctionScreeningDetailsProps) {
    const [details, setDetails] = useState<SanctionEntityDetails[]>(null)
    const [shareHolders, setShareHolders] = useState<Contact[]>([])
    const { t } = useTranslationHook([NAMESPACES_ENUM.SANCTIONLISTFORM])

    useEffect(() => {
      setDetails(props.sanctionDetail || [])
    }, [props.sanctionDetail])

    useEffect(() => {
      let allShareHolders = []
      if (props.section === SanctionListSection.shareHolder) {
        allShareHolders = [...props.selectedSupplier?.shareHolders || []]
      }
      if (props.section === SanctionListSection.subsidiaries) {
        allShareHolders = [...props.selectedSupplier?.subsidiaries || []]
      }
      if (props.section === SanctionListSection.subContractors) {
        allShareHolders = [...props.selectedSupplier?.subcontractors || []]
      }
      if (props.section === SanctionListSection.boardOfDirectors) {
        allShareHolders = [...props.selectedSupplier?.boardOfDirectors || []]
      }
      setShareHolders(allShareHolders)
      const allSanctionDetails = allShareHolders.reduce((contact, obj) => contact.concat(obj.sanctionList || []), []);
      setDetails(allSanctionDetails)
    }, [props.section, props.selectedSupplier])

    return ( <>
        {props.sanctionEntityType === SantionEntityType.Business && details?.length > 0 &&
            <div className={styles.sanctionListFormContainer}>
                <SanctionResult
                    sanctionEntityType={props.sanctionEntityType} 
                    allEntities={details}
                    selectedSupplier={props.selectedSupplier}
                    roleOptions={props.roleOptions}
                    isAdverseMedia={props.isAdverseMedia}/>
            </div>
        }

        {props.sanctionEntityType === SantionEntityType.Individual && shareHolders?.length > 0 &&
            shareHolders.map((contact, index) => {
                return (<>
                    {contact?.sanctionList?.length > 0 ?
                        <div key={index} className={styles.sanctionListFormContainer}>
                            <SanctionResult
                                sanctionEntityType={props.sanctionEntityType} 
                                shareHolder={contact} 
                                allEntities={contact?.sanctionList}
                                selectedSupplier={props.selectedSupplier}
                                roleOptions={props.roleOptions}
                                isAdverseMedia={props.isAdverseMedia}/>
                        </div>
                        : <></>
                    }
                </>)
            })
        }
        
        { ((props.sanctionEntityType === SantionEntityType.Business || props.sanctionEntityType === SantionEntityType.Individual) && (details && details.length === 0)) &&
          <div className={styles.sanctionListFormEmptyState}>
            <ThumbsUp size={20} color={'var(--warm-stat-mint-mid)'}/> {t('--noResult--')}
          </div>
        }
    </>)
}


export function SanctionListForm (props: SanctionListFormProps) {
    const [supplierSanctionDetails, setSupplierSanctionDetails] = useState<SanctionEntityDetails[]>([])
    const [sanctionLists, setSanctionLists] = useState<Option[]>([])
    const isBigScreen = useMediaQuery({ query: `(min-width: ${MAX_WIDTH_FOR_MOBILE_VIEW})` })
    const [showSourceDetails, setShowSourceDetails] = useState<boolean>(false)
    const [allSource, setAllSource] = useState<SanctionSource[]>([])

    const { t } = useTranslationHook([NAMESPACES_ENUM.SANCTIONLISTFORM]) 

    useEffect(() => {
        if (props.formData) {
          setSupplierSanctionDetails(props.formData.selectedSupplier?.sanctionList)
        }
        setAllSource(mockSanctionSourceList)
    }, [props.formData])

    useEffect(() => {
        if (props.allSanctionLists) {
          setSanctionLists(props.allSanctionLists)
        }
    }, [props.allSanctionLists])

    function getSanctionListName (type: string): string {
        const sanctionList = sanctionLists.find(details => details.path === type)
        return sanctionList ? sanctionList.displayName : type
    }

    function toggleModal () {
      setShowSourceDetails(!showSourceDetails)
    }

    function canShowSanctionResult (data: Contact[]) {
        return data?.some(result => result.sanctionList?.length > 0)
    }

    return (<>
       <div className={`${styles.sanctionListForm} ${props.readOnly ? styles.sanctionListReadOnlyForm : ''}`}>
            { props.formData?.sanctionRiskScores?.length > 0 && <div className={styles.headerContainer}>
              <div className={styles.subTitle}>{t('--subTitle--')}</div>
              {!props.isAdverseMedia && <div>
                <OroButton label={t('--sourceLink--')} icon={<ArrowUpRight size={16} />} type='secondary' fontWeight='normal' iconOrientation='right' radiusCurvature={'medium'} onClick={toggleModal} />
              </div>}
            </div>}
            <div className={styles.sanctionListFormWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <span className={styles.match}>{t('--entityTitle--')}</span>
                    </div> 
                </div>
                <SanctionScreeningDetails 
                  sectionTitle={t('--entityTitle--')} 
                  sanctionDetail={supplierSanctionDetails} 
                  sanctionEntityType={SantionEntityType.Business}
                  selectedSupplier={props.formData?.selectedSupplier}
                  isAdverseMedia={props.isAdverseMedia}/>
            </div>
            
            <div className={styles.sanctionListFormWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <span className={styles.match}>{t('--individualTitle--')}</span>
                    </div> 
                </div>
                <SanctionScreeningDetails
                  sectionTitle={t('--individualTitle--')}
                  sanctionEntityType={SantionEntityType.Individual}
                  section={SanctionListSection.shareHolder}
                  selectedSupplier={props.formData?.selectedSupplier}
                  roleOptions={props.roleOptions}
                  isAdverseMedia={props.isAdverseMedia}/>
            </div>

            {canShowSanctionResult(props.formData?.selectedSupplier?.subsidiaries) && <div className={styles.sanctionListFormWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <span className={styles.match}>{t('--subsidiariesTitle--')}</span>
                    </div> 
                </div>
                <SanctionScreeningDetails
                  sectionTitle={t('--subsidiariesTitle--')}
                  sanctionEntityType={SantionEntityType.Individual}
                  section={SanctionListSection.subsidiaries}
                  selectedSupplier={props.formData?.selectedSupplier}
                  roleOptions={props.roleOptions}
                  isAdverseMedia={props.isAdverseMedia}/>
            </div>}

            {canShowSanctionResult(props.formData?.selectedSupplier?.subcontractors) && <div className={styles.sanctionListFormWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <span className={styles.match}>{t('--subContractorTitle--')}</span>
                    </div> 
                </div>
                <SanctionScreeningDetails
                  sectionTitle={t('--subContractorTitle--')}
                  sanctionEntityType={SantionEntityType.Individual}
                  section={SanctionListSection.subContractors}
                  selectedSupplier={props.formData?.selectedSupplier}
                  roleOptions={props.roleOptions}
                  isAdverseMedia={props.isAdverseMedia}/>
            </div>}

            {canShowSanctionResult(props.formData?.selectedSupplier?.boardOfDirectors) && <div className={styles.sanctionListFormWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <span className={styles.match}>{t('--boardOfDirectors--')}</span>
                    </div> 
                </div>
                <SanctionScreeningDetails
                  sectionTitle={t('--boardOfDirectors--')}
                  sanctionEntityType={SantionEntityType.Individual}
                  section={SanctionListSection.boardOfDirectors}
                  selectedSupplier={props.formData?.selectedSupplier}
                  roleOptions={props.roleOptions}
                  isAdverseMedia={props.isAdverseMedia}/>
            </div>}
       </div>

       <Modal
            open={showSourceDetails}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className={`${styles.santionSourceModal}`}>
                <div className={styles.modalHeader}>
                  <div className={styles.group}>
                    {t('--sanctionSourceModalTitle--')}
                  </div>
                  <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
                </div>

                <div className={`${styles.modalBody}`}>
                    {allSource && allSource?.length > 0 && allSource?.map((source, index) => {
                        return (
                            <div key={index} className={styles.sanctionSourceContainer}>
                                <div className={styles.source}>
                                  <div className={styles.sourceName}>{source.name}</div>
                                  {source.link && <div className={styles.sourceLinkContainer}>
                                    <a className={styles.link} href={source.link} target="_blank" rel="noopener noreferrer">{source.link} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>
                                  </div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
              </div>
            </Box>
       </Modal>

    </>)
}