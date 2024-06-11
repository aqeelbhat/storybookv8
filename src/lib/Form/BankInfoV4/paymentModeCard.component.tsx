/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from "react";
import { Option } from "./../../Types";
import { Edit3, Plus, X } from "react-feather";
import { Grid } from "@mui/material";
import { Trans } from "react-i18next";

import { PaymentMode } from "../BankInfoV3/types";
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from "../../i18n";
import { mapAlpha2codeToDisplayName } from "../../util";
import { MultiSelect } from "../../Inputs";
import { COL3, isEmpty } from "../util";

import styles from "./styles.module.scss";
import { getPaymentModeOptions } from "./types";
import { OroButton } from "../../controls";

export interface PaymentModeCardProps {
  data?: PaymentMode[];
  bankCountry?: string;
  bankCurrency?: string;
  onChange?: (value?: PaymentMode[]) => void;

  forceValidate?: boolean;
  canShowEntities?: boolean;
  disableBankCountry?: boolean;
  readOnly?: boolean;
  companyEntities?: Option[];
  companyEntityOptions?: Option[];
  allowBankPayoutCurrencyRequest?: boolean;
  fetchEntityChildren?: (
    parent: string,
    childrenLevel: number,
  ) => Promise<Option[]>;
  onEntitySearch?: (keyword: string) => Promise<Option[]>;
  onEntityChange?: (value: Option[]) => void;

  onCountryChange?: () => void;
  onRequestCurrency: (currencyCode?: string) => void;
}

export function PaymentModeCard(props: PaymentModeCardProps) {
  const PaymentModeOptions = getPaymentModeOptions();
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO]);

  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [companyEntitiesVisible, setCompanyEntitiesVisible] =
    useState<boolean>(false);

  useEffect(() => {
    setPaymentModes(props.data || []);
  }, [props.data]);

  function getPaymentModeLogo(): string {
    const currentModeOption = PaymentModeOptions.find(
      (option) => option.code === paymentModes[0]?.type,
    );
    return currentModeOption?.logo;
  }
  function getPaymentModeName(): string {
    const currentModeOption = PaymentModeOptions.find(
      (option) => option.code === paymentModes[0]?.type,
    );
    return currentModeOption?.displayName;
  }
  function getCurrencies(): string[] {
    const currencyList = props.data?.map((mode) => mode.currencyCode) || [];
    const uniqueCurrencies = Array.from(new Set(currencyList)); // extract unique
    return uniqueCurrencies;
  }

  function requestBankCurrency() {
    props.onRequestCurrency(props.bankCurrency);
  }
  function removeBankCurrencyRequest() {
    props.onRequestCurrency();
  }

  return (
    <div className={styles.paymentModeCard}>
      {!props.disableBankCountry && (
        <div className={styles.bankCountry}>
          <span>{t("--countryOfYourBankAccount--")}:&nbsp;</span>
          <span className={styles.highlight}>{props.bankCountry}</span>
          {!props.readOnly && (
            <OroButton
              type="link"
              icon={<Edit3 size={14} strokeWidth={"2px"} />}
              label={t("--edit--")}
              iconOrientation="left"
              fontWeight="semibold"
              onClick={props.onCountryChange}
            />
          )}
        </div>
      )}

      <div className={styles.currencies}>
        <span>{t("--payoutCurrency--")}:&nbsp;</span>
        <span className={styles.highlight}>{getCurrencies().join(", ")}</span>

        {props.allowBankPayoutCurrencyRequest &&
          props.bankCurrency &&
          !getCurrencies().includes(props.bankCurrency) && (
            <>
              {paymentModes[0]?.additionalCurrencyRequested ? (
                <span className={styles.requested}>
                  <Trans
                    t={t}
                    i18nKey="--currencyRequested--"
                    values={{ currency: props.bankCurrency }}
                  >
                    <span className={styles.highlight}>
                      {props.bankCurrency}
                    </span>
                    {" requested"}
                  </Trans>
                  <X
                    size={14}
                    tabIndex={0}
                    onClick={removeBankCurrencyRequest}
                    className={styles.close}
                  />
                </span>
              ) : (
                <span
                  className={styles.request}
                  tabIndex={0}
                  onClick={requestBankCurrency}
                >
                  <Trans
                    t={t}
                    i18nKey="--addCurrencyForPayout--"
                    values={{ currency: props.bankCurrency }}
                  >
                    <Plus size={14} />
                    {" Request "}
                    <span className={styles.highlight}>
                      {props.bankCurrency}
                    </span>
                  </Trans>
                </span>
              )}
            </>
          )}
      </div>

      {(!paymentModes || paymentModes.length < 1) && (
        <div className={styles.emptyMsg}>
          <div className={styles.description}>
            {t("--selectEntityToViewPayment--")}
          </div>
        </div>
      )}

      {props.canShowEntities && (
        <div className={styles.footer}>
          <div className={styles.description}>
            {companyEntitiesVisible ? (
              <Grid item xs={COL3}>
                <MultiSelect
                  label={t("--entitiesThatCanMakePayments--")}
                  value={props.companyEntities}
                  options={props.companyEntityOptions}
                  required={true}
                  forceValidate={props.forceValidate}
                  absolutePosition
                  fetchChildren={props.fetchEntityChildren}
                  onSearch={props.onEntitySearch}
                  validator={(value) =>
                    isEmpty(value)
                      ? getI18Text("is required field", {
                          label: t("--companyEntities--"),
                        })
                      : ""
                  }
                  onChange={props.onEntityChange}
                />
              </Grid>
            ) : (
              <>
                <span className={styles.highlight}>{t("--note--")}: </span>
                <Trans t={t} i18nKey="--thisAllowsPaymentFrom--">
                  {"This allows payment from"}
                  <CompanyEntitiesDisplayText value={props.companyEntities} />
                </Trans>
                {/* <OroButton type='link' label={t('--change--')} icon={<Edit3 size={14}/>} iconOrientation='left' onClick={() => setCompanyEntitiesVisible(true)} /> */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyEntitiesDisplayText(props: { value?: Option[] }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO]);
  const [entityNames, setEntityNames] = useState<string[]>([]);

  useEffect(() => {
    if (props.value) {
      const _entityNames: string[] = props.value.map((entity) => {
        return `${entity.displayName} (${mapAlpha2codeToDisplayName(entity.customData?.other?.countryCode)})`;
      });
      setEntityNames(_entityNames);
    }
  }, [props.value]);

  return (
    <span className={styles.companyEntitiesDisplayText}>
      {entityNames[0]}
      <span className={styles.higlight}>
        {entityNames.length > 1
          ? `, ${t("--plusMore--", { count: entityNames.length - 1 })}`
          : ""}
      </span>
    </span>
  );
}
