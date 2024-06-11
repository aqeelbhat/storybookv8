import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle, Mail, MoreVertical, Search, Trash2 } from 'react-feather'
import { Box, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { Trans } from 'react-i18next'

import { ConfirmationDialog } from '../../Modals'
import { Contact, User } from '../../Types'
import { createImageFromInitials } from '../../util'
import { InternalUserRoles, TeamFormAction, TeamMember, TeamRole } from '../types'
import { getUserDisplayName, mapStringToOption } from '../util'
import { Option, TypeAhead } from '../../Inputs'
import { NAMESPACES_ENUM, getI18Text as getI18ControlText, useTranslationHook } from '../../i18n'
import { getProfilePic } from '../risk-data-validation-form.component'
import { OroButton } from '../../controls'
import { getSignedUser } from '../../SigninService'

import styles from './items-styles.module.scss'
import style from './user-list.module.scss'

export function AddNewOwner (props: {
  isOpen: boolean
  team: Array<TeamMember>
  isUserNotExistInPgm?: string
  toggleModal?: () => void
  onUserSearch?: (query: string) => Promise<Array<User>>
  onUserChanges?: (user: Array<TeamMember>) => void
  onUpdateOwner?: (newOwner: TeamMember) => void
}) {

  const [selectedOwner, setSelectedOwner] = useState<TeamMember>()
  const asyncContactTypeaheadRef = useRef<any>(null)
  const [showError, setShowError] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false)
  const [userSuggestions, setUserSuggestions] = useState<User[]>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.TEAMFORM)
  const [showErrorUserNotExit, setShowErrorUserNotExit] = useState<string | null>(null)

  useEffect(() => {
    setShowError(false)
    setShowErrorUserNotExit(null)
    setSelectedOwner(null)
  }, [props.isOpen])

  useEffect(() => {
    if (props.isUserNotExistInPgm) {
      setShowErrorUserNotExit(props.isUserNotExistInPgm)
    } else {
      setShowErrorUserNotExit(null)
    }
  }, [props.isUserNotExistInPgm])


  function toggleModal () {
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function searchUsers (query: string) {
    if (props.onUserSearch) {
      setIsLoading(true)
      setUserSuggestions([])
      props.onUserSearch(query)
        .then(users => {
          setIsLoading(false)
          setUserSuggestions(users)
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

  function handleUserSelect (e: Array<any>) {
    if (e && e.length > 0) {
      const newUser: TeamMember = e[0]
      newUser.teamRole = InternalUserRoles.owner
      setSelectedOwner(newUser)
      setShowError(false)
      if (props.onUserChanges) {
        props.onUserChanges(e)
      }
    } else {
      setShowErrorUserNotExit(null)
      if (props.onUserChanges) {
        props.onUserChanges(null)
      }
    }
  }

  function handleAddNewOwner () {
    if (props.onUpdateOwner && selectedOwner && !showErrorUserNotExit) {
      setShowError(false)
      props.onUpdateOwner(selectedOwner)
    } else if (!selectedOwner) {
      setShowError(true)
    }
  }

  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box className={style.popup}>
            <div className={style.addNewMember}>
              <div className={style.header}>
                <AlertCircle color={'var(--warm-stat-honey-regular)'} size={22} />
                <span className={style.title}>{t('--reassignOwner--', 'Reassign ownership')}</span>
              </div>
              <div className={style.body}>
                <div className={style.description}>{t("--ownerSelection--", 'Measure needs to have an Owner. Please reassign Ownership to another person')}</div>
                <div className={style.usersList}>
                  <span>{t("--selectNewOwner--", 'Select new owner')}</span>
                  <div className={classnames(style.userSearchBox, showError ? style.errorState : '')} id="reAssignOwner">
                    <Search size={16} color="var(--warm-neutral-shade-300)" className={style.searchIcon}/>
                    <div className={classnames(style.typeAheadContainer)}>
                      <AsyncTypeahead
                        className={`reactBootstrapSearchTypeahead owner`}
                        id="teamUsers"
                        useCache={false}
                        allowNew={false}
                        multiple={false}
                        labelKey={(option:User) => `${option.firstName} ${option.lastName}`}
                        minLength={1}
                        isLoading={isLoading}
                        placeholder={t("--searchUsingName--", "Search using name")}
                        ref={asyncContactTypeaheadRef}
                        options={userSuggestions}
                        onChange={handleUserSelect}
                        filterBy={(option, props) => {
                          return true
                        }}
                        onSearch={searchUsers}
                        renderMenuItemChildren={(option:User) => (
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
                  </div>
                  {showError && <div className={style.errorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{getI18ControlText('--validationMessages--.--fieldRequired--')}</div>}
                  {showErrorUserNotExit && <div className={style.errorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{showErrorUserNotExit}</div>}
                </div>
              </div>
              <div className={style.footer}>
                <OroButton label={t("--confirm--", "Confirm")} type="primary" theme="coco" fontWeight="semibold" radiusCurvature="medium" onClick={handleAddNewOwner}/>
                <OroButton label={t("--cancel--", "Cancel")} type="default" fontWeight="semibold" radiusCurvature="medium" onClick={toggleModal} />
              </div>
            </div>
         </Box>
      </Modal>
    </>
  )
}

interface UserItemProps {
  data: TeamMember | Contact
  readOnly: boolean
  onChange?: (data: TeamMember | Contact) => void
  onDelete?: () => void
}

function UserItem (props: UserItemProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [profilePicture, setProfilePicture] = useState<string>()

  useEffect(() => {
    if ((props.data as TeamMember).picture) {
      setProfilePicture((props.data as TeamMember).picture)
    } else if ((props.data as Contact).imageUrl) {
      setProfilePicture((props.data as Contact).imageUrl)
    } else {
      const nameFragment = getUserDisplayName(props.data).split(' ')
      setProfilePicture(createImageFromInitials(nameFragment[0], nameFragment[1]))
    }
  }, [props.data])

  function handleRoleChange (role: TeamRole) {
    if (props.onChange) {
      props.onChange({...props.data, teamRole: role})
    }
  }

  function onDelete () {
    if (props.onDelete) {
      setShowDeleteConfirmation(false)
      props.onDelete()
    }
  }

  return (
    <>
      <div className={styles.userItem}>
        <div className={styles.userProfile}>
          <img src={profilePicture} alt='Profile picture' />
        </div>

        <div className={styles.userDetails}>
          <div className={styles.name}>{getUserDisplayName(props.data)}</div>
          <div className={styles.role}>{(props.data as TeamMember).teamRole || (props.data as Contact).role}</div>
          
          {/* <div className={styles.note}>Add note</div> */}
        </div>

        <div className={styles.userRole}>
          {/* <SelectControl
            value={props.data.teamRole || 'Member'}
            options={['Owner', 'Member']}
            readOnly={props.readOnly}
            onChange={handleRoleChange}
          /> */}
          <div className={styles.email}><Mail size={14} color={'#3E4456'} />{props.data.email}</div>
        </div>

        { !props.readOnly &&
          <div className={styles.delete}>
            <Trash2 onClick={() => setShowDeleteConfirmation(true)} size={20} color="#ABABAB" />
          </div>}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title={`Remove ${getUserDisplayName(props.data)}`}
        description={`You are removing the user '${getUserDisplayName(props.data)}' from the list. Please confirm to proceed.`}
        primaryButton="Remove"
        secondaryButton="Cancel"
        actionType="danger"
        onPrimaryButtonClick={onDelete}
        onSecondaryButtonClick={() => setShowDeleteConfirmation(false)}
      />
    </>
  )
}

export function UserRow (props: {
  index: number,
  member: TeamMember,
  hasEditPermission?: boolean,
  isRunnerApp?: boolean
  onRoleUpdate?: (newRole: Option, oldRole: Option, member: TeamMember) => void
  onDelete?: (member: TeamMember, deletedRole?: Option) => void
  onUserChanges?: (user: Array<TeamMember>) => void
}) {

  // const [member, setMember]= useState<TeamMember>()
  const [currentUserRole, setCurrentUserRole] = useState<Option>()
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.TEAMFORM) 
  
  const basfRequiredRoles: Array<Option> = [
    {
      displayName: t("--owner--", "Owner"),
      path: 'Owner',
      id: 'owner',
      selectable: true
    }, {
      displayName: t("--deputyOwner--", "Deputy owner"),
      path: 'CoOwner',
      id: 'coOwner',
      selectable: true
    }, {
      displayName: t("--member--", "Member"),
      path: 'Member',
      id: 'member',
      selectable: true
    }]
  const roles: Array<Option> = [
      {
        displayName: t("--coOwner--", "Co-owner"),
        path: 'CoOwner',
        id: 'coOwner',
        selectable: true
      }, {
        displayName: t("--watcher--", "Watcher"),
        path: 'Member',
        id: 'member',
        selectable: true
      }]

  useEffect(() =>{
    if (props.member) {
      let selectedRole
      if (props.isRunnerApp) {
        if (props.member.teamRole === 'Owner' as TeamRole) {
          selectedRole = mapStringToOption(props.member.teamRole)
        } else {
          selectedRole = roles.find(role => role.path === props.member.teamRole)
        }
      } else {
        selectedRole = basfRequiredRoles.find(role => role.path === props.member.teamRole)
      }
      setCurrentUserRole(selectedRole)
    }
  }, [props.member])


  function getUserPicture (user: TeamMember) {
    let profilePicture;
    if (user?.picture) {
      profilePicture = user.picture
    } else if (user) {
      const nameFragment = getUserDisplayName(user)?.split(' ')
      if (nameFragment?.length > 0) {
        profilePicture = createImageFromInitials(nameFragment[0], nameFragment[1])
      }
    }
    return profilePicture
  }

  function onPopoverToggle (e) {
    e.stopPropagation()
    setIsPopoverOpen(!isPopoverOpen)
  }

  function onDelete () {
    if (props.onDelete) {
      setIsPopoverOpen(false)
      props.onDelete(props.member, currentUserRole)
    }
  }

  function hidePopover (e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setIsPopoverOpen(false)
  }

  function handleRoleUpdate (updatedRole: Option) {
    if (props.onRoleUpdate) {
      props.onRoleUpdate(updatedRole, currentUserRole, props.member)
    }
  }

  function showMoreAction (): boolean {
    if (!props.isRunnerApp && props.hasEditPermission) {
      return true
    } else if (props.isRunnerApp && props.hasEditPermission && currentUserRole?.path !== InternalUserRoles.owner) {
      return true
    } else if (props.isRunnerApp && currentUserRole?.path === InternalUserRoles.owner) {
      return false
    } else if (props.isRunnerApp && !props.hasEditPermission && (props.member?.userName === getSignedUser().userName) && (currentUserRole?.path === InternalUserRoles.member)) {
      return true
    }
    return false
  }

  function showHoverEffect (): boolean {
    if (!props.isRunnerApp && props.hasEditPermission) {
      return true
    } else if (props.isRunnerApp && currentUserRole?.path !== InternalUserRoles.owner && props.hasEditPermission) {
      return true
    }
    return false
  }

  return (
    <TableRow key={`user_${props.member?.userName}`} className={classnames(style.row, {[style.rowHoverEffect] : showHoverEffect()})}>
        <TableCell scope="row" className={style.cell}>
          <div className={style.user}>
            <div className={style.userProfile}>
              <img src={getUserPicture(props.member)} alt='Profile picture' height={32} width={32} />
            </div>
            <span className={style?.userName}>{props.member && getUserDisplayName(props.member)}</span>
          </div>
        </TableCell>
        <TableCell className={classnames(style.cell, style.email)}>{props.member?.email}</TableCell>
        <TableCell className={style.cell}>
          <div className={style.role}>
            {( (props.isRunnerApp && currentUserRole?.path !== InternalUserRoles.owner)|| !props.isRunnerApp) && <TypeAhead
              placeholder='Select'
              value={currentUserRole}
              options={props.isRunnerApp ? roles : basfRequiredRoles}
              noBorder
              disabled={!props.hasEditPermission || (props.isRunnerApp && currentUserRole?.path === InternalUserRoles.owner)}
              hideClearButton={true}
              expandLeft
              onChange={handleRoleUpdate}
              backgroundColor={'var(--warm-prime-chalk)'}
              disableTypeahead={true}
            />}
            {props.isRunnerApp && currentUserRole?.path === InternalUserRoles.owner && <span className={style.name}>{InternalUserRoles.owner}</span>}
          </div>
        </TableCell>
        <TableCell  className={style.cell} align="right">
          {showMoreAction() && <div className={style.action}>
            <MoreVertical size={20} color='var(--warm-neutral-shade-200)' cursor="pointer" onClick={onPopoverToggle} />
            { isPopoverOpen &&
              <div className={style.popoverContainer}>
                <ul className={style.actionList}>
                  <li className={style.actionListItem} onClick={onDelete} data-testid={`line-item-${props.index}-delete-btn`}>
                    <Trash2 size={18} color="var(--warm-neutral-shade-200)"/>
                    <span>{t("--delete--", 'Delete')}</span>
                  </li>
                </ul>
              </div>}
            { isPopoverOpen && <div className={style.actionPopoverBackdrop} onClick={hidePopover}></div> }
          </div>}
        </TableCell>
    </TableRow>
  )
}

export function UserTable (props: {
  value: TeamMember[],
  hasEditPermission?: boolean,
  isRunnerApp?: boolean
  isUserNotExistInPgm?: string
  onDelete?: (upadtedList: Array<TeamMember>, isRoleUpdate?: TeamFormAction) => void
  onUpdateRole?: (upadtedList: Array<TeamMember>, isRoleUpdate?: TeamFormAction) => void
  onUserSearch?: (query: string) => Promise<Array<User>>
  onUserChanges?: (user: Array<TeamMember>) => void
}) {
  const [userList, setUserList] = useState<Array<TeamMember>>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.TEAMFORM)
  const [deleteMember, setDeleteMember] = useState<TeamMember>()
  const [deleteUserRole, setDeleteUserRole] = useState<Option>()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [showUpdateRoleConfirmation, setShowUpdateRoleConfirmation] = useState<boolean>(false)

  const [newUserRole, setNewUserRole] = useState<Option>()
  const [oldUserRole, setOldUserRole] = useState<Option>()
  const [roleUpdatedMessage, setRoleUpdatedMessage] = useState<JSX.Element>()
  const [roleUpdatedTitle, setRoleUpdatedTitle] = useState<string>('')
  const [removeOwner, setRemoveOwner] = useState<boolean>(false)
  const [updateMember, setUpdateMember] = useState<TeamMember>()
  const [updateWatcherRole, setUpdateWatcherRole] = useState<boolean>(false)

  useEffect(() => {
    setUserList(props.value || [])
    setShowUpdateRoleConfirmation(false)
    setShowDeleteConfirmation(false)
    setRemoveOwner(false)
  }, [props.value])

  function deleteUserFromModalList () {
    if (deleteMember) {
      const updatedUserList = userList.filter(user => {
        if ((user?.userName !== deleteMember?.userName) || (user?.teamRole !== deleteMember?.teamRole)) {
          return user
        }
      })
      if (props.onDelete) {
        props.onDelete(updatedUserList, TeamFormAction.deletedMembers)
      }
    }
  }

  function updateOwnerRole (updateRole: string): Array<TeamMember> {
    const memberList = userList
    const currentOwnerIndex = memberList.findIndex(user => user?.teamRole === InternalUserRoles.owner)
    if (currentOwnerIndex > -1) {
      memberList[currentOwnerIndex].teamRole = updateRole as InternalUserRoles
    }
    return memberList
  }

  function updateRoleForUser () {
    const memberList = userList
    const updatedUserIndex = memberList.findIndex(user => user?.userName === updateMember?.userName)
    if (oldUserRole?.path === InternalUserRoles.member && newUserRole?.path === InternalUserRoles.coOwner && newUserRole?.id !== oldUserRole?.id && updatedUserIndex > -1) {
      memberList[updatedUserIndex].teamRole = InternalUserRoles.coOwner
    } else if ((oldUserRole?.path === InternalUserRoles.member || oldUserRole?.path === InternalUserRoles.coOwner) &&
    newUserRole?.path === InternalUserRoles.owner && newUserRole?.id !== oldUserRole?.id && updatedUserIndex > -1) {
      const currentOwnerIndex = memberList.findIndex(user => user?.teamRole === InternalUserRoles.owner)
      if (currentOwnerIndex > -1) {
        memberList[currentOwnerIndex].teamRole = InternalUserRoles.member
      }
      memberList[updatedUserIndex].teamRole = InternalUserRoles.owner
    } else if (oldUserRole?.path === InternalUserRoles.coOwner && newUserRole?.path === InternalUserRoles.member && newUserRole?.id !== oldUserRole?.id && updatedUserIndex > -1) {
      memberList[updatedUserIndex].teamRole = InternalUserRoles.member
    }
    if (props.onUpdateRole) {
      props.onUpdateRole(memberList, TeamFormAction.updatedMember)
    }
    setUpdateWatcherRole(false)
  }

  function handleUpdateNewOwner (newOwner: TeamMember) {
    if (deleteMember) {
      let updatedUserList = userList.filter(user => user?.userName !== deleteMember?.userName)
      const ownerIndex = updatedUserList.findIndex(user => user?.userName === newOwner?.userName)
      if (ownerIndex > -1) {
        updatedUserList[ownerIndex].teamRole = InternalUserRoles.owner
      } else {
        updatedUserList = [newOwner, ...updatedUserList]
      }
      if (props.onDelete) {
        props.onDelete(updatedUserList, TeamFormAction.deletedMembers)
      }
    } else if (updateMember) {
      let memberList = updateOwnerRole(newUserRole?.path)
      const userIndex = memberList.findIndex(user => user?.userName === newOwner?.userName)
      if (userIndex > -1) {
        memberList[userIndex].teamRole = InternalUserRoles.owner
      } else {
        memberList = [newOwner, ...memberList]
      }
      if (props.onUpdateRole) {
        props.onUpdateRole(memberList, TeamFormAction.updatedMember)
      }
    }
  }

  function getDisplayMessageOnRoleChange (newrole: Option, oldRole: Option) {
    if (oldRole?.path === InternalUserRoles.member && newrole?.path === InternalUserRoles.coOwner && newrole?.id !== oldRole?.id && !props.isRunnerApp) {
      return <span>
        <Trans t={t} i18nKey="--memberToDeputyOwner--" values={{ DeputyOwner: `Deputy Owner` }}>
        {`By assigning `}
        <span className={style.highlight}>
          {`Deputy Owner`}
        </span>
        {` role, individual can edit details of the measure but won’t receive email notifications on updates.`}
      </Trans>
      </span>
    } else if (oldRole?.path === InternalUserRoles.member && newrole?.path === InternalUserRoles.coOwner && newrole?.id !== oldRole?.id && props.isRunnerApp) {
      return <span>
        <Trans t={t} i18nKey="--watcherToCoOwner--" values={{ coOwner: `Co-Owner` }}>
        {`By assigning `}
        <span className={style.highlight}>
          {`Co-Owner`}
        </span>
        {` role, individual can edit the request and receive notifications on request updates.`}
      </Trans>
      </span>
    } else if ((oldRole?.path === InternalUserRoles.member || oldRole?.path === InternalUserRoles.coOwner) && newrole?.path === InternalUserRoles.owner && newrole?.id !== oldRole?.id) {
      return <span>
        <Trans t={t} i18nKey="--memberToOwner--" values={{ Owner: 'Owner', Member: 'Member' }}>
            {`This action will replace the existing `}
            <span className={style.highlight}>
              {'Owner'}
            </span>
            {` assign them as `}
            <span className={style.highlight}>
              {'Member'}
            </span>
            {`, directing all measure notifications to the new owner`}
          </Trans>
      </span>
    } else if (oldRole?.path === InternalUserRoles.coOwner && newrole?.path === InternalUserRoles.member && newrole?.id !== oldRole?.id && !props.isRunnerApp) {
      return <span>
        <Trans t={t} i18nKey="--deputyOwnerToMember--" values={{ DeputyOwner: `Deputy Owner`, Member: 'Member'}}>
            {`This action will replace the `}
            <span className={style.highlight}>
            {`Deputy Owner`}
            </span>
            {` and assign them as `}
            <span className={style.highlight}>
              {'Member'}
            </span>
          </Trans>
      </span>
    } else if (oldRole?.path === InternalUserRoles.coOwner && newrole?.path === InternalUserRoles.member && newrole?.id !== oldRole?.id && props.isRunnerApp) {
      return <span>
        <Trans t={t} i18nKey="--coOwnerToWatcher--" values={{ coOwner: `Co-Owner`, Watcher: 'Watcher' }}>
            {`This action will replace the `}
            <span className={style.highlight}>
            {`Co-Owner`}
            </span>
            {` and assign them as `}
            <span className={style.highlight}>
              {'Watcher'}
            </span>
          </Trans>
      </span>
    }
  }

  function getDisplayTitleOnRoleChange (newrole: Option, oldRole: Option) {
    if (oldRole.path === InternalUserRoles.member && newrole.path === InternalUserRoles.coOwner && newrole.id !== oldRole.id) {
      return t("--changeRole--", 'Change Role?')
    } else if (oldRole.path === InternalUserRoles.coOwner && newrole.path === InternalUserRoles.member && newrole.id !== oldRole.id) {
      return t("--changeRole--", 'Change Role?')
    } else if ((oldRole.path === InternalUserRoles.member || oldRole.path === InternalUserRoles.coOwner) && newrole.path === InternalUserRoles.owner && newrole.id !== oldRole.id) {
      return t("--reassignOwnership--", 'Re-assign Ownership?')
    }
    return ''
  }

  useEffect(() => {
    if (updateWatcherRole) {
      updateRoleForUser()
    }
  }, [updateWatcherRole])

  function isMultipleOwnerExist (member: TeamMember): boolean {
    const ownerList = userList.filter(user => user.teamRole === InternalUserRoles.owner && user.userName !== member.userName)
    return ownerList.length > 0
  }

  function handleRoleUpdate (newrole: Option, oldRole: Option, updateMember: TeamMember) {
    if (newrole.path !== oldRole.path) {
      const message = getDisplayMessageOnRoleChange(newrole, oldRole)
      const title = getDisplayTitleOnRoleChange(newrole, oldRole)
      setNewUserRole(newrole)
      setOldUserRole(oldRole)
      setUpdateMember(updateMember)
      if (oldRole.path === InternalUserRoles.owner) {
        setRemoveOwner(true)
      } if (props.isRunnerApp && oldRole.path === InternalUserRoles.coOwner && newrole.path === InternalUserRoles.member && newrole.id !== oldRole.id) {
        setUpdateWatcherRole(true)
      } else {
        setRoleUpdatedMessage(message)
        setRoleUpdatedTitle(title)
        setShowUpdateRoleConfirmation(true)
      }
    }
  }

  function onDelete (member: TeamMember, currentUserRole?: Option) {
    setDeleteMember(member)
    setDeleteUserRole(currentUserRole)

    if (member.teamRole === InternalUserRoles.owner && !isMultipleOwnerExist(member)) {
      setRemoveOwner(true)
    } else {
      setShowDeleteConfirmation(true)
    }
  }


  return (
    <div className={style.userList}>
    <TableContainer component={Paper} className={style.userTable}>
      <Table aria-label="internal-user-table" className={style.table}>
        <TableHead>
          <TableRow className={style.th}>
            <TableCell className={style.cell}>{t("--name--", "NAME")}</TableCell>
            <TableCell className={style.cell}>{t("--email--", "EMAIL")}</TableCell>
            <TableCell className={classnames(style.cell, style.role)}>{t("--role--", "ROLE")}</TableCell>
            <TableCell className={style.action}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {userList && userList.map((row, index) => (
          <UserRow
            index={index}
            member={row}
            onDelete={onDelete}
            hasEditPermission={props.hasEditPermission}
            onRoleUpdate={handleRoleUpdate}
            key={`userRole_${index}`}
            isRunnerApp={props.isRunnerApp}
          />
        ))}

          </TableBody>
        </Table>
      </TableContainer>
      {deleteMember && <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title={`${t("--remove--", "Remove")} ${(deleteUserRole?.displayName || '')?.toLowerCase()}`}
        description={<span>
          <Trans t={t} i18nKey="--removingUser--" values={{ role: deleteUserRole.displayName.toLowerCase() }}>
        {`You are removing the `}
        <span className={style.highlight}>
            {deleteUserRole.displayName.toLowerCase()}
        </span>
        {` from the list. Please confirm to proceed.`}
      </Trans>
      </span>}
        primaryButton={t("--remove--", "Remove")}
        secondaryButton={t("--cancel--", "Cancel")}
        actionType="danger"
        isSeperatorNeeded
        isPeopleTab
        radius={2}
        toggleModal={() => {setShowDeleteConfirmation(false); setDeleteMember(null)}}
        onPrimaryButtonClick={deleteUserFromModalList}
        onSecondaryButtonClick={() => setShowDeleteConfirmation(false)}
      />}
      <ConfirmationDialog
        isOpen={showUpdateRoleConfirmation}
        title={roleUpdatedTitle}
        description={roleUpdatedMessage}
        primaryButton={t("--confirm--", "Confirm")}
        secondaryButton={t("--cancel--", "Cancel")}
        actionType="warning"
        isCurrencyUpdateModal
        width={460}
        radius={2}
        isPeopleTab
        toggleModal={() => setShowUpdateRoleConfirmation(false)}
        onPrimaryButtonClick={updateRoleForUser}
        onSecondaryButtonClick={() => setShowUpdateRoleConfirmation(false)}
      />
      {userList && <AddNewOwner
        isOpen={removeOwner}
        team={userList}
        isUserNotExistInPgm={props.isUserNotExistInPgm}
        onUserSearch={props.onUserSearch}
        onUpdateOwner={handleUpdateNewOwner}
        toggleModal={() => {setRemoveOwner(false); setDeleteMember(null); setShowUpdateRoleConfirmation(false)}}
        onUserChanges={props.onUserChanges}
      />}
    </div>
  )
}

interface UserListProps {
  value: TeamMember[] | Contact[]
  forceValidate?: boolean
  readOnly?: boolean
  onChange?: (value: TeamMember[] | Contact[]) => void
}

export function UserList (props: UserListProps) {
  const [userList, setUserList] = useState<Array<TeamMember | Contact>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    const list = props.value || []
    setUserList(list)
  }, [props.value])

  function handleChange (value: TeamMember[]) {
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function handleUserChange (index: number, data: TeamMember | Contact) {
    const userListCopy = [ ...userList ]
    userListCopy[index] = data
    setUserList(userListCopy)
    handleChange(userListCopy as TeamMember[])
  }

  function deleteUser (index: number) {
    const userListCopy = [ ...userList ]
    userListCopy.splice(index, 1)
    setUserList(userListCopy)
    handleChange(userListCopy as TeamMember[])
  }

  return (
    <div className={classnames(styles.userList, {[styles.readOnly]: props.readOnly})}>
      { userList && userList.map((user, i) =>
        <UserItem
          data={user}
          readOnly={props.readOnly}
          onChange={(data) => handleUserChange(i, data)}
          onDelete={() => deleteUser(i)}
          key={i}
        />)}
    </div>
  )
}
