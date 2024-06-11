import React, { useEffect, useState } from "react"
import { PurchaseOrder, Supplier } from "../../../Types";
import styles from './styles.module.scss'
import { OROSpinner } from "../../../Loaders";
import { OroHyperLink } from "../../../controls/oroHyperLink";
import classNames from "classnames";
import { targetType } from "../../../controls/oroHyperLink/types";
import PurchaseOrderStatus from "../PurchaseOrderStatus";
import { getFormattedDate } from "../utils";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import { Option, } from "../../../Inputs";
import OroAnimator from "../../../controls/OroAnimator";

type Props = {
  loadList: boolean
  poId?: string
  supplierName?: string
  regions: Option[]
  getNormalizedVendors?: (vendorIds: string[], name?: string, regions?: string[], onUploadProgress?: (progressEvent: any) => void) => Promise<Supplier[]>
  fetchPOList: (poNumberOrId: string, supplierIds: string[]) => Promise<{ objs: PurchaseOrder[], total: number }>
}
function PurchaseOrderList (props: Props) {
  const [List, setList] = useState<PurchaseOrder[]>([])
  const [showList, setShowList] = useState(false)
  // for locale
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getLocaleText (key: string) {
    return t('--po--.' + key)
  }

  function LoadPOs (poId: string, supplierIds: string[]) {
    // fetch all PO
    props.fetchPOList(poId, supplierIds)
      .then((res) => {
        setList(res.objs)
        setShowList(true)
      }).catch(() => {
        setShowList(true)
      })
  }

  useEffect(() => {
    if (props.loadList) {
      setShowList(false)

      const _supplierName = props.supplierName || ''
      if (_supplierName && props.getNormalizedVendors) {
        const allRegions = props.regions?.map(region => region.displayName) || []
        props.getNormalizedVendors([], _supplierName, allRegions)
          .then((suppliers) => {
            const _supplierIds = suppliers?.map((sup) => sup.vendorId) || []
            LoadPOs(props.poId || '', _supplierIds)
          }).catch(() => {
            LoadPOs(props.poId || '', [])
          })
      } else {
        LoadPOs(props.poId || '', [])
      }
    }
  }, [props.loadList])

  function renderList () {
    return <div className={styles.table}>
      <div className={styles.header}>
        <div className={classNames(styles.th, styles.nowrap)}>{getLocaleText('--purchaseOrder--')}</div>
        <div className={classNames(styles.th, styles.nowrap)}>{getLocaleText('--supplier--')}</div>
        <div className={classNames(styles.th, styles.nowrap)}>{getLocaleText('--requestor--')}</div>
        <div className={classNames(styles.th, styles.nowrap)}>{getLocaleText('--status--')}</div>
      </div>
      <div className={styles.body}>
        {List.map((po) => <div className={styles.row}>
          <div className={styles.cell}>
            <div className={styles.poCell}>
              <div className={styles.nowrap}>
                <OroHyperLink href={`/purchase/${po.id}`} target={targetType._blank}>{po.poNumber}</OroHyperLink>
              </div>
              <div className={classNames(styles.subLabel, styles.nowrap)}>{getLocaleText('--created--')} {po.erpCreatedDate ? getFormattedDate(po.erpCreatedDate) : po?.created ? getFormattedDate(po.created) : '-'}</div>
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.nowrap}>{po.normalizedVendorRef?.name}</div>
            <div className={classNames(styles.subLabel, styles.nowrap)}>{po.normalizedVendorRef?.id}</div>
          </div>
          <div className={classNames(styles.cell, styles.nowrap)}>{po.requestorName}</div>
          <div className={classNames(styles.cell)}><PurchaseOrderStatus status={po.status || po.runtimeStatus} /></div>
        </div>
        )}
        <div className={styles.footer}>
          <OroHyperLink href={`/purchase?page=0&sort=createdDesc`} target={targetType._blank}>{getLocaleText('--viewAll--')}</OroHyperLink>
        </div>
      </div>
    </div>
  }

  return <div>
    <div className={styles.responseLabel}>{props.poId ? getLocaleText('--overview--') : getLocaleText('--foundList--')}</div>
    {!showList && <OROSpinner />}
    <OroAnimator show={showList}>{renderList()}</OroAnimator>
  </div>
}
export default PurchaseOrderList