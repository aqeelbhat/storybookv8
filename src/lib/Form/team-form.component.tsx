import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { AlertCircle, ArrowRight, Camera, ChevronDown, Circle, HelpCircle, Info, Mail, Phone, Plus, PlusCircle, Search, X } from 'react-feather'
import { Autocomplete, Box, FormControlLabel, Modal, Radio, RadioGroup, TextField, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

import { InternalUserRoles, MasterDataRoleObject, TeamFormAction, TeamFormData, TeamFormProps, TeamMember, TeamRole } from './types'
import { Contact, SupplierUser, User, UserId } from '../Types'
import { areObjectsSame, areUserLinesSame, getUserDisplayName } from './util'
import { OroButton } from '../controls'
import { UserList, UserTable } from './Items/user-list.component'
import { createImageFromInitials } from '../util'
import { Option, imageFileAcceptType } from '../Inputs'
import { PortalPanelDialog } from '../Portal/portal-panel.component'

import styles from './team-form-styles.module.scss'
import './../BootstrapTypeahead.scss'
import defaultUserPic from './assets/default-user-pic.png'
import EmptySupplierContact from './assets/EmptyStateSupplierContact.png'
import radioFilledGreenIcon from '../Form/assets/radio-filled-green.png'
import { getProfilePic } from './risk-data-validation-form.component';
import { NAMESPACES_ENUM, getI18Text as getI18ControlText, getI18Text, useTranslationHook } from '../i18n';
import { Trans } from 'react-i18next';

const customStyle = { 
  '& .MuiOutlinedInput-root': {
    'padding': '0px !important'
  }
}

export function AddNewMember (props: {
  isOpen: boolean
  isRunnerApp?: boolean
  isSensitive?: boolean
  team: Array<TeamMember>
  isUserNotExistInPgm?: string
  toggleModal?: () => void
  onUserSearch?: (query: string) => Promise<Array<User>>
  onRoleChange?: () => void
  onUserChanges?: (user: Array<TeamMember>) => void
  onSaveMember?: (teamRole: string, userList: Array<TeamMember>) => void
}) {

  const [selectedRole, setSelectedRole] = useState<TeamRole | null>()
  const [selectedMember, setSelectedMembers] = useState<Array<TeamMember>>([])
  const [selectedOwner, setSelectedOwner] = useState<TeamMember | null>()
  const [currentOwner, setCurrentOwner] = useState<TeamMember | null>()
  const asyncContactTypeaheadRef = useRef<any>(null)
  const [showError, setShowError] = useState<boolean>(false)
  const [showAlreadyExitError, setShowAlreadyExitError] = useState<boolean>(false)
  const [showErrorUserNotExit, setShowErrorUserNotExit] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [userSuggestions, setUserSuggestions] = useState<User[]>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.TEAMFORM) 

  useEffect(() => {
    if (selectedRole && props.team && props.team.length > 0) {
      const owner = props.team.find(user => user.teamRole === InternalUserRoles.owner)
      setCurrentOwner(owner)
    }
  }, [selectedRole])

  useEffect(() => {
    if (props.isUserNotExistInPgm) {
      setShowErrorUserNotExit(props.isUserNotExistInPgm)
    } else {
      setShowErrorUserNotExit(null)
    }
  }, [props.isUserNotExistInPgm])

  useEffect(() => {
    setShowError(false)
    setShowAlreadyExitError(false)
    setSelectedRole(null)
    setSelectedMembers([])
    setSelectedOwner(null)
    setShowErrorUserNotExit(null)
  }, [props.isOpen])

  function toggleModal () {
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function handleRoleSelection (event: any) {
    setSelectedRole(event.target.value)
    setShowAlreadyExitError(false)
    setShowError(false)
    asyncContactTypeaheadRef.current?.clear()
    setSelectedOwner(null)
    setSelectedMembers([])
    if (props.onRoleChange) {
      props.onRoleChange()
    }
  }
  

  function BpRadio(props) {
    return (
        <Radio
        color="default"
        checkedIcon={<img src={radioFilledGreenIcon} alt="" className={styles.radioIcon}/>}
        icon={<Circle color="#d9d9d9" size={16}></Circle>}
        {...props}
        className={styles.radioButton}
        />

    );
  }

  function searchUsers (query: string) {
    if (props.onUserSearch) {
      setIsLoading(true)
      setUserSuggestions([])
      props.onUserSearch(query)
        .then(users => {
          setIsLoading(false)
          let filterUsers = users
          if (selectedMember.length > 0 && users.length > 0) {
            filterUsers = users.filter(user => !selectedMember?.find(member => member.userName === user.userName))
          }
          if (props.team && props.team.length > 0) {
            filterUsers = filterUsers.filter(user => !props.team?.find(member => member.userName === user.userName))
          }
          setUserSuggestions(filterUsers)
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err)
          setUserSuggestions([])
        })
    } else {
      setUserSuggestions([])
    }
  }
  
  function isUserAlreadySelelcted (newUser: User): boolean {
    return props.team?.some(user => user.userName === newUser?.userName)
  }

  function handleUserSelect (e: Array<TeamMember>) {
    if (e && e.length > 0) {
      if (selectedRole === InternalUserRoles.owner) {
        const newUser: TeamMember = e[0]
        newUser.teamRole = selectedRole as TeamRole
        if (selectedOwner?.userName !== newUser?.userName) {
          setSelectedOwner(newUser)
        }
      } else {
        const newUserList: Array<TeamMember> = e.map(user => {
            return {
              ...user, teamRole: selectedRole as TeamRole
            }
          })
        setSelectedMembers(newUserList)
      }
      if (e.length > 0) {
        if (props.onUserChanges) {
          props.onUserChanges(e)
        }
      }
      setShowError(false)
    } else {
      if (selectedRole === InternalUserRoles.owner) {
        setSelectedOwner(null)
      } else {
        setSelectedMembers([])
      }
      setShowErrorUserNotExit(null)
      if (props.onUserChanges) {
        props.onUserChanges(null)
      }
    }
  }

  function checkIfUsersAreSelected () {
    return (selectedRole !== InternalUserRoles.owner && selectedMember.length > 0) || (selectedRole === InternalUserRoles.owner && selectedOwner)
  }

  function handleAddNewMember () {
    const isUserSelected = checkIfUsersAreSelected()
    let isUserAlreadyExit
    if (selectedRole === InternalUserRoles.owner) {
      isUserAlreadyExit = isUserAlreadySelelcted(selectedOwner)
    } else {
      isUserAlreadyExit = selectedMember.some(user => isUserAlreadySelelcted(user))
    }

    if (props.onSaveMember && selectedRole === InternalUserRoles.owner && isUserSelected && !isUserAlreadyExit && !showErrorUserNotExit) {
      setShowError(false)
      props.onSaveMember(selectedRole, [selectedOwner])
    } else if (props.onSaveMember && (selectedRole === InternalUserRoles.member || selectedRole === InternalUserRoles.coOwner) && isUserSelected && !isUserAlreadyExit && !showErrorUserNotExit) {
      setShowError(false)
      props.onSaveMember(selectedRole, selectedMember)
    } else if (!isUserSelected && !isUserAlreadyExit && !showErrorUserNotExit) {
      setShowError(true)
    } else if (isUserAlreadyExit && !showErrorUserNotExit) {
      setShowAlreadyExitError(true)
    }
  }

  function handleClosePopup() {
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function clearTypeaheadValue () {
    setSelectedOwner(null)
    asyncContactTypeaheadRef.current.clear();
  }


  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box className={styles.popup}>
            <div className={styles.addNewMember}>
              <div className={styles.header}>
                <span className={styles.title}>{props.isRunnerApp ? t("--addPeople--", "Add people") : t("--addInternalTeam--", "Add internal team")}</span>
                {/* <X size={20} color="var(--warm-neutral-shade-300)" cursor="pointer" onClick={() => toggleModal()}/> */}
              </div>
              <div className={styles.body}>
                <div className={styles.rolesList}>
                  <span>{props.isRunnerApp ? t("--selectARole--", "Select a role") : t("--selectTheTypeOfRole--", "Select the type of role")}</span>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={handleRoleSelection}
                    value={selectedRole}
                    className={styles.radioGroup}
                  >
                    {!props.isRunnerApp &&
                      <div className={styles.items}>
                          <FormControlLabel
                            value={InternalUserRoles.owner}
                            control={<BpRadio />}
                            className={styles.roleLabel}
                            label={
                            <div className={styles.roleInfo}>
                              <span>{t("--owner--", "Owner")}</span>
                              <div className={styles.roleDefinition}>{t("--canEditAndReceiveNotifications--", "Can edit all details of the measure and will receive notifications on updates.")}</div>
                              {/* <CustomizedTooltip
                                title={t("--canEditAndReceiveNotifications--", "Can edit all details of the measure and will receive notifications on updates.")}
                                placement='top'>
                                <Info size={18} color='var(--warm-neutral-shade-200)'/>
                              </CustomizedTooltip> */}
                            </div>}
                          />
                          <FormControlLabel
                            value={InternalUserRoles.coOwner}
                            control={<BpRadio />}
                            className={styles.roleLabel}
                            label={
                              <div className={styles.roleInfo}>
                                <span>{t("--deputyOwner--", "Deputy Owner")}</span>
                                <div className={styles.roleDefinition}>{t("--canEditAndNoNotifications--", "Can edit all details of the measure. No notifications will be sent." )}</div>
                                {/* <CustomizedTooltip
                                  arrow
                                  title={t("--canEditAndNoNotifications--", "Can edit all details of the measure. No notifications will be sent." )}
                                  placement='top'>
                                  <Info size={18} color='var(--warm-neutral-shade-200)'/>
                                </CustomizedTooltip> */}
                              </div>}
                          />
                          <FormControlLabel
                            value={InternalUserRoles.member}
                            control={<BpRadio />}
                            className={styles.roleLabel}
                            label={
                            <div className={styles.roleInfo}>
                              <span>{t("--member--", "Member")}</span>
                              <div className={styles.roleDefinition}>{t("--canMilestoneOwnerAndEditAccess--", "Can also be milestone owner and have edit access to milestones.")}</div>
                              {/* <CustomizedTooltip
                                arrow
                                title={t("--canMilestoneOwnerAndEditAccess--", "Can also be milestone owner and have edit access to milestones.")}
                                placement='top'>
                                  <Info size={18} color='var(--warm-neutral-shade-200)'/>
                              </CustomizedTooltip> */}
                            </div>}
                          />
                      </div>}
                      {props.isRunnerApp &&
                      <div className={styles.items}>
                          <FormControlLabel
                            value={InternalUserRoles.coOwner}
                            control={<BpRadio />}
                            className={styles.roleLabel}
                            label={
                            <div className={styles.roleInfo}>
                              <span>{t("--coOwner--", "Co-owner")}</span>
                              <div className={styles.roleDefinition}>{t("--coOwnerDescription--", "Can edit/ resubmit request. Will be notified on failed or denied request")}</div>
                            </div>}
                          />
                          <FormControlLabel
                            value={InternalUserRoles.member}
                            control={<BpRadio />}
                            className={styles.roleLabel}
                            label={
                              <div className={styles.roleInfo}>
                                <span>{t("--watcher--", "Watcher")}</span>
                                <div className={styles.roleDefinition}>{t("--watcherDescription--", "Gets visibility to the request." )}</div>
                              </div>}
                          />
                      </div>}
                  </RadioGroup>
                 </div>
                 {selectedRole && <div className={styles.usersList}>
                  <span>{selectedRole === InternalUserRoles.owner ? t("--selectUser--", 'Select user') : t("--selectUsers--", 'Select users')}</span>
                  <div className={classnames(styles.userSearchBox, showError ? styles.errorState : '', (selectedMember.length > 3) ? styles.searchBoxPadding : '')} id='teamMember'>
                    <Search size={16} color="var(--warm-neutral-shade-300)" className={styles.searchIcon}/>
                    <div className={classnames(styles.typeAheadContainer)}>
                      <AsyncTypeahead
                        className={`reactBootstrapSearchTypeahead owner`}
                        id="teamUsers"
                        useCache={false}
                        allowNew={false}
                        multiple={selectedRole !== InternalUserRoles.owner}
                        labelKey={(option: User) => `${option.firstName} ${option.lastName}`}
                        minLength={1}
                        isLoading={isLoading}
                        placeholder={t("--searchUsingName--", "Search using name")}
                        ref={asyncContactTypeaheadRef}
                        options={userSuggestions}
                        selected={(selectedRole !== InternalUserRoles.owner) && selectedMember}
                        onChange={handleUserSelect}
                        filterBy={(option, props) => {
                          return true
                        }}
                        onSearch={searchUsers}
                        renderMenuItemChildren={(option: User) => (
                          <div className="dropdown-item-teamFormat">
                            <img src={option.picture || getProfilePic(option) } alt="" />
                              <div className="dropdown-item-teamFormat-row">
                                <div className="dropdown-item-teamFormat-teammember"><span>{`${option?.firstName} ${option?.lastName}`}</span></div>
                                <div className="dropdown-item-teamFormat-teammemberemail"><span>{option?.email}</span></div>
                              </div>
                          </div>
                        )}
                      />
                    </div>
                    {(selectedRole === InternalUserRoles.owner) && selectedOwner && <X size={16} color="var(--warm-neutral-shade-300)" className={styles.searchIcon} onClick={clearTypeaheadValue}/>}
                  </div>
                  {showAlreadyExitError && <div className={styles.errorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{t("--userAlreadyExist--", 'User already exists')}</div>}
                 </div>}
                 {(selectedRole === InternalUserRoles.owner) && currentOwner && <div className={styles.overlayMessage}>
                    <Info size={20} color="var(--warm-neutral-shade-500)" className={styles.icon}/>
                    <span className={styles.message}>{t("--thisWillReplaceExisting--", "This will replace existing")} <span>{t("--owner--", "Owner")}</span> ({getUserDisplayName(currentOwner)}) {t("--andReAssignThemAs--", "and re-assign them as")} <span>{t("--member--", "Member")}</span></span>
                  </div>}
                  {props.isSensitive && <div className={styles.overlayMessage}>
                    <Info size={20} color="var(--warm-neutral-shade-500)" className={styles.icon}/>
                     <span className={styles.message}>{t("--sensitiveMeasureWarning--")}</span>
                  </div>}
                 {showError && <div className={styles.errorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{getI18ControlText('--validationMessages--.--fieldRequired--')}</div>}
                 {showErrorUserNotExit && <div className={styles.errorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{showErrorUserNotExit}</div>}
              </div>
              <div className={styles.footer}>
                <OroButton label={t("--add--", "Add")} type="primary" theme="coco" fontWeight="semibold" radiusCurvature="medium" disabled={!!showErrorUserNotExit} onClick={handleAddNewMember}/>
                <OroButton label={t("--cancel--", "Cancel")} type="default" fontWeight="semibold" radiusCurvature="medium" onClick={handleClosePopup} />
              </div>
            </div>
         </Box>
      </Modal>
    </>
  )
}

export function TeamForm (props: TeamFormProps) {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false)
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState<boolean>(false)
  
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceValidateContactForm, setForceValidateContactForm] = useState<boolean>(false)
  const asyncUserTypeaheadRef = useRef<any>(null)

  const [users, setUsers] = useState<TeamMember[]>([])
  const [modalUsersList, setModalUsersList] = useState<TeamMember[]>([])
  const [supplierContacts, setSupplierContacts] = useState<SupplierUser[]>([])
  
  // Create new contact state:
  const [profileImage, setProfileImage] = useState(defaultUserPic)
  const [fileSizErrorMessage, setFileSizeErrorMessage] = useState('')
  const [imageFile, setImageFile] = useState<File>()
  const pciUploadRef = useRef<any>(null)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const { t } = useTranslationHook(NAMESPACES_ENUM.TEAMFORM) 

  useEffect(() => {
    if (props.formData) {
      setUsers(props.formData.users || [])
      setSupplierContacts(props.formData.supplierContacts || [])
      setIsMemberModalOpen(false)
    }
  }, [props.formData])

  function getFormData (): TeamFormData {
    return {
      users,
      supplierContacts
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: User[] | SupplierUser[]): TeamFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as TeamFormData

    switch (fieldName) {
      case 'users':
        formData.users = newValue as User[]
        break
      case 'supplierContacts':
        formData.supplierContacts = newValue as SupplierUser[]
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: User[] | SupplierUser[],
    newValue: User[] | SupplierUser[],
    action?: TeamFormAction,
    role?: TeamRole
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areUserLinesSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          action,
          role
        )
      } else if (Array.isArray(newValue) && action == TeamFormAction.updatedMember) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          action,
          role
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = false

    if (!users || users.length < 1) {
      invalidFieldId = 'user-list-field'
      isInvalid = true
    } else if (props.isSupplier && (!supplierContacts || supplierContacts.length < 1)) {
      invalidFieldId = 'supplierContact-list-field'
      isInvalid = true
    }

    return isInvalid ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }


  function isContactAlreadySelelcted (newUser: SupplierUser): boolean {
    return supplierContacts.some(user => getUserDisplayName(user) === getUserDisplayName(newUser))
  }

  function showContactForm () {
    setIsContactModalOpen(false)
    setIsCreateContactModalOpen(true)
  }

  useEffect(() => {
    if (asyncUserTypeaheadRef?.current) {
      asyncUserTypeaheadRef.current.clear()
      asyncUserTypeaheadRef.current.blur()
    }
  }, [modalUsersList])

  function fetchData (skipValidation?: boolean): TeamFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  function closeMemberModal () {
    setIsMemberModalOpen(!isMemberModalOpen)
    setModalUsersList([])
  }

  function closeContactModal () {
    setIsContactModalOpen(false)
  }

  function closeCreateContacModal () {
    closeCreateContactModal()
  }

  function goBackFromCreateContactModal () {
    closeCreateContactModal()
    setIsContactModalOpen(true)
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [users, supplierContacts])

  function getContactPicture (contact: SupplierUser): string {
    if (contact.imageUrl) {
      return contact.imageUrl
    } else {
      const nameFragment = getUserDisplayName(contact).split(' ')
      return createImageFromInitials(nameFragment[0], nameFragment[1])
    }
  }

  function handleUpdateUserList (updatedTeam: Array<TeamMember>, isRoleUpdate?: TeamFormAction) {
    const newUsers: TeamMember[] = updatedTeam.map(user => {
      const role  = user.teamRole
      return {
        ...user,
        role
      }
    })
    setModalUsersList(newUsers)
    handleFieldValueChange('users', users, updatedTeam, isRoleUpdate)
  }

  function saveInternalMembers (role: string, userList: Array<TeamMember>) {
    const newUsers: TeamMember[] = userList.map(user => {
      return {
        ...user,
        role
      }
    })
    if (role === InternalUserRoles.owner) {
      const memberList = users
      const currentOwnerIndex = memberList.findIndex(user => user?.teamRole === InternalUserRoles.owner)
      if (currentOwnerIndex > -1) {
        memberList[currentOwnerIndex].teamRole = InternalUserRoles.member
      }
      setUsers([...newUsers, ...memberList])
      handleFieldValueChange('users', users, [...newUsers, ...users], TeamFormAction.addedMembers, role as TeamRole)
    } else {
      setUsers([...users, ...newUsers])
      handleFieldValueChange('users', users, [...users, ...newUsers], TeamFormAction.addedMembers, role as TeamRole)
    }
  }

  function selectContact (contact: SupplierUser) {
    setSupplierContacts([...supplierContacts, contact])
    handleFieldValueChange('supplierContacts', supplierContacts, [...supplierContacts, contact])

    closeContactModal()
  }

  function returnFileSize (number) {
    if (number < 1048576) {
      return true
    } else {
      return false
    }
  }

  function handleImageUpload (e) {
    setFileSizeErrorMessage('')
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      if (returnFileSize(e.target.files[0].size)) {
        setImageFile(e.target.files[0])
        setProfileImage(encodeURI(URL.createObjectURL(e.target.files[0])))
      } else {
        setProfileImage(defaultUserPic)
        setFileSizeErrorMessage (t('--pleaseUploadFileSizeLess--'))

      }
    }
  }

  function closeCreateContactModal () {
    setIsCreateContactModalOpen(false)

    setNewFirstName('')
    setNewLastName('')
    setNewPhone('')
    setNewEmail('')
    setNewRole('')
    setImageFile(undefined)
    setProfileImage(defaultUserPic)
  }

  function createNewContact () {
    setForceValidateContactForm(!newFirstName || !newEmail)
    if (!newFirstName || !newEmail) {
      return
    }
  
    if (props.onCreateSupplierContact) {
      const newContact: SupplierUser = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        role: newRole,
        phone: newPhone,
        fullName: `${newFirstName} ${newLastName}`,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined
      }
      props.onCreateSupplierContact(newContact, imageFile)
        .then(resp => {
          setSupplierContacts([newContact, ...supplierContacts])
          handleFieldValueChange('supplierContacts', supplierContacts, [newContact, ...supplierContacts])
          closeCreateContactModal()
        })
        .catch(err => console.log(err))
    }
  }

  function openFileInput () {
    if (pciUploadRef.current) {
      pciUploadRef.current.click()
      if (pciUploadRef.current.value) {
        pciUploadRef.current.value = ''
      }
    }
  }
  
  function newContactFormInfoPersonali18(key: string){ return t('--newContactFormInfoPersonal--.' + key)}

  return (
    <div className={styles.teamForm}>
      {props.isSupplier &&
        <div className={styles.section}>
          <div className={classnames(styles.row, styles.titleRow)}>
            <div className={classnames(styles.item, styles.col5)} id="supplierContact-search-field">
              <div className={styles.listHeader}>
                <div className={styles.listTitle}>{t('--supplierContacts--')}</div>
                <div className={styles.listAction} onClick={() => setIsContactModalOpen(true)}><PlusCircle size={14} color={'#135EF2'}/>{t('--addContact--')}</div>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col5)} id="supplierContact-list-field">
              {
                supplierContacts && supplierContacts.length === 0 && 
                <div className={styles.emptyState}>
                  <span className={styles.emptyStateLine1}>{t('--noSupplierContactsAdded--')}</span>
                  <span className={styles.emptyStateLine2}>{t('--addOneWithContactButton--')}</span>
                    <div className={styles.emptyStateIconContainer}> 
                      <div className={styles.emptyStateIconContainerContact}>
                        <img src={EmptySupplierContact} />
                      </div>
                    </div>
                </div>
              }
              { supplierContacts && supplierContacts.length > 0 &&
                <UserList
                  value={supplierContacts}
                  forceValidate={forceValidate}
                  onChange={(value) => { setSupplierContacts(value as Contact[]); handleFieldValueChange('supplierContacts', supplierContacts, value) }}
                />}
            </div>
          </div>
        </div>}

      <div className={classnames(styles.peopleSection, styles.section)}>
        <div className={classnames(styles.row, styles.titleRow)} id="user-search-field">
          <div className={classnames(styles.item, styles.col5)} id="supplierContact-search-field">
            <div className={styles.listHeader}>
              <div className={styles.listTitleConatiner}>
                <span className={styles.title}>{t("--internalTeam--", "Internal")}</span>
                <div className={styles.count}>{users.length}</div>
              </div>
              <div>
                {props.hasEditPermission && <OroButton fontWeight="medium" type="default" icon={<Plus color={'var(--warm-neutral-shade-400'} size={20}/>} radiusCurvature="medium" label={t("--add--")} onClick={() => setIsMemberModalOpen(true)} />}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col5)} id="user-list-field">
            {
              users && users.length === 0 &&
              <div className={styles.internalMemberEmptyState}>
                <span>{t("--noMemberAdded--", "No member added")}</span>
                {/* <span>{t("--addMemberMessage--", "Use +Add to add member to internal team")}</span> */}
                <span>
                    <Trans t={t} i18nKey="--addMemberMessage--" values={{ Add: `+ Add` }}>
                      {`Use `}
                      <span className={styles.highlight}>
                        {`+ Add`}
                      </span>
                      {` to add member to internal team`}
                    </Trans>
                </span>
              </div>
            }
            { users && users.length > 0 &&
              <UserTable
                value={users}
                isRunnerApp={props.isRunnerApp}
                isUserNotExistInPgm={props.isUserNotExistInPgm}
                onDelete={handleUpdateUserList}
                hasEditPermission={props.hasEditPermission}
                onUserSearch={props.onUserSearch}
                onUpdateRole={handleUpdateUserList}
                onUserChanges={props.onUserChanges}
              />
            }
          </div>
        </div>

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col4, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" theme="coco" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" theme="coco" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>

      <PortalPanelDialog isOpen={isContactModalOpen}>
        <div className={styles.dialog}>
          <div className={styles.modalHeader}>
            <div className={styles.title}>{t('--addSupplierContact--')}</div>
            <div className={styles.closeBtn} onClick={closeContactModal}><X size={22} color={'var(--warm-neutral-shade-200)'} /></div>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.addNewContactBtn} onClick={showContactForm}>
              <div className={styles.group}>
                <PlusCircle color={'var(--warm-neutral-shade-200)'} size={15} />
                <span>{t('--addNewContact--')}</span>
              </div>
              <div className={styles.group}>
                <ArrowRight color={'var(--warm-neutral-shade-200)'} size={15} />
              </div>
            </div>

            { props.existingSupplierContacts && props.existingSupplierContacts.length > 0 &&
              props.existingSupplierContacts.filter(contact => !isContactAlreadySelelcted(contact)).map((contact, i) =>
                <div className={styles.modalContactItem} onClick={() => selectContact(contact)} key={i}>
                  <div className={styles.primaryDetails}>
                    <div className={styles.profile}>
                      <img src={getContactPicture(contact)} alt='Profile picture' />
                    </div>
                    <div className={styles.details}>
                      <div className={styles.name}>
                        <div className={styles.text}>{getUserDisplayName(contact)}</div>
                      </div>
                      <div className={styles.role}>{contact.role || ''}</div>
                      <div className={styles.email}><Mail size={14} color={'var(--warm-neutral-shade-200)'} />{contact.email || '-'}</div>
                    </div>
                  </div>
                </div>)}
          </div>
        </div>
      </PortalPanelDialog>

      <PortalPanelDialog isOpen={isCreateContactModalOpen}>
        <div className={styles.dialog}>
          <div className={styles.modalHeader}>
            <div className={styles.title}>{t('--addNewSupplierContact--')}</div>
            <div className={styles.closeBtn} onClick={closeCreateContacModal}><X size={22} color={'var(--warm-neutral-shade-200)'} /></div>
          </div>

          <div className={`${styles.modalBody} ${styles.newContactForm}`}>
              <div className={styles.newContactFormInfoPic}>
                <div className={styles.newContactFormInfoPicBox}>
                  <img src={profileImage} alt=""/>
                  <input ref={pciUploadRef} onClick={(event) => {(event.target as HTMLInputElement).value = '' }} type="file" accept={imageFileAcceptType} onChange={handleImageUpload}></input>
                  <span onClick={openFileInput} className={styles.cameraOnhover}><Camera size={20} color="#ffffff" /></span>
                </div>
                {fileSizErrorMessage && <div className={`oro-input-error ${styles.picBoxError}`}>{fileSizErrorMessage}</div>}
              </div>

              <div className={styles.newContactFormInfoPersonal}>
                <div className={styles.name}>
                    <div className={styles.nameFirst}>
                        <label>{newContactFormInfoPersonali18('--firstName--')}<span className={styles.error}>*</span></label>
                        <input type="text" value={newFirstName} className={(forceValidateContactForm && !newFirstName) ? styles.error : ''} onChange={(e) => setNewFirstName(e.target.value)}></input>
                    </div>
                    <div className={styles.nameLast}>
                        <label>{newContactFormInfoPersonali18('--lastname--')}</label>
                        <input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)}></input>
                    </div>
                </div>
                <div className={styles.role} id="materialUIAutocomplete">
                  <label>{newContactFormInfoPersonali18('--role--')}</label>
                  <Autocomplete
                    id={styles.freeSolo}
                    freeSolo
                    popupIcon={<ChevronDown size={16} color="#8c8c8c"></ChevronDown>}
                    forcePopupIcon
                    disableClearable={false}
                    value={newRole}
                    options={props.supplierRoleOptions}
                    clearOnEscape={true}
                    clearIcon={<X color="#8c8c8c" size={16} className="clearText"></X>}
                    getOptionLabel={option => (option as MasterDataRoleObject).name || newRole}
                    renderInput={(params) => (
                      <TextField
                        placeholder=""
                        {...params}
                        onChange={(event) => setNewRole(event.target.value)}
                        onBlur={(event) => setNewRole(event.target.value)}
                      />
                    )}
                    sx={customStyle}
                  />
                </div>
                <div className={styles.email}>
                  <label>{newContactFormInfoPersonali18('--email--')} <span className={styles.error}>*</span></label>
                  <input type="text" value={newEmail} className={(forceValidateContactForm && !newEmail) ? styles.error : ''} onChange={(e) => setNewEmail(e.target.value)}></input>
                </div>
                <div className={styles.phone}>
                  <label>{newContactFormInfoPersonali18('--phoneOptional--')}</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="-"></input>
                </div>
                <div className={styles.note}>
                  <label>{newContactFormInfoPersonali18('--noteOptional--')}</label>
                  <textarea />
                </div>
              </div>
          </div>

          <div className={styles.modalFooter}>
            <OroButton type="primary" theme="coco" radiusCurvature="medium" label={t('--saveAndProceed--')} onClick={createNewContact} />
            <OroButton type="default" theme="coco" radiusCurvature="medium" label={t('--back--')} onClick={goBackFromCreateContactModal} />
          </div>
        </div>
      </PortalPanelDialog>

      <AddNewMember
        isOpen={isMemberModalOpen}
        team={users}
        isSensitive={props.isSensitive}
        isRunnerApp={props.isRunnerApp}
        isUserNotExistInPgm={props.isUserNotExistInPgm}
        toggleModal={() => setIsMemberModalOpen(!isMemberModalOpen)}
        onUserSearch={props.onUserSearch}
        onRoleChange={props.onRoleChange}
        onUserChanges={props.onUserChanges}
        onSaveMember={saveInternalMembers}
      />
    </div>
  )
}
