import React, { useEffect, useState, useRef } from "react";
import { XCircle } from "react-feather";
import { Checkbox, FormControlLabel } from "@mui/material";
import { areOptionsSame, validateEmail, validateField } from "./util";
import {
  TypeAhead,
  OROPhoneInput,
  OROEmailInput,
  TextArea,
  inputFileAcceptType,
  TextBox,
  MultiSelect,
} from "../Inputs";
import { Option, Attachment, OroMasterDataType } from "./../Types";
import {
  BankCallbackFormData,
  BankCallbackFormProps,
  CallbackOutcome,
} from "./types";
import styles from "./bank-callback-form-styles.module.scss";
import { DateTimeControlNew, OroButton } from "../controls";
import classnames from "classnames";
import moment from "moment";
import { OROFileIcon } from "../RequestIcon";
import { OROFileUpload } from "../Inputs";
import AlertCircle from "./../Inputs/assets/alert-circle.svg";
import { FilePreview } from "../FilePreview";
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";

const CALLBACK_SOURCE_VALIDATE_INVOICE = ["businessOwners", "emailFromVendor"];
const LabelStyle = {
  "& .MuiFormControlLabel-label": {
    color: "#575F70",
  },
};

export function BankCallbackForm(props: BankCallbackFormProps) {
  const [date, setDate] = useState<string>(
    moment().format("MMMM DD YYYY h:mm:ss a"),
  );
  const [contactName, setContactName] = useState<string>("");
  const [titleDesignation, setTitleDesignation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactSources, setContactSources] = useState<Option[]>([]);
  const [contactSourceOptions, setContactSourceOptions] = useState<Option[]>(
    [],
  );
  const [callBackTo, setCallBackTo] = useState<Option>();
  const [callBackToOptions, setCallBackToOptions] = useState<Option[]>([]);
  const [finalOutComes, setFinalOutComes] = useState<CallbackOutcome[]>([]);
  const [outcomes, setOutcomes] = useState<Option[]>([]);
  const [invoiceValidated, setInvoiceValidated] = useState<boolean>(false);
  const [invoiceValidatedTouched, setInvoiceValidatedTouched] =
    useState<boolean>(false);
  const [invoiceForceValidated, setInvoiceForceValidated] =
    useState<boolean>(false);
  const [showInvoiceCheckBox, setShowInvoiceCheckBox] =
    useState<boolean>(false);
  const [notesAttachment, setNotesAttachment] = useState<Attachment[]>([]);
  const [fileForPreview, setFileForPreview] = useState<Blob | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [docName, setDocName] = useState("");
  const [mediaType, setMediaType] = useState("");
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERCALLBACK]);
  const [forceValidateAll, setForceValidateAll] = useState<boolean>(false);
  const [forceValidateMandatory, setForceValidateMandatory] =
    useState<boolean>(false);

  useEffect(() => {
    if (props.formData) {
      const callbackSource = props.callBackToOptions.find(
        (option) => option.path === props.formData.callbackTo,
      );
      if (callbackSource) {
        setCallBackTo(callbackSource);
      }

      setContactName(props.formData.nameOfContact || "");
      setTitleDesignation(props.formData.titleAndDesignation || "");
      setEmail(props.formData.email || "");
      setPhone(props.formData.phoneNumber || "");
      setContactSources(props.formData.contactSources || []);

      if (props.formData?.contactSources?.length) {
        const validateInvoice = props.formData?.contactSources.some((source) =>
          CALLBACK_SOURCE_VALIDATE_INVOICE.includes(source.path),
        );
        setShowInvoiceCheckBox(validateInvoice);
        setInvoiceValidated(props.formData?.invoiceAmountValidated || false);
      }

      if (props.formData.noteAttachments) {
        setNotesAttachment(props.formData.noteAttachments);
      }

      if (props?.formData?.outcomes?.length) {
        setFinalOutComes(props.formData.outcomes);
        const outcomes = props.formData.outcomes
          .map((outcomeOption) => {
            const selected = props.outcomeOptions.find(
              (option) => option.path === outcomeOption.code,
            );
            if (selected) {
              return selected;
            }
          })
          .filter((option) => option);
        setOutcomes(outcomes);
      }
    }
  }, [
    props.formData,
    props.callBackToOptions,
    props.callBackOptions,
    props.outcomeOptions,
  ]);

  useEffect(() => {
    if (props.callBackToOptions) {
      setCallBackToOptions(props.callBackToOptions);
    }
  }, [props.callBackToOptions]);

  useEffect(() => {
    if (props.callBackOptions) {
      setContactSourceOptions(props.callBackOptions);
    }
  }, [props.callBackOptions]);

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData);
    }
  }, [
    date,
    callBackTo,
    contactName,
    titleDesignation,
    phone,
    email,
    contactSources,
    invoiceValidated,
    notes,
    finalOutComes,
  ]);

  useEffect(() => {
    if (forceValidateAll) {
      setInvoiceForceValidated(true);
    }
  }, [forceValidateAll]);

  function onDateChange(dateString: string) {
    setDate(dateString);
  }

  function isFormInvalid(skipOptionalFields?: boolean): string {
    let invalidFieldId = "";
    let isInvalid = false;

    if (!date || date === "Invalid date") {
      invalidFieldId = "callbackdate-field";
      isInvalid = true;
    } else if (!callBackTo) {
      invalidFieldId = "callbackto-field";
      isInvalid = true;
    } else if (
      !skipOptionalFields &&
      showInvoiceCheckBox &&
      !invoiceValidated
    ) {
      invalidFieldId = "validate-invoice-field";
      isInvalid = true;
    } else if (
      !skipOptionalFields &&
      finalOutComes &&
      finalOutComes.length > 0
    ) {
      isInvalid = finalOutComes.some((field, index) => {
        if (!field.code) {
          invalidFieldId = `finaloutcome-field-${index}`;
          return true;
        }
      });
    }
    return isInvalid ? invalidFieldId : "";
  }

  function fetchData(skipValidation?: boolean): BankCallbackFormData {
    const invalidFieldId = isFormInvalid(skipValidation);
    if (invalidFieldId) {
      triggerValidations(invalidFieldId, skipValidation);
    }
    return invalidFieldId ? null : getFormData();
  }

  function getFormData(): BankCallbackFormData {
    return {
      callbackTime: moment(date).format("YYYY-MM-DD[T]HH:mm:ss"),
      callbackTo: callBackTo ? callBackTo.path : null,
      nameOfContact: contactName ? contactName : "",
      titleAndDesignation: titleDesignation ? titleDesignation : "",
      method: null,
      phoneNumber: phone ? phone : "",
      email: email ? email : "",
      contactSources: contactSources ? contactSources : [],
      invoiceAmountValidated: invoiceValidated ? invoiceValidated : false,
      note: notes ? notes : "",
      noteAttachments: notesAttachment ? notesAttachment : [],
      outcomes: finalOutComes ? finalOutComes : [],
    };
  }

  function triggerValidations(
    invalidFieldId: string,
    skipOptionalFields?: boolean,
  ) {
    setForceValidateMandatory(true);
    !skipOptionalFields && setForceValidateAll(true);
    setTimeout(() => {
      setForceValidateMandatory(false);
      setForceValidateAll(false);
    }, 1000);

    const input = document.getElementById(invalidFieldId);
    if (input?.scrollIntoView) {
      input?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  function getFormDataWithUpdatedValue(
    fieldName: string,
    newValue: string | boolean | number | Option | Option[],
    index?: number,
  ): BankCallbackFormData {
    const formData = JSON.parse(
      JSON.stringify(getFormData()),
    ) as BankCallbackFormData;
    switch (fieldName) {
      case "callbackDateTime":
        formData.callbackTime = moment(newValue as string).format(
          "YYYY-MM-DD[T]HH:mm:ss",
        );
        break;
      case "callbackTo":
        const selectedCallback = newValue as Option;
        formData.callbackTo = selectedCallback ? selectedCallback.path : "";
        break;
      case "contactName":
        formData.nameOfContact = newValue as string;
        break;
      case "titleDesignation":
        formData.titleAndDesignation = newValue as string;
        break;
      case "contactEmail":
        formData.email = newValue as string;
        break;
      case "contactPhone":
        formData.phoneNumber = newValue as string;
        break;
      case "contactSources":
        const selectedContactSource = newValue as Option[];
        formData.contactSources = selectedContactSource
          ? selectedContactSource
          : [];
        break;
      case "invoiceAmountValidated":
        formData.invoiceAmountValidated = newValue as boolean;
        break;
      case "notes":
        formData.note = newValue as string;
        break;
      case "finalOutcome":
        const selectedOutcomeOption = newValue as Option;
        if (formData.outcomes?.length) {
          formData.outcomes[index].code = selectedOutcomeOption
            ? selectedOutcomeOption.path
            : "";
          formData.outcomes[index].codeRef = {
            id: selectedOutcomeOption?.path ? selectedOutcomeOption.path : "",
            name: selectedOutcomeOption?.displayName
              ? selectedOutcomeOption.displayName
              : "",
            erpId: "",
          };
        } else {
          const selectedOutCome: CallbackOutcome = {
            index: 0,
            accountNumber: null,
            code: selectedOutcomeOption.path,
          };
          formData.outcomes.push(selectedOutCome);
        }
        break;
    }
    return formData;
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | boolean | Option | Option[],
    newValue: string | boolean | Option | Option[],
    index?: number,
  ) {
    if (props.onValueChange) {
      if (typeof newValue === "boolean" && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
        );
      } else if (typeof newValue === "string" && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
        );
      } else if (
        Array.isArray(newValue) &&
        !areOptionsSame(oldValue as Option[], newValue as Option[])
      ) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
        );
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue, index),
        );
      }
    }
  }

  function handleFormSubmit() {
    const invalidFieldId = isFormInvalid();
    if (invalidFieldId) {
      triggerValidations(invalidFieldId);
    } else if (props.onSubmit) {
      props.onSubmit(getFormData());
    }
  }

  function handleFormSave() {
    const invalidFieldId = isFormInvalid(true);
    if (invalidFieldId) {
      triggerValidations(invalidFieldId, true);
    } else if (props.onSubmit) {
      props.onSubmit(getFormData());
    }
  }

  function handleFormCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  function onOutcomeSelected(selectedOption: Option, index: number) {
    if (finalOutComes?.length > 0) {
      const finalOutComesCopy = [...finalOutComes];
      finalOutComes[index].code = selectedOption?.path;
      finalOutComes[index].codeRef = {
        id: selectedOption?.path ? selectedOption.path : "",
        name: selectedOption?.displayName ? selectedOption.displayName : "",
        erpId: "",
      };
      setFinalOutComes(finalOutComesCopy);
    } else {
      const selectedOutCome: CallbackOutcome = {
        index: 0,
        accountNumber: null,
        code: selectedOption?.path,
        codeRef: {
          id: selectedOption?.path ? selectedOption.path : "",
          name: selectedOption?.displayName ? selectedOption.displayName : "",
          erpId: "",
        },
      };
      setFinalOutComes([selectedOutCome]);
    }
    const previousVal = { ...outcomes[index] };
    outcomes[index] = selectedOption;
    setOutcomes(outcomes);
    handleFieldValueChange("finalOutcome", previousVal, selectedOption, index);
  }

  function onSourceContactChange(selectedOption?: Option[]) {
    setShowInvoiceCheckBox(false);
    setContactSources(selectedOption);
    if (
      selectedOption?.length &&
      selectedOption.some((source) =>
        CALLBACK_SOURCE_VALIDATE_INVOICE.includes(source.path),
      )
    ) {
      setShowInvoiceCheckBox(true);
    }
  }

  async function handleOroFilesUpload(params: Array<File>) {
    for (let i = 0; i < params.length; i++) {
      const fieldName = `noteAttachments[${notesAttachment?.length ? notesAttachment?.length + i : i}]`;
      if (props.onFileUpload) {
        await props
          .onFileUpload(params[i], fieldName)
          .then((resp) => {
            console.log(resp);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  function handleOroFilesSelection(value?: File[]) {
    const invalidFieldId = isFormInvalid(true);
    if (invalidFieldId) {
      triggerValidations(invalidFieldId, true);
    } else if (props.onSubmit) {
      props
        .onSubmit(getFormData())
        .then(() => {
          if (Array.isArray(value)) {
            handleOroFilesUpload(value as Array<File>);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleFileDelete(fieldName?: string, index?: number) {
    if (props.onFileDelete && fieldName) {
      props.onFileDelete(fieldName);
    }
  }

  function fetchChildren(
    masterDataType: OroMasterDataType,
    parent: string,
    childrenLevel: number,
  ): Promise<Option[]> {
    if (props.fetchChildren) {
      return props.fetchChildren(parent, childrenLevel, masterDataType);
    } else {
      return Promise.reject("fetchChildren API not available");
    }
  }

  function searchMasterdataOptions(
    keyword?: string,
    masterDataType?: OroMasterDataType,
  ): Promise<Option[]> {
    if (props.searchOptions) {
      return props.searchOptions(keyword, masterDataType);
    } else {
      return Promise.reject("searchOptions API not available");
    }
  }

  function loadFile(fieldName: string, doc: Attachment) {
    if (!fileForPreview) {
      if (props.loadDocument && fieldName) {
        props
          .loadDocument(fieldName, doc.mediatype, doc.filename, doc.path)
          .then((resp) => {
            setDocName(doc.filename);
            setMediaType(doc.mediatype);
            setFileForPreview(resp);
            setIsPreviewOpen(true);
          })
          .catch((err) => console.log(err));
      }
    } else {
      setIsPreviewOpen(true);
    }
  }

  return (
    <>
      <div className={styles.callbackForm}>
        <div className={styles.callbackFormDetails}>
          <div className={styles.section}>
            <div className={styles.row}>
              <div
                className={`${styles.item} ${styles.datetimeContainer} datetimeContainer`}
                id="callbackdate-field"
              >
                <label>{t("--callBackDateTime--")}</label>
                <DateTimeControlNew
                  value={date}
                  config={{}}
                  onChange={(value) => {
                    onDateChange(value);
                    handleFieldValueChange("callbackDateTime", date, value);
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.statusSection}>
                <div className={styles.statusContainer}>
                  <div className={styles.statusTitle}>
                    {t("--callBackStatus--")}
                  </div>
                  {finalOutComes &&
                    finalOutComes.length > 0 &&
                    finalOutComes.map((item, index) => {
                      return (
                        <div key={index} className={styles.outcomeRow}>
                          <div
                            className={classnames(
                              styles.item,
                              styles.outcomeDropdown,
                            )}
                            id={`finaloutcome-field-${index}`}
                          >
                            <span className={styles.finalOutcomeTitle}>
                              {t("--bankAccount--")}{" "}
                              {finalOutComes.length > 1 && index + 1} :{" "}
                              {item.accountNumber?.unencryptedValue?.replace(
                                /\d(?=\d{4})/g,
                                "*",
                              ) || item.accountNumber?.maskedValue}
                            </span>
                            <div
                              className={styles.finalOutcomeDropdownContainer}
                            >
                              <TypeAhead
                                value={outcomes[index]}
                                options={props.outcomeOptions}
                                disabled={false}
                                required={true}
                                disableTypeahead={true}
                                placeholder={t("--selectPlaceholder--")}
                                forceValidate={forceValidateAll}
                                expandLeft={props.isInPortal}
                                validator={(value) =>
                                  validateField(t("--outcome--"), value)
                                }
                                onChange={(value) => {
                                  onOutcomeSelected(value, index);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.item} id="callbackto-field">
                <label>{t("--callBackTo--")}</label>
                <TypeAhead
                  value={callBackTo}
                  options={callBackToOptions}
                  disabled={false}
                  required={true}
                  placeholder={t("--selectPlaceholder--")}
                  forceValidate={forceValidateMandatory}
                  expandLeft={props.isInPortal}
                  validator={(value) =>
                    validateField(t("--callBackTo--"), value)
                  }
                  onChange={(value) => {
                    setCallBackTo(value);
                    handleFieldValueChange("callbackTo", callBackTo, value);
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.item} id="callback-contact-name">
                <label>{t("--contactName--")}</label>
                <TextBox
                  placeholder={t("--contactPlaceholder--")}
                  value={contactName}
                  disabled={false}
                  required={false}
                  forceValidate={false}
                  onChange={(value) => {
                    setContactName(value);
                    handleFieldValueChange("contactName", contactName, value);
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div
                className={styles.item}
                id="callback-title-designation-field"
              >
                <label>{t("--titleAndDesignation--")}</label>
                <TextBox
                  placeholder={t("--titleDesignationPlaceholder--")}
                  value={titleDesignation}
                  disabled={false}
                  required={false}
                  forceValidate={false}
                  onChange={(value) => {
                    setTitleDesignation(value);
                    handleFieldValueChange(
                      "titleDesignation",
                      titleDesignation,
                      value,
                    );
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.item}>
                <div className={styles.phonecommunication}>
                  <div
                    className={classnames(styles.item, styles.phone)}
                    id="communicationmode-phone-field"
                  >
                    <label>{t("--phoneNumber--")}</label>
                    <OROPhoneInput
                      placeholder="+1 ___-___-____"
                      disabled={false}
                      required={true}
                      value={phone}
                      forceValidate={forceValidateMandatory}
                      onChange={(value) => {
                        setPhone(value);
                        handleFieldValueChange("contactPhone", phone, value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.item} id="communicationmode-email-field">
                <label>{t("--emailAddress--")}</label>
                <OROEmailInput
                  placeholder={t("--emailPlaceholder--")}
                  value={email}
                  disabled={false}
                  required={false}
                  forceValidate={forceValidateMandatory}
                  validator={(value) =>
                    validateEmail(t("--email--"), value, true)
                  }
                  onChange={(value) => {
                    setEmail(value);
                    handleFieldValueChange("contactEmail", email, value);
                  }}
                />
              </div>
            </div>

            <>
              <div className={styles.row}>
                <div className={styles.item} id="contact-source-field">
                  <label>{t("--sourceOfContact--")}</label>
                  <MultiSelect
                    placeholder={t("--selectPlaceholder--")}
                    value={contactSources}
                    options={contactSourceOptions}
                    disabled={false}
                    required={true}
                    showClearAllOption={true}
                    forceValidate={forceValidateMandatory}
                    expandLeft={props.isInPortal}
                    fetchChildren={(parent, childrenLevel) =>
                      fetchChildren("ContactSource", parent, childrenLevel)
                    }
                    onSearch={(keyword) =>
                      searchMasterdataOptions(keyword, "ContactSource")
                    }
                    validator={(value) => validateField(t("--source--"), value)}
                    onChange={(value) => {
                      onSourceContactChange(value);
                      handleFieldValueChange(
                        "contactSources",
                        contactSources,
                        value,
                      );
                    }}
                  />
                </div>
                <div>
                  {showInvoiceCheckBox && (
                    <div
                      className={`${styles.checkBox} contactSourceInvoiceLabel`}
                      id="validate-invoice-field"
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={invoiceValidated}
                            onChange={(e) => {
                              setInvoiceValidated(e.target.checked);
                              setInvoiceValidatedTouched(true);
                              handleFieldValueChange(
                                "invoiceAmountValidated",
                                invoiceValidated,
                                e.target.checked,
                              );
                            }}
                            color="success"
                          />
                        }
                        label={t("--validateInvoiceLabel--")}
                        sx={LabelStyle}
                      />
                      {(invoiceValidatedTouched || invoiceForceValidated) &&
                        !invoiceValidated && (
                          <div className={styles.error}>
                            <img src={AlertCircle} />
                            {t("--invoiceValidate--")}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className={classnames(styles.row, styles.pdB8)}>
                <div className={styles.item} id="notes-field">
                  <label>{t("--notes--")}</label>
                  <TextArea
                    value={notes}
                    required={false}
                    placeholder={t("--notesPlaceholder--")}
                    forceValidate={false}
                    onChange={(value) => {
                      setNotes(value);
                      handleFieldValueChange("notes", notes, value);
                    }}
                  />
                </div>
              </div>

              <div className={classnames(styles.row, styles.pdB8)}>
                <div className={styles.item} id="notes-field">
                  <label>{t("--additionalDocuments--")}</label>
                  <OROFileUpload
                    inputFileAcceptTypes={inputFileAcceptType}
                    onFileSelected={(e) =>
                      handleOroFilesSelection(e as Array<File>)
                    }
                    multiple={true}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.fileItem}>
                  {notesAttachment &&
                    notesAttachment?.length > 0 &&
                    notesAttachment.map((file, key) => {
                      return (
                        <div
                          key={key}
                          className={styles.file}
                          onClick={() =>
                            loadFile(`noteAttachments[${key}]`, file)
                          }
                        >
                          <div className={styles.name}>
                            <OROFileIcon fileType={file.mediatype} />
                            <div>{file.filename}</div>
                          </div>
                          <div>
                            <XCircle
                              size={14}
                              color="#ABABAB"
                              onClick={(e) => {
                                handleFileDelete(
                                  `noteAttachments[${key}]`,
                                  key,
                                );
                                e.stopPropagation();
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          </div>

          {(props.submitLabel || props.cancelLabel) && (
            <div className={styles.section}>
              <div className={classnames(styles.row, styles.actionBar)}>
                <div
                  className={classnames(styles.item, styles.col3, styles.flex)}
                ></div>
                <div
                  className={classnames(
                    styles.item,
                    styles.col1,
                    styles.flex,
                    styles.action,
                  )}
                >
                  {props.cancelLabel && (
                    <OroButton
                      label={props.cancelLabel}
                      type="link"
                      fontWeight="semibold"
                      radiusCurvature="medium"
                      onClick={handleFormCancel}
                    />
                  )}
                  {props.submitLabel && (
                    <OroButton
                      label={props.submitLabel}
                      type="primary"
                      fontWeight="semibold"
                      radiusCurvature="medium"
                      onClick={handleFormSubmit}
                    />
                  )}
                  {props.submitLabel && (
                    <OroButton
                      label="Save"
                      type="secondary"
                      fontWeight="semibold"
                      radiusCurvature="medium"
                      onClick={handleFormSave}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {fileForPreview && isPreviewOpen && (
        <FilePreview
          fileBlob={fileForPreview}
          filename={docName}
          mediatype={mediaType}
          onClose={(e) => {
            setIsPreviewOpen(false);
            setFileForPreview(null);
            e.stopPropagation();
          }}
        />
      )}
    </>
  );
}
