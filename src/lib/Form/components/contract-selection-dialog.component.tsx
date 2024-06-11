import React, { useEffect, useState } from 'react'
import { Checkbox, TablePagination } from '@mui/material'
import { ChevronLeft, ChevronRight, Search, X } from 'react-feather'
import styles from './contract-selection-dialog.module.scss'
import { ExistingContract } from '../types'
import { IDRef } from '../../Types'
import { formatDate, getDateRangeDisplayString, getFormattedAmountValue, mapContractToIDRef } from '../util'
import { useTranslationHook, NAMESPACES_ENUM } from '../../i18n';

interface ContractSelectionProps {
    contractList?: Array<ExistingContract>
    selectedContracts?: Array<IDRef>
    onClose?: () => void
    onSelectedContract?: (contracts: Array<IDRef>) => void
}

interface ContractListItemProps {
    contract: ExistingContract
    selectedContracts: Array<IDRef>
    index: number
    onSelectContract?: (contracts: Array<IDRef>) => void
}

function ContractListItem (props: ContractListItemProps) {
    const [isContractSelected, setIsContractSelected] = useState(false)

    useEffect(() => {
      if (props.contract) {
        const contract = props.selectedContracts?.find(item => item.id === props.contract.contractId)
        setIsContractSelected(contract ? true : false)
      }
    }, [props.contract])

    function handleContractSelection (event) {
        setIsContractSelected(event.target.checked)
        let updatedContracts: IDRef[] = []
        if (event.target.checked) {
           const mappedContract = mapContractToIDRef(props.contract) 
           updatedContracts = [...props.selectedContracts, mappedContract]
        } else {
           updatedContracts = props.selectedContracts?.filter(contract => contract.id !== props.contract?.contractId)
        }
        props.onSelectContract(updatedContracts)
    }

    return (
      <div className={styles.contractContainerListRow}>
        <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowCheckbox} contractSelectionCheckbox`}>
          <Checkbox id={`${props.index}_contract`} onChange={handleContractSelection} checked={isContractSelected} />
        </div>
        <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowName}`}>
            <div className={styles.contractContainerListRowNameDetails}>
                <div className={styles.contractContainerListRowNameDetailsTitle} title={props.contract?.name}>{props.contract?.name}</div>
                {props.contract?.startDate && props.contract?.endDate && <div className={styles.contractContainerListRowNameDetailsPeriod}>
                    {getDateRangeDisplayString(props.contract?.startDate, props.contract?.endDate)}
                </div>}
            </div>
        </div>
          <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowOwner}`}>
            {props.contract?.businessOwners?.map(owner => owner.name)?.join(', ') || '-'}
          </div>
          <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowDepartment}`}>
            {props.contract?.departments?.map(dept => dept.name)?.join(', ') || '-'}
          </div>
          <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowRenewal}`}>
            {formatDate(props.contract?.autoRenewDate, 'MMM DD[,] YYYY')}
          </div>
          <div className={`${styles.contractContainerListRowItem} ${styles.contractContainerListRowTCV}`}>
            {getFormattedAmountValue(props.contract?.totalValueMoney)}
          </div>
      </div>
    )
}

export function ContractSelectionDialog (props: ContractSelectionProps) {
    const [contracts, setContracts] = useState<Array<ExistingContract>>([])
    const [selectedContracts, setSelectedContracts] = useState<Array<IDRef>>([])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

    useEffect(() => {
        setContracts(props.contractList || [])
    }, [props.contractList])

    useEffect(() => {
        props.selectedContracts && setSelectedContracts(props.selectedContracts || [])
    }, [props.selectedContracts])

    function handleSearchInputChange (searchKey: string) {
        setSearchKeyword(searchKey)
        const filteredContracts = props.contractList?.filter(contract => {
          return searchKey === '' || (contract.name.toLowerCase().includes(searchKey.toLowerCase()))
        })
        setContracts(filteredContracts)
        setPage(0)
        setRowsPerPage(10)
    }

    function handleChangePage (event, newPage) {
        setPage(newPage)
        const contractContainerListRows = document.getElementById('contractContainerListRows') as HTMLDivElement
        contractContainerListRows?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }

    function handleChangeRowsPerPage (event) {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    function clearSearch() {
        setSearchKeyword('')
        handleSearchInputChange('')
    }

    function onContractSelection (contracts: IDRef[]) {
        setSelectedContracts(contracts)
    }

    function onSubmitContracts () {
        if (props.onSelectedContract) {
            props.onSelectedContract(selectedContracts)
        }
    }

    return (
        <div className={styles.contract}>
            <div className={styles.contractContainer}>
                <div className={styles.contractContainerHeader}>
                    {t("Select the contracts for renewal")}
                    <X size={20} color="var(--warm-neutral-shade-500)" onClick={props.onClose}></X>
                </div>
                <div className={styles.contractContainerFilters}>
                    <div className={styles.contractContainerFiltersSearch}>
                        <Search size={16} color={'var(--warm-neutral-shade-400)'} />
                        <input
                            type="text"
                            placeholder={t("Search")}
                            value={searchKeyword || ''}
                            onChange={(e) => handleSearchInputChange(e.target.value)}
                        />
                        {searchKeyword && <X size={16} color={'#575F70'} onClick={clearSearch} />}
                    </div>
                </div>
                <div className={styles.contractContainerList}>
                    <div className={styles.contractContainerListColumns}>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnCheckbox}`}></div>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnName}`}>NAME</div>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnOwner}`}>OWNER</div>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnDept}`}>DEPARTMENT</div>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnRenewalDate}`}>RENEWAL DUE</div>
                        <div className={`${styles.contractContainerListColumn} ${styles.contractContainerListColumnTCV}`}>TCV</div>
                    </div>
                    <div className={styles.contractContainerListRows} id='contractContainerListRows'>
                      {
                        contracts.length > 0 && contracts.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => {
                          return (
                            <ContractListItem key={index} contract={item} selectedContracts={selectedContracts} onSelectContract={onContractSelection} index={page * rowsPerPage + (index)}></ContractListItem>
                          )
                        })
                      }
                    </div>
                </div>
                <div className={styles.contractContainerFooter}>
                    <TablePagination
                        component="div"
                        count={contracts.length}
                        className={styles.contractContainerPaginationContainer}
                        backIconButtonProps={{ className: `${styles.tablePaginationBackArrow}`, children: <ChevronLeft size={16} color='var(--warm-neutral-shade-300)'></ChevronLeft> }}
                        nextIconButtonProps={{ className: `${styles.tablePaginationNextArrow}`, children: <ChevronRight size={16} color='var(--warm-neutral-shade-300)'></ChevronRight> }}
                        page={page}
                        labelRowsPerPage=''
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  <button className={styles.actionButton} onClick={onSubmitContracts}>
                    {t("Done")}
                  </button>
                </div>
            </div>
        </div>
      )
}

