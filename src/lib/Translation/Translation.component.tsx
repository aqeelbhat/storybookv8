import React, { useEffect, useRef, useState } from 'react'
import styles from './translation.module.scss'
import { detectTextLanguage, translateText } from './api'
import parse from 'html-react-parser'

export function Translation (props: {children: any, canShowTranslation?: boolean}) {
    const [translatedText, setTranslatedText] = useState()
    const [showTranslatedText, setShowTranslatedText] = useState(false)
    const userLang = navigator.language.slice(0,2)
    const [isUserLanguageIsDifferent, setIsUserLanguageIsDifferent] = useState(false)
    const [detectCalledOnce, setDetectCalledOnce] = useState(false)
    const childRef = useRef<any>(null)

    useEffect(() => {
        if (props.canShowTranslation && props.children && childRef && childRef.current && childRef.current?.innerHTML && !translatedText && !detectCalledOnce && !isUserLanguageIsDifferent) {
            // added timeout because rich text editor takes time to load the text
            setTimeout(async () => {
                await detectTextLanguage(childRef.current?.innerHTML)
                    .then(res => {
                        if (res && res.data && Array.isArray(res.data?.detections) && res.data.detections.length > 0) {
                            if (Array.isArray(res.data.detections[0]) && res.data.detections[0].length > 0) {
                                if (res.data.detections[0][0].language !== userLang && res.data.detections[0][0].confidence > 0) {
                                    setIsUserLanguageIsDifferent(true)
                                    setDetectCalledOnce(true)
                                }
                            }
                        }
                    }).catch(err => {
                        console.error(err)
                    })
            }, 500);
        }
    }, [childRef?.current])

    async function onTranslation () {
        if (childRef && childRef.current && childRef.current?.innerHTML && !translatedText) {
            translateText(childRef.current?.innerHTML, userLang)
                .then(res => {
                    if (res && res.data && Array.isArray(res.data?.translations) && res.data.translations.length > 0) {
                        if (res.data.translations[0].translatedText) {
                            setShowTranslatedText(true)
                            setTranslatedText(res.data.translations[0].translatedText)
                        }
                    }
                }).catch(err => {
                    console.error(err)
                })
        } else if (translatedText) {
            setShowTranslatedText(true)
        }
    }
    function clearTranslation () {
        setShowTranslatedText(false)
    }
    return (
        props.canShowTranslation ? 
        <div className={styles.translate}>
            <div className={!showTranslatedText ? styles.translateOriginalShow : styles.translateOriginalHide} ref={childRef}>{props.children}</div>
            <div className={showTranslatedText && translatedText ? styles.translateOriginalShow : styles.translateOriginalHide}>{translatedText ? parse(translatedText) : ''}</div>
            {!showTranslatedText && isUserLanguageIsDifferent && <div className={styles.translateAction} onClick={onTranslation} data-testid="seeTranslation">See Translation</div>}
            {showTranslatedText && isUserLanguageIsDifferent && <div className={styles.translateAction} onClick={clearTranslation} data-testid="seeOriginal">See Original</div>}
        </div>
        : <>{props.children}</>
    )
}