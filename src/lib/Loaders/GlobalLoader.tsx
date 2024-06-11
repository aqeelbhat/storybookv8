import React from 'react'
import './GlobalLoader.scss'

export function GlobalLoader (props: { className?: string, isActive: boolean }) {
  return props.isActive
    ? (
      <div className={`loading-overlay-container ${props.className}`}>
        <div className="loading-overlay">
            {/* <div className="loader">Loading...</div> */}
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
      )
    : null
}
