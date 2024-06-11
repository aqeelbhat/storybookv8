import React, { useEffect, useState } from 'react'
import { Box, Modal, Pagination, TablePagination } from '@mui/material'
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from 'react-feather'
import classnames from 'classnames'

import { PurchaseOrder, Option } from '../../Types'
import { OroButton } from '../../controls'
import { getTotalPriceDisplayText } from '../../Form/changepo-form.component'

import styles from './poSearchPopup.module.scss'
import { PurchaseOrderFilter, PurchaseOrderSearchVariables } from '../../Types/common'
import { getDateDisplayString } from '../../Form/util'
import { FilterOption, StatusSelector } from '../button/status-filter-selector.component'
import { getI18Text as getI18ControlText } from '../../i18n'

export enum SortKey {
  recentlyUpdated = 'recentlyUpdated',
  dueDate = 'dueDate',
  created = 'created',
  amount = 'amount',
  updated = 'updated',
  startDate = 'startDate',
  endDate = 'endDate',
  totalValue = 'totalValue',

  updatedAsc = 'updatedAsc',
  startDateAsc = 'startDateAsc',
  endDateAsc = 'endDateAsc',
  totalValueAsc = 'totalValueAsc'
}

export const DEFAULT_PAGE_SIZE = 30
const SORT_OPTIONS: Array<FilterOption> = [
  {
    code: SortKey.created,
    label: 'Last updated'
  },
  {
    code: SortKey.amount,
    label: 'Amount'
  }
]

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 920,
  height: 580,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  padding: '20px 24px',
  borderRadius: '8px'
}

export function PoSearchPopup (props: {
  isOpen: boolean
  filter: PurchaseOrderFilter
  options?: PurchaseOrder[]
  totalOptions?: number
  defaultCurrency?: string
  departmentOptions?: Option[]
  locale: string
  onClose?: () => void
  onFilterChange?: (variables: PurchaseOrderSearchVariables) => void
  onSelect?: (po: PurchaseOrder) => void
}) {
  const [searchString, setSearchString] = useState<string>('')
  const [sort, setSort] = useState<string>(SortKey.created)
  const [departments, setDepartments] = useState<string[]>([])
  const [page, setPage] = useState<number>(0)

  useEffect(() => {
    setSearchString(props.filter?.keywords)
    // setSort(props.filter?.sortKey)
    // setDepartments(props.filter?.departments)
  }, [props.filter])

  useEffect(() => {
    if (props.onFilterChange) {
      props.onFilterChange({
        filter: {
          keywords: searchString,
          departments: departments,
          sortKey: sort
        },
        page: page,
        size: DEFAULT_PAGE_SIZE
      })
    }
  }, [searchString, sort, departments, page])

  function selectPO (po: PurchaseOrder) {
    if (props.onSelect) {
      props.onSelect(po)
    }
  }

  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <div className={styles.poModal}>
          <div className={styles.headerBar}>
            <div className={styles.title}>
              Advanced PO search
            </div>
            <div className={styles.spread}></div>
            <div className={styles.closeBtn} onClick={props.onClose}>
              <X size={16} color={'var(--warm-neutral-shade-500)'} />
            </div>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.search}>
              <Search size={16} color={'#575F70'} />
              <input
                type="text"
                placeholder={getI18ControlText('--fieldTypes--.--objectSelector--.--searchByName--')}
                value={searchString || ''}
                onChange={(e) => setSearchString(e.target.value)}
              />
              {searchString && <X size={16} color={'#575F70'} onClick={() => setSearchString('')} />}
            </div>
            <div className={styles.spread} />
            <div className={styles.sort}>
              <StatusSelector value={sort} options={SORT_OPTIONS} expandLeft hideCount onChange={val => setSort(val as string)} />
            </div>
            <div className={styles.filter}>
              {props.departmentOptions && props.departmentOptions.length > 0 &&
                <StatusSelector placeholder='Departments' value={departments} options={props.departmentOptions.map(dept => { return { code: dept.path, label: dept.displayName }})} multiselect expandLeft hideCount onChange={val => setDepartments(val as string[])} />}
            </div>
          </div>

          <div className={styles.poList}>
            <div className={styles.poListHeader}>
              <div className={`${styles.col} ${styles.name}`}>PO Details</div>
              <div className={styles.col}>Department</div>
              <div className={styles.col}>Company Entity</div>
              <div className={styles.col}>Total</div>
              <div className={`${styles.col} ${styles.action}`}></div>
            </div>
            {props.options &&
              <div className={styles.poListItemsWrapper}>
                {props.options.map((po, i) =>
                  <div className={classnames(styles.poListItem)} key={i}>
                    <div className={`${styles.col} ${styles.name}`}>
                      <div className={styles.poDetails}>
                        <div className={styles.primary}>
                          <div className={styles.prop}>{po.poNumber}</div>
                          <div className={styles.prop}>{po.normalizedVendorRef?.name || po.normalizedVendorRef?.selectedVendorRecord?.name}</div>
                        </div>
                        <div className={styles.secondary}>
                          <div className={styles.prop}>Created on: <span className={styles.value}>{getDateDisplayString(po.start, props.locale)}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.col}>
                      {po.departmentRef?.name || ''}
                    </div>
                    <div className={styles.col}>
                      {po.companyEntityRef?.name || ''}
                    </div>
                    <div className={styles.col}>
                      {getTotalPriceDisplayText(po, props.defaultCurrency)}
                    </div>
                    <div className={`${styles.col} ${styles.action}`}>
                      <OroButton label='Select' icon={<ArrowRight size={16} />} type='primary' fontWeight='normal' iconOrientation='right' radiusCurvature={'medium'} onClick={() => selectPO(po)} />
                    </div>
                  </div>)}
              </div>}
          </div>

          <div className={styles.actionBar}>
            <div className={styles.spread}></div>
            <div className={styles.pagination}>
              {/* <Pagination
                shape='rounded'
                // count={Math.ceil(tableCount / DEFAULT_PAGE_SIZE)}
                page={page + 1}
                onChange={(evt, page) => setPage(page - 1)}
              /> */}
              <TablePagination
                component="div"
                count={props.totalOptions || 0}
                backIconButtonProps={{ className: `${styles.tablePaginationBackArrow}`, children: <ChevronLeft size={16} color='var(--warm-neutral-shade-300)' /> }}
                nextIconButtonProps={{ className: `${styles.tablePaginationNextArrow}`, children: <ChevronRight size={16} color='var(--warm-neutral-shade-300)' /> }}
                page={page}
                labelRowsPerPage={'Tasks per page:'}
                rowsPerPage={DEFAULT_PAGE_SIZE}
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                onPageChange={(e, page) => setPage(page)}
                // onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}
