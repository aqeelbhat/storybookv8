import React, { useState, useEffect, createRef } from "react";
import { Check, Trash2, Upload } from "react-feather";
import styles from "../Inputs/styles.module.scss";
import style from "./style.module.scss";
import { inputFileAcceptType, Option } from "../Inputs/types";
import {
  CustomCertificate,
  MultiConfig,
} from "../CustomFormDefinition/types/CustomFormModel";
import { DateControlNew } from "./date.component";
import AlertCircle from "../Inputs/assets/alert-circle.svg";
import { mapCertificate } from "../Types/Mappers/common";
import { Attachment, Certificate, IDRef } from "../Types/common";
import { DateRange } from "../Inputs";
import { checkFileForS3Upload } from "../Inputs/utils.service";
import { getDateObject } from "../Form/util";
import moment from "moment";
import { OroButton } from "./button/button.component";
import { OROFileIcon } from "../RequestIcon";
import { getI18Text as getI18ControlText } from "../i18n";
import { getSessionLocale } from "../sessionStorage";
import { FilePreview } from "../FilePreview";

export function CertificateControl(props: {
  value?: Array<Certificate>;
  certificate?: CustomCertificate;
  multiConfig?: MultiConfig;
  name?: string;
  disabled?: boolean;
  theme?: "coco";
  forceValidate: boolean;
  onChange?: (
    value: Array<Certificate>,
    file?: File,
    certificateCode?: string,
  ) => void;
}) {
  const [uploadedCertificates, setUploadedCertificates] = useState<
    Array<Certificate>
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDateRange, setDateRange] = useState(false);
  const lineRefs = React.useRef([]);
  const otherRef = React.useRef(null);
  const [error, setError] = useState<string | null>();
  let uploadedFileIndex = -1;
  lineRefs.current = props.certificate?.validCertificateNames.map(
    (_, i) => lineRefs.current[i] ?? createRef(),
  );

  useEffect(() => {
    if (props.value && Array.isArray(props.value)) {
      setUploadedCertificates(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (
      props.forceValidate &&
      props.multiConfig?.minCount > uploadedCertificates.length
    ) {
      setError(`Minimum of ${props.multiConfig?.minCount} required`);
    }
  }, [props.forceValidate, props.value]);

  useEffect(() => {
    if (props.certificate) {
      if (
        props.certificate.expiryDateRequired &&
        props.certificate.issueDateRequired
      ) {
        setDateRange(true);
      }
    }
  }, [props.certificate]);

  const validateFile = (file) => {
    // if (!file || !inputFileAcceptType.includes(file.type) || !file.type) {
    //   setErrorMessage('File type not accepted')
    //   return false
    // }
    return true;
  };

  const handleFiles = (file, certificateCode: string) => {
    setErrorMessage("");
    if (validateFile(file)) {
      const uploaded = uploadedCertificates
        ? [...uploadedCertificates, mapCertificate(file, certificateCode)]
        : [mapCertificate(file, certificateCode)];
      setUploadedCertificates(uploaded);
      if (props.onChange) {
        props.onChange(uploaded, file, certificateCode);
      }
    }
  };

  const filesSelected = (event, certificateCode: string) => {
    if (!props.disabled && event.target.files.length > 0) {
      const file = checkFileForS3Upload(event.target.files[0]);
      handleFiles(file, certificateCode);
    }
  };

  function themeClass(): string {
    return props.theme ? styles["theme" + props.theme] : styles.theme;
  }

  function removeCertificate(index: number, certificateCode: string) {
    if (props.onChange) {
      props.onChange(uploadedCertificates, null, certificateCode);
    }
    const certificateCopy = [...uploadedCertificates];
    certificateCopy.splice(index, 1);
    setUploadedCertificates(certificateCopy);
  }

  function parseDate(date: Date) {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  }

  function handleDateChange(
    startDate: string,
    endDate: string,
    certificateName?: string,
  ) {
    const index = checkForUploadedCertificate(certificateName);
    const copyUploadedCertificates = [...uploadedCertificates];

    if (startDate) {
      copyUploadedCertificates[index].issueDate = startDate;
    } else {
      copyUploadedCertificates[index].issueDate = null;
    }

    if (endDate) {
      copyUploadedCertificates[index].expiryDate = endDate;
    } else {
      copyUploadedCertificates[index].expiryDate = null;
    }

    setUploadedCertificates(copyUploadedCertificates);
    if (props.onChange) {
      props.onChange(copyUploadedCertificates);
    }
  }

  function checkForUploadedCertificate(name: string): number {
    uploadedFileIndex = uploadedCertificates.findIndex(
      (e) => e.name.name === name,
    );
    return uploadedFileIndex;
  }

  function openFileInput(index: number) {
    if (
      lineRefs.current &&
      lineRefs.current[index] &&
      lineRefs.current[index].current
    ) {
      lineRefs.current[index].current.click();
      if (lineRefs.current[index].current.value) {
        lineRefs.current[index].current.value = "";
      }
    }
  }

  return (
    <div className={error ? styles.error : ""}>
      <div
        className={`${styles.oroUpload} ${themeClass()} ${style.certificateControl}`}
      >
        {props.certificate?.validCertificateNames &&
          props.certificate?.validCertificateNames.map((certificate, i) => {
            return (
              <div
                key={i}
                className={
                  checkForUploadedCertificate(certificate.name) < 0
                    ? style.certiBorder
                    : ""
                }
              >
                {(!uploadedCertificates ||
                  checkForUploadedCertificate(certificate.name) < 0) && (
                  <div className={style.certificateControlItem}>
                    <div className={style.certificateControlItemName}>
                      {certificate.name}
                    </div>
                    <input
                      id={`file_${i}`}
                      name={`file_${i}`}
                      ref={lineRefs.current[i]}
                      type="file"
                      title=""
                      accept={inputFileAcceptType}
                      disabled={props.disabled}
                      style={{ display: "none" }}
                      onClick={(event) => {
                        (event.target as HTMLInputElement).value = "";
                      }}
                      onChange={(e) => filesSelected(e, certificate.name)}
                    />
                    <OroButton
                      type="secondary"
                      className={style.certificateControlItemButton}
                      onClick={() => openFileInput(i)}
                      label={`Upload`}
                      icon={
                        <Upload size={12} style={{ marginRight: "10px" }} />
                      }
                    />
                  </div>
                )}
                {uploadedCertificates &&
                  checkForUploadedCertificate(certificate.name) >= 0 &&
                  uploadedFileIndex >= 0 &&
                  uploadedCertificates[uploadedFileIndex] && (
                    <div
                      key={i}
                      id={`file_${i}`}
                      className={style.certificateControlResultFrame}
                    >
                      <div
                        className={style.certificateControlResultFrameContainer}
                      >
                        <div
                          className={
                            style.certificateControlResultFrameContainerHeader
                          }
                        >
                          <p
                            className={
                              style.certificateControlResultFrameContainerHeaderTitle
                            }
                          >
                            {certificate.name}
                          </p>
                          <Check size={17} className={style.CheckIcon} />
                        </div>
                      </div>
                      <div className={style.certificateControlResultFrameBody}>
                        <div
                          className={
                            style.certificateControlResultFrameBodyItem
                          }
                        >
                          <div className={style.File}>
                            <OROFileIcon
                              fileType={
                                uploadedCertificates[uploadedFileIndex]
                                  ?.attachment?.mediatype
                              }
                            ></OROFileIcon>
                            <p className={style.uploadedName}>
                              {uploadedCertificates[uploadedFileIndex]
                                ?.attachment?.filename ||
                                uploadedCertificates[uploadedFileIndex]
                                  ?.attachment?.name}
                            </p>
                          </div>
                          <Trash2
                            size={17}
                            className={style.Trash}
                            onClick={() =>
                              removeCertificate(
                                checkForUploadedCertificate(certificate.name),
                                certificate.name,
                              )
                            }
                          />
                        </div>
                        <div
                          className={
                            style.certificateControlResultFrameBodyDates
                          }
                        >
                          {props.certificate.issueDateRequired &&
                            !props.certificate.expiryDateRequired && (
                              <div
                                className={
                                  style.certificateControlResultFrameBodyDatesItem
                                }
                              >
                                <span>Issue Date</span>
                                <DateControlNew
                                  value={getDateObject(
                                    uploadedCertificates[uploadedFileIndex]
                                      ?.issueDate,
                                  )}
                                  config={{}}
                                  onChange={(e) =>
                                    handleDateChange(e, null, certificate.name)
                                  }
                                />
                              </div>
                            )}
                          {!props.certificate.issueDateRequired &&
                            props.certificate.expiryDateRequired && (
                              <div
                                className={
                                  style.certificateControlResultFrameBodyDatesItem
                                }
                              >
                                <span>Expiry Date</span>
                                <DateControlNew
                                  value={getDateObject(
                                    uploadedCertificates[uploadedFileIndex]
                                      ?.expiryDate,
                                  )}
                                  config={{}}
                                  onChange={(e) =>
                                    handleDateChange(null, e, certificate.name)
                                  }
                                />
                              </div>
                            )}
                          {isDateRange && (
                            <DateRange
                              locale={getSessionLocale()}
                              startDate={getDateObject(
                                uploadedCertificates[uploadedFileIndex]
                                  .issueDate,
                              )}
                              endDate={getDateObject(
                                uploadedCertificates[uploadedFileIndex]
                                  .expiryDate,
                              )}
                              disabled={false}
                              required={true}
                              onDateRangeChange={(startDate, endDate) => {
                                handleDateChange(
                                  parseDate(getDateObject(startDate)),
                                  parseDate(getDateObject(endDate)),
                                  certificate.name,
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                {errorMessage &&
                  i === checkForUploadedCertificate(certificate.name) && (
                    <span className={styles.oroUploadError} id={`error_${i}`}>
                      {errorMessage}
                    </span>
                  )}
              </div>
            );
          })}
      </div>
      {error && (
        <div className={styles.oroUploadError}>
          <img src={AlertCircle} /> {error}
        </div>
      )}
    </div>
  );
}

export function CertificateControlNew(props: {
  value?: Array<Certificate>;
  name?: string;
  disabled?: boolean;
  config: {
    multiConfig?: MultiConfig;
    certificateConfig?: CustomCertificate;
    forceValidate?: boolean;
    optional?: boolean;
    fieldName?: string;
    localCertificateOptions?: Option[];
  };
  dataFetchers: {
    getDocumentByName?: (
      fieldName: string,
      certificateId?: string,
    ) => Promise<Blob>;
  };
  validator?: (value?) => string | null;
  onChange?: (
    value: Array<Certificate>,
    file?: Attachment | File,
    fileName?: string,
    certificateId?: string,
  ) => void;
}) {
  const [uploadedCertificates, setUploadedCertificates] = useState<
    Array<Certificate>
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDateRange, setDateRange] = useState(false);
  const [issueDateLeadTime, setIssueDateLeadTime] = useState<number>();
  const [expiryDateLeadTime, setExpiryDateLeadTime] = useState<number>();
  const [otherCertificateName, setOtherCertificateName] = useState("");
  const lineRefs = React.useRef([]);
  const otherRef = React.useRef(null);
  const [error, setError] = useState<string | null>();
  const [fileForPreview, setFileForPreview] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  let uploadedFileIndex = -1;
  lineRefs.current = props.config.certificateConfig?.validCertificateNames.map(
    (_, i) => lineRefs.current[i] ?? createRef(),
  );

  useEffect(() => {
    setUploadedCertificates(
      props.value && Array.isArray(props.value) ? props.value : [],
    );
  }, [props.value]);

  /** looking for other certificate name */

  useEffect(() => {
    if (props.value && props.config.certificateConfig?.validCertificateNames) {
      props.value.forEach((certificate) => {
        if (
          props.config.certificateConfig?.validCertificateNames.findIndex(
            (validCetificate) => validCetificate.name === certificate.name.name,
          ) < 0
        ) {
          setOtherCertificateName(certificate.name.name);
        }
      });
    }
  }, [props.value, props.config.certificateConfig?.validCertificateNames]);

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional) {
      if (props.config.multiConfig?.minCount > uploadedCertificates.length) {
        setError(
          getI18ControlText(
            "--validationMessages--.--atLeastMinimumRequired--",
            { min: props.config.multiConfig?.minCount || 0 },
          ),
        );
      } else if (props.validator) {
        setError(props.validator(uploadedCertificates));
      }
    }

    if (
      props.config.certificateConfig?.expiryDateRequired &&
      props.config.certificateConfig?.issueDateRequired
    ) {
      setDateRange(true);
    }
    if (props.config.certificateConfig?.issueDateLeadTime) {
      setIssueDateLeadTime(props.config.certificateConfig?.issueDateLeadTime);
    }
    if (props.config.certificateConfig?.expiryDateLeadTime) {
      setExpiryDateLeadTime(props.config.certificateConfig?.expiryDateLeadTime);
    }
  }, [props.config]);

  const validateFile = (file) => {
    // if (!file || !inputFileAcceptType.includes(file.type) || !file.type) {
    //   setErrorMessage('File type not accepted')
    //   return false
    // }
    return true;
  };

  const handleFiles = (
    file,
    certificateCode: string,
    certificateId?: string,
  ) => {
    setErrorMessage("");
    if (validateFile(file)) {
      const newCertificates = uploadedCertificates
        ? [
            ...uploadedCertificates,
            mapCertificate(file, certificateCode, "", "", certificateId),
          ]
        : [mapCertificate(file, certificateCode, "", "", certificateId)];
      setUploadedCertificates(newCertificates);

      if (props.validator && !props.config.optional) {
        setError(props.validator(newCertificates));
      }

      if (props.onChange) {
        props.onChange(
          newCertificates,
          file,
          `${props.config.fieldName}[${uploadedCertificates.length}].attachment`,
          certificateId,
        );
      }
    }
  };

  const filesSelected = (
    event,
    certificateCode: string,
    certificateId?: string,
  ) => {
    if (!props.disabled && event.target.files.length > 0) {
      const file = checkFileForS3Upload(event.target.files[0]);
      handleFiles(file, certificateCode, certificateId);
    }
  };

  function themeClass(): string {
    return styles.theme;
  }

  function removeCertificate(
    index: number,
    certificateCode: string,
    certificateId?: string,
  ) {
    const newCertificates = [...uploadedCertificates];
    newCertificates.splice(index, 1);
    setUploadedCertificates(newCertificates);

    if (props.validator && !props.config.optional) {
      setError(props.validator(newCertificates));
    }

    if (props.onChange) {
      props.onChange(
        newCertificates,
        undefined,
        `${props.config.fieldName}[${index}]`,
        certificateId,
      );
    }
  }

  function parseDate(date: Date) {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  }

  function handleDateChange(
    date: string,
    isIssueDate: boolean,
    certificateName?: string,
    certificateId?: string,
  ) {
    const index = checkForUploadedCertificate(certificateName);
    const copyUploadedCertificates = [...uploadedCertificates];

    if (isIssueDate) {
      copyUploadedCertificates[index].issueDate = date;
    } else {
      copyUploadedCertificates[index].expiryDate = date;
    }

    setUploadedCertificates(copyUploadedCertificates);

    if (props.validator && !props.config.optional) {
      setError(props.validator(copyUploadedCertificates));
    }

    if (props.onChange) {
      props.onChange(copyUploadedCertificates, undefined, "", certificateId);
    }
  }

  function checkForUploadedCertificate(name: string): number {
    uploadedFileIndex = uploadedCertificates.findIndex(
      (e) => e.name.name === name,
    );
    return uploadedFileIndex;
  }

  function openFileInput(index: number) {
    if (
      lineRefs.current &&
      lineRefs.current[index] &&
      lineRefs.current[index].current
    ) {
      lineRefs.current[index].current.click();
      if (lineRefs.current[index].current.value) {
        lineRefs.current[index].current.value = "";
      }
    }
  }

  function openOtherInput(e) {
    otherRef.current.click();
    if (otherRef.current.value) {
      otherRef.current.value = "";
    }
  }

  function getCertificateTypeDisplayName(certificate: IDRef) {
    const localizedCertificateOption =
      props.config?.localCertificateOptions?.find((locCert) => {
        return locCert.path === certificate.name;
      });
    return localizedCertificateOption?.displayName || certificate.name;
  }

  function handleOtherCertificateName(e) {
    if (e?.target?.value) {
      setOtherCertificateName(e.target.value);
    }
  }

  function previewFile(index: number, id?: string) {
    setError(null);
    if (!fileForPreview) {
      const fileName = id
        ? id
        : `${props.config.fieldName}[${index}].attachment`;
      props.dataFetchers.getDocumentByName &&
        props.dataFetchers
          .getDocumentByName(fileName)
          .then((resp) => {
            setFileForPreview(resp);
            setIsPreviewOpen(true);
          })
          .catch((err) => console.log());
    }
  }

  return (
    <div className={error ? styles.error : ""}>
      <div
        className={`${styles.oroUpload} ${themeClass()} ${style.certificateControl}`}
      >
        {props.config.certificateConfig?.validCertificateNames &&
          props.config.certificateConfig?.validCertificateNames.map(
            (certificate, i) => {
              return (
                <div
                  key={i}
                  className={
                    checkForUploadedCertificate(certificate.name) < 0
                      ? style.certiBorder
                      : ""
                  }
                >
                  {(!uploadedCertificates ||
                    checkForUploadedCertificate(certificate.name) < 0) && (
                    <div className={style.certificateControlItem}>
                      <div className={style.certificateControlItemName}>
                        {getCertificateTypeDisplayName(certificate)}
                      </div>
                      <input
                        id={`file_${i}`}
                        name={`file_${i}`}
                        ref={lineRefs.current[i]}
                        type="file"
                        title=""
                        accept={inputFileAcceptType}
                        disabled={props.disabled}
                        style={{ display: "none" }}
                        onClick={(event) => {
                          (event.target as HTMLInputElement).value = "";
                        }}
                        onChange={(e) =>
                          filesSelected(e, certificate.name, certificate.id)
                        }
                      />
                      <OroButton
                        type="secondary"
                        className={style.certificateControlItemButton}
                        onClick={() => openFileInput(i)}
                        label={getI18ControlText(
                          "--fieldTypes--.--certificate--.--upload--",
                        )}
                        icon={<Upload size={14} />}
                      />
                    </div>
                  )}
                  {uploadedCertificates &&
                    checkForUploadedCertificate(certificate.name) >= 0 &&
                    uploadedFileIndex >= 0 &&
                    uploadedCertificates[uploadedFileIndex] && (
                      <div
                        key={i}
                        id={`file_${i}`}
                        className={style.certificateControlResultFrame}
                      >
                        <div
                          className={
                            style.certificateControlResultFrameContainer
                          }
                        >
                          <div
                            className={
                              style.certificateControlResultFrameContainerHeader
                            }
                          >
                            <p
                              className={
                                style.certificateControlResultFrameContainerHeaderTitle
                              }
                            >
                              {getCertificateTypeDisplayName(certificate)}
                            </p>
                            <Check size={17} className={style.CheckIcon} />
                          </div>
                        </div>
                        <div
                          className={style.certificateControlResultFrameBody}
                        >
                          <div
                            className={
                              style.certificateControlResultFrameBodyItem
                            }
                          >
                            <div
                              className={style.File}
                              onClick={() =>
                                previewFile(
                                  checkForUploadedCertificate(certificate.name),
                                  certificate.id,
                                )
                              }
                            >
                              <OROFileIcon
                                fileType={
                                  uploadedCertificates[uploadedFileIndex]
                                    ?.attachment?.mediatype
                                }
                              ></OROFileIcon>
                              <p className={style.uploadedName}>
                                {uploadedCertificates[uploadedFileIndex]
                                  ?.attachment?.filename ||
                                  uploadedCertificates[uploadedFileIndex]
                                    ?.attachment?.name}
                              </p>
                            </div>
                            <Trash2
                              size={17}
                              className={style.Trash}
                              onClick={() =>
                                removeCertificate(
                                  checkForUploadedCertificate(certificate.name),
                                  certificate.name,
                                  certificate.id,
                                )
                              }
                            />
                          </div>
                          {fileForPreview && isPreviewOpen && (
                            <FilePreview
                              fileBlob={fileForPreview}
                              filename={
                                (
                                  uploadedCertificates[
                                    checkForUploadedCertificate(
                                      certificate.name,
                                    )
                                  ]?.attachment as Attachment
                                )?.name ||
                                (
                                  uploadedCertificates[
                                    checkForUploadedCertificate(
                                      certificate.name,
                                    )
                                  ]?.attachment as Attachment
                                )?.filename ||
                                ""
                              }
                              mediatype={
                                (
                                  uploadedCertificates[
                                    checkForUploadedCertificate(
                                      certificate.name,
                                    )
                                  ]?.attachment as Attachment
                                )?.mediatype || ""
                              }
                              onClose={(e) => {
                                setIsPreviewOpen(false);
                                e.stopPropagation();
                                setFileForPreview(null);
                              }}
                            />
                          )}
                          <div
                            className={
                              style.certificateControlResultFrameBodyDates
                            }
                          >
                            {props.config.certificateConfig
                              ?.issueDateRequired && (
                              <div
                                className={
                                  style.certificateControlResultFrameBodyDatesItem
                                }
                              >
                                <span>
                                  {getI18ControlText(
                                    "--fieldTypes--.--certificate--.--issueDate--",
                                  )}
                                </span>
                                <DateControlNew
                                  value={getDateObject(
                                    uploadedCertificates[uploadedFileIndex]
                                      ?.issueDate,
                                  )}
                                  onChange={(e) =>
                                    handleDateChange(
                                      e,
                                      true,
                                      certificate.name,
                                      certificate.id,
                                    )
                                  }
                                  config={{
                                    dateConfig: {
                                      issueDateLeadTime: issueDateLeadTime,
                                    },
                                  }}
                                />
                              </div>
                            )}
                            {props.config.certificateConfig
                              ?.expiryDateRequired && (
                              <div
                                className={
                                  style.certificateControlResultFrameBodyDatesItem
                                }
                              >
                                <span>
                                  {getI18ControlText(
                                    "--fieldTypes--.--certificate--.--expiryDate--",
                                  )}
                                </span>
                                <DateControlNew
                                  value={getDateObject(
                                    uploadedCertificates[uploadedFileIndex]
                                      ?.expiryDate,
                                  )}
                                  onChange={(e) =>
                                    handleDateChange(
                                      e,
                                      false,
                                      certificate.name,
                                      certificate.id,
                                    )
                                  }
                                  config={{
                                    dateConfig: {
                                      leadTime: expiryDateLeadTime,
                                    },
                                  }}
                                />
                              </div>
                            )}
                            {/* { isDateRange &&
                     <DateRange
                      startDate={getDateObject(uploadedCertificates[uploadedFileIndex].issueDate)}
                      endDate={getDateObject(uploadedCertificates[uploadedFileIndex].expiryDate)}
                      disabled={false}
                      required={true}
                      onDateRangeChange={(startDate, endDate) => {
                        handleDateChange(parseDate(getDateObject(startDate)), parseDate(getDateObject(endDate)), certificate.name)
                      }}
                      config={{
                        leadTime: issueDateLeadTime,
                        expiryLeadTime: expiryDateLeadTime
                      }}
                     />} */}
                          </div>
                        </div>
                      </div>
                    )}
                  {errorMessage &&
                    i === checkForUploadedCertificate(certificate.name) && (
                      <span className={styles.oroUploadError} id={`error_${i}`}>
                        {errorMessage}
                      </span>
                    )}
                </div>
              );
            },
          )}
        {props.config.certificateConfig?.allowOthers && (
          <div>
            {(!uploadedCertificates ||
              checkForUploadedCertificate(otherCertificateName) < 0) && (
              <div className={style.certificateControlItem}>
                <div className={style.certificateControlItemName}>
                  <input
                    id={`other_file_name`}
                    name={`other_file_name`}
                    type="text"
                    value={otherCertificateName}
                    onChange={handleOtherCertificateName}
                  />
                </div>
                <input
                  id={`file_${props.config.certificateConfig?.validCertificateNames.length}`}
                  name={`file_${props.config.certificateConfig?.validCertificateNames.length}`}
                  ref={otherRef}
                  type="file"
                  title=""
                  accept={inputFileAcceptType}
                  disabled={!otherCertificateName}
                  style={{ display: "none" }}
                  onClick={(event) => {
                    (event.target as HTMLInputElement).value = "";
                  }}
                  onChange={(e) => filesSelected(e, otherCertificateName)}
                />
                <OroButton
                  type="secondary"
                  className={style.certificateControlItemButton}
                  disabled={!otherCertificateName}
                  onClick={(e) => openOtherInput(e)}
                  label={getI18ControlText(
                    "--fieldTypes--.--certificate--.--upload--",
                  )}
                  icon={<Upload size={14} />}
                />
              </div>
            )}
            {uploadedCertificates &&
              checkForUploadedCertificate(otherCertificateName) >= 0 &&
              uploadedFileIndex >= 0 &&
              uploadedCertificates[uploadedFileIndex] && (
                <div
                  id={`file_${props.config.certificateConfig?.validCertificateNames.length}`}
                  className={style.certificateControlResultFrame}
                >
                  <div className={style.certificateControlResultFrameContainer}>
                    <div
                      className={
                        style.certificateControlResultFrameContainerHeader
                      }
                    >
                      <p
                        className={
                          style.certificateControlResultFrameContainerHeaderTitle
                        }
                      >
                        {otherCertificateName}
                      </p>
                      <Check size={17} className={style.CheckIcon} />
                    </div>
                  </div>
                  <div className={style.certificateControlResultFrameBody}>
                    <div
                      className={style.certificateControlResultFrameBodyItem}
                    >
                      <div
                        className={style.File}
                        onClick={() =>
                          previewFile(
                            checkForUploadedCertificate(otherCertificateName),
                          )
                        }
                      >
                        <OROFileIcon
                          fileType={
                            uploadedCertificates[uploadedFileIndex]?.attachment
                              ?.mediatype
                          }
                        ></OROFileIcon>
                        <p className={style.uploadedName}>
                          {uploadedCertificates[uploadedFileIndex]?.attachment
                            ?.filename ||
                            uploadedCertificates[uploadedFileIndex]?.attachment
                              ?.name}
                        </p>
                      </div>
                      <Trash2
                        size={17}
                        className={style.Trash}
                        onClick={() =>
                          removeCertificate(
                            checkForUploadedCertificate(otherCertificateName),
                            otherCertificateName,
                          )
                        }
                      />
                    </div>
                    {fileForPreview && isPreviewOpen && (
                      <FilePreview
                        fileBlob={fileForPreview}
                        filename={
                          (
                            uploadedCertificates[uploadedFileIndex]
                              ?.attachment as Attachment
                          )?.name ||
                          (
                            uploadedCertificates[uploadedFileIndex]
                              ?.attachment as Attachment
                          )?.filename ||
                          ""
                        }
                        mediatype={
                          (
                            uploadedCertificates[uploadedFileIndex]
                              ?.attachment as Attachment
                          )?.mediatype || ""
                        }
                        onClose={(e) => {
                          setIsPreviewOpen(false);
                          e.stopPropagation();
                          setFileForPreview(null);
                        }}
                      />
                    )}
                    <div
                      className={style.certificateControlResultFrameBodyDates}
                    >
                      {props.config.certificateConfig?.issueDateRequired && (
                        <div
                          className={
                            style.certificateControlResultFrameBodyDatesItem
                          }
                        >
                          <span>
                            {getI18ControlText(
                              "--fieldTypes--.--certificate--.--issueDate--",
                            )}
                          </span>
                          <DateControlNew
                            value={getDateObject(
                              uploadedCertificates[uploadedFileIndex]
                                ?.issueDate,
                            )}
                            onChange={(e) =>
                              handleDateChange(e, true, otherCertificateName)
                            }
                            config={{
                              dateConfig: {
                                issueDateLeadTime: issueDateLeadTime,
                              },
                            }}
                          />
                        </div>
                      )}
                      {props.config.certificateConfig?.expiryDateRequired && (
                        <div
                          className={
                            style.certificateControlResultFrameBodyDatesItem
                          }
                        >
                          <span>
                            {getI18ControlText(
                              "--fieldTypes--.--certificate--.--expiryDate--",
                            )}
                          </span>
                          <DateControlNew
                            value={getDateObject(
                              uploadedCertificates[uploadedFileIndex]
                                ?.expiryDate,
                            )}
                            onChange={(e) =>
                              handleDateChange(e, false, otherCertificateName)
                            }
                            config={{
                              dateConfig: {
                                leadTime: expiryDateLeadTime,
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
      {error && (
        <div className={styles.oroUploadError}>
          <img src={AlertCircle} /> {error}
        </div>
      )}
    </div>
  );
}
