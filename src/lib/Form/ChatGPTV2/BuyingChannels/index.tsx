/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/
import React from 'react'
import styles from './styles.module.scss'
import { BuyingChannelsProps } from './types'
import BuyingChannel from './BuyingChannel/BuyingChannel'

function BuyingChannels (props: BuyingChannelsProps) {
    return <div>
        {!props.isFallbackShown && <div className={styles.responseLabel}>{props.title}</div>}
        <div className={styles.container}>
            {props.buyerChannelDetails && props.buyerChannelDetails?.map((detail, index) => <div key={index}>
                <BuyingChannel
                    primaryButton={props.primaryButton}
                    buyerChannelDetail={detail}
                    fetchProcessDuration={props.fetchProcessDuration}
                    fetchProcessSteps={props.fetchProcessSteps}
                    fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                    createRequest={props.createRequest} /></div>
            )}</div>
    </div>
}

export default BuyingChannels