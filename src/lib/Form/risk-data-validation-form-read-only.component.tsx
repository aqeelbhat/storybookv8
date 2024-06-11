import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import dashboardIcon from './assets/dashboard.svg'
import { RiskValidationFormData, RiskScoreDetails} from './types'
import styles from './risk-data-validation-form-read-only-styles.module.scss'
import defaultUserPic from './assets/default-user-pic.png'
import { getUserDisplayName, OROFORMIDS } from './util'
import { getRiskLevelClass, getRiskLevelDisplayName, getProfilePic, RiskScore } from './risk-data-validation-form.component'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function RiskDataValidationFormReadOnlyComponent (props: {data: RiskValidationFormData, formId?: string}) {
    const [allComments, setAllComments] = useState<Array<RiskScoreDetails>>([])
    const { t } = useTranslationHook(NAMESPACES_ENUM.RISKDATAVALIDATIONFORM)
    const riskLevelOptions = [
        {
          id: 'low',
          displayName: t("--low--"),
          path: 'low'
        },
        {
          id: 'medium',
          displayName: t("--medium--"),
          path: 'medium'
        },
        {
          id: 'high',
          displayName: t("--high--"),
          path: 'high'
        }
      ]

    useEffect(() => {
        setAllComments([])
        let allPreviousComments: Array<RiskScoreDetails> = []
        if (props?.data.oroRiskScore?.manualRiskScoreHistory?.length) {
            allPreviousComments = [...props?.data.oroRiskScore?.manualRiskScoreHistory, props?.data?.oroRiskScore?.manualRiskScore]            
        } else {
            if (props?.data?.oroRiskScore?.manualRiskScore) {
                allPreviousComments.push(props?.data?.oroRiskScore?.manualRiskScore)
            }
        }
        setAllComments(allPreviousComments)
    }, [props.data])
    
    function getRiskValidationData (row: RiskScoreDetails[], section?: string) {
        return (
            row?.length > 0 && row?.map((item, key) => {
                return (
                    <RiskScore key={key} riskScore={item} />
                )
            })
        )
    }

    function getAllComments () {

        return (
            allComments?.length > 0 && allComments.map((item, key) => {
                return (
                    <div key={key} className={styles.riskValidationFormReadOnlyScoreRowDataValidationContent}>
                        <div className={styles.riskValidationFormReadOnlyCommentsBodyRowProfile}>
                          <img src={getProfilePic(item.userId) || defaultUserPic} alt={t("--userProfile--")} />
                        </div>
                        <div className={classnames(styles.item, styles.col1)}>
                            <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumn}>
                                <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumnSource}>{t("--requestor--")}</span>
                                <div>
                                    <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumnService}>{getUserDisplayName(item.userId)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={classnames(styles.item, styles.col1)}>

                        </div>
                        <div className={classnames(styles.item, styles.col1, styles.riskValidationFormReadOnlyScoreRowDataValidationContentRiskBadge)}>
                            <div className={`${styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumn}`}>
                                <div className={`${styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumnLevel} ${getRiskLevelClass(item?.level)}`}>
                                    <span className={styles.risklevel}>{getRiskLevelDisplayName(riskLevelOptions, item.level)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={classnames(styles.item, styles.col3)}>
                            <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumn}>
                                <ul className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumnNoteslist}>
                                {
                                    item.notes && item.notes.map((note, i) => {
                                    return (
                                        <li key={i} className={styles.riskValidationFormReadOnlyScoreRowDataValidationContentColumnlist}>{note}</li>
                                    )
                                    })
                                }
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }

  return (
    <div>
    <div className={styles.riskValidationFormReadOnly}>
        <div className={styles.riskValidationFormReadOnlySection}>
            {props.formId !== OROFORMIDS.OroDomainRiskScoreForm && <div className={styles.overallScoreContainer}> 
                <div className={`${styles.overallScoreContainerManualRiskScore} ${getRiskLevelClass(props.data?.oroRiskScore?.overallLevel)}`}>
                    <div className={classnames(styles.item, styles.icon)}>
                      <img src={dashboardIcon} alt=""/>
                    </div>
                    <div className={`${classnames(styles.item, styles.col3, styles.leveltext)}`}>
                        <span className={styles.riskValidationFormReadOnlyText}>{t("--overallRiskLevelLabel--")}</span>
                    </div>
                    <div className={`${classnames(styles.item, styles.col2)}`}> 
                        <span className={styles.overallRisk}>{getRiskLevelDisplayName(riskLevelOptions, props.data?.oroRiskScore?.overallLevel)}</span>
                    </div>
                </div>
            </div>}

            { props.formId !== OROFORMIDS.OroDomainRiskScoreForm && (props?.data?.oroRiskScore?.manualRiskScoreHistory?.length || props?.data?.oroRiskScore?.manualRiskScore) &&
                <div className={styles.riskValidationFormReadOnlyRow}>  
                    <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                           <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--manualScore--")}</span>
                        </div>
                        <div className={styles.comments}>
                            { getAllComments() }
                        </div>
                    </div>
                </div>
            }
            {
                (props.formId === OROFORMIDS.OroDomainRiskScoreForm || props.formId === OROFORMIDS.OroRiskScoreForm) && props.data.oroRiskScore && props.data.oroRiskScore?.domainRiskScore && props.data.oroRiskScore?.domainRiskScore?.length > 0 &&
                <div className={styles.riskValidationFormReadOnlyRow}>
                    <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                            <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--domainVerification--")} </span>
                        </div>
                            {
                                getRiskValidationData(props.data.oroRiskScore.domainRiskScore, 'email')
                            }
                    </div>
                </div>
            }
            {
                props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.data.oroRiskScore && props.data.oroRiskScore?.emailRiskScore && props.data.oroRiskScore?.emailRiskScore?.length > 0 &&
                <div className={styles.riskValidationFormReadOnlyRow}>
                    <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                            <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--emailVerificationLabel--")} </span>
                        </div>
                            {
                                getRiskValidationData(props.data.oroRiskScore.emailRiskScore, 'email')
                            }
                    </div>
                </div>
            }
            {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.data?.oroRiskScore && props.data?.oroRiskScore?.oroRiskScore &&
                    <div className={styles.riskValidationFormReadOnlyRow}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                            <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                              <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--internalScore--")}</span>
                            </div>

                            <RiskScore riskScore={props.data?.oroRiskScore?.oroRiskScore} />
                        </div>
                    </div>
            }
            {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.data?.oroRiskScore && props.data?.oroRiskScore?.sustainabilityScore &&
                    <div className={styles.riskValidationFormReadOnlyRow}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                            <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                              <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--sustainabilityScore--")}</span>
                            </div>

                            {
                                getRiskValidationData(props.data.oroRiskScore.sustainabilityScore)
                            }
                        </div>
                    </div>
            }
            {
                props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.data.oroRiskScore && props.data.oroRiskScore?.bankAccountRiskScore && props.data.oroRiskScore?.bankAccountRiskScore?.length > 0 &&
                <div className={styles.riskValidationFormReadOnlyRow}>
                    <div className={styles.riskValidationFormReadOnlyScoreRowDataValidation}>
                        <div className={styles.riskValidationFormReadOnlyScoreRowDataValidationSection}>
                           <span className={styles.riskValidationFormReadOnlyScoreRowDataValidationSectionHeader}>{t("--bankAccountValidation--")}</span>
                        </div>
                            {
                                getRiskValidationData(props.data.oroRiskScore.bankAccountRiskScore, 'bank')
                            }
                    </div>
                </div>
            }
        </div>
    </div>
</div>
  )
}
export function RiskDataValidationFormReadOnly (props: {data: RiskValidationFormData, formId?: string}){
    return <I18Suspense><RiskDataValidationFormReadOnlyComponent {...props} /></I18Suspense>
  }
