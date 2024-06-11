import React, { useEffect, useState } from "react"
import { Edit2, Link, Trash2 } from "react-feather"
import { Typography } from '@mui/material';
import styles from './supplier-assessment-detail-styles.module.scss'
import moment from 'moment'
import { Assessment, Attachment, IDRef } from "../../Types"
import { getUserDisplayName } from "../../Form";
import { OROFileIcon } from "../../RequestIcon";
import { FilePreview } from "../../FilePreview";

export interface AssessmentListProps {
  assessment: Array<any>
  pageSize: number
  hideActions?: boolean
  onDelete?: (selectedAssessment: Assessment, index?: number) => void
  onEdit?: (selectedAssessment: Assessment, index?: number) => void
  onFileLoad? : (id: string) => Promise<string>
  openDocumentByLink?: (url: string) => void
}

interface AssessmentItemProps {
  item: any
  isActive?: boolean
  index?: number
  showLatest?: boolean
  showActions?: boolean
  onAssessmentDelete?: (item: Assessment, index?: number) => void
  onAssessmentEdit?: (item: Assessment, index?: number) => void
  onLoadFile?: (id: string, file: Attachment) => void
  openDocumentLink?: (url: string) => void
}

const ROWS_PER_PAGE = 20

export function AssessmentItem (props: AssessmentItemProps) {
    const [highlights, setHighlights] = useState<Array<{label: string, value: string}>>([])
    const [assessment, setAssessment] = useState<Assessment>(null)

    function formatDate (date: string): string {
      return date ? moment(date).format('MMM DD, YYYY') : ''
    }

    function isDateExpired (date: string): boolean {
      return date ? moment(date).isBefore() : false
    }

    function getAllValues (dimensions: Array<IDRef>): string {
      const restriction: Array<string> = dimensions.map(dimension => dimension.name)
      return restriction ? restriction.join(', ') : ''
    }

    function deleteAssessment () {
      if (props.onAssessmentDelete) {
        props.onAssessmentDelete(assessment, props.index)
      }
    }

    function editAssessment () {
      if (props.onAssessmentEdit) {
        props.onAssessmentEdit(assessment, props.index)
      } 
    }

    function loadFile (id: string, file: Attachment) {
      if (props.onLoadFile) {
        props.onLoadFile(id, file)
      }
    }

    function openDocumentByLink (url: string) {
      if (props.openDocumentLink) {
        props.openDocumentLink(url)
      }
    }

    useEffect(() => {
      if (props.item) {
        setAssessment(props.item)
        const highlightCopy: Array<{label: string, value: string}> = []
        if (props.item.dimension) {
          if (props.item.dimension.programs && props.item.dimension.programs.length > 0){
            highlightCopy.push({
              label: 'Program:',
              value: getAllValues(props.item.dimension.programs)
            })
          }
          if (props.item.dimension.categories && props.item.dimension.categories.length > 0){
            highlightCopy.push({
              label: 'Category:',
              value: getAllValues(props.item.dimension.categories)
            })
          }
          if (props.item.dimension.departments && props.item.dimension.departments.length > 0){
            highlightCopy.push({
              label: 'Department:',
              value: getAllValues(props.item.dimension.departments)
            })
          }
          if (props.item.dimension.companyEntities && props.item.dimension.companyEntities.length > 0){
              highlightCopy.push({
                label: 'Entity:',
                value: getAllValues(props.item.dimension.companyEntities)
              })
          }
        }
        setHighlights(highlightCopy)
      }
    }, [props.item])

    const customStyleText: any = {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--warm-neutral-shade-500)'
      }
    const customStyleFileName: any = {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--warm-neutral-shade-600)',
        cursor: 'pointer',
        maxWidth: '497px'
    }
    const dateExpiredStyle: any = {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--warm-stat-chilli-regular)',
        maxWidth: '92px'
    }

    return (
        <div className={styles.assessmentListTableBodyRow}>
            <div className={styles.assessmentListTableBodyRowContent}>
                <div className={`${styles.assessmentListTableBodyColumn} ${styles.assessmentListTableBodyColumnName}`}>
                  <div className={styles.assessmentListTableBodyColumnNameTitle}>
                    <Typography noWrap={true} variant="body1" sx={customStyleFileName} title={assessment?.name || ''}>
                      {assessment?.name || ''}
                    </Typography>
                  </div>
                  {highlights.length > 0 && <ul className={styles.highlightsContainer}>
                    { highlights.map((highlight, index) => {
                    return <li className={styles.highlightsItem} key={index}>
                        <span className={styles.highlightsLabel}>{highlight.label}</span>
                        <span className={styles.highlightsText}>{highlight.value}</span>
                        <span className={styles.highlightsSeperator}></span>
                    </li>
                    })}
                  </ul>}
                  {assessment && assessment.attachment &&
                  <div className={styles.file} onClick={(e) => loadFile(assessment.id, assessment.attachment)}>
                      {<OROFileIcon fileType={assessment.attachment?.mediatype} />}{assessment.attachment.filename}
                  </div>}
                  {assessment && assessment.souceURL && 
                    <div className={styles.file} onClick={(e) => openDocumentByLink(assessment.souceURL)}>
                        <Link size={18} color={'var(--warm-prime-azure)'}/>URL Link
                    </div>}
                </div>
                <div className={`${styles.assessmentListTableBodyColumn} ${styles.assessmentListTableBodyColumnType}`}>
                  <Typography noWrap={true} sx={customStyleText} variant="body1" title={assessment?.type?.name  || ''}>
                    {assessment?.type?.name || ''}
                  </Typography>
                </div>
                <div className={`${styles.assessmentListTableBodyColumn} ${styles.assessmentListTableBodyColumnType}`}>
                  <Typography noWrap={true} sx={customStyleText} variant="body1" title={formatDate(assessment?.created)}>
                    {formatDate(assessment?.created)}
                  </Typography>
                </div>
                <div className={`${styles.assessmentListTableBodyColumn} ${styles.assessmentListTableBodyColumnType}`}>
                  <Typography noWrap={true} sx={isDateExpired(assessment?.expiration) ?  dateExpiredStyle : customStyleText} variant="body1" title={formatDate(assessment?.expiration)}>
                    {formatDate(assessment?.expiration)}
                  </Typography>
                </div>
                <div className={`${styles.assessmentListTableBodyColumn} ${styles.assessmentListTableBodyColumnOwner}`}>
                  <Typography noWrap={true} sx={customStyleText} variant="body1" title={assessment?.requester ? getUserDisplayName(assessment?.requester) : ''}>
                    {assessment?.requester ? getUserDisplayName(assessment?.requester) : ''}
                  </Typography>
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.assessmentListTableBodyColumnAction}`}>
                    { props.showActions && <span className={styles.assessmentListTableBodyColumnActionDownload}>
                        <Edit2 size={18} color={'var(--warm-neutral-shade-300)'} onClick={editAssessment}/>
                      </span> }
                    { props.showActions && <span className={styles.assessmentListTableBodyColumnActionDownload}>
                        <Trash2 size={18} color={'var(--warm-neutral-shade-300)'} onClick={deleteAssessment}/>
                      </span> }
                </div>
            </div>
        </div>
    )
}
  
export function AssessmentList (props: AssessmentListProps) {

  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')

  function onFileLoad (id: string, file: Attachment) {
    if (props.onFileLoad) {
      props.onFileLoad(id)
      .then((resp) => {
        setDocName(file.filename)
        setMediaType(file.mediatype)
        setFileForPreview(resp)
        setIsPreviewOpen(true)
      })
      .catch(err => console.log(err))
    }
  }

    return (
        <div className={styles.assessmentList}>
            <div className={`${styles.assessmentListTable}}`}>
                <div className={styles.assessmentListTableHeader}>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnName}`}>ASSESSMENT NAME</div>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnType}`}>TYPE</div>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnType}`}>ASSESSED DATE</div>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnType}`}>EXPIRATION DATE</div>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnOwner}`}>UPLOADED BY</div>
                <div className={`${styles.assessmentListTableHeaderColumn} ${styles.assessmentListTableHeaderColumnAction}`}></div>
                </div>
                <div className={styles.assessmentListTableBody}>
                {
                    props.assessment && props.assessment.length > 0 && props.assessment.slice(props.pageSize*ROWS_PER_PAGE, (props.pageSize+1)*ROWS_PER_PAGE).map((item, index) => {
                    return (
                        <AssessmentItem
                            key={index}
                            index={index}
                            item={item}
                            showActions={props.hideActions}
                            onAssessmentDelete={props.onDelete}
                            onAssessmentEdit={props.onEdit}
                            onLoadFile={onFileLoad}
                            openDocumentLink={props.openDocumentByLink}
                        />
                    )
                    }) 
                }
                </div>
            </div>
            {
                fileForPreview && isPreviewOpen &&
                <FilePreview
                    fileBlob={fileForPreview}
                    fileURL={fileForPreview}
                    filename={docName}
                    mediatype={mediaType}
                    onClose={(e) => {setIsPreviewOpen(false); e.stopPropagation()}}
                />
            }
        </div>
    )
}
    