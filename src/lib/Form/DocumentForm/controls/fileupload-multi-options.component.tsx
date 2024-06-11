import React from 'react'

import DeviceUploadIcon from './../assets/device-upload.png'
import GoogleDriveIcon from './../assets/google-drive.png'
import DropBoxIcon from './../assets/dropbox.png'
import SharePointIcon from './../assets/share-point.png'
import BoxUploadIcon from './../assets/box-upload.png'
import UrlUploadIcon from './../assets/url-upload.png'

import style from './fileupload-multi-options.module.scss'

function FileUploadMultiOptions () {
  return <div className={style.container}>
    <div>
      <span className={style.text}>Drop file here,</span>
      <span className={style.link}> Browse </span>
      <span className={style.text}>or import from</span>
    </div>
    <ul className={style.ul}>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={DeviceUploadIcon} alt="" />
        </div>
        <span className={style.circleText}>Device</span>
      </li>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={GoogleDriveIcon} alt="" />
        </div>
        <span className={style.circleText}>Google drive</span>
      </li>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={DropBoxIcon} alt="" />
        </div>
        <span className={style.circleText}>Dropbox</span>
      </li>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={SharePointIcon} alt="" />
        </div>
        <span className={style.circleText}>SharePoint</span>
      </li>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={BoxUploadIcon} alt="" />
        </div>
        <span className={style.circleText}>Box</span>
      </li>
      <li className={style.li}>
        <div className={style.circleBox}>
          <img src={UrlUploadIcon} alt="" />
        </div>
        <span className={style.circleText}>URL</span>
      </li>
    </ul>
  </div>
}

export default FileUploadMultiOptions