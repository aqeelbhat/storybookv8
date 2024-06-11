import React, { useEffect, useState } from "react";
import { IDRef, SegmentationDetail } from "../Types";
import { UpdateSupplierScopeOfUseReadOnlyProps } from "./types";
import { Capabilities } from "./updateSupplierScopeOfUse-form.component";
import './oro-form-read-only.css'
import styles from "./updateSupplierScopeOfUse-form-styles.module.scss"
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import { areArraysSame, getSupplierSegmentationName } from "./util";

interface ScopeDiff {
    changed: boolean
    original: SegmentationDetail | null
}

function EditedScopeDiff (props: {scope: SegmentationDetail, diffs: Array<ScopeDiff> | null}) {
    const [originalScope, setOriginalScope] = useState<SegmentationDetail>(null)

    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)

    useEffect(() => {
      if (props.diffs?.length > 0) {
        const matchedScope = props.diffs.find(diff => diff.changed && (diff.original && diff.original.id === props.scope?.id))
        matchedScope && setOriginalScope(matchedScope.original)
      }
    }, [props.diffs])

    function canShowContraintDiff (updated: IDRef[], original: IDRef[]): boolean {
        const updatedNames = updated?.map(value => value.name)
        const originalNames = original?.map(value => value.name)
        return !areArraysSame(updatedNames, originalNames)
    }

    return (<>
        {originalScope && <div className="oroFormReadOnly">
            <div className="formFields">
                {props.scope?.description !== originalScope?.description && <div className="keyValuePair">
                    <div className="label">{t("Description")}</div>
                    <div className="value diffValue">
                        {props.scope?.description && <span className='updatedValue'>{props.scope?.description}</span>}
                        {originalScope?.description && <span className='oldValue'>{originalScope?.description}</span>}
                    </div>
                </div>}
                {props.scope?.segmentation !== originalScope?.segmentation && <div className="keyValuePair">
                    <div className="label">{t("Status")}</div>
                    <div className="value diffValue">
                        {props.scope?.segmentation && <span className='updatedValue'>{getSupplierSegmentationName(props.scope?.segmentation)}</span>}
                        {originalScope?.segmentation && <span className='oldValue'>{getSupplierSegmentationName(originalScope?.segmentation)}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.categories, originalScope?.dimension?.categories) && <div className="keyValuePair">
                    <div className="label">{t("Categories")}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.categories?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.categories?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.categories?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.categories?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.regions, originalScope?.dimension?.regions) && <div className="keyValuePair">
                    <div className="label">{t('Regions')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.regions?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.regions?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.regions?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.regions?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.sites, originalScope?.dimension?.sites) && <div className="keyValuePair">
                    <div className="label">{t('Sites')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.sites?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.sites?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.sites?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.sites?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.departments, originalScope?.dimension?.departments) && <div className="keyValuePair">
                    <div className="label">{t('Department')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.departments?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.departments?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.departments?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.departments?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.products, originalScope?.dimension?.products) && <div className="keyValuePair">
                    <div className="label">{t('Products')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.products?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.products?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.products?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.products?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.productStages, originalScope?.dimension?.productStages) && <div className="keyValuePair">
                    <div className="label">{t('Products Stages')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.productStages?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.productStages?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.productStages?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.productStages?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.companyEntities, originalScope?.dimension?.companyEntities) && <div className="keyValuePair">
                    <div className="label">{t('Company Entity')}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.companyEntities?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.companyEntities?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.companyEntities?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.companyEntities?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
                {canShowContraintDiff(props.scope?.dimension?.programs, originalScope?.dimension?.programs) && <div className="keyValuePair">
                    <div className="label">{t("Program")}</div>
                    <div className="value diffValue">
                        {props.scope?.dimension && props.scope?.dimension?.programs?.length > 0 && <span className='updatedValue'>{props.scope?.dimension?.programs?.map(constraint => constraint.name).join(', ')}</span>}
                        {originalScope?.dimension && originalScope?.dimension?.programs?.length > 0 && <span className='oldValue'>{originalScope?.dimension?.programs?.map(constraint => constraint.name).join(', ')}</span>}
                    </div>
                </div>}
            </div>
        </div>}
    </>)
}

export function UpdateSupplierScopeOfUseReadOnly (props: UpdateSupplierScopeOfUseReadOnlyProps) {
    const [addedScope, setAddedScope] = useState<SegmentationDetail[]>([])
    const [updatedScope, setUpdatedScope] = useState<SegmentationDetail[]>([])
    const [deletedScope, setDeletedScope] = useState<SegmentationDetail[]>([])

    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)

    useEffect(() => {
      if (props.formData) {
        setAddedScope(props.formData?.added || [])
        setUpdatedScope(props.formData?.updated || [])
        setDeletedScope(props.formData?.deleted || [])
      }
    }, [props.formData])

    return (<>
        <div className={styles.supplierScopeForm}>
            {addedScope && addedScope?.length > 0 && <div className={styles.readOnlyForm}>
                <div className={styles.readOnlyContainer}>
                    <span className={styles.title}>{t('Newly added scope')}</span>
                </div>
                {addedScope.map((capability: SegmentationDetail, index: number) => {
                    return (
                    capability?.dimension
                        ? <div key={index} className={styles.readOnlyFormScopeList}>
                            <Capabilities item={capability} index={index} readOnly={true} />
                        </div>
                        : <></>
                    )
                })}
            </div>}

            {updatedScope && updatedScope?.length > 0 && <div className={styles.readOnlyForm}>
                <div className={styles.readOnlyContainer}>
                  <span className={styles.title}>{t('Edited scope')}</span>
                </div>
                {updatedScope.map((capability: SegmentationDetail, index: number) => {
                    return (
                    capability?.dimension
                        ? <div key={index} className={styles.readOnlyFormScopeList}>
                            <Capabilities item={capability} index={index} readOnly={true} />
                            { props.diffs && props.diffs?.listDiffs && props.diffs?.listDiffs?.segmentations?.listDifferent &&
                                <div>
                                    <EditedScopeDiff scope={capability} diffs={props.diffs?.listDiffs?.segmentations?.itemDiffs}/>
                                </div>
                            }
                        </div>
                        : <></>
                    )
                })}
            </div>}
            
            {deletedScope && deletedScope?.length > 0 && <div className={styles.readOnlyForm}>
                <div className={styles.readOnlyContainer}>
                  <span className={styles.title}>{t('Deleted scope')}</span>
                </div>
                {deletedScope && deletedScope?.length > 0 && deletedScope.map((capability: SegmentationDetail, index: number) => {
                    return (
                    capability?.dimension
                        ? <div key={index} className={`${styles.deletedScopeList}`}>
                            <Capabilities item={capability} index={index} readOnly={true} isDeletedScope={true}/>
                        </div>
                        : <></>
                    )
                })}
            </div>}
        </div>
    </>
    )
}