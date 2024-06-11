import React from "react"
import styles from './styles.module.scss'
import classNames from "classnames";

//TODO
// const StatusMap = {
//   "Draft": "draft",
//   "In Approval": "inApproval",
//   "Approved": "approved",
//   "Pending Receipt": "pendingReceipt",
//   "Partially Received": "partiallyReceived",
//   "Pending Bill": "pendingBill",
//   "Closed": "closed"
// }
// function getStatusClass (status: string) {
//   return StatusMap[status] || ''
// }

function PurchaseOrderStatus (props: { status: string }) {
  return props.status ?
    <span className={classNames(styles.status, styles[`${props.status}`])}>{props.status}</span>
    : null
}
export default PurchaseOrderStatus