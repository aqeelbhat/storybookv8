import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import moment from "moment";
import { DateControlNew, OroButton } from "../../controls";
import {
  AttachmentBox,
  inputFileAcceptType,
  OROWebsiteInput,
  TextBox,
  TypeAhead,
} from "../../Inputs";
import { SupplierAssessment } from "../../Types/supplier";
import { Attachment, Option, OroMasterDataType, User } from "../../Types";
import "../../../lib/BootstrapTypeahead.scss";
import styles from "./styles.module.scss";
import {
  getDateObject,
  validateField,
  getUserDisplayName,
} from "../../Form/util";
import { Edit3, PlusCircle } from "react-feather";
import { ScopeSelector } from "../CapabilitiesDetails/ScopeSelector/scope-selelctor.component";
import {
  getConditionValues,
  getDefaultSelectedOptions,
  updateHierarchyForSelectedOptions,
} from "../CapabilitiesDetails/ScopeSelector/option-utils.service";
import { ConditionValuesMap } from "../CapabilitiesDetails/ScopeSelector/types";

export interface SupplierAssessmentDetailsProps {
  supplierAssessment?: SupplierAssessment;
  typeOptions: Option[];
  restrictionOptions: Option[];
  fetchChildren?: (
    parent: string,
    childrenLevel: number,
    masterDataType?: string,
  ) => Promise<Option[]>;
  searchOptions?: (
    keyword?: string,
    masterDataType?: string,
  ) => Promise<Option[]>;
  onUserSearch?: (query: string) => Promise<Array<User>>;
  onSubmitDetails?: (assessmentDetails: SupplierAssessment) => void;
  onCancel?: () => void;
  onFileUpload?: (file: File, assessmentId: string) => void;
  onFileDelete?: (file: File, assessmentId: string) => void;
  loadDocument?: (assessmentId: string) => Promise<string>;
}

export function SupplierAssessmentDetails(
  props: SupplierAssessmentDetailsProps,
) {
  const [isLoading, setIsLoading] = useState(false);
  const asyncUserTypeaheadRef = useRef<any>(null);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<Option>();
  const [owner, setOwner] = useState<User | null>(null);
  const [ownerOptions, setOwnerOptions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User[]>([]);
  const [createdOn, setCreatedOn] = useState<string>("");
  const [expiresOn, setExpiresOn] = useState<string>("");
  const [restrictions, setRestrictions] = useState<Option[]>([]);
  const [showRestrictionModal, setShowRestrictionModal] =
    useState<boolean>(false);
  const [filteredRestrictions, setFilteredRestrictions] = useState<Option[]>(
    [],
  );
  const [restrictionValues, setRestrictionValues] =
    useState<ConditionValuesMap>({});
  const [forceValidate, setForceValidate] = useState<boolean>(false);
  const [relatedDocs, setRelatedDocs] = useState<Attachment>();
  const [documentURL, setDocumentURL] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>(null);

  useEffect(() => {
    if (props.supplierAssessment) {
      setName(props.supplierAssessment.name || "");
      setType(props.supplierAssessment.type);
      setOwner(props.supplierAssessment.requester);
      setExpiresOn(props.supplierAssessment.expiration);
      setCreatedOn(props.supplierAssessment.created);
      setDocumentURL(props.supplierAssessment.sourceURL || "");
      setRelatedDocs(props.supplierAssessment.attachment);
      if (
        props.supplierAssessment.restrictions &&
        props.supplierAssessment.restrictions.length > 0
      ) {
        setFilteredRestrictions(
          setSelected(
            props.restrictionOptions,
            props.supplierAssessment.restrictions,
          ),
        );
      }
      setSelectedUser(
        props.supplierAssessment.requester
          ? [props.supplierAssessment.requester]
          : [],
      );
    }
  }, [props.supplierAssessment]);

  useEffect(() => {
    if (filteredRestrictions && filteredRestrictions.length > 0) {
      const selectedValues = getDefaultSelectedOptions(
        filteredRestrictions,
        "",
      );
      setRestrictionValues(getConditionValues(selectedValues));
    }
  }, [filteredRestrictions]);

  useEffect(() => {
    if (props.supplierAssessment) {
      const selected = setSelected(
        props.restrictionOptions,
        props.supplierAssessment.restrictions,
      );
      setRestrictions(
        updateHierarchyForSelectedOptions(
          selected,
          props.supplierAssessment.restrictions,
          "",
        ),
      );
      setFilteredRestrictions(selected);
    } else {
      setFilteredRestrictions(props.restrictionOptions || []);
    }
  }, [props.restrictionOptions]);

  function getDateForSubmit(date: string): string {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  }

  function searchUsers(query: string) {
    if (props.onUserSearch) {
      setIsLoading(true);
      setOwnerOptions([]);
      props
        .onUserSearch(query)
        .then((users) => {
          setIsLoading(false);
          setOwnerOptions(users);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          setOwnerOptions([]);
        });
    } else {
      setOwnerOptions([]);
    }
  }
  // const debouncedUserSearch = useMemo(() => debounce(searchUsers), [])

  function handleUserSelect(e: Array<any>) {
    setSelectedUser(e);
    if (e && e.length > 0) {
      setOwner(e[0]);
    }
  }

  function getDetails(): SupplierAssessment {
    return {
      id: props.supplierAssessment?.id || null,
      name: name || "",
      type: type ? type : null,
      requester: owner ? owner : null,
      created: getDateForSubmit(createdOn),
      expiration: getDateForSubmit(expiresOn),
      restrictions: restrictions ? restrictions : [],
      sourceURL: documentURL || "",
      attachment: relatedDocs ? relatedDocs : null,
      selectedFile: !props.supplierAssessment ? selectedFile : null,
    };
  }

  function triggerValidations(invalidFieldId: string) {
    setForceValidate(true);
    setTimeout(() => {
      setForceValidate(false);
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

  function submitDetails() {
    const invalidFieldId = isFormInvalid();
    if (invalidFieldId) {
      triggerValidations(invalidFieldId);
    } else if (props.onSubmitDetails) {
      props.onSubmitDetails(getDetails());
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  function isFormInvalid(): string {
    let invalidFieldId = "";
    let isInvalid = false;

    isInvalid = !name || !type;
    invalidFieldId = !name
      ? "supplier-assessment-name-field"
      : !type
        ? "supplier-assessment-type-field"
        : "";
    return isInvalid ? invalidFieldId : "";
  }

  function showModal() {
    setShowRestrictionModal(!showRestrictionModal);
  }

  function setSelected(options?: Array<Option>, values?: Array<Option>) {
    const selectedRestriction =
      options &&
      options.map((option) => {
        option.selectable = true;
        const isSelected =
          values && values.find((opt) => opt.path === option.path);
        option.selected = isSelected ? true : false;
        setSelected(option.children, values);
        return option;
      });
    return selectedRestriction;
  }

  function handleRestrictionSubmit(selectedOptions: Option[]) {
    setRestrictions(selectedOptions);
    setRestrictionValues(getConditionValues(selectedOptions));
    setFilteredRestrictions(setSelected(filteredRestrictions, selectedOptions));
    setShowRestrictionModal(false);
  }

  function getRestrictionStrings(): JSX.Element[] {
    const conditionStrings: JSX.Element[] = [];
    for (const value in restrictionValues) {
      conditionStrings.push(
        <span>
          {value}: {restrictionValues[value].join(", ")}
        </span>,
      );
    }
    return conditionStrings;
  }

  function onAssessedDateChange(dateString: string) {
    setCreatedOn(dateString);
  }

  function onExpireDateChange(dateString: string) {
    setExpiresOn(dateString);
  }

  function handleFileChange(file?: File) {
    if (file) {
      setSelectedFile(file);
      if (props.onFileUpload && props.supplierAssessment?.id) {
        props.onFileUpload(file, props.supplierAssessment?.id || "");
      }
      setRelatedDocs(file);
    } else {
      if (props.onFileDelete && props.supplierAssessment?.id) {
        props.onFileDelete(file, props.supplierAssessment?.id || "");
      }
      setRelatedDocs(null);
    }
  }

  function loadFile(): Promise<string> {
    if (props.loadDocument && props.supplierAssessment.id) {
      return props.loadDocument(props.supplierAssessment.id);
    } else {
      return Promise.reject();
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

  return (
    <>
      <div className={styles.supplierAssessment}>
        <div className={styles.details}>
          <div className={styles.detailsSection}>
            <div className={styles.row}>
              <div
                className={`${styles.item} ${styles.col3}`}
                id="supplier-assessment-name-field"
              >
                <label className={styles.itemLabel}>Name</label>
                <TextBox
                  placeholder="Enter"
                  value={name}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate}
                  validator={(value) => validateField("Name", value)}
                  onChange={(value) => {
                    setName(value);
                  }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div
                className={`${styles.item} ${styles.col2}`}
                id="supplier-assessment-type-field"
              >
                <label className={styles.itemLabel}>Type</label>
                <TypeAhead
                  placeholder="Select"
                  value={type}
                  options={props.typeOptions}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate}
                  fetchChildren={(parent, childrenLevel) =>
                    fetchChildren("AssessmentType", parent, childrenLevel)
                  }
                  onSearch={(keyword) =>
                    searchMasterdataOptions(keyword, "AssessmentType")
                  }
                  validator={(value) => validateField("Type", value)}
                  onChange={(value) => {
                    setType(value);
                  }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div
                className={`${styles.item} ${styles.col2}`}
                id="supplier-assessment-owner-field"
              >
                <label
                  htmlFor="async-assessment-user-search"
                  className={styles.itemLabel}
                >
                  Owner
                </label>
                <div className={styles.searchInput}>
                  <AsyncTypeahead
                    id="async-assessment-user-search"
                    useCache={false}
                    filterBy={() => true}
                    isLoading={isLoading}
                    labelKey={(option: User) =>
                      `${option.firstName} ${option.lastName}`
                    }
                    minLength={1}
                    selected={selectedUser}
                    onSearch={searchUsers}
                    onChange={handleUserSelect}
                    options={ownerOptions}
                    placeholder="Search for user"
                    ref={asyncUserTypeaheadRef}
                    renderMenuItemChildren={(option: User, props) => (
                      <div className="dropdown-item-customFormat">
                        <div className="dropdown-item-customFormat-name">
                          <span>{getUserDisplayName(option)}</span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className={classNames(styles.row, styles.dateContainer)}>
              <div
                className={`${styles.item} ${styles.col1}`}
                id="supplier-assessment-assessed-date-field"
              >
                <label className={styles.itemLabel}>Assessed on</label>
                <DateControlNew
                  placeholder="Select date"
                  value={getDateObject(createdOn)}
                  config={{}}
                  onChange={onAssessedDateChange}
                />
              </div>
              <div
                className={`${styles.item} ${styles.col1}`}
                id="supplier-assessment-expire-date-field"
              >
                <label className={styles.itemLabel}>Expires on</label>
                <DateControlNew
                  placeholder="Select date"
                  value={getDateObject(expiresOn)}
                  config={{}}
                  onChange={onExpireDateChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div
                className={classNames(
                  `${styles.item} ${styles.col3}`,
                  styles.restrictions,
                )}
                id="supplier-assessment-restriction-field"
              >
                <label className={styles.itemLabel}>Limited to</label>
                {restrictions && restrictions.length > 0 && (
                  <>
                    <div
                      className={styles.addRestrictions}
                      onClick={() => showModal()}
                    >
                      <Edit3 color="var(--coco-azure)" size={14} />
                      <span className={styles.label}>Edit</span>
                    </div>
                  </>
                )}
              </div>
              <div>
                {restrictions && restrictions.length === 0 && (
                  <div
                    className={styles.addRestrictions}
                    onClick={() => showModal()}
                  >
                    <PlusCircle color="var(--coco-azure)" size={14} />
                    <span className={styles.label}>Add</span>
                  </div>
                )}
              </div>
              {restrictions && restrictions.length > 0 && (
                <div className={`${styles.item} ${styles.col3}`}>
                  <ul className={styles.itemList}>
                    {getRestrictionStrings().map((restriction, i) => {
                      return (
                        <li key={i} className={styles.text}>
                          {restriction}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Commenting for Now */}
          <div className={styles.detailsRelatedDocSection}>
            <div className={styles.title}>Related Documents</div>
            <div className={styles.row}>
              <div className={`${styles.item} ${styles.col3}`}>
                <OROWebsiteInput
                  label="URL"
                  value={documentURL}
                  disabled={false}
                  required={true}
                  forceValidate={false}
                  onChange={(value) => {
                    setDocumentURL(value);
                  }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={`${styles.item} ${styles.col4}`}>
                <label className={styles.itemLabel}>Documents</label>
                <div>
                  <div id="related-doc-attachment-box">
                    <AttachmentBox
                      value={relatedDocs}
                      inputFileAcceptTypes={`${inputFileAcceptType}`}
                      disabled={false}
                      required={false}
                      theme="coco"
                      onChange={(file) => handleFileChange(file)}
                      onPreviewByURL={() => loadFile()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.row}>
              <div
                className={classNames(
                  styles.item,
                  styles.flex,
                  styles.actionBtn,
                )}
              >
                <OroButton
                  label="Submit"
                  type="primary"
                  className={styles.submitBtn}
                  fontWeight="semibold"
                  radiusCurvature="medium"
                  onClick={submitDetails}
                  theme="coco"
                />
                <OroButton
                  label="Cancel"
                  type="secondary"
                  className={styles.cancelBtn}
                  fontWeight="semibold"
                  radiusCurvature="medium"
                  onClick={handleCancel}
                  theme="coco"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showRestrictionModal && (
        <ScopeSelector
          options={filteredRestrictions}
          isOpen={showRestrictionModal}
          toggle={() => setShowRestrictionModal(false)}
          onSubmit={handleRestrictionSubmit}
        />
      )}
    </>
  );
}
