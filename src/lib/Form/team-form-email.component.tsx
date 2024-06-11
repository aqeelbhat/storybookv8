import React from 'react'
import './email-template.css'
import { TeamFormData } from './types'
import { mapCurrencyToSymbol } from './../'
import classnames from 'classnames'
import { getUserDisplayName } from './util'

export function TeamFormEmail (props: {data: TeamFormData}) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Engagement Team</h1>

      <table className="listBox">
        <tbody>
          { props.data.users && props.data.users.map((user, i) => {
            return (
              <tr className={classnames("marginB6", "listItem", { last: (i+1) === props.data.users.length })} key={i}>
                <td colSpan={5}>
                  <table>
                    <tbody>
                      <tr className="line">
                        <td align="left" className="userProfile">
                          <div className="emailLabelValue">{ user.picture && <img src={user.picture} alt='Profile picture' />}</div>
                        </td>
                        <td align="left" className="userDetails">
                          <div className="emailLabelValue userName">{getUserDisplayName(user)}</div>
                          <div className="emailLabelValue">{ user.email }</div>
                        </td>
                        <td align="left" className="userRole">
                          <div className="emailLabelValue">{ user.teamRole }</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
