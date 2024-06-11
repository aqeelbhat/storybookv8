import React from 'react'
import { YesNoToggle } from '../Inputs'

import styles from './compliance-form-styles.module.scss'

export function ComplianceForm () {
  return (
    <div className={styles.complianceForm}>
      <label className={styles.complianceFormTitle}>COMPLIANCE QUESTIONS</label>
      <p className={styles.complianceFormDesc}>
        All technology & data purchases need IT review to ensure that safe,
        compliant appropriate use of solutions by employees.
      </p>

      <div className={styles.complianceFormSection}>
        <label>Data privacy</label>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>1.</span>
            <p>
              Will the use of this software or data include access to information identifying an individual person?
              <span className={styles.eg}> (e.g. Name, Address, Email, Phone Number, any data that can identify an individual)</span>
            </p>
          </div>
          <YesNoToggle />
        </div>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>2.</span>
            <p>
              Is the data being used in this project going to / coming from the European Union? 
            </p>
          </div>
          <YesNoToggle />
        </div>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>3.</span>
            <p>
            Is the data being used in this project going to / coming from California? 
            </p>
          </div>
          <YesNoToggle />
        </div>
        
      </div>

      <div className={styles.complianceFormSection}>
        <label>INTELLECTUAL PROPERTY</label>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>1.</span>
            <p>
            Will the supplier create intellectual property and by-products for this project which Optimizely needs to own?
              <span className={styles.eg}>(e.g Content, design, graphic, art work, infographic, software, survey or research reports)</span>
            </p>
          </div>
          <YesNoToggle />
        </div>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>2.</span>
            <p>
            Will this supplier be given access to Optimizely’s intellectual property, or proprietary data to deliver this project? 
            </p>
          </div>
          <YesNoToggle />
        </div>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>3.</span>
            <p>
            Are you OK with the supplier referencing Optimizely by name as a client, using the Optimizely logo in customer references, websites or events? 
            </p>
          </div>
          <YesNoToggle />
        </div>

      </div>

      <div className={styles.complianceFormSection}>
        <label>IT DATA SECURITY</label>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>1.</span>
            <p>
              Will the use of this product need access to Optimizely sensitive company data?
              <span className={styles.eg}>(e.g. Customer details, Finance data or Employee data)</span>
            </p>
          </div>
          <YesNoToggle />
        </div>

        <div className={styles.complianceFormSectionQues}>
          <div className={styles.complianceFormSectionQuesPara}>
            <span className={styles.complianceFormSectionQuesParaNum}>2.</span>
            <p>
              Will this product integrate with or access data from business-critical systems at Optimizely?
              <span className={styles.eg}>(e.g. Salesforce, Marketo, Gainsight, Netsuite, SuccessFactors)</span>
            </p>
          </div>
          <YesNoToggle />
        </div>

      </div>

    </div>
  )
}