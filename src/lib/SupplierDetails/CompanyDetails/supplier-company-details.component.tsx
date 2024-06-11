import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { OroButton } from "../../controls";
import { convertAddressToString } from "../../Form/util";
import { AttachmentBox, Currency, imageFileAcceptType, OROWebsiteInput, TextArea, TextBox, TypeAhead } from "../../Inputs";
import { GooglePlaceSearch } from '../../GooglePlaceSearch/GooglePlaceSearch'
import { Address, Attachment, Money, Option, OroMasterDataType } from "../../Types";
import { SupplierDetails } from "../../Types/supplier";
import styles from './styles.module.scss'
import { getValueFromAmount } from "../../Inputs/utils.service";
import { Upload } from "react-feather";
import { DEFAULT_CURRENCY } from "../../util";
import { getSessionLocale } from "../../sessionStorage";


export interface EditCompanyDetailsProps {
    supplier?: SupplierDetails
    currencies: Array<Option>
    industryCodes: Array<Option>
    defaultCurrency?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onEditDetails?: (supplier: SupplierDetails) => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    onPlaceSelect?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    onCancel?: () => void
}

export function SupplierCompanyDetails (props: EditCompanyDetailsProps) {
   const [supplierDetails, setSupplierDetails] = useState<SupplierDetails>(null)
   const [name, setName] = useState<string>('')
   const [businessType, setBusinessType] = useState<string>('')
   const [website, setWebsite] = useState<string>('')
   const [address, setAddress] = useState<Address>()
   const [description, setDescription] = useState<string>('')
   const [registrationId, setRegistrationId] = useState<string>('')
   const [totalEmployees, setTotalEmployees] = useState<string>('')
   const [totalRevenue, setTotalRevenue] = useState<Money>()
   const [attachment, setAttachment] = useState<Attachment | File>()
   const [currenciesOptions, setCurrenciesOptions] = useState<Option[]>([])
   const [selectedBusinessType, setSelectedBusinessType] = useState<Option>()
   const [businessTypeOptions, setBusinessTypeOptions] = useState<Option[]>([])
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [preview, setPreview] = useState('')

    useEffect(() => {
      if (props.supplier) {
        setSupplierDetails(props.supplier)
        setName(props.supplier.commonName || '')
        setBusinessType(props.supplier.industryCode || '')
        setAddress(props.supplier.address)
        setDescription(props.supplier.description || '')
        setWebsite(props.supplier.website|| '')
        setRegistrationId(props.supplier.regId || '')
        setTotalEmployees(props.supplier?.numEmployees || '')
        setTotalRevenue({
          currency: props.supplier?.annualRevenue?.currency || DEFAULT_CURRENCY,
          amount: props.supplier?.annualRevenue?.amount
        })
        setAttachment(props.supplier.attachment)
      }
    }, [props.supplier])

    useEffect(() => {
      props.currencies && setCurrenciesOptions(props.currencies)
    }, [props.currencies])

    useEffect(() => {
      props.industryCodes && setBusinessTypeOptions(props.industryCodes)
      const selectedOption = getSelectedIndustryCode(props.industryCodes, props.supplier?.industryCode)
      if (selectedOption) {
        setSelectedBusinessType(selectedOption)
      }
    }, [props.industryCodes])

    useEffect(() => {
      if (!selectedFile) {
        setPreview(undefined)
        return
      }
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(encodeURIComponent(objectUrl))
      return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  function getSelectedIndustryCode (options: Option[], code: string): Option {
    let selectedOption: Option;
    options.some(option => selectedOption = (option.id === code || option.customData?.code === code) ? option : getSelectedIndustryCode(option.children || [], code))
    return selectedOption
  }

    function getUpdateDetails (): SupplierDetails {
        return {
            id: props.supplier?.id || '',
            commonName : name ? name : '',
            industryCode: businessType ? businessType : '',
            address: address,
            description: description ? description : '',
            website : website ? website : '',
            regId: registrationId ? registrationId : '',
            numEmployees: totalEmployees ? totalEmployees : '',
            annualRevenue: totalRevenue
        }
    }

    function submitDetails() {
        if (props.onEditDetails) {
          props.onEditDetails(getUpdateDetails())
        }
    }

    function handleCancel () {
        if (props.onCancel) {
           props.onCancel()
        }
    }

    function handleFileChange (fieldName: string, e) {
      if (e && e.target && e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        if (file) {
          setSelectedFile(file)
          if (props.onFileUpload) {
            props.onFileUpload(file, fieldName)
            .then(resp => {
              setSelectedFile(null)
            })
            .catch(err => console.log(err))
          }
        } else {
          setSelectedFile(null)
        }
      }
    }

    function fillInAddress (place: google.maps.places.PlaceResult) {
      if (props.onPlaceSelect) {
        props.onPlaceSelect(place).then((resp: Address) =>{
          setAddress(resp)
        }).catch(err =>{
          console.error(err)
        })
      }
    }

    function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
      if (props.fetchChildren) {
        return props.fetchChildren(parent, childrenLevel, masterDataType)
      } else {
        return Promise.reject('fetchChildren API not available')
      }
    }

    function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
      if (props.searchOptions) {
        return props.searchOptions(keyword, masterDataType)
      } else {
        return Promise.reject('searchOptions API not available')
      }
    }

    return (<div className={styles.editSupplier}>
        <div className={styles.details}>
            <div className={styles.detailsSection}>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-name-field">
                    <label>Company name</label>
                    <TextBox
                        placeholder="Enter..."
                        value={name}
                        disabled={false}
                        required={false}
                        forceValidate={false}
                        onChange={value => { setName(value) }}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col2}`} id="supplier-company-type-field">
                    <label>Nature of business</label>
                      <TypeAhead
                          value={selectedBusinessType}
                          options={businessTypeOptions}
                          disabled={false}
                          required={false}
                          placeholder='Select...'
                          fetchChildren={(parent, childrenLevel) => fetchChildren('IndustryCode', parent, childrenLevel)}
                          onSearch={(keyword) => searchMasterdataOptions(keyword, 'IndustryCode')}
                          onChange={value => { setSelectedBusinessType(value); setBusinessType(value?.id || '')}}
                      />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-website-field">
                        <OROWebsiteInput
                            label="Website"
                            value={website}
                            disabled={false}
                            required={true}
                            forceValidate={false}
                            onChange={value => { setWebsite(value)}}
                        />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-address-field">
                        <GooglePlaceSearch
                          id="company-address-field"
                          label="Address"
                          value={convertAddressToString(address)}
                          onPlaceSelect={fillInAddress}
                          required={true} readonly={false}
                        />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-description-field">
                        <label>Description</label>
                        <TextArea
                            value={description}
                            required={false}
                            placeholder='Enter..'
                            forceValidate={false}
                            onChange={value => { setDescription(value); }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.detailsSection}>
                <div className={styles.title}>Additional Information <span className={styles.subTitle}>(Optional)</span></div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-regid-field">
                    <label>Registration ID</label>
                    <TextBox
                        placeholder="Enter..."
                        value={registrationId}
                        disabled={false}
                        required={false}
                        forceValidate={false}
                        onChange={value => { setRegistrationId(value) }}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-company-noOfEmployees-field">
                    <label>No. of employees</label>
                    <TextBox
                        placeholder="Enter..."
                        value={totalEmployees}
                        disabled={false}
                        required={false}
                        forceValidate={false}
                        onChange={value => { setTotalEmployees(value) }}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col2}`} id="supplier-company-revenue-field">
                    <label>Total annual revenue</label>
                    <Currency
                      locale={getSessionLocale()}
                      unit={totalRevenue?.currency || props.defaultCurrency || DEFAULT_CURRENCY}
                      value={totalRevenue?.amount ? totalRevenue.amount.toLocaleString(getSessionLocale()) : ''}
                      unitOptions={currenciesOptions}
                      disabled={false}
                      required={true}
                      hideClearButton={true}
                      onChange={value => { setTotalRevenue({amount: Number(getValueFromAmount(value)), currency: totalRevenue?.currency}); }}
                      onUnitChange={value => { setTotalRevenue({amount: totalRevenue.amount, currency: value || DEFAULT_CURRENCY}); }}
                    />
                  </div>
                </div>
            </div>

            <div className={styles.detailsSection}>
                <div className={`${styles.row} ${styles.pdBt0}`}>
                    <div className={classNames(styles.item, styles.flex, styles.actionBtn)}>
                      <OroButton label="Cancel" type="secondary" className={styles.cancelBtn} fontWeight="semibold" radiusCurvature="medium" onClick={handleCancel} theme="coco" />
                      <OroButton label="Submit" type="primary" className={styles.submitBtn} fontWeight="semibold" radiusCurvature="medium" onClick={submitDetails} theme="coco" />
                    </div>
                </div>
            </div>
        </div>
        {/* commenting for now */}
        {/* <div className={styles.logoSection}>
              <div className={styles.logoSectionContainer}>
                { props.supplier && props.supplier.logoURL && !selectedFile &&
                  <img className={styles.logoSectionContainerImg} src={props.supplier.logoURL} alt="" />
                }
                {
                  selectedFile &&  <img className={styles.logoSectionContainerImg} src={preview} alt=""/>
                }
                <div className={styles.fileUpload}>
                      {(!selectedFile && !props.supplier?.logoURL) && <Upload size={30} color="#0C48D0" />}
                      <div className={styles.fileUploadText}>
                        <div className={styles.placeholder}>{props.supplier && props.supplier.logoURL ? 'Reupload Logo' : 'Upload Logo'}</div>
                        {(!selectedFile && !props.supplier?.logoURL) && <span className={styles.optional}>(Optional)</span>}
                      </div>
                      <input
                        name="file"
                        className={styles.fileUploadFileInput}
                        type="file"
                        title=""
                        accept={`${imageFileAcceptType}`}
                        disabled={false}
                        onChange={(e) => handleFileChange('companyLogo', e)}
                      />
                </div>
              </div>
        </div> */}
    </div>
    )

}
