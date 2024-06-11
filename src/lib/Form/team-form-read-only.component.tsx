import React from 'react'

import { TeamFormData } from './types'

import './oro-form-read-only.css'
import { UserList } from './Items/user-list.component';

export function TeamFormReadOnly (props: {data: TeamFormData}) {
  return (
    <div className="oroFormReadOnly">

      <UserList
        value={props.data.users}
        readOnly={true}
      />
    </div>
  )
}
