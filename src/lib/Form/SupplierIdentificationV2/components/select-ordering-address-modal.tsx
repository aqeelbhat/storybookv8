import React, { useEffect, useState } from "react"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { OroButton } from "../../../controls"
import { getMaterialBoxStyle } from '../../../controls/popovers/utils'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../../i18n"
import { AlertCircle, Check, Circle, X } from "react-feather"
import { Address, IDRef, Location, Vendor, convertAddressToString } from "../../.."
import styles from './styles.module.scss'

interface OrderingAddressProps {
  open: boolean
  vendor: Vendor[]
  orderingAddress?: string
  purchaseOrgs?: IDRef[]
  isOrderingAddressMandatory?: boolean
  onOrderingAddressSelect?: (address: Address) => void
  onClose?: () => void
}

const orderingAddressListStyle = getMaterialBoxStyle({
    width: '600px',
    padding: '24px'
})

function OrderingAddressModalComponent (props: OrderingAddressProps) {
    const [value, setValue] = useState<Location | null>(null)
    const [allLocations, setAllLocations] = useState<Location[]>([])
    const [showError, setShowError] = useState(false)
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

    useEffect(() => {
      if (props.vendor && props.vendor.length > 0) {
        const _allLocations = props.vendor.map(data => data.locations).flat()
        setAllLocations(_allLocations)
        if (props.orderingAddress) {
          const _location = _allLocations.find(loc => {
            const address = convertAddressToString(loc.address)
            return address === props.orderingAddress
          })
          setValue(_location)
        }
      }
    }, [props.vendor, props.orderingAddress])

    function handleChange (location: Location) {
      setValue(location)
      setShowError(false)
    }
    function onSubmit () {
        if (value) {
          setShowError(false)
          props.onOrderingAddressSelect && props.onOrderingAddressSelect(value.address)
        } else {
          setShowError(true) 
        }
    }
    return (
        <Modal
          open={props.open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={orderingAddressListStyle}>
            <div className={styles.orderingAddressPopup}>
                <div className={styles.orderingAddressPopupHeader}>
                  <div className={styles.title}>
                    <div className={styles.text}>{t('--selectOrderingAddress--')}</div>
                    <X className={styles.closeBtn} size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => { setShowError(false); props.onClose()}} />
                  </div>
                  <div className={styles.subTitle}>
                    <div className={styles.name}>
                        {t('--purchaseEntity--')}
                        <span>{props.purchaseOrgs?.map(org => org.name)?.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.orderingAddressPopupBody}>
                    <div className={styles.resultContainer}>
                      <div className={styles.resultContainerList}>
                      {
                          props.vendor && props.vendor?.length > 0 && props.vendor.map((vendor, index) => {
                            return (
                              <div key={index}>
                                {
                                  vendor.locations && vendor.locations?.length > 0 && vendor.locations.map((location, idx) => {
                                    return (<div key={idx} className={`${styles.resultContainerListItems} ${value === location ? styles.active : ''}`} onClick={() => handleChange(location)}>
                                      <div className={styles.resultContainerListItemsInfo}>
                                        <div className={styles.resultContainerListItemsInfoDetail}>
                                            <div className={styles.resultContainerListItemsInfoDetailrow}>
                                            <div className={styles.vendorId}>{vendor.vendorId || vendor.id}</div>
                                            <div className={styles.vendorName}>{vendor.name}</div>
                                            </div>
                                            <div className={styles.vendorAddress}>{convertAddressToString(location.address)}</div>
                                        </div>
                                        <div className={styles.resultContainerListItemsInfoCheckbox}>
                                            {value !== location && <Circle color="var(--warm-neutral-shade-100)" />}
                                            {value === location && <span className={styles.icon}><Check color="var(--warm-prime-chalk)" /></span>}
                                            <input type="radio" name="contact" onChange={() => handleChange(location)} />
                                        </div>
                                      </div>
                                    </div>)
                                  })
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                    {allLocations && allLocations.length === 0 && <div className={styles.emptyResultContainer}>
                       {t('--noOrderingAddressAvailable--')}
                      </div>}
                </div>
                {showError && props.isOrderingAddressMandatory && <div className={styles.error}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)" /> {t('--pleaseSelectOrderingAddress--')}</div>}
                {allLocations?.length > 0 && <div className={styles.orderingAddressPopupFooter}>
                  <OroButton label={t('--submit--')} type='primary' radiusCurvature="medium" fontWeight="semibold" onClick={onSubmit} />
                </div>}
            </div>
          </Box>
        </Modal>
      )
}
export function OrderingAddressModal (props: OrderingAddressProps) {
    return <I18Suspense><OrderingAddressModalComponent {...props}></OrderingAddressModalComponent></I18Suspense>
}