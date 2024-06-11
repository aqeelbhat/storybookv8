/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'
import { Address } from './EnSTC'
import styles from './stc.module.scss'
import React from 'react'

export function DeSTC (props: {
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro Labs, Inc.
      Lieferbedingungen und Konditionen</b></p>

      <p className={styles.subtitle}><b>Gültig ab: {getLocalDateString((new Date()).toString(), 'de')}</b></p>

      <p
      ><span>Diese Allgemeinen
      Geschäftsbedingungen für Lieferanten regeln Ihren Zugang und Ihre Nutzung der </span><span
      >Dienstleistungen (die „<b>Dienstleistungen</b>“), die im Besitz oder
      unter Kontrolle von Oro Labs, Inc. sind, einer Gesellschaft aus Delaware („<b>Oro
      Labs</b>“). DURCH DIE NUTZUNG DER DIENSTLEISTUNGEN ODER </span></p>

      <p
      ><span>DURCH DIE ANDERWEITIGE AKZEPTANZ DIESER
      BEDINGUNGEN DURCH DEN ZUGANG ZU DIESER </span></p>

      <p
      ><span>WEBSITE UND DAS KLICKEN AUF
      „WEITER“ ERKLÄREN SIE ALS („<b>LIEFERANT</b>“) SICH DAMIT </span></p>

      <p
      ><span>EINVERSTANDEN, AN DIESE
      LIEFERUNGS-BEDINGUNGEN GEBUNDEN ZU SEIN UND DIESE EINZUHALTEN. Wenn Sie diese
      Vereinbarung im Namen einer Firma, eines Unternehmens, einer
      Kapitalgesellschaft oder einer anderen juristischen Person akzeptieren,
      erklären Sie und die betreffende Firma, das Unternehmen, die
      Kapitalgesellschaft oder die andere juristische Person, dass Sie befugt sind,
      diese </span><span>juristische Person an diese Vereinbarung zu binden;
      in diesem Fall beziehen sich die Begriffe „<b>Sie</b>“ oder „<b>Lieferant</b>“
      auf diese juristische Person. Oro Labs und der Lieferant werden hier jeweils
      als „<b>Partei</b>“ und zusammen als „<b>Parteien</b>“ bezeichnet.</span><span
      > </span></p>

      <p
      ><span>Die Dienstleistungen umfassen den Zugang zur
      Plattform von Oro Labs, um die Einreichung und Verwaltung von Beschaffungsmaterialien
      zwischen dem Lieferant und einem oder mehreren Kunden </span><span>von
      Oro Labs (jeweils ein „<b>Kunde</b>“) zwecks Teilnahme an
      Beschaffungsaktivitäten des Lieferanten für </span><span>diesen Kunden
      zu erleichtern. Jeder Kunde, mit dem Sie im Rahmen der Dienste interagieren,
      kann von Ihnen verlangen, zusätzlichen Bedingungen in Verbindung mit Ihrer
      Beziehung zu diesem Kunden zuzustimmen. Solche Zusatzbedingungen können Ihnen
      zur Zustimmung über die Dienstleistungen vorgelegt werden. </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >1.<span>&nbsp; </span></span>Umfang
      der Dienstleistung; Laufzeit<span> </span></b></p>

      <p
      ><b><span>1.1. </span></b><span>Während der
      Laufzeit (wie unten definiert) gewährt Oro Labs dem Lieferant und seinen </span><span
     >Mitarbeitern, Auftragnehmern und Vertretern („<b>autorisierte Benutzer</b>“)
      eine eingeschränkte, nicht </span><span>exklusive, nicht übertragbare
      (außer in Übereinstimmung mit Abschnitt 7.3) Lizenz für den Zugriff auf </span></p>

      <p
      ><span>und die Nutzung der Dienste für die eigenen
      internen Geschäftszwecke des Lieferanten in Übereinstimmung mit den Bedingungen
      dieser Vereinbarung. Oro Labs behält sich alle nicht ausdrücklich gewährten
      Rechte in und an den Dienstleistungen vor. </span></p>

      <p
      ><b><span>1.2.</span></b><span> Die Dienste
      werden dem Lieferanten derzeit kostenlos zur Verfügung gestellt, aber Oro Labs
      behält sich das Recht vor, in Zukunft für bestimmte oder alle Dienste Gebühren
      zu erheben. Oro Labs informiert Sie, bevor die von Ihnen genutzten Dienste
      gebührenpflichtig werden, und wenn Sie diese Dienste weiterhin nutzen möchten,
      müssen Sie alle anfallenden Gebühren für diese Dienste bezahlen. </span></p>

      <p
      ><b><span>1.3</span></b><span>. Als
      Bedingung für die Nutzung der Dienste und den Zugang des Lieferanten zu den Diensten
      erklärt sich der Lieferant damit einverstanden, die Dienste nicht für
      ungesetzliche Zwecke oder in einer Weise zu nutzen, die gegen diese
      Vereinbarung verstößt. Jede Nutzung der Dienste, die gegen diese Vereinbarung
      verstößt, kann unter anderem zur Kündigung oder Sperrung des Kontos des
      Lieferanten und seiner Fähigkeit zur Nutzung der Dienste führen. Der Lieferant
      darf sich nicht an einer der folgenden verbotenen Aktivitäten beteiligen: (a)
      direkt oder indirekt den Quellcode, den Objektcode oder die zugrunde liegende
      Struktur, die Ideen, das Fachwissen oder die Algorithmen, die für die Dienste
      oder die Software, die Dokumentation oder die Daten im Zusammenhang mit den </span><span
     >Diensten („<b>Software</b>“) relevant </span><span>sind,
      abzuleiten, zu zerlegen, zu isolieren oder anderweitig zu versuchen, diese zu
      entdecken oder herzuleiten; (b) Teile der Dienste in irgendeinem Medium zu
      kopieren, zu verteilen, zu übertragen oder offenzulegen, insbesondere durch
      automatis</span><span>iertes oder nicht automatisiertes „Extrahierens,
      Kopierens, Speicherns sowie der Wiederverwendung fremder Inhalte und Daten“;
      (c) personenbezogene Daten </span></p>

      <p
      ><span>(„PII“), einschließlich Kontonamen, von den
      Diensten zu sammeln oder zu erfassen; (d) die Dienste oder </span><span
     >die Software zu verändern, anzupassen, zu übersetzen oder davon abgeleitete
      Werke zu erstellen; (e) die Dienste oder die Software zu übertragen, zu
      verkaufen, zu vermieten, zu vermitteln, zu unterteilen, zu verleihen oder für
      Kooperationsmarketing, Teilnutzungsrechte oder Servicebüro-Zwecke oder
      anderweitig zugunsten Dritter zu nutzen; (f) ein automatisiertes System,
      einschließlich, aber nicht </span><span>beschränkt auf „Roboter“,
      „Suchmaschinen“, „Offline</span><span>-</span><span>Lesegeräte“
      usw. zu verwenden, auf die Dienste </span><span>zuzugreifen oder auf
      Inhalte oder Funktionen der Dienste mit anderen Technologien oder Mitteln
      zuzugreifen, als denjenigen, die von den Diensten zur Verfügung gestellt oder
      genehmigt wurden; (g) Spam, Kettenbriefe oder andere unerwünschte E-Mails zu
      versenden; (h) absichtlich oder wissentlich Aktivitäten zu unternehmen, die die
      Dienste oder mit den Diensten verbundene Server oder Netzwerke stören oder
      unterbrechen; (i) Eigentumshinweise oder Kennzeichnungen zu entfernen, zu
      verunstalten, zu verdecken oder zu verändern; (j) die Dienste absichtlich oder
      wissentlich in einer Weise zu nutzen, die gegen geltende Gesetze oder
      Vorschriften verstößt; (k) zu versuchen, die Systemintegrität oder sicherheit
      zu beeinträchtigen oder Übertragungen zu oder von den Servern, auf denen die
      Dienste laufen, zu entschlüsseln; ungültige Daten, Viren, Würmer oder andere
      Software-Agenten über die Dienste hochzuladen; die Maßnahmen zu umgehen, die
      Oro Labs einsetzt, um den Zugang zu den Diensten zu verhindern oder
      einzuschränken, einschließlich, aber nicht beschränkt auf Funktionen, die die
      Nutzung oder das Kopieren von Inhalten oder Funktionen verhindern oder
      einschränken oder Beschränkungen der Nutzung der Dienste oder der darin
      enthaltenen Inhalte oder Funktionen durchsetzen; (l) sich als eine andere
      Person auszugeben oder auf andere Weise die Zugehörigkeit des Lieferanten zu
      einer natürlichen oder juristischen Person falsch darzustellen, Betrug zu
      begehen, die </span></p>

      <p
      ><span>Identität des Lieferanten zu verbergen oder
      zu versuchen, sie zu verbergen; oder (m) auf Teile der Dienste oder über die
      Dienste verfügbare Dienste oder Materialien zuzugreifen, sie zu verteilen oder
      für kommerzielle Zwecke zu nutzen. </span></p>

      <p
      ><b><span>1.4.</span></b><span> </span><span
     >Die „<b>Laufzeit</b>“ der Nutzung der Dienstleistungen durch den
      Lieferanten gilt so lange, wie der </span><span>Lieferant eine
      Geschäftsbeziehung mit einem Kunden unterhält, die die Nutzung oder den Zugang
      zu den Dienstleistungen erfordert, es sei denn, Oro Labs kündigt den Zugang des
      Lieferanten zu den Diensten aus irgendeinem Grund früher. </span></p>

      <p
      ><b><span>1.5.</span></b><span> Mit der
      Beendigung oder dem Ablauf dieser Vereinbarung erlöschen alle dem Lieferanten
      von Oro Labs gewährten Rechte und Lizenzen unverzüglich (mit Ausnahme der in
      diesem Abschnitt 1.5 genannten).  Auf Verlangen des Lieferanten bemüht sich Oro
      Labs in angemessener Weise, die vom Lieferanten für die Dienste
      bereitgestellten Lieferanten-Daten (wie unten definiert) zu löschen; allerdings
      kann Oro Labs Kopien von Lieferanten-Daten aufbewahren: (i) die von Oro
      Labs-Kunden unabhängig bereitgestellt wurden; (ii) soweit dies zur Einhaltung
      geltender Gesetze, Vorschriften oder berufsständischer Normen erforderlich ist;
      (iii) auf Servern oder Datensicherung-Quellen, wenn solche Lieferanten-Daten
      von lokalen Festplatten gelöscht werden und kein Versuch unternommen wird,
      solche Lieferanten-Daten von solchen Servern oder Backup-Quellen
      wiederherzustellen, und/oder (iv) wie anderweitig in Abschnitt 3.5 festgelegt. </span></p>

      <p
      ><b><span>1.6.</span></b><span> Der
      Lieferant ist in vollem Umfang für die Geheimhaltung seines Passworts und
      seines Kontos verantwortlich. Darüber hinaus ist der Lieferant für alle
      Aktivitäten, die unter seinem Konto stattfinden, voll verantwortlich. Der
      Lieferant verpflichtet sich, Oro Labs unverzüglich über jede bekannte oder
      vermutete unbefugte Nutzung seines Benutzernamens und Passworts oder jede
      andere Verletzung der Sicherheit zu informieren. Der Lieferant und nicht Oro Labs
      haftet für alle Verluste, die dem Lieferanten, </span></p>

      <p
      ><span>Oro Labs und anderen Parteien durch die
      Verwendung des Benutzernamens, des Passworts oder des </span></p>

      <p
      ><span>Kontos des Lieferanten entstehen, und zwar
      nur in dem Fall und in dem Umfang, in dem eine solche </span></p>

      <p
      ><span>Verwendung entweder vom Lieferanten gestattet
      wurde oder das Ergebnis eines Versäumnisses des Lieferanten ist, die
      Vertraulichkeit des Passworts und der Kontoinformationen des Lieferanten zu
      wahren. Der Lieferant darf das Konto einer anderen Person zu keiner Zeit ohne
      die schriftliche Genehmigung des Kontoinhabers nutzen. Das Konto des
      Lieferanten ist einzigartig für den Lieferant und darf nicht an Dritte
      übertragen werden. </span></p>

      <p
      ><b><span>1.7.</span></b><span> Die Dienste
      können von Oro Labs nach eigenem Ermessen von Zeit zu Zeit geändert werden. Oro
      Labs: (a) behält sich das Recht vor, die Dienste nach eigenem Ermessen ohne
      Vorankündigung zurückzuziehen oder zu ändern; und (b) ist nicht haftbar, wenn
      aus irgendeinem Grund alle oder ein Teil der Dienste zu irgendeinem Zeitpunkt
      oder für irgendeinen Zeitraum nicht verfügbar sind. </span><b><span>1.8.</span></b><span
     > Der Lieferant ist für die Beschaffung und Wartung aller erforderlichen
      Ausrüstungen und Zusatzdienste verantwortlich, die für die Verbindung mit den
      Diensten, den Zugang zu ihnen oder ihre anderweitige Nutzung erforderlich sind,
      einschließlich, aber nicht beschränkt auf Modems, Hardware, Server, Software,
      Betriebssysteme, Netzwerke, Webserver und dergleichen. </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >2.<span>&nbsp; </span></span>Registrierung
      des Kontos<span> </span></b></p>

      <p
      ><b><span>2.1. </span></b><span>Vor der
      Nutzung der Dienste muss der Lieferant den Prozess der Kontoregistrierung
      abschließen, indem er Oro Labs aktuelle, vollständige und genaue Informationen
      zur Verfügung stellt, wie sie im entsprechenden Registrierungsformular
      abgefragt werden. Jeder autorisierte Benutzer darf sich nur einmal unter einem
      einzigen Benutzernamen registrieren und der Lieferant stellt sicher, dass kein
      autorisierter Benutzer (a) sich im Namen einer anderen Person registriert; (b)
      sich unter dem Namen einer anderen Person oder unter einem fiktiven Namen oder
      Alias registriert; (c) einen Benutzernamen wählt, der eine Verkörperung einer
      anderen (realen oder fiktiven) Person oder Einrichtung darstellt oder nahelegt,
      dass ein autorisierter Benutzer ein Vertreter einer Einrichtung ist, obwohl
      dies nicht der Fall ist, oder der anstößig ist; oder (d) einen Benutzernamen
      wählt, um Benutzer und/oder Oro Labs hinsichtlich der wahren Identität eines
      autorisierten Benutzers zu täuschen oder in die Irre zu führen. Autorisierte
      Benutzer verpflichten sich, alle Informationen zur Kontoregistrierung zu
      pflegen und zu aktualisieren, um sie wahrheitsgemäß, genau, aktuell und
      vollständig zu halten. Wenn die vom autorisierten Benutzer bereitgestellten
      Informationen unwahr, ungenau, nicht aktuell oder unvollständig sind oder
      anderweitig gegen die oben genannten Einschränkungen verstoßen, hat Oro Labs
      das Recht, das Konto des autorisierten Benutzers zu kündigen und jegliche
      aktuelle oder zukünftige Nutzung der Dienste zu verweigern.  </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >3.<span>&nbsp; </span></span>Inhalt;
      Feedback<span> </span></b></p>

      <p
      ><b><span>3.1 </span></b><span>Alle
      Informationen oder Inhalte, die von autorisierten Nutzern über die Dienste
      hochgeladen, geteilt, </span><span>gespeichert, zur Verfügung gestellt
      oder übertragen werden, sind „Inhalte“ des Lieferanten, </span><span>einschließlich
      Profilinformationen, Transaktions- und andere Daten, die Sie an die Dienste
      senden, </span></p>

      <p
      ><span>Werbeinformationen,
      Transaktionsdaten/-details, Kundenlisten, Daten, die Sie über Ihre Kunden und
      Lieferanten führen, persönliche Daten, Marketinginformationen oder damit
      verbundene Informationen. Einige Inhalte können von anderen Benutzern
      eingesehen werden. Sie tragen die alleinige </span></p>

      <p
      ><span>Verantwortung für alle Inhalte, die Sie zu
      den Diensten beitragen. Sie versichern, dass alle von Ihnen übermittelten
      Inhalte korrekt, vollständig und aktuell sind und allen geltenden Gesetzen,
      Regeln und Vorschriften entsprechen. Sie verpflichten sich, keine
      Benutzerbeiträge zu veröffentlichen, hochzuladen, zu teilen, zu speichern oder
      anderweitig über die Dienste bereitzustellen, die: (i) die Urheberrechte oder
      andere Rechte Dritter verletzen (z.B., Markenrechte, Datenschutzrechte, etc.
      (ii) sexuell eindeutige Inhalte oder Pornografie enthalten; (iii) hasserfüllte,
      verleumderische oder diskriminierende Inhalte enthalten oder zum Hass gegen
      Einzelpersonen oder Gruppen auffordern; (iv) Minderjährige ausnutzen; (v)
      ungesetzliche Handlungen oder extreme Gewalt darstellen; (vi) Tierquälerei oder
      extreme Gewalt gegen Tiere darstellen; (vii) betrügerische Machenschaften,
      Multi-Level-Marketing (MLM), schnelles Geldverdienen, Online-Glücks und
      -Gewinnspiele, Geldgeschenke, Heimarbeit oder andere dubiose Geldgeschäfte
      fördern oder (viii) gegen irgendein Gesetz verstoßen. </span></p>

      <p
      ><b><span>3.2.</span></b><span> Für alle
      Inhalte gewährt der Lieferant Oro Labs hiermit die Lizenz, Inhalte anzuzeigen,
      aufzuführen, zu übersetzen, zu modifizieren (für technische Zwecke, z. B. um
      sicherzustellen, dass die Inhalte auf einem mobilen Gerät angezeigt werden
      können), zu vertreiben, aufzubewahren, zu vervielfältigen und </span><span
     >anderweitig in Bezug auf diese Inhalte zu handeln (zusammenfassend als
      „<b>Nutzung</b>“ bezeichnet), in </span><span>jedem Fall, um Oro Labs
      in die Lage zu versetzen, die Dienste zu erbringen, was die Bereitstellung von
      Inhalten an Kunden einschließt, mit denen der Lieferant sich dazu entschieden
      hat, diese Inhalte zu teilen oder zu veröffentlichen. </span></p>

      <p
      ><b><span>3.3. </span></b><span>Die Nutzung
      der Inhalte durch Oro Labs unterliegt dem Zusatz zur Datenverarbeitung, der in
      diese Vereinbarung aufgenommen wurde. Der Zusatz zur Datenverarbeitung hat
      Vorrang, wenn es einen </span></p>

      <p
      ><span>Konflikt zwischen ihm und der
      Datenschutzrichtlinie oder dieser Vereinbarung gibt. Sie können sich an Oro Labs
      wenden, um ein unterzeichnetes Exemplar des Datenverarbeitungszusatzes zu
      erhalten, falls dies für die Einhaltung der lokalen Gesetze erforderlich ist. </span></p>

      <p
      ><b><span>3.4</span></b><span> Der Lieferant
      ist für alle Inhalte verantwortlich, die durch die Nutzung der Dienste durch
      den Lieferanten hochgeladen, eingestellt oder gespeichert werden. Oro Labs ist
      nicht verantwortlich für verloren gegangene oder nicht wiederherstellbare
      Inhalte, es sei denn, sie sind das Ergebnis grober Fahrlässigkeit oder
      vorsätzlichen Fehlverhaltens von Oro Labs. Obwohl Oro Labs nicht verpflichtet
      ist, den Inhalt oder die Nutzung der Dienste durch den Lieferanten zu
      überwachen, kann Oro Labs nach eigenem Ermessen Inhalte ganz oder teilweise
      entfernen oder die Nutzung der Dienste verbieten, wenn sie als inakzeptabel,
      unerwünscht, unangemessen oder als Verstoß gegen diese Vereinbarung angesehen
      werden. </span></p>

      <p
      ><b><span>3.5</span></b><span>. Der
      Lieferant kann verlangen, dass Oro Labs die Daten des Lieferanten wie in
      Abschnitt 1.5 dargelegt löscht. Der Lieferant erkennt jedoch ausdrücklich an
      und erklärt sich damit einverstanden, dass Inhalte, die zuvor anderen Nutzern
      (einschließlich z. B. Kunden) zur Verfügung gestellt oder von diesen kopiert
      oder gespeichert wurden, von Oro Labs aufbewahrt werden können, um diesen
      Nutzern weiterhin Zugang zu diesen Inhalten zu gewähren (und die hierin
      festgelegten Lizenzen gelten so lange, wie dieser Zugang gewährt wird). </span></p>

      <p
      ><b><span>3.6.</span></b><span> Von Zeit zu
      Zeit kann Oro Labs Nutzern die Möglichkeit geben, freiwillig Feedbacks und
      Ideen für Verbesserungen im Zusammenhang mit den Diensten einzureichen. Der
      Lieferant erklärt sich damit einverstanden, dass (a) sein Feedback und der
      Ausdruck seiner Ideen und/oder Verbesserungen automatisch in das Eigentum von
      Oro Labs übergehen; (b) Oro Labs das Feedback des Lieferanten und seinen Inhalt
      für jeden Zweck und auf jede Art und Weise und ohne jegliche Einschränkungen
      verwenden oder weiterverbreiten kann, mit der Ausnahme, dass Oro Labs sich
      bereit erklärt, den Namen des Lieferanten, der mit einem solchen Feedback in
      Verbindung steht, vertraulich zu behandeln; </span></p>

      <p
      ><span>(c) Oro Labs ist nicht verpflichtet, das
      Feedback zu prüfen; (d) Oro Labs ist nicht verpflichtet, das Feedback
      vertraulich zu behandeln; und (e) Oro Labs hat keine Verpflichtung gegenüber
      dem Lieferant oder einen Vertrag mit dem Lieferant, weder implizit noch
      anderweitig. Durch die Bereitstellung von Feedback oder Ideen erkennt der
      Lieferant an und erklärt sich damit einverstanden, dass Oro Labs und seine
      Beauftragten selbst viele Einsendungen erstellen oder erhalten können, die dem Feedback
      oder den Ideen, die der Lieferant über die Dienste oder andere Kanäle und
      Mittel einreicht, ähnlich oder identisch sein können. Der Lieferant verzichtet
      hiermit auf alle Ansprüche, die er bisher hatte, haben könnte und/oder in
      Zukunft haben könnte, dass die von Oro Labs und seinen Beauftragten
      akzeptierten, überprüften und/oder verwendeten Einreichungen dem Feedback oder
      den Ideen des Lieferanten ähnlich sind. </span></p>

      <p><b><span
      > </span></b></p>

      <p className={styles.subtitle}><b><span
      >4.<span>&nbsp; </span></span>Vertraulichkeitsverpflichtung;
      Eigentumsrechte<span> </span></b></p>

      <p
      ><b><span>4.1. </span></b><span
     >Jede Vertragspartei (die „<b>empfangende</b></span><span> </span><b><span
     >Vertragspartei</span></b><span>“) nimmt zur Kenntnis, dass die
      andere </span></p>

      <p
      ><span>Vertragspartei (die „<b>veröffentlichende</b></span><span
     > </span><b><span>Vertragspartei</span></b><span>“)
      geschäftliche, technische oder finanzielle </span><span>Informationen,
      die sich auf das Geschäft der veröffentlichenden Vertragspartei beziehen (im
      Folgenden </span><span>als „<b>proprietäre</b></span><span> </span><b><span
     >Informationen</span></b><span>“ der veröffentlichenden
      Vertragspartei bezeichnet), offengelegt hat </span><span>oder
      offenlegen kann. Zu den urheberrechtlich geschützten Informationen von Oro Labs
      gehören nichtöffentliche Informationen über Merkmale, Funktionalität und
      Leistung der Dienste.  Zu den urheberrechtlich geschützten Informationen jedes
      Lieferanten gehören nicht-öffentliche Daten über </span><span>diesen
      Lieferanten, die dieser Lieferant Oro Labs zur Verfügung stellt („<b>Daten</b></span><span
     > </span><b><span>des</span></b><span> </span><b><span
     >Lieferanten</span></b><span>“), Inhalte </span><span>und
      alle Daten oder Informationen, die aus der Nutzung der Dienste durch den
      Lieferanten abgeleitet werden. Um Zweifel auszuschließen, umfassen die Daten
      des Lieferanten keine zusätzlichen Daten (wie unten definiert) oder Daten,
      Informationen oder Inhalte, die von anderen Dritten als dem Lieferant
      hochgeladen wurden. Die empfangende Partei verpflichtet sich, angemessene
      Vorkehrungen zu treffen, um diese geschützten Informationen zu schützen, und
      diese geschützten Informationen nicht zu nutzen oder an Dritte weiterzugeben, es
      sei denn, dies ist zur Nutzung oder Erbringung der Dienste oder auf andere
      Weise hierin gestattet; die empfangende Partei ist jedoch berechtigt,
      geschützte Informationen an ihre Auftragnehmer und/oder Vertreter
      weiterzugeben, die ein legitimes Bedürfnis haben, die geschützten Informationen
      zu kennen, und die an Vertraulichkeitsverpflichtungen gebunden sind, die
      mindestens ebenso streng sind wie die hierin enthaltenen. Die veröffentlichende
      Vertragspartei erklärt sich damit einverstanden, dass das Vorstehende nicht für
      Informationen gilt, die nach Ablauf von fünf (5) Jahren nach ihrer Offenlegung
      bekannt werden, oder für Informationen, von denen die empfangende
      Vertragspartei nachweisen kann, dass sie (a) der Öffentlichkeit allgemein
      zugänglich sind oder werden, ohne dass die empfangende Vertragspartei gegen
      diese Vereinbarung verstoßen hat, (b) sich in ihrem Besitz befanden oder ihr
      bekannt waren, bevor sie sie von der veröffentlichenden Vertragspartei erhalten
      hat, (c) ihr rechtmäßig und ohne Einschränkung von einer dritten Partei
      offengelegt wurden oder (d) unabhängig entwickelt wurden, ohne dass sie
      proprietäre Informationen der veröffentlichenden Vertragspartei verwendet hat. </span></p>

      <p
      ><b><span>4.2.</span></b><span> Die
      Vertragsparteien erkennen hiermit an und kommen überein, dass jede Verletzung
      oder Nichterfüllung der Vertraulichkeitsverpflichtungen einer Vertragspartei im
      Rahmen dieses Abkommens der anderen Vertragspartei einen Schaden zufügt, dessen
      Höhe schwer zu bestimmen ist.  </span></p>

      <p
      ><span>Dementsprechend ist die nicht
      vertragsbrüchige Partei zusätzlich zu allen anderen Rechtsbehelfen, auf die
      eine Partei Anspruch hat, berechtigt, ohne Nachweis eines tatsächlichen
      Schadens einen von einem zuständigen Gericht angeordneten Unterlassungsanspruch
      geltend zu machen, einschließlich, aber nicht beschränkt auf eine einstweilige
      Verfügung, die jede Verletzung der Vertraulichkeitsverpflichtungen der
      vertragsbrüchigen Partei untersagt. </span></p>

      <p
      ><b><span>4.3.</span></b><span> Wenn die
      empfangende Partei oder einer ihrer Vertreter nach geltendem Recht gezwungen
      ist, urheberrechtlich geschützte Informationen offenzulegen, muss die
      empfangende Partei, soweit dies nach geltendem Recht zulässig ist (a) die
      veröffentlichende Vertragspartei unverzüglich und vor einer solchen Offenlegung
      schriftlich von dieser Anforderung zu unterrichten, damit die veröffentlichende
      Vertragspartei eine Schutzverfügung oder andere Abhilfemaßnahmen beantragen
      oder auf ihr Recht auf Vertraulichkeit gemäß den Bedingungen dieser
      Vereinbarung verzichten kann; und (b) die veröffentlichende Vertragspartei auf
      deren alleinige Kosten in angemessener Weise dabei zu unterstützen, sich einer
      solchen Offenlegung zu widersetzen oder eine Schutzverfügung oder andere
      Einschränkungen der Offenlegung zu beantragen. Verzichtet die veröffentlichende
      Vertragspartei auf die Einhaltung der Vorschriften oder ist die empfangende
      Vertragspartei nach der in diesem Abschnitt 4.3 geforderten Benachrichtigung
      und Unterstützung weiterhin gesetzlich zur Offenlegung geschützter
      Informationen verpflichtet, so legt die empfangende Vertragspartei nur den Teil
      der geschützten Informationen offen, zu dessen Offenlegung sie nach Beratung
      durch ihren Rechtsbeistand gesetzlich verpflichtet ist, und bemüht sich auf
      Ersuchen der veröffentlichenden Vertragspartei in wirtschaftlich vertretbarem
      Umfang darum, von dem zuständigen Gericht oder einer anderen vorsitzenden
      Behörde die Zusicherung zu erhalten, dass diese geschützten Informationen
      vertraulich behandelt werden. Eine solche erzwungene Offenlegung durch die
      empfangende Partei hat keine anderen Auswirkungen auf die Verpflichtungen der
      empfangenden Partei im Rahmen dieser Vereinbarung in Bezug auf die auf diese
      Weise offengelegten urheberrechtlich geschützten Informationen. </span></p>

      <p
      ><b><span>4.4.</span></b><span> Der
      Lieferant ist Inhaber aller Rechte, Titel und Interessen an seinen geschützten
      Informationen, einschließlich der Designs, Marken, Dienstleistungsmarken und
      Logos des Lieferanten, und behält diese ein. Oro Labs ist Inhaber aller Rechte,
      Titel und Anteile an seinen urheberrechtlich geschützten Informationen,
      einschließlich (a) der Dienstleistungen und der Software sowie aller
      Verbesserungen, Erweiterungen oder Änderungen daran, (b) jeglicher Software,
      Anwendungen, Erfindungen oder sonstiger Technologien, die in Verbindung mit den
      Implementierungsdienstleistungen oder dem Support entwickelt wurden, (c) aller
      Rechte an geistigem Eigentum im Zusammenhang mit den vorgenannten Punkten und
      (d) der Designs, Marken, Dienstleistungsmarken und Logos von Oro Labs und den
      Dienstleistungen, unabhängig davon, ob sie Eigentum von Oro Labs sind oder an
      Oro Labs lizenziert wurden. </span></p>

      <p
      ><b><span>4.5.</span></b><span> Ungeachtet
      anderslautender Bestimmungen in dieser Vereinbarung hat Oro Labs das Recht
      (während und nach der Laufzeit dieser Vereinbarung), Daten und Informationen im
      Zusammenhang mit der Nutzung der Dienste durch den Lieferanten in
      zusammengefasster und anonymer Form </span><span>(„<b>zusammengefasste</b></span><span
     > </span><b><span>Daten</span></b><span>“) für seine
      internen Geschäftszwecke zu verwenden, um die Dienste zu </span><span>verbessern
      und zu erweitern, um statistische und Leistungsinformationen zusammenzustellen
      und für andere Entwicklungs-, Diagnose- und Korrekturzwecke in Verbindung mit
      den Diensten und anderen Angeboten von Oro Labs. Alle Rechte, die hier nicht
      ausdrücklich gewährt werden, gelten als verweigert. </span><b><span>4.6</span></b><span
     > Zusätzlich zu dem Vorstehenden, nur in Bezug auf Abonnenten, wird Oro
      Labs (i) wirtschaftlich angemessene und geeignete technische und
      organisatorische Maßnahmen ergreifen, um LieferantenDaten vor unbefugtem und
      rechtswidrigem Verlust, Zugriff oder Offenlegung zu schützen, (ii) physische,
      elektronische und verfahrenstechnische Schutzmaßnahmen in Übereinstimmung mit
      den geltenden Datenschutzgesetzen ergreifen, einschließlich, aber nicht
      beschränkt auf: (a) die Aufrechterhaltung geeigneter Sicherheitsvorkehrungen,
      um den Zugang zu den Daten des Lieferanten auf die Mitarbeiter, Vertreter,
      Lizenzgeber oder Lieferanten von Oro Labs zu beschränken, die diese
      Informationen benötigen, um die Verpflichtungen von Oro Labs im Rahmen dieser
      Vereinbarung zu erfüllen; (b) Verfahren und Praktiken für die sichere
      Übertragung oder den sicheren Transport der Daten des Lieferanten; und (c) die
      Aufrechterhaltung geeigneter Sicherheitsvorkehrungen, um den unbefugten Zugriff
      auf die Daten des Lieferanten zu verhindern. </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >5.<span>&nbsp; </span></span>Garantie
      und Haftungsausschluss<span> </span></b></p>

      <p
      ><b><span>5.1.</span></b><span> Jede Partei
      sichert hiermit zu, verpflichtet sich und gewährleistet, dass: (a) dass sie bei
      der Erfüllung dieses Vertrags während der Laufzeit alle geltenden Gesetze und
      Vorschriften einhält; (b) dass sie das volle Recht, die Vollmacht und die
      Befugnis hat, diesen Vertrag abzuschließen; (c) dass die Erfüllung ihrer
      Verpflichtungen im Rahmen dieses Vertrags keine andere Vereinbarung verletzt,
      an der sie beteiligt ist, und dies auch in Zukunft nicht tun wird; und (d) dass
      dieser Vertrag eine rechtmäßige, gültige und verbindliche Verpflichtung
      darstellt, wenn er vereinbart wird. Der Lieferant sichert ferner zu, dass er
      Inhaber der erforderlichen Lizenzen, Rechte, Zustimmungen und Genehmigungen für
      die Veröffentlichung und Übermittlung der Inhalte und Lieferanten-Daten ist
      oder über diese verfügt. Der </span></p>

      <p
      ><span>Lieferant erklärt sich ferner damit
      einverstanden, dass die Inhalte und Lieferanten-Daten, die er an die Dienste
      übermittelt, kein urheberrechtlich geschütztes Material Dritter oder Material
      enthalten, das anderen Eigentumsrechten Dritter unterliegt, es sei denn, der
      Lieferant hat die Erlaubnis des rechtmäßigen Eigentümers des Materials oder der
      Lieferant ist anderweitig rechtlich dazu berechtigt, das Material zu
      veröffentlichen und dem Unternehmen alle hierin gewährten Lizenzrechte zu
      gewähren. </span></p>

      <p
      ><b><span>5.2.</span></b><span> Der
      Lieferant erkennt an, dass die Dienste von Oro Labs von den Vereinigten Staaten
      aus kontrolliert und betrieben werden. Wenn der Kunde, der Dienstleistungen vom
      Lieferanten beziehen möchte, außerhalb der USA ansässig ist, werden die vom
      Lieferanten bereitgestellten Inhalte, einschließlich personenbezogener Daten,
      in dem dem Standort des Kunden am nächsten gelegenen Rechenzentrum verarbeitet,
      das sich in einem anderen Land befinden kann als der Standort des </span></p>

      <p
      ><span>Lieferanten. Oro Labs gibt keine Zusicherung
      oder Garantie, dass die Dienste oder Teile davon für die Nutzung in einer
      bestimmten Gerichtsbarkeit geeignet oder verfügbar sind. Der Lieferant und
      seine autorisierten Benutzer unterliegen in Verbindung mit der Nutzung der
      Dienste und/oder der damit verbundenen Dienstleistungen den Exportkontrollen
      der Vereinigten Staaten und sind für etwaige Verstöße gegen diese Kontrollen
      verantwortlich, einschließlich, aber nicht beschränkt auf Embargos der
      Vereinigten Staaten oder andere bundesstaatliche Regeln und Vorschriften, die
      den Export beschränken. </span></p>

      <p
      ><b><span>5.3.</span></b><span> MIT AUSNAHME
      DER AUSDRÜCKLICHEN GARANTIEN IN ABSCHNITT 5.1 WERDEN DIE DIENSTE OHNE </span></p>

      <p
      ><span>MÄNGELGEWÄHR BEREITGESTELLT. ORO LABS LEHNT
      INSBESONDERE ALLE STILLSCHWEIGENDEN </span></p>

      <p
      ><span>GEWÄHRLEISTUNGEN DER MARKTTAUGLICHKEIT, DER
      EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND </span></p>

      <p
      ><span>DES EIGENTUMSRECHTS AB. OHNE DAS VORSTEHENDE
      EINZUSCHRÄNKEN, ÜBERNIMMT ORO LABS </span></p>

      <p
      ><span>KEINERLEI GARANTIE DAFÜR, DASS DIE DIENSTE,
      PRODUKTE VON DRITTANBIETERN, INHALTE VON </span></p>

      <p
      ><span>DRITTANBIETERN ODER ERGEBNISSE DER NUTZUNG
      DER DIENSTE DEN ANFORDERUNGEN DES </span></p>

      <p
      ><span>LIEFERANTEN ODER EINER ANDEREN PERSON
      ENTSPRECHEN, OHNE UNTERBRECHUNG FUNKTIONIEREN, </span></p>

      <p
      ><span>DAS BEABSICHTIGTE ERGEBNIS ERZIELEN, MIT
      SOFTWARE, SYSTEMEN ODER ANDEREN DIENSTEN KOMPATIBEL SIND ODER MIT DIESEN
      ZUSAMMENARBEITEN, SICHER, GENAU, VOLLSTÄNDIG, FREI VON SCHÄDLICHEM CODE ODER
      FEHLERFREI SIND.  </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >6.<span>&nbsp; </span></span>Einschränkung
      der Haftung<span> </span></b></p>

      <p
      ><b><span>6.1.</span></b><span> MIT AUSNAHME
      EINER VERLETZUNG VON ABSCHNITT 1.3 HAFTET KEINE DER BEIDEN PARTEIEN IM </span></p>

      <p
      ><span>GRÖSSTMÖGLICHEN NACH GELTENDEM RECHT
      ZULÄSSIGEN UMFANG FÜR BESONDERE, ZUFÄLLIGE, </span></p>

      <p
      ><span>INDIREKTE, EXEMPLARISCHE ODER FOLGESCHÄDEN
      (EINSCHLIESSLICH, ABER NICHT BESCHRÄNKT AUF </span></p>

      <p
      ><span>SCHÄDEN AUS ENTGANGENEM GEWINN,
      GESCHÄFTSUNTERBRECHUNG, VERLUST VON </span></p>

      <p
      ><span>GESCHÄFTSINFORMATIONEN, EINNAHMEN, ERWARTETEN
      UMSATZ ODER EINSPARUNGEN, ODER </span></p>

      <p
      ><span>SONSTIGE VERMÖGENSSCHÄDEN), DIE SICH AUS
      DIESER VEREINBARUNG, DEN DIENSTEN, PRODUKTEN </span></p>

      <p
      ><span>DRITTER, WEBSITES DRITTER ODER INHALTEN
      DRITTER, DIE ÜBER DIE DIENSTE ZUR VERFÜGUNG </span></p>

      <p
      ><span>GESTELLT WERDEN, ERGEBEN ODER IN IRGENDEINER
      WEISE DAMIT ZUSAMMENHÄNGEN, UNABHÄNGIG </span></p>

      <p
      ><span>DAVON, OB SIE AUS UNERLAUBTEN HANDLUNGEN
      (EINSCHLIESSLICH FAHRLÄSSIGKEIT), VERTRÄGEN ODER ANDEREN RECHTSTHEORIEN
      RESULTIEREN, SELBST WENN DIE BETREFFENDE PARTEI AUF DIE MÖGLICHKEIT SOLCHER
      SCHÄDEN HINGEWIESEN WURDE. </span></p>

      <p
      ><b><span>6.2.</span></b><span> MIT AUSNAHME
      EINER VERLETZUNG VON ABSCHNITT 1. 6.2. MIT AUSNAHME EINER VERLETZUNG </span></p>

      <p
      ><span>VON ABSCHNITT 1. 3 WIRD DIE GESAMTE HAFTUNG
      EINER PARTEI ODER IHRER VERBUNDENEN </span></p>

      <p
      ><span>UNTERNEHMEN, DIE SICH AUS DIESER
      VEREINBARUNG, DEN DIENSTEN, PRODUKTEN DRITTER, </span></p>

      <p
      ><span>WEBSITES DRITTER ODER ÜBER DIE DIENSTE ZUR
      VERFÜGUNG GESTELLTEN INHALTEN DRITTER ERGIBT </span></p>

      <p
      ><span>ODER IN IRGENDEINER WEISE DAMIT
      ZUSAMMENHÄNGT, UNABHÄNGIG DAVON, OB SIE SICH AUS EINER </span></p>

      <p
      ><span>VERTRAGSVERLETZUNG ERGIBT ODER DAMIT
      ZUSAMMENHÄNGT, (I) EINHUNDERT DOLLAR ($100) UND </span></p>

      <p
      ><span>(II) DIE GESAMTSUMME DER VOM LIEFERANT AN ORO
      LABS GEZAHLTEN BETRÄGE (UND ALLER </span></p>

      <p
      ><span>AUFGELAUFENEN, ABER NOCH NICHT GEZAHLTEN
      BETRÄGE) IN DEN 6 MONATEN VOR DEM EREIGNIS, </span></p>

      <p
      ><span>DAS DEN ANSPRUCH BEGRÜNDET, ÜBERSTEIGT,
      UNABHÄNGIG DAVON, OB DIESE BETRÄGE AUS </span></p>

      <p
      ><span>VERTRAGSBRUCH, UNERLAUBTER HANDLUNG
      (EINSCHLIESSLICH FAHRLÄSSIGKEIT), </span></p>

      <p
      ><span>GEFÄHRDUNGSHAFTUNG ODER EINER ANDEREN
      RECHTLICHEN ODER ANGEMESSENEN THEORIE ENTSTANDEN SIND ODER DEN HÖHEREN BETRAG
      DARSTELLEN. </span></p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >7.<span>&nbsp; </span></span>Sonstiges<span
      > </span></b></p>

      <p
      ><b><span>7.1. Aufrechterhaltung.</span></b><span
     > Die folgenden Abschnitte dieser Vereinbarung überdauern die Kündigung
      oder das Auslaufen dieser Vereinbarung: Abschnitt 1.2, 1.3, 1.5, 3.4, 3.5, 4,
      5, 6 und 7. </span></p>

      <p
      ><b><span>7.2.</span></b><span> </span><b><span
     >Ungültigkeit</span></b><span>. Sollte sich eine Bestimmung
      dieser Vereinbarung als nicht durchsetzbar oder ungültig erweisen, wird diese
      Bestimmung auf das erforderliche Mindestmaß beschränkt oder aufgehoben, so dass
      diese Vereinbarung ansonsten in vollem Umfang in Kraft und durchsetzbar bleibt.
      </span></p>

      <p
      ><b><span>7.3. Übertragung.</span></b><span>
      Diese Vereinbarung ist von keiner der Parteien abtretbar, übertragbar oder
      unterlizenzierbar, es sei denn, die andere Partei hat vorher schriftlich
      zugestimmt; allerdings kann jede Partei diese Vereinbarung abtreten oder
      übertragen: (a) an ein verbundenes Unternehmen, wenn (i) der
      Abtretungsempfänger schriftlich zugestimmt hat, an die Bedingungen dieser
      Vereinbarung gebunden zu sein, (ii) die abtretende Partei für die
      Verpflichtungen aus dieser Vereinbarung haftet, wenn der Abtretungsempfänger sie
      nicht erfüllt, und (iii) die abtretende Partei die andere Partei schriftlich
      von der </span></p>

      <p
      ><span>Abtretung unterrichtet hat; (b) im Falle
      einer Fusion, eines Verkaufs von im Wesentlichen allen Aktien, Vermögenswerten
      oder Geschäften oder einer sonstigen Umstrukturierung, an der die abtretende
      Partei beteiligt ist, und die vorherige schriftliche Zustimmung der nicht
      abtretenden Partei ist in einem solchen Fall nicht erforderlich, mit der
      ausdrücklichen Maßgabe, dass in Fällen, in denen die abtretende Partei nicht
      das überlebende Unternehmen ist, diese Vereinbarung den Rechtsnachfolger der
      abtretenden Partei in Bezug auf alle Verpflichtungen aus dieser Vereinbarung
      bindet. Jeder andere Versuch einer Übertragung oder Abtretung ist nichtig. </span></p>

      <p
      ><b><span>7.4. Höhere Gewalt</span></b><span
     >. Sollte eine der Vertragsparteien durch Streiks, Aussperrungen,
      Arbeitskämpfe, Unmöglichkeit der Materialbeschaffung oder Dienstleistungen,
      Stromausfall, Unruhen, Aufstände oder andere Gründe ähnlicher Art, die nicht
      von der verzögerten Vertragspartei zu vertreten sind, an der Ausführung von
      Arbeiten oder Handlungen, die im Rahmen dieses Vertrags erforderlich sind,
      gehindert werden, so hat die betreffende Vertragspartei die andere
      Vertragspartei unverzüglich davon in Kenntnis zu setzen, sofern es sich nicht
      um eine Zahlungsverpflichtung handelt, Krieg oder andere Gründe ähnlicher Art,
      die nicht auf das Verschulden der Partei zurückzuführen sind, die bei der
      Ausführung von Arbeiten oder Handlungen, die nach diesem Vertrag erforderlich
      sind, in Verzug geraten ist, so hat diese Partei die andere Partei unverzüglich
      von diesem Verzug in Kenntnis zu setzen, und die Ausführung dieser Handlung ist
      für die Dauer des Verzugs entschuldigt, und die Frist für die Ausführung einer
      solchen Handlung wird um den Zeitraum des Verzugs verlängert. </span></p>

      <p
      ><b><span>7.5. Vollständige Vereinbarung.</span></b><span
     > Diese Vereinbarung ist die vollständige und ausschließliche Erklärung
      des gegenseitigen Verständnisses der Parteien und ersetzt und hebt alle
      früheren schriftlichen und mündlichen Vereinbarungen, Mitteilungen und
      sonstigen Absprachen in Bezug auf den Gegenstand dieser Vereinbarung auf. Alle
      Verzichtserklärungen und Änderungen bedürfen der Schriftform und müssen von
      beiden Parteien unterzeichnet werden, sofern in dieser Vereinbarung nichts
      anderes vorgesehen ist. </span></p>

      <p
      ><b><span>7.6. Änderung.</span></b><span>
      Oro Labs kann diese Lieferanten-Bedingungen von Zeit zu Zeit nach eigenem
      Ermessen überarbeiten und aktualisieren. Alle Änderungen treten sofort in
      Kraft, wenn sie auf dieser Website zur Verfügung gestellt werden, und gelten für
      den gesamten Zugang zu und die Nutzung der Dienste danach. Änderungen an den
      Bestimmungen zur Streitbeilegung gemäß Abschnitt 7.13 gelten jedoch nicht für
      Streitigkeiten, die den Parteien an oder vor dem Datum, an dem die Änderung auf
      dieser Website veröffentlicht wird, tatsächlich mitgeteilt wurden.  Die
      fortgesetzte Nutzung der Dienste durch den Lieferanten nach der
      Veröffentlichung der überarbeiteten Nutzungsbedingungen bedeutet, dass der
      Lieferant die Änderungen akzeptiert und ihnen zustimmt. Dem Lieferanten wird
      empfohlen, diese Seite von Zeit zu Zeit zu besuchen, um sich über etwaige
      Änderungen zu informieren, da solche Änderungen für den Lieferanten verbindlich
      sind. </span></p>

      <p
      ><b><span>7.7. Beziehung zwischen den Parteien.</span></b><span
     > Durch diese Vereinbarung wird keine Agentur, Partnerschaft, kein
      Gemeinschaftsunternehmen und kein Arbeitsverhältnis geschaffen, und der
      Lieferant ist in keiner Weise befugt, Oro Labs in irgendeiner Hinsicht zu
      binden. </span></p>

      <p
      ><b><span>7.8. Websites von
      Dritten.</span></b><span> Die Dienste können Links zu Werbetreibenden,
      Websites oder Diensten </span><span>Dritter („<b>Drittseiten</b>“)
      enthalten. Der Lieferant erkennt an und stimmt zu, dass Oro Labs nicht </span></p>

      <p
      ><span>verantwortlich oder haftbar ist für: (i) die
      Verfügbarkeit oder Richtigkeit solcher Drittseiten oder (ii) den Inhalt, die
      Produkte oder Ressourcen auf oder von solchen Drittseiten. Websites von
      Drittanbietern bedeuten nicht, dass Oro Labs diese Websites oder
      Dienstleistungen befürwortet. Wenn der Lieferant beschließt, auf eine der mit
      den Diensten verlinkten Websites Dritter zuzugreifen, tut er dies vollständig
      auf eigenes Risiko und vorbehaltlich der Nutzungsbedingungen für diese Websites
      Dritter und erkennt die alleinige Verantwortung für und die Übernahme aller
      Risiken an, die sich aus der Nutzung solcher Websites Dritter ergeben. </span></p>

      <p
      ><b><span>7.9. Produkte von Drittanbietern und
      Inhalte von Drittanbietern.</span></b><span> In Verbindung mit den
      Diensten hat der Lieferant möglicherweise Zugang zu Anwendungen, Integrationen,
      Software, Diensten, Systemen </span><span>oder anderen Produkten, die
      nicht von Oro Labs entwickelt wurden („<b>Produkte Dritter</b>“), oder zu </span><span
     >Daten/Inhalten, die von solchen Produkten Dritter abgeleitet sind oder
      sich aus einer Vereinbarung </span><span>zwischen Oro Labs und einem
      solchen Dritten ergeben (zusammenfassend als „<b>Inhalte Dritter</b>“ </span><span
     >bezeichnet). Oro Labs kann nicht garantieren, dass derartige Inhalte
      Dritter frei von Material sind, das Sie möglicherweise als anstößig oder
      anderweitig beanstanden. Darüber hinaus übernimmt Oro Labs keine Garantie oder
      Unterstützung für Produkte von Drittanbietern oder Inhalte von Drittanbietern (unabhängig
      davon, ob diese Elemente von Oro Labs als verifiziert oder in die Dienste
      integriert bezeichnet werden) und lehnt jegliche Verantwortung und Haftung für
      diese Elemente und ihren Zugang zu oder ihre Integration in die Dienste ab,
      einschließlich ihrer Änderung, Löschung oder Offenlegung. Der Lieferant erkennt
      an und erklärt sich damit einverstanden, dass solche Drittprodukte und </span><span
     >Drittinhalte die „vertraulichen Informationen“ des Eigentümers solcher
      Drit</span><span>tprodukte und Drittinhalte darstellen, und als solcher
      erklärt sich der Lieferant damit einverstanden, angemessene Vorkehrungen zum
      Schutz solcher Drittprodukte und Drittinhalte zu treffen, und diese Produkte
      und Inhalte Dritter nicht zu verwenden (außer in Verbindung mit den Diensten
      oder mit anderweitiger schriftlicher Genehmigung des Eigentümers) oder an
      Dritte weiterzugeben, es sei denn, es handelt sich um seine Auftragnehmer
      und/oder Vertreter, die ein legitimes Bedürfnis haben, davon Kenntnis zu
      erlangen, und die an Vertraulichkeitsverpflichtungen gebunden sind, die
      mindestens so streng sind wie die hierin enthaltenen. </span></p>

      <p
      ><b><span>7.10. Benachrichtigungen. </span></b><span
     >Alle Mitteilungen im Rahmen dieses Vertrags bedürfen der Schriftform
      und gelten als ordnungsgemäß erfolgt, wenn sie bei persönlicher Übergabe
      empfangen werden; wenn der Empfang elektronisch bestätigt wird, wenn sie per
      Fax oder E-Mail übermittelt werden; am Tag nach der Absendung, wenn sie am
      nächsten Tag durch einen anerkannten Nachtzustelldienst zugestellt werden; und
      nach Erhalt, wenn sie per Einschreiben mit Rückschein versandt werden. Alle
      Mitteilungen an Oro Labs können an [EMAIL] oder per Post an <Address /> gesendet
      werden. </span></p>

      <p
      ><b><span>7.11. Geltendes Recht.</span></b><span
     > Diese Vereinbarung unterliegt den Gesetzen des Staates Delaware, ohne
      Bezugnahme auf die Grundsätze des Kollisionsrechts. Alle Streitigkeiten
      zwischen den Parteien, die sich aus dieser Vereinbarung ergeben oder mit ihr in
      Zusammenhang stehen, werden ausschließlich durch ein JAMS-Schiedsverfahren
      beigelegt, das in Kalifornien oder an einem anderen einvernehmlich festgelegten
      Ort stattfindet und in Übereinstimmung mit den zu diesem Zeitpunkt geltenden
      JAMSBestimmungen durchgeführt wird. Der Schiedsspruch ist endgültig und
      unanfechtbar und kann von jedem zuständigen Gericht erlassen werden. Die
      obsiegende Vertragspartei hat Anspruch auf Erstattung aller angemessenen
      Anwaltskosten von der anderen Vertragspartei, zusätzlich zu allen anderen
      Schadensersatzleistungen. Beide Parteien verzichten auf das Recht, sich an
      einer Sammelklage zu beteiligen, wenn es um Streitigkeiten zwischen den
      Parteien geht, und die Parteien verzichten jeweils auf das Recht auf ein
      Verfahren vor einem Schwurgericht. Alle Ansprüche müssen in der individuellen
      Eigenschaft der Parteien geltend gemacht werden und nicht als Kläger oder
      Mitglied einer Gruppe in einem vermeintlichen Sammel- oder
      Repräsentativverfahren, und, sofern Oro Labs nicht anders zustimmt, darf der
      Schiedsrichter die Ansprüche von mehr als einer Person nicht zusammenfassen.
      Dieser Verzicht auf Sammelklagen ist ein wesentlicher Bestandteil dieser
      Schiedsvereinbarung und kann nicht abgetrennt werden. Sollte sich dieser
      Verzicht auf Sammelklagen aus irgendeinem Grund als nicht durchsetzbar
      erweisen, so gilt die gesamte Schiedsvereinbarung nicht. Der in diesem
      Abschnitt 7.12 festgelegte Verzicht auf das Recht auf ein Verfahren vor einem
      Schwurgericht bleibt jedoch in vollem Umfang in Kraft. LIEFERANT UND ORO LABS
      VEREINBAREN, DASS JEDER KLAGEGRUND, DER SICH AUS </span></p>

      <p
      ><span>DEN DIENSTLEISTUNGEN ODER DIESER VEREINBARUNG
      ERGIBT ODER DAMIT ZUSAMMENHÄNGT, INNERHALB EINES (1) JAHRES NACH ENTSTEHUNG DES
      KLAGEGRUNDES EINGELEITET WERDEN MUSS. </span></p>

      <p
      ><span>ANDERNFALLS IST EIN SOLCHER KLAGEGRUND
      DAUERHAFT VERJÄHRT. </span></p>

      <p
      ><b><span>7.13. Urheberrechtspolitik</span></b><span
     >. Oro Labs respektiert die geistigen Eigentumsrechte anderer und
      erwartet, dass die Benutzer der Dienste dasselbe tun. Oro Labs reagiert auf
      Mitteilungen über angebliche Urheberrechtsverletzungen, die dem geltenden Recht
      entsprechen und ordnungsgemäß an den von Oro </span><span>Labs
      benannten Urheberrechtsbeauftragten („<b>Urheberrechtsbeauftragter</b>“)
      übermittelt werden. Der </span><span>benannte Copyright Agent von Oro
      Labs, der Benachrichtigungen über angebliche Verstöße entgegennimmt, ist:</span></p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>

      <p
      >&nbsp;</p>

      <p
      ><b><span>HAFTUNGSAUSSCHLUSS</span></b>: Dies ist eine
      inoffizielle Übersetzung, die nur zu Informationszwecken bereitgestellt wird.
      Die englische Originalversion dieser &quot;Allgemeinen Geschäftsbedingungen für
      Lieferanten&quot;  (<OroButton label='hier verfügbar' type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />)  ist
      rechtsverbindlich und hat im Falle eines Konflikts oder einer Diskrepanz mit
      dieser inoffiziellen Übersetzung Vorrang.</p>
    </div>
  )
}
