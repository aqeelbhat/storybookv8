/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import styles from './stc.module.scss'
import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'

export function Address () {
  return (
    <span>ORO LABS Inc., 2100 Geng Rd, Suite 210-#118, Palo Alto, CA 94303</span>
  )
}

export function EnSTC (props: {
  showLanguageToggle: boolean
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro Labs, Inc. Supplier Terms
      and Conditions</b></p>

      <p className={styles.subtitle}><b>Effective
      date: {getLocalDateString((new Date()).toString(), 'en')}</b></p>

      <p><span>These Supplier Terms and Conditions govern your access
      and use of the services (the “<b>Services</b>”), owned or controlled by Oro
      Labs, Inc., a Delaware corporation (“<b>Oro Labs</b>”). BY USING THE SERVICES,
      OR BY OTHERWISE ACCEPTING THESE TERMS BY ACCESSING THIS WEBSITE, CLICKING “<span>CONTINUE</span>”, YOU (“<b>SUPPLIER”)</b> ARE
      AGREEING TO BE BOUND AND ABIDE BY THESE SUPPLIER TERMS AND CONDITIONS. IF YOU
      DO NOT WANT TO AGREE TO THESE TERMS AND CONDITIONS, YOU MUST NOT ACCESS OR USE
      THE SERVICES. If you are accepting this Agreement on behalf of a company,
      business, corporation, or other entity, you and the applicable company,
      business, corporation, or other entity each represent and warrant that you have
      the authority to bind such entity to this Agreement, in which case the terms “<b>you</b>”
      or “<b>Supplier</b>” will refer to such entity. Oro Labs and Supplier are each
      referred to herein as a “<b>Party</b>” and together as the “<b>Parties</b>.”</span></p>

      <p><span>The Services include access to Oro Labs’ platform to
      facilitate the </span><span>submission and management
      of procurement materials between Supplier and one or more customers of Oro Labs
      (each, a “<b>Customer</b>”) in order to participate in procurement activities
      by Supplier to</span><span> such Customer.  Each Customer
      you interact with via the Services may require you to agree to additional terms
      in connection with your relationship with such Customer.  Such additional terms
      may be presented to you for acceptance via the Services.  </span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span>1. Scope of Service; Term</span></b></p>

      <p><b><span>1.1.</span></b><span>&nbsp;During
      the Term (as defined below) Oro Labs grants Supplier and its employees,
      contractors and agents (“<b>Authorized Users</b>”) a limited, non-exclusive,
      non-transferable (except in accordance with Section&nbsp;7.3) license to access
      and use the Services for Supplier’s own internal business purposes in
      accordance with the terms of this Agreement. Oro Labs reserves all rights not
      expressly granted in and to the Services.</span></p>

      <p><b><span
      >1.2.</span></b><span>&nbsp;The
      Services are currently made available to Supplier for free, but Oro Labs
      reserves the right to charge for certain or all Services in the Future.  Oro
      Labs will notify you before any Services you are then using begin carrying a
      fee, and if you wish to continue using such Services, you must pay all
      applicable fees for such Services.</span></p>

      <p><b><span
      >1.3.</span></b><span>&nbsp;As a
      condition of Supplier’s use of and access to the Services, Supplier agrees not
      to use the Services for any unlawful purpose or in any way that violates this
      Agreement. Any use of the Services in violation of this Agreement may result
      in, among other things, termination or suspension of Supplier’s account and
      ability to use the Services. Supplier may not engage in any of the following
      prohibited activities: (a) directly or indirectly, reverse engineer, decompile,
      disassemble, separate or otherwise attempt to discover or derive the source
      code, object code or underlying structure, ideas, know-how or algorithms
      relevant to the Services or any software, documentation or data related to the
      Services (“<b>Software</b>”); (b) copy, distribute, convey, or disclose any
      part of the Services in any medium, including without limitation by any
      automated or non-automated “scraping”; (c) collect or harvest any personally
      identifiable information (“PII&quot;), including account names, from the
      Services; (d) modify, adapt, translate, or create derivative works based on the
      Services or the Software; (e) transfer, sell, lease, syndicate, subsyndicate,
      lend, or use the Services or any Software for cobranding, timesharing or
      service bureau purposes or otherwise for the benefit of a third party; (f) use
      any automated system, including without limitation “robots,” “spiders,”
      “offline readers,” etc., to access the Services, or access any content or
      features of the Services through any technology or means other than those
      provided or authorized by the Services; (g) transmit spam, chain letters, or
      other unsolicited email; (h)&nbsp;intentionally or knowingly engage in any
      activity that interferes with or disrupts the Services or servers or networks
      connected to the Services; (i) remove, deface, obscure, or alter any proprietary
      notices or labels; (j) intentionally or knowingly use the Services in any
      manner in violation of any applicable laws or regulations;&nbsp;(k) attempt to
      interfere with, compromise the system integrity or security, or decipher any
      transmissions to or from the servers running the Services; upload invalid data,
      viruses, worms, or other software agents through the Services; bypass the
      measures Oro Labs may use to prevent or restrict access to the Services,
      including without limitation features that prevent or restrict use or copying
      of any content or features or enforce limitations on use of the Services or the
      content or features therein; (l) impersonate another person or otherwise
      misrepresenting Supplier’s affiliation with a person or entity, conducting
      fraud, hiding or attempting to hide Supplier’s identity; or (m) access,
      distribute, or use for any commercial purposes any part of the Services or any
      services or materials available through the Services.</span></p>

      <p><b><span
      >1.4.</span></b><span>&nbsp;The “<b>Term</b>”
      of Supplier’s use of the Services shall be for so long as Supplier continues to
      have a commercial relationship with any Customer that requires use or access to
      the Services unless Oro Labs earlier terminates Supplier’s access to the
      Services for any reason. </span></p>

      <p><b><span
      >1.5.</span></b><span>&nbsp;Upon the
      termination or expiration of this Agreement, all rights and licenses granted by
      Oro Labs to Supplier shall immediately cease (except as set forth in this
      Section&nbsp;1.5).  Upon Supplier’s request, Oro Labs will use reasonable
      efforts to delete Supplier Data (defined below) provided by Supplier to the
      Services; provided, however, Oro Labs may retain copies of Supplier Data: (i)
      provided independently by Oro Labs Customers; (ii) as necessary in order to
      comply with applicable law, regulation or professional standards; (iii) on
      servers or back-up sources if such Supplier Data is deleted from local hard
      drives and no attempt is made to recover such Supplier Data from such servers
      or back-up sources, and/or (iv) as otherwise set forth in Section 3.5.</span></p>

      <p><b><span
      >1.6.&nbsp;</span></b><span>Supplier
      is entirely responsible for maintaining the confidentiality of its password and
      account. Furthermore, Supplier is entirely responsible for any and all
      activities that occur under its account. Supplier agrees to notify Oro Labs
      immediately of any known or suspected unauthorized use of its username and
      password or any other breach of security. Supplier, and not Oro Labs, will be
      liable for any loss that Supplier, Oro Labs and any other party may incur as a
      result of someone else using Supplier’s username, password, or account, only in
      the event and to the extent that such use is either permitted by Supplier or is
      a result of Supplier’s failure to maintain the confidentiality of Supplier’s
      password and account information. Supplier may not use anyone else’s account at
      any time, without the written permission of the account holder. Supplier’s
      account is unique to Supplier and may not be transferred to any third party.</span></p>

      <p><b><span
      >1.7.&nbsp;</span></b><span>The
      Services may be modified by Oro Labs at its discretion from time to time. Oro
      Labs: (a) reserves the right to withdraw or amend the Services in its sole
      discretion without notice; and (b) will not be liable if, for any reason, all
      or any part of the Services are unavailable at any time or for any period.<b>&nbsp;</b></span></p>

      <p><b><span
      >1.8.&nbsp;</span></b><span>Supplier
      shall be responsible for obtaining and maintaining any equipment and ancillary
      services needed to connect to, access or otherwise use the Services, including,
      without limitation, modems, hardware, servers, software, operating systems,
      networking, web servers and the like.</span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span>2. Account Registration</span></b></p>

      <p><b><span
      >2.1.&nbsp;</span></b><span>Prior to
      using the Services, Supplier must complete the account registration process by
      providing Oro Labs with current, complete, and accurate information as prompted
      by the applicable registration form. Each Authorized User shall register only
      once using a single username and Supplier will ensure that no Authorized User
      will (a) register on behalf of another person; (b) register under the name of
      another person or under a fictional name or alias; (c) choose a username that
      constitutes or suggests an impersonation of any other person (real or
      fictitious) or entity or that an Authorized User is a representative of an
      entity when it is not, or that is offensive; or (d) choose a username for the
      purposes of deceiving or misleading users and/or Oro Labs as to an Authorized
      User’s true identity. Authorized User agree to maintain and update any account
      registration information to keep it true, accurate, current and complete. If
      any information provided by Authorized User is untrue, inaccurate, not current,
      incomplete, or otherwise violates the restrictions as set forth above, Oro Labs
      has the right to terminate Authorized User’s account and refuse any and all
      current or future use of the Services.&nbsp;</span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span
      >3. Content; Feedback</span></b></p>

      <p><b><span
      >3.1&nbsp;</span></b><span>Any
      information or content uploaded, shared, stored, provided or transferred
      through the Services by Authorized Users is Supplier’s “Content”, including profile
      information, transaction and other data You send to the Services, promotional information,
      transaction data/details, customer lists, data You maintain about Your
      customers and suppliers, personal data, marketing information or related
      information.<b> </b>Some Content may be viewable by other users. You are solely
      responsible for all Content you contribute to the Services. You represent that
      all Content submitted by you are accurate, complete, up-to-date, and in
      compliance with all applicable laws, rules and regulations. You agree that you
      will not post, upload, share, store, or otherwise provide through the Services
      any User Submissions that: (i) infringe any third party&apos;s copyrights or other
      rights (e.g., trademark, privacy rights, etc.); (ii) contain sexually explicit
      content or pornography; (iii) contain hateful, defamatory, or discriminatory
      content or incite hatred against any individual or group; (iv) exploit minors;
      (v) depict unlawful acts or extreme violence; (vi) depict animal cruelty or
      extreme violence towards animals; (vii) promote fraudulent schemes, multi-level
      marketing (MLM) schemes, get rich quick schemes, online gaming and gambling,
      cash gifting, work from home businesses, or any other dubious money-making
      ventures; or (viii) that violate any law.</span></p>

      <p><b><span
      >3.2.&nbsp;</span></b><span>&nbsp;For
      all Content, Supplier hereby grants Oro Labs a license to display, perform,
      translate, modify (for technical purposes, for example, making sure Content is
      viewable on a mobile device), distribute, retain, reproduce and otherwise act
      with respect to such Content (collectively, “<b>Use</b>”), in each case to
      enable Oro Labs to provide the Services, which includes providing Content to
      Customers with whom Supplier has decided to share or publish such Content.</span></p>

      <p><b><span
      > 3.3.&nbsp;</span></b><span>Oro
      Labs’ use of Content will be subject to the Data Processing Addendum,
      incorporated into this Agreement. The Data Processing Addendum shall control,
      as applicable, if there is a conflict between it and the Privacy Policy or this
      Agreement. You may contact Oro Labs for a signed copy of the Data Processing Addendum
      exhibit if necessary, for your local law compliance.</span></p>

      <p><b><span
      >3.4 </span></b><span>Supplier is
      responsible for all Content uploaded, posted or stored through Supplier’s use
      of the Services. Oro Labs is not responsible for any lost or unrecoverable
      Content other than as a result of Oro Labs’ gross negligence or willful
      misconduct. Although Oro Labs has no obligation to monitor the Content or Supplier’s
      use of the Services, Oro Labs may, in its sole discretion, remove any Content,
      in whole or in part, or prohibit any use of the Services alleged to be
      unacceptable, undesirable, inappropriate, or in violation of this Agreement.</span></p>

      <p><b><span
      >3.5.&nbsp;</span></b><span>Supplier</span><span
      > may request that Oro Labs delete Supplier Data as set
      forth in Section 1.5. However, Supplier specifically acknowledges and agrees
      that, to the extent that Content has previously been provided to, or copied or
      stored by other users (including, for example, Customers), such Content may be
      retained by Oro Labs for the purpose of continuing to provide access to such
      Content to such users (and the licenses set forth herein will continue for so
      long as such access is provided).</span></p>

      <p><b><span
      >3.6.&nbsp;</span></b><span>From
      time to time, Oro Labs may provide opportunities for users to voluntarily
      submit feedback and ideas for improvements related to the Services. Supplier
      agrees that (a) its feedback and expression of its ideas and/or improvements
      will automatically become the property of and owned by Oro Labs; (b) Oro Labs
      may use or redistribute Supplier’s feedback and its contents for any purpose
      and in any way and without any restrictions, except that Oro Labs agrees to
      keep the name of the Supplier associated with such feedback confidential; (c)
      there is no obligation for Oro Labs to review any feedback; (d) there is no
      obligation to keep any feedback confidential; and (e) Oro Labs shall have no
      obligation to Supplier or contract with Supplier, implied or otherwise. By
      providing feedback or ideas, Supplier acknowledges and agrees that Oro Labs and
      its designees may create on its own or obtain many submissions that may be
      similar or identical to the feedback or ideas that Supplier submits through the
      Services or other channels and means. Supplier hereby waives any and all claims
      it may have had, may have, and/or may have in the future, that the submissions
      accepted, reviewed and/or used by Oro Labs and its designees may be similar to Supplier’s
      feedback or ideas.</span></p>

      <p><b><span
      >&nbsp;</span></b></p>

      <p className={styles.subtitle}><b><span
      >4. Confidentiality; Proprietary Rights</span></b></p>

      <p><b><span
      >4.1.&nbsp;</span></b><span>Each
      Party (the “<b>Receiving Party</b>”) understands that the other Party (the “<b>Disclosing
      Party</b>”) has disclosed or may disclose business, technical or financial
      information relating to the Disclosing Party’s business (hereinafter referred
      to as “<b>Proprietary Information</b>” of the Disclosing Party). Proprietary
      Information of Oro Labs includes non-public information regarding features,
      functionality and performance of the Services.&nbsp; Proprietary Information of
      each Supplier includes non-public data about that Supplier provided by that Supplier
      to Oro Labs (“<b>Supplier Data</b>”), Content, and any data or information
      derived from Supplier’s use of the Services. For the avoidance of doubt, Supplier
      Data does not include Aggregate Data (as defined below) or any data,
      information or content uploaded by third parties other than Supplier. The
      Receiving Party agrees to take reasonable precautions to protect such
      Proprietary Information, and, except to use or perform the Services or as
      otherwise permitted herein, not to use or divulge to any third person any such
      Proprietary Information; provided, however, the Receiving Party may disclose
      Proprietary Information to its contractors and/or agents who have a legitimate
      need to know the Proprietary Information and who are bound by obligations of
      confidentiality at least as stringent as those contained herein. The Disclosing
      Party agrees that the foregoing shall not apply with respect to any information
      after five (5) years following the disclosure thereof, or any information that
      the Receiving Party can document (a)&nbsp;is or becomes generally available to
      the public through no action of the Receiving Party in violation of this
      Agreement, (b)&nbsp;was in its possession or known by it prior to receipt from
      the Disclosing Party, (c)&nbsp;was rightfully disclosed to it without
      restriction by a third party, or (d)&nbsp;was independently developed without
      use of any Proprietary Information of the Disclosing Party.</span></p>

      <p><b><span
      >4.2.&nbsp;</span></b><span>The
      Parties hereby acknowledge and agree that any breach of or default of a Party’s
      obligations of confidentiality under this Agreement shall cause damage to the
      other Party in an amount that is difficult to ascertain. &nbsp;Accordingly, in
      addition to any other relief to which a Party may be entitled, the
      non-defaulting Party shall be entitled, without proof of actual damages, to
      seek any injunctive relief ordered by any court of competent jurisdiction
      including, but not limited to, an injunction restraining any violation of the
      defaulting Party’s obligations of confidentiality hereunder.</span></p>

      <p><b><span
      >4.3.</span></b><span>&nbsp;If the
      Receiving Party or any of its representatives is compelled by applicable law to
      disclose any Proprietary Information then, to the extent permitted by
      applicable law, the Receiving Party shall: (a) promptly, and prior to such
      disclosure, notify the Disclosing Party in writing of such requirement so that
      the Disclosing Party can seek a protective order or other remedy, or waive its
      right to confidentiality pursuant to the terms of this Agreement; and (b)
      provide reasonable assistance to the Disclosing Party, at the Disclosing
      Party’s sole cost and expense, in opposing such disclosure or seeking a
      protective order or other limitations on disclosure. If the Disclosing Party
      waives compliance or, after providing the notice and assistance required under
      this Section 4.3, the Receiving Party remains required by law to disclose any
      Proprietary Information, the Receiving Party shall disclose only that portion
      of the Proprietary Information that, on the advice of the Receiving Party’s
      legal counsel, the Receiving Party is legally required to disclose and, upon
      the Disclosing Party’s request, shall use commercially reasonable efforts to
      obtain assurances from the applicable court or other presiding authority that
      such Proprietary Information will be afforded confidential treatment. No such
      compelled disclosure by the Receiving Party will otherwise affect the Receiving
      Party’s obligations hereunder with respect to the Proprietary Information so disclosed.</span></p>

      <p><b><span
      >4.4.&nbsp;</span></b><span>Supplier
      shall own and retain all right, title and interest in and to its Proprietary
      Information, including the designs, trademarks, service marks, and logos of Supplier.
      Oro Labs shall own and retain all right, title and interest in and to its
      Proprietary Information, including (a) the Services and Software, and all
      improvements, enhancements or modifications thereto, (b) any software,
      applications, inventions or other technology developed in connection with the
      Implementation Services or support, (c) all intellectual property rights
      related to any of the foregoing, and (d) the designs, trademarks, service
      marks, and logos of Oro Labs and the Services, whether owned by or licensed to Oro
      Labs.&nbsp;&nbsp;</span></p>

      <p><b><span
      >4.5.&nbsp;</span></b><span>Notwithstanding
      anything to the contrary in this Agreement, Oro Labs shall have the right
      (during and after the Term hereof) to use data and information related to Supplier’s
      use of the Services in an aggregate and anonymized manner (“<b>Aggregate Data</b>”)
      for its internal business purposes to improve and enhance the Services, to
      compile statistical and performance information, and for other development,
      diagnostic and corrective purposes in connection with the Services and Oro
      Labs’ other offerings. Any rights not expressly granted herein are deemed withheld.</span></p>

      <p><b><span
      >4.6</span></b><span>&nbsp;In
      addition to the foregoing, with respect to Subscribers only, Oro Labs will (i)
      maintain commercially reasonable and appropriate technical and organizational
      measures designed to secure Supplier Data against unauthorized and unlawful
      loss, access or disclosure, (ii) maintain physical, electronic and procedural
      safeguards in compliance with applicable privacy laws, including, but not
      limited to: (a) the maintenance of appropriate safeguards to restrict access to
      Supplier Data to the employees, agents, licensors or service providers of Oro
      Labs who need that information to carry out Oro Labs’ obligations under this
      Agreement; (b) procedures and practices for safe transmission or transportation
      of the Supplier Data; and (c) the maintenance of appropriate safeguards to
      prevent the unauthorized access of the Supplier Data.</span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span
      >5. Warranty and Disclaimer</span></b></p>

      <p><b><span
      >5.1.&nbsp;</span></b><span>Each
      Party hereby represents, covenants, and warrants that: (a) it shall be in
      compliance with all applicable laws and regulations during the Term in the
      performance of this Agreement; (b) it has the full right, power, and authority
      to enter into this Agreement; (c) the performance of its obligations under this
      Agreement do not and will not violate any other agreement to which it is a
      party; and (d) this Agreement constitutes a legal, valid, and binding
      obligation when agreed to.&nbsp;Supplier further represents and warrants that
      it owns or has the necessary licenses, rights, consents, and permissions to
      publish and submit the Content and Supplier Data. Supplier further agrees that
      the Content and Supplier Data it submits to the Services will not contain third
      party copyrighted material, or material that is subject to other third-party
      proprietary rights, unless Supplier has permission from the rightful owner of
      the material or Supplier is otherwise legally entitled to post the material and
      to grant Company all of the license rights granted herein.</span></p>

      <p><b><span
      >5.2.&nbsp;</span></b><span>Supplier
      acknowledges that the Services are controlled and operated by Oro Labs from the
      United States. If the Customer that wishes to procure services from Supplier is
      located outside of the United States, Content, including personal information,
      provided by Supplier will be processed in the datacenter closest to the
      Customer’s location, which may be in a different country than where Supplier is
      located. Oro Labs does not represent or warrant that the Services, or any part
      thereof, are appropriate or available for use in any particular jurisdiction. Supplier
      and its authorized users are subject to United States export controls in
      connection with the use of the Services and/or services related thereto and are
      responsible for any violations of such controls, including, without limitation,
      any United States embargoes or other federal rules and regulations restricting
      exports.</span></p>

      <p><b><span
      >5.3.&nbsp;</span></b><span>EXCEPT
      FOR THE EXPRESS WARRANTIES SET FORTH IN SECTION 5.1, THE SERVICES ARE PROVIDED
      “AS IS.” ORO LABS SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND TITLE. WITHOUT LIMITING
      THE FOREGOING, ORO LABS MAKES NO WARRANTY OF ANY KIND THAT THE SERVICES, ANY
      THIRD-PARTY PRODUCT, THIRD-PARTY CONTENT, OR ANY RESULTS OF THE USE OF THE
      SERVICES, WILL MEET SUPPLIER’S OR ANY OTHER PERSON’S REQUIREMENTS, OPERATE
      WITHOUT INTERRUPTION, ACHIEVE ANY INTENDED RESULT, BE COMPATIBLE OR WORK WITH
      ANY SOFTWARE, SYSTEM, OR OTHER SERVICES, BE SECURE, ACCURATE, COMPLETE, FREE OF
      HARMFUL CODE, OR ERROR-FREE.&nbsp;</span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span
      >6. Limitation of Liability</span></b></p>

      <p><b><span
      >6.1.&nbsp;</span></b><span>EXCEPT
      FOR A BREACH OF SECTION 1.3, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
      IN NO EVENT WILL EITHER PARTY BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT,
      EXEMPLARY OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION,
      DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS
      INFORMATION, REVENUES, ANTICIPATED SALES OR SAVINGS, OR ANY OTHER PECUNIARY
      LOSS), ARISING OUT OF OR IN ANY WAY RELATED TO THIS AGREEMENT, THE SERVICES,
      THIRD-PARTY PRODUCTS, THIRD-PARTY SITES, OR THIRD-PARTY CONTENT MADE AVAILABLE
      THROUGH THE SERVICES, WHETHER ARISING IN TORT (INCLUDING NEGLIGENCE) CONTRACT
      OR ANY OTHER LEGAL THEORY, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE
      POSSIBILITY OF SUCH DAMAGES.&nbsp;<b>&nbsp;</b></span></p>

      <p><b><span
      >6.2.&nbsp;</span></b><span>EXCEPT
      FOR A BREACH OF SECTION 1.3, IN NO EVENT WILL THE COLLECTIVE AGGREGATE
      LIABILITY OF EITHER PARTY OR ITS AFFILIATES ARISING OUT OF OR IN ANY WAY
      RELATED TO THIS AGREEMENT, THE SERVICES, THIRD-PARTY PRODUCTS, THIRD-PARTY
      SITES, OR THIRD-PARTY CONTENT MADE AVAILABLE THROUGH THE SERVICES, WHETHER
      ARISING UNDER OR RELATED TO BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
      STRICT LIABILITY, OR ANY OTHER LEGAL OR EQUITABLE THEORY, EXCEED THE GREATER OF
      (I) ONE HUNDRED DOLLARS ($100) AND (II) THE TOTAL AMOUNTS PAID (AND ANY AMOUNTS
      ACCRUED BUT NOT YET PAID) BY SUPPLIER TO ORO LABS IN THE 6-MONTH PERIOD
      PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</span></p>

      <p><span>&nbsp;</span></p>

      <p className={styles.subtitle}><b><span
      >7. Miscellaneous</span></b></p>

      <p><b><span
      >7.1. Survival</span></b><span>. The
      following Sections of this Agreement will survive the termination or expiration
      of this Agreement: Section 1.2, 1.3, 1.5,&nbsp; 3.4, 3.5, 4,&nbsp;5,&nbsp;6 and&nbsp;7.</span></p>

      <p><b><span
      >7.2.&nbsp;Severability</span></b><span>.
      If any provision of this Agreement is found to be unenforceable or invalid,
      that provision will be limited or eliminated to the minimum extent necessary so
      that this Agreement will otherwise remain in full force and effect and
      enforceable.&nbsp;<b>&nbsp;</b></span></p>

      <p><b><span
      >7.3.&nbsp;Assignment</span></b><span>.
      This Agreement is not assignable, transferable or sublicensable by either Party
      except with the other’s prior written consent; provided, however, that either
      Party may assign or transfer this Agreement: (a) to an affiliate where (i) the
      assignee has agreed in writing to be bound by the terms of this Agreement, (ii)
      the assigning Party remains liable for obligations under this Agreement if the
      assignee defaults on them, and (iii) the assigning Party has notified the other
      Party of the assignment, in writing; and (b) in the event of a merger, sale of
      substantially all of the stock, assets or business, or other reorganization
      involving the assigning Party, and the non-assigning Party’s prior written
      consent shall not be required in such instance with the express understanding
      that in cases where the assigning Party is not the surviving entity, this
      Agreement will bind the successor in interest to the assigning Party with
      respect to all obligations hereunder. Any other attempt to transfer or assign
      is void.</span></p>

      <p><b><span
      >7.4.&nbsp;Force Majeure</span></b><span>. In the event that either Party hereto shall be delayed, hindered, or
      prevented from the performance of any act required hereunder, other than a
      payment obligation, by reason of strikes, lock-outs, labor troubles, inability
      to procure materials or services, failure of power, riots, insurrections, war
      or other reasons of a like nature not the fault of the Party delayed in
      performing work or doing acts required under the terms of this Agreement, such
      Party shall immediately provide notice to the other Party of such delay, and performance
      of such act shall be excused for the period of the delay and the period for the
      performance of any such act shall be extended for a period equivalent to the
      period of such delay.</span></p>

      <p><b><span
      >7.5.&nbsp;Entire Agreement</span></b><span
      >. This Agreement is the complete and exclusive statement
      of the mutual understanding of the Parties&nbsp;and supersedes and cancels all
      previous written and oral agreements, communications and other understandings
      relating to the subject matter of this Agreement. All waivers and modifications
      must be in a writing signed by both Parties, except as otherwise provided
      herein.</span></p>

      <p><b><span
      >7.6.&nbsp;Modification</span></b><span>.
      Oro Labs may revise and update these Supplier Terms and Conditions from time to
      time in its sole discretion. All changes are effective immediately when made
      available on this website and will apply to all access to and use of the
      Services thereafter. However, any changes to the dispute resolution provisions
      set forth in Section 7.13 will not apply to any disputes for which the Parties
      have actual notice on or before the date the change is posted on this
      website.&nbsp; Supplier’s continued use of the Services following the posting
      of revised Terms of Service means that Supplier accepts and agrees to the
      changes. Supplier is encouraged to check this page from time to time so that Supplier
      is aware of any changes, as such changes are binding on Supplier.</span></p>

      <p><b><span
      >7.7.&nbsp;Relationship of the Parties</span></b><span
      >. No agency, partnership, joint venture, or employment is
      created as a result of this Agreement and Supplier does not have any authority
      of any kind to bind Oro Labs in any respect whatsoever.</span></p>

      <p><b><span
      >7.8.&nbsp;Third-Party Sites</span></b><span
      >. The Services may contain links to third-party
      advertisers, websites or services (“<b>Third-Party Sites</b>”). Supplier
      acknowledges and agrees that Oro Labs is not responsible or liable for: (i) the
      availability or accuracy of such Third-Party Sites, or (ii) the content,
      products, or resources on or available from such Third-Party Sites. Any Third-Party
      Sites do not imply any endorsement by Oro Labs of those websites or services.
      If Supplier decides to access any of the Third-Party Sites linked to the
      Services, Supplier does so entirety at its own risk and subject to the terms
      and conditions of use for such Third-Party Sites and acknowledges sole
      responsibility for and assumes all risk arising from its use of any such
      Third-Party Sites.</span></p>

      <p><b><span
      >7.9.&nbsp;Third-Party Products and Third-Party Content</span></b><span
      >. In connection with the Services, Supplier may have
      access to or use applications, integrations, software, services, systems, or
      other products not developed by Oro Labs (“<b>Third-Party Products</b>”), or
      data/content derived from such Third-Party Products or arising out of an
      agreement between Oro Labs and such third-party&nbsp;(collectively, “<b>Third-Party
      Content</b>”). Oro Labs cannot guarantee that such Third-Party Content will be
      free of material you may find objectionable or otherwise. Additionally, Oro
      Labs does not warrant or support Third-Party Products or Third-Party Content
      (whether or not these items are designated by Oro Labs as verified or
      integrated with the Services) and disclaims any and all responsibility and
      liability for these items and their access to or integration with the Services,
      including their modification, deletion, or disclosure. Supplier acknowledges
      and agrees that such Third-Party Products and Third-Party Content constitute
      the “confidential information” of the owner of such Third-Party Products and
      Third-Party Content, and as such, Supplier agrees to take reasonable
      precautions to protect such Third-Party Products and Third-Party Content, and
      not to use (except in connection with the Services or as otherwise permitted by
      owner in writing) or divulge to any third person any such Third-Party Products
      or Third-Party Content except to its contractors and/or agents who have a
      legitimate need to know and who are bound by obligations of confidentiality at
      least as stringent as those contained herein.</span></p>

      <p><b><span
      >7.10.&nbsp;Notices</span></b><span>.
      All notices under this Agreement will be in writing and will be deemed to have
      been duly given when received, if personally delivered; when receipt is
      electronically confirmed, if transmitted by facsimile or e-mail; the day after
      it is sent, if sent for next day delivery by recognized overnight delivery
      service; and upon receipt, if sent&nbsp;by certified or registered mail, return
      receipt requested. Any notices to Oro Labs may be sent to&nbsp;</span><span><a href="mailto:privacy@orolabs.ai"><span>privacy@orolabs.ai</span></a></span><span
      > or by mail addressed to <Address />.</span></p>

      <p><b><span
      >7.11. Governing Law</span></b><span>.
      This Agreement shall be governed by the laws of the State of Delaware without
      reference to conflict of law principles. Any dispute between the Parties
      arising out of or related to this Agreement shall be resolved exclusively by
      JAMS arbitration, which shall be held in California or another location
      mutually agreed upon, and conducted in accordance with the JAMS then in effect.
      Judgment upon the award rendered shall be final and non-appealable and may be
      entered in any court having jurisdiction. The prevailing Party shall be
      entitled to recovery of all its reasonable attorneys’ fees from the other Party
      in addition to any other award of damages.&nbsp;Both Parties waive any right to
      participate in any class action involving disputes between the Parties, and the
      Parties are each waiving the right to a trial by jury. All claims must be
      brought in the Parties’ individual capacity, and not as a plaintiff or class
      member in any purported class or representative proceeding, and, unless agreed
      otherwise by Oro Labs, the arbitrator may not consolidate more than one
      person’s claims. This class action waiver is an essential part of this
      arbitration agreement and may not be severed. If for any reason this class
      action waiver is found unenforceable, then the entire arbitration agreement
      will not apply. However, the waiver of the right to trial by jury set forth in
      this Section&nbsp;7.12 will remain in full force and effect. SUPPLIER AND ORO
      LABS AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THE SERVICES
      OR THIS AGREEMENT MUST COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION
      ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS PERMANENTLY BARRED.</span></p>

      <p><b><span
      >7.13. Copyright Policy</span></b><span>.
      Oro Labs respects the intellectual property rights of others and expects users
      of the Services to do the same. Oro Labs will respond to notices of alleged
      copyright infringement that comply with applicable law and are properly
      provided to Oro Labs’ designated copyright agent (“<b>Copyright Agent</b>”). Oro
      Labs’ designated Copyright Agent to receive notifications of claimed
      infringement is:</span></p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>
      
      {props.showLanguageToggle &&
      <p
      >View (<OroButton label='in your language' type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />).</p>}
    </div>
  )
}
