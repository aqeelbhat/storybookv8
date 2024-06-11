/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { OroButton, ProcessStep, RichTextEditor } from '../../../..'
import { LatestReviewSteps } from '../../../../LatestPreviewSteps/latest-review-steps.component'
import styles from './styles.module.scss'
import { BuyingChannelProps } from '../types'

function BuyingChannel (props: BuyingChannelProps) {
    const [steps, setSteps] = useState<Array<ProcessStep>>([])
    const [daysToComplete, setDaysToComplete] = useState<number>(0)
    const [minDuration, setMinDuration] = useState<string>('')
    const [maxDuration, setMaxDuration] = useState<string>('')

    useEffect(() => {
        const _process = props.buyerChannelDetail?.requestProcessName
        if (_process && props.fetchProcessSteps) {
            props.fetchProcessSteps(_process)
                .then(resp => {
                    if (resp?.steps?.length > 0) {
                        setSteps(resp?.steps)
                    }
                    if (resp?.daysToComplete) {
                        setDaysToComplete(resp?.daysToComplete)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        if (_process && props.fetchProcessDuration) {
            props.fetchProcessDuration(_process)
                .then(resp => {
                    if (resp.min) {
                        setMinDuration(resp.min)
                    }
                    if (resp.max) {
                        setMaxDuration(resp.max)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [props.buyerChannelDetail?.requestProcessName])

    function handleButtonClick () {
        if (props.createRequest && props.buyerChannelDetail?.requestProcessName && props.buyerChannelDetail?.ref) {
            props.createRequest(props.buyerChannelDetail?.requestProcessName, props.buyerChannelDetail?.ref)
        } else if (props.buyerChannelDetail?.url) {
            window.open(props.buyerChannelDetail?.url, '_blank')
        }
    }
    const imgStyle: React.CSSProperties = {
        maxHeight: "48px",
        maxWidth: "140px"
    }
    const imageUrl = props.buyerChannelDetail?.imageUrl
    if (imageUrl && imageUrl.endsWith('.svg')) {
        imgStyle.width = "140px"
        imgStyle.height = "48px"
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.infoCell}>
                    <div className={styles.title}>{props.buyerChannelDetail?.ref?.name || ''}</div>
                    {props.buyerChannelDetail?.description && <div className={styles.desc}>{props.buyerChannelDetail?.description}</div>}
                </div>
                {imageUrl && <div>
                    <img style={imgStyle} src={imageUrl} />
                </div>}
            </div>
            {props.buyerChannelDetail?.helpVideo &&
                <div className={styles.video}>
                    <iframe width='100%' src={props.buyerChannelDetail?.helpVideo} />
                </div>}
            {props.buyerChannelDetail?.instruction &&
                <div className={styles.instruction}><RichTextEditor className="oro-rich-text-question-readonly"
                    value={props.buyerChannelDetail?.instruction}
                    readOnly={true}
                    hideToolbar={true} /></div>}
            {
                steps?.length > 0 &&
                <div>
                    <LatestReviewSteps
                        steps={steps}
                        daysToComplete={daysToComplete}
                        minDuration={minDuration}
                        maxDuration={maxDuration}
                        fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                    />
                </div>
            }
            <div className={styles.buttons}>
                <OroButton type='primary' label={props.primaryButton} radiusCurvature='medium' onClick={handleButtonClick} />
            </div>
        </div>
    )
}

export default BuyingChannel
