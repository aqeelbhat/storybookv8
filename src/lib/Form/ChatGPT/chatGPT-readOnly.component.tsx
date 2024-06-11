import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { Label, Value } from '../../controls/atoms';
import { ChatGPTFormData, ChatGPTReadOnlyFormProps } from "./types";

import styles from './style.module.scss'
import { getUserDisplayName } from '..';
import { User } from '../../Types';
import { createImageFromInitials } from '../../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';

export function ChatGPTReadOnlyForm (props: ChatGPTReadOnlyFormProps) {
    const [attributes, setAttributes] = useState<Array<{ label: string, value: string }>>([])
    const formData = props.formData || {} as ChatGPTFormData;
    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

    useEffect(() => {
        if (props.signedInUserDetails) {
            const _highlights: Array<{ label: string, value: string }> = []

            if (props.signedInUserDetails?.departmentName) {
                _highlights.push({
                    label: t('--department--'),
                    value: props.signedInUserDetails.departmentName
                })
            }

            if (props.signedInUserDetails?.defaultCompanyEntity) {
                _highlights.push({
                    label: t('--companyEntity--'),
                    value: props.signedInUserDetails.defaultCompanyEntity
                })
            }
            setAttributes(_highlights)
        }
    }, [props.signedInUserDetails])

    function getProfilePicture (user: User) {
        if (user.picture) {
          return user.picture
        } else {
          const name = getUserDisplayName(user).split(' ')
          return createImageFromInitials(name[0], name[1])
        }
    }

    return (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12}>
              <div className={styles.extractedSectionHeader}>
                <div className={styles.extractedSectionHeaderContainer}>
                    <div className={styles.profilePicture}>
                        <img src={getProfilePicture(props.signedInUserDetails)} alt='' />
                    </div>
                    <div className={styles.user}>
                      <div>{getUserDisplayName(props.signedInUserDetails)}</div>
                      <div className={styles.userContainer}>
                       {
                        attributes.map((highlight, index) =>
                            <div className={styles.userAttribute} key={index}>
                                <div className={styles.userAttributeLabel}>{highlight.label}:</div>
                                <div className={styles.userAttributeValue}>{highlight.value}</div>
                            </div>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </Grid>
            {props.searchQuery && <>
                <Grid item xs={4}>
                  <Label>{t('--need--')}</Label>
                </Grid>
                <Grid item xs={8}>
                  <Value>{props.searchQuery}</Value>
                </Grid>
            </>}
            {formData?.categories?.length > 0 && <>
                <Grid item xs={4}>
                    <Label>{t('--categoryTab--')}</Label>
                </Grid>
                <Grid item xs={8}>
                  <Value>{formData?.categories?.map(option => option.displayName).join(', ')}</Value>
                </Grid>
            </>}
            {formData?.regions?.length > 0 && <>
                <Grid item xs={4}>
                    <Label>{t('--region--')}</Label>
                </Grid>
                <Grid item xs={8}>
                  <Value>{formData?.regions?.map(option => option.displayName).join(', ')}</Value>
                </Grid>
            </>}
          </Grid>
        </>
      )
}