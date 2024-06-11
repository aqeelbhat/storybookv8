/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useState } from 'react'

import { EnSTC } from './EnSTC'
import { FrSTC } from './FrSTC'
import { DeSTC } from './DeSTC'
import { ItSTC } from './ItSTC'
import { PtSTC } from './PtSTC'
import { EsSTC } from './EsSTC'
import { getSessionLocale } from '../sessionStorage'

export function OroTnc () {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getSessionLocale())

  function togleLanguage () {
    if (currentLanguage === 'en') {
      setCurrentLanguage(getSessionLocale())
    } else {
      setCurrentLanguage('en')
    }

    const doc = document.getElementById("oro-tnc-wrapper")
    doc && doc.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }

  function getLocalizedTnc () {
    switch (currentLanguage) {
      case 'fr':
        return <FrSTC onToggleLanguage={togleLanguage} />
      case 'de':
        return <DeSTC onToggleLanguage={togleLanguage} />
      case 'it':
        return <ItSTC onToggleLanguage={togleLanguage} />
      case 'pt':
        return <PtSTC onToggleLanguage={togleLanguage} />
      case 'es':
        return <EsSTC onToggleLanguage={togleLanguage} />
      default:
        return <EnSTC onToggleLanguage={togleLanguage} showLanguageToggle={getSessionLocale() !== 'en'} />
    }
  }

  return (<>
    {getLocalizedTnc()}
  </>)
}
