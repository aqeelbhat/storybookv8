/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { ArrowUpRight, FastForward } from 'react-feather'

import styles from './styles.module.scss'
import defaultCatalogLogo from '../assets/default-catalog-logo.svg'

import { ItemDetails, ItemListType, Option } from '../../../Types'
import { MoneyValue, MoneyValue2 } from '../../../CustomFormDefinition'
import { OroButton } from '../../../controls'
import { getSessionLocale } from '../../../sessionStorage'
import { NAMESPACES_ENUM, useTranslationHook, StringMap } from '../../../i18n'
import OroAnimator from '../../../controls/OroAnimator'
import AIGenerator from '../AIGenerator'

function Catalog (props: {
  catalog?: Option
  reset: boolean
  onSearch: () => Promise<ItemListType>
  onSkip: () => void
  hideSkip: boolean
  onCatalogLoad: ()=>void
}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  const [itemList, setItemList] = useState<ItemListType>()
  const [isLoading, setIsLoading] = useState(false)

  function getI18Text (key: string, options?: StringMap) {
    return t('--catalog--.' + key, options) as string
    //TODO: Remove explicit typecast
    // MARK: This was done for migration
  }

  useEffect(() => {
    if (props.reset) {
      setIsLoading(true)
      props.onSearch()
        .then(res => {
          setIsLoading(false)
          setItemList(res)
          props.onCatalogLoad()
        })
        .catch(err => {
          setIsLoading(false)
          console.log('Catalog: could not fetch catalog options')
        })
    }
  }, [props.reset])

  function gotoMarketplace () {
    const url = itemList?.startPageUrl || props.catalog?.customData?.other?.url
    if (url) {
      window.open(url, '_blank')
    }
  }

  function gotoItem (item: ItemDetails) {
    if (item.url) {
      window.open(item.url, '_blank')
    }
  }

  function viewMore () {
    if (itemList?.searchResultUrl) {
      window.open(itemList.searchResultUrl, '_blank')
    }
  }

  function skip () {
    props.onSkip()
  }
  const _showFoundItems = !isLoading && itemList?.items && (itemList.items.length > 0)
  const _noitems = !isLoading && (!itemList?.items || (itemList.items.length < 1))
  return (<>
    <div className={styles.message}>{getI18Text('--weFoundSomeRecommendations--')}</div>
    <div className={styles.catalog}>
      <div className={styles.header}>
        <div className={styles.details}>
          <div className={styles.title}>{props.catalog?.displayName || ''}</div>
          <div className={styles.description}>{props.catalog?.customData?.longDescription || props.catalog?.customData?.description || ''}</div>
          {(props.catalog?.customData?.limit?.amount !== undefined) &&
            <div className={styles.limit}>{getI18Text('--spendLimit--')} <span className={styles.value}><MoneyValue value={props.catalog?.customData?.limit} locale={getSessionLocale()} /></span></div>}
        </div>
        {props.catalog?.customData?.image &&
          <div className={styles.logo}>
            <img
              src={props.catalog?.customData?.image}
              alt={props.catalog?.displayName}
              style={{ maxHeight: '80px', maxWidth: '140px' }}
              tabIndex={0}
              onClick={gotoMarketplace} />
          </div>}
      </div>
      <OroAnimator show={_showFoundItems}><>
        <div className={styles.foundMessage}>{getI18Text('--foundMatchingItems--')}</div>
        <div className={styles.itemGrid}>
          {itemList?.items && itemList.items.map((item, i) =>
            <div key={i} className={styles.item} tabIndex={0} onClick={() => gotoItem(item)}>
              {item.images?.[0]?.sourceUrl
                ? <div className={styles.icon}>
                  <img src={item.images?.[0]?.sourceUrl} alt={props.catalog?.displayName} style={{ width: '100%' }} />
                </div>
                : <div className={styles.defailtIcon}>
                  <img src={defaultCatalogLogo} alt={props.catalog?.displayName} style={{ height: '40px' }} />
                  <div className={styles.noImageMsg}>{getI18Text('--noImageAvailable--')}</div>
                </div>}
              <div className={styles.name}>{item.name}</div>
              <div className={styles.vendorName}>{item.normalizedVendorRef?.name}</div>
              <div className={styles.price}><MoneyValue2 value={item.price} locale={getSessionLocale()} /></div>
            </div>)}
          {itemList?.searchResultUrl &&
            <div className={`${styles.item} ${styles.viewMore}`} tabIndex={0} onClick={viewMore}>
              <div className={styles.title}>{getI18Text('--seeMore--')}</div>
              <div className={styles.subtitle}>{getI18Text('--inMarketplace--', { marketplaceName: props.catalog?.displayName })}</div>
              <div className={styles.spread} />
              <div className={styles.arrow}><ArrowUpRight size={18} color='var(--warm-prime-azure)' /></div>
            </div>}
        </div></>
      </OroAnimator>
      <OroAnimator show={_noitems}><div className={styles.noFound}>
        <span className={styles.text}>{getI18Text('--couldNotFindMatchingItems--')}</span>
        <OroButton label={getI18Text('--goTo--', { name: props.catalog?.displayName })}
          icon={<ArrowUpRight size={18} />} iconOrientation='right' type='link'
          onClick={gotoMarketplace} />
      </div></OroAnimator>

      <OroAnimator show={isLoading} withDelay><AIGenerator message={getI18Text('--searchingForMatching--')} /></OroAnimator>
    </div>
    <OroAnimator show={!props.hideSkip && !isLoading}><OroButton label={getI18Text('--notApplicableContinueExploring--')}
      icon={<FastForward size={16} />} iconOrientation='right' type='link'
      className={styles.footer}
      onClick={skip} /></OroAnimator>
  </>)
}

export default Catalog