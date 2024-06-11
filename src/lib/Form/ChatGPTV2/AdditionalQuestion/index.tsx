/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import styles from './styles.module.scss'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { OroButton } from '../../../controls'
import { ArrowRightCircle, ChevronsRight } from 'react-feather'
import { IQuestion } from '../types'
import AIResponse from '../AIResponse'
import OroAnimator from '../../../controls/OroAnimator'
import { NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'

type IProps = {
    show: boolean
    userResponded: boolean
    placeholder: string
    value: IQuestion
    onSearch: (input: IQuestion) => void
    onQuestionSkip?: (input: IQuestion) => void
}

export default function AdditionalQuestion (props: IProps) {
    const [value, setValue] = useState('')
    const [title, setTitle] = useState('')
    const areaRef = useRef<HTMLTextAreaElement>(null)

    const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])

    useEffect(() => {
        areaRef.current && areaRef.current.focus()
    }, [areaRef])

    useEffect(() => {
        setValue(props.value?.answer || '')
        setTitle(props.value?.question || '')
    }, [props.value])

    function handleChange (event) {
        const element = areaRef.current
        if (element) {
            element.style.height = 'auto';
            element.style.height = (element.scrollHeight) + "px";
        }

        setValue(event.target.value)
    }

    function handleButtonClick () {
        if (value) {
            props.onSearch({ ...props.value, answer: value })
        }
    }

    function handleQuestionSkip () {
        if (props.onQuestionSkip) {
            props.onQuestionSkip(props.value)
        }
    }

    return <>
        {/* User responded.. show question as well */}
        <OroAnimator show={props.show && props.userResponded} withDelay>
            <AIResponse userResponded={false}>
                <div className={styles.response}>{title}</div>
            </AIResponse>
        </OroAnimator>
        <OroAnimator show={props.show && props.userResponded} withDelay>
            <AIResponse userResponded>
                <div className={styles.response}>{value}</div>
            </AIResponse>
        </OroAnimator>
        <OroAnimator show={props.show && !props.userResponded} withDelay>
            <AIResponse userResponded={false}>
                <>
                    <div className={classNames(styles.editMode)}>
                        <div className={styles.heading}>{title}</div>
                        <div className={classNames(styles.queryBox)}>
                            <div className={styles.area}>
                                <textarea ref={areaRef} value={value} className={styles.input} onChange={handleChange} placeholder={props.placeholder} />
                            </div>
                            <div className={classNames(styles.bottomRow)}>
                                <div className={classNames(styles.enterCell)}>
                                    <OroButton onClick={handleButtonClick} type="link" icon={<div className={classNames(styles.enterIcon)}><ArrowRightCircle width={40} height={40} /></div>} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.skip}>
                        <div className={styles.ques}>{t('--notSure--')}</div>
                        <div className={styles.link} onClick={handleQuestionSkip}>{t('--skipQuestion--')} <ChevronsRight size={20} color='var(--warm-prime-azure)'/></div>
                    </div>
                </>
            </AIResponse>
        </OroAnimator>
    </>
}