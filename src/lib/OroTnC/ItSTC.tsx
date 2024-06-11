/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import { Address } from './EnSTC'
import styles from './stc.module.scss'
import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'

export function ItSTC (props: {
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro Labs, Inc. Termini e condizioni per I fornitori </b></p>

      <p className={styles.subtitle}><b>Data di entrata in vigore: {getLocalDateString((new Date()).toString(), 'it')}</b></p>

      <p>I
      presenti Termini e condizioni per i fornitori regolano l&apos;accesso e l&apos;utilizzo
      dei servizi (nel prosieguo identificati come &quot;<b>Servizi</b>&quot;), di proprietà
      o controllati da Oro Labs, Inc. una società con sede nello Stato Delaware (nel
      prosieguo indicata come &quot;<b>Oro Labs</b>&quot;). MEDIANTE L’UTILIZZO DEI
      SERVIZI O TRAMITE L’ACCETTAZIONE DEI PRESENTI TERMINI IN ALTRO MODO ACCEDENDO A
      QUESTO SITO WEB E CLICCANDO SU &quot;CONTINUA&quot;, come &quot;<b>FORNITORI&quot;</b>
      SI ACCETTA DI ESSERE VINCOLATI DAI PRESENTI TERIMINI E CONDIZIONI PER I
      FORNITORI E DI RISPETTARNE IL CONTENUTO. SE NON INTENDE ACCETTARE I PRESENTI
      TERMINI E CONDIZIONI, NON SI DEVE ACCEDERE O UTILIZZARE I SERVIZI. Se il presente
      Contratto viene accettato per conto di un&apos;azienda, un&apos;impresa, una società o
      un&apos;altra entità, si richiede che sia il mediatore che l&apos;azienda, l&apos;impresa, la
      società o un&apos;altra entità interessata dichiarino e garantiscano che il primo
      sia in possesso l&apos;autorità di vincolare le seconde al presente Contratto. In
      questo caso, il termine &quot;<b>Fornitore</b>&quot; farà riferimento a tale
      entità. Oro Labs e il Fornitore sono qui indicati ciascuno come una &quot;<b>Parte</b>&quot;
      e insieme come le &quot;<b>Parti</b>&quot;. </p>

      <p 
      >I Servizi includono l&apos;accesso alla piattaforma di Oro Labs
      per facilitare l&apos;invio e la gestione di materiali di approvvigionamento tra il
      Fornitore e uno o più clienti di Oro Labs (ciascuno di essi indicato come
      &quot;<b>Cliente</b>&quot;) al fine di prendere parte ad attività di
      approvvigionamento svolte dal Fornitore nei confronti di tale Cliente. Ciascun
      Cliente con cui si interagisce tramite i Servizi può richiedere di accettare
      termini aggiuntivi in relazione al rapporto intrattenuto con lo stesso. Tali
      termini aggiuntivi potranno essere presentati al fornitore per l&apos;accettazione
      tramite i Servizi.  </p>

      <p
      > </p>

      <p className={styles.subtitle}><b>1. Estensione del servizio; durata </b></p>

      <p 
      ><b>1.1. </b>Per tutta la durata dell’accordo (come definita
      di seguito) Oro Labs concede al Fornitore e ai suoi dipendenti, appaltatori e
      agenti (&quot;<b>Utenti autorizzati</b>&quot;) una licenza limitata, non
      esclusiva e non trasferibile (tranne che in conformità con la Sezione 7.3) per
      accedere e utilizzare i Servizi per scopi aziendali interni del Fornitore ai
      sensi dei termini del presente Contratto. Oro Labs si riserva tutti i diritti
      non espressamente concessi su e per i Servizi. </p>

      <p 
      ><b>1.2. </b>I Servizi sono attualmente resi disponibili al
      Fornitore a titolo gratuito, ma Oro Labs si riserva il diritto di rendere parte
      di essi o la loro totalità a pagamento in futuro.  Oro Labs informerà i fornitori
      prima che i Servizi di cui si usufruisce inizino ad essere a pagamento. Nel
      caso si desideri continuare ad utilizzare tali Servizi, sarà necessario pagare
      tutte le tariffe applicabili per questi ultimi. </p>

      <p 
      ><b>1.3. </b>Come condizione per l&apos;utilizzo e l&apos;accesso ai
      Servizi da parte del Fornitore, quest&apos;ultimo si impegna a non utilizzarli per
      scopi illegali o in qualsiasi modo che violi i termini del presente Contratto.
      Qualsiasi utilizzo dei Servizi in violazione del presente Contratto può
      comportare, tra l&apos;altro, l’impossibilità di accesso agli stessi e la cessazione
      o la sospensione dell&apos;account del Fornitore. <span>È</span>
      fatto divieto al Fornitore di intraprendere ogni attività tra quelle di seguito
      riportate: (a) decodificare, decompilare, disassemblare, separare o tentare in
      altro modo di scoprire o ricavare il codice sorgente, il codice oggetto o la
      struttura sottostante, le idee, il know-how o gli algoritmi relativi ai Servizi
      o qualsiasi software, documentazione o dato relativo ai Servizi (&quot;<b>Software</b>&quot;),
      sia direttamente che indirettamente; (b) copiare, distribuire, trasmettere o
      divulgare qualsiasi parte dei Servizi con qualsiasi mezzo, incluso, senza
      limitazioni, qualsiasi &quot;scraping&quot; automatizzato o non automatizzato;
      (c) raccogliere o accumulare informazioni di identificazione personale
      (&quot;PII&quot;), compresi i nomi degli account, tramite i Servizi; (d)
      modificare, adattare, tradurre o creare opere derivate basate sui Servizi o sul
      Software; (e) trasferire, vendere, affittare, aggregare, subappaltare, prestare
      o utilizzare i Servizi o qualsiasi Software per scopi di co-branding,
      timesharing o service bureau o comunque a beneficio di terzi; (f) utilizzare
      sistemi automatizzati, tra cui, a titolo esemplificativo, &quot;robot&quot;,
      &quot;spider&quot;, &quot;lettori offline&quot;, ecc., per accedere ai Servizi
      o a qualsiasi contenuto o funzionalità offerta da essi attraverso tecnologie o
      mezzi diversi da quelli forniti o autorizzati; (g) inviare spam, catene di
      Sant&apos;Antonio o altri messaggi di posta elettronica non richiesti; (h) <span
      >intraprendere intenzionalmente o consapevolmente qualsiasi
      attività che interferisca o interrompa i Servizi o i server o le reti collegate
      a essi; </span>(i) rimuovere, rovinare, oscurare o alterare qualsiasi avviso o
      etichetta di proprietà; (j) utilizzare intenzionalmente o consapevolmente i
      Servizi in modo da violare leggi o normative vigenti; (k) tentare di
      interferire, compromettere l&apos;integrità o la sicurezza del sistema o decifrare
      qualsiasi trasmissione da o verso i server che gestiscono i Servizi; caricare
      dati non validi, virus, worm o altri agenti software attraverso i Servizi;
      aggirare le misure che Oro Labs può mettere in atto per prevenire o limitare
      l&apos;accesso ai Servizi, incluse, a titolo esemplificativo, le funzioni che
      impediscono o limitano l&apos;uso o la copia di qualsiasi contenuto o funzione o che
      applicano limitazioni all&apos;uso dei Servizi o del contenuto o delle funzioni in
      essi presenti; (l) fingersi un&apos;altra persona o altrimenti travisare
      l&apos;affiliazione del Fornitore con una persona o un&apos;entità, condurre frodi,
      nascondere o tentare di nascondere l&apos;identità del Fornitore; o (m) accedere,
      distribuire o utilizzare per scopi commerciali qualsiasi parte dei Servizi o
      qualsiasi servizio o materiale disponibile attraverso di essi. </p>

      <p 
      ><b>1.4. </b>La &quot;<b>Durata</b>&quot; della licenza di
      utilizzo dei Servizi da parte del Fornitore coincide con il tempo in cui
      quest’ultimo continuerà a intrattenere un rapporto commerciale con Clienti che
      richiedano l&apos;uso o l&apos;accesso ai Servizi, a meno che Oro Labs non interrompa
      prima l&apos;accesso del Fornitore ai Servizi per qualsiasi motivo.  </p>

      <p 
      ><b>1.5. </b>Alla risoluzione o alla scadenza del presente
      Contratto, tutti i diritti e le licenze concessi da Oro Labs al Fornitore
      cesseranno immediatamente (ad eccezione di quanto stabilito nella Sezione 1.5
      del presente documento).  Su richiesta del Fornitore, Oro Labs compirà sforzi
      ragionevoli per cancellare i Dati del Fornitore (definiti di seguito) trasmessi
      dal Fornitore ai Servizi; a condizione, tuttavia, che Oro Labs possa conservare
      copie dei Dati del Fornitore: (i) fornite in modo indipendente dai Clienti di
      Oro Labs; (ii) come necessario per attenersi leggi, ai regolamenti o agli
      standard professionali vigenti; (iii) su server o fonti di back-up nel caso i
      Dati del Fornitore vengano cancellati dai dischi rigidi locali, a patto che non
      venga fatto alcun tentativo di recuperarli, e/o (iv) come altrimenti stabilito
      nella Sezione 3.5. </p>

      <p 
      ><b>1.6. Il </b>Fornitore è interamente responsabile del
      mantenimento della riservatezza della propria password e del proprio account.
      Inoltre, il Fornitore è interamente responsabile di tutte le attività che
      avvengono tramite il suo account. Il Fornitore si impegna a notificare
      immediatamente a Oro Labs in merito a qualsiasi uso non autorizzato, ignoto o
      sospetto, del proprio nome utente e della propria password o a qualsiasi altra
      violazione della sicurezza. Il Fornitore, e non Oro Labs, sarà responsabile per
      qualsiasi perdita che il Fornitore, Oro Labs e qualsiasi altra parte dovesse
      subire come risultato dell&apos;utilizzo da parte di estranei del nome utente, della
      password o dell&apos;account del Fornitore, solo nel caso e nella misura in cui tale
      utilizzo sia consentito dal Fornitore o sia il risultato del mancato
      mantenimento della riservatezza della password e delle informazioni del
      suddetto account. Il Fornitore non può utilizzare account diversi da quello
      personale se sprovvisto dell&apos;autorizzazione scritta da parte del titolare
      dell&apos;account. L&apos;account del Fornitore è unico e non può essere trasferito a
      terzi. </p>

      <p 
      ><b>1.7. </b>I Servizi possono essere modificati
      unilateralmente da Oro Labs. Oro Labs: (a) si riserva il diritto di ritirare o
      modificare i Servizi a sua esclusiva discrezione senza preavviso; e (b) non
      sarà responsabile se, per qualsiasi motivo, tutti o parte dei Servizi
      dovessero  risultare indisponibili in qualsiasi momento o per qualsiasi
      periodo.  </p>

      <p 
      ><b>1.8. Il </b>Fornitore è responsabile dell&apos;ottenimento e
      della manutenzione di qualsiasi apparecchiatura e servizio accessorio
      necessario per connettersi, accedere o utilizzare in altro modo i Servizi,
      compresi, a titolo esemplificativo, modem, hardware, server, software, sistemi
      operativi, reti, server web e simili. </p>

      <p
      > </p>

      <p className={styles.subtitle}><b>2. Registrazione dell’account </b></p>

      <p 
      ><b>2.1. </b>Prima di utilizzare i Servizi, il Fornitore
      deve completare il processo di registrazione dell&apos;account fornendo a Oro Labs
      informazioni aggiornate, complete e accurate come richiesto dal relativo modulo
      di registrazione. Ogni Utente autorizzato è tenuto a registrarsi una sola volta
      utilizzando un unico nome utente e il Fornitore farà in modo che nessun Utente
      autorizzato (a) si registri per conto di un&apos;altra persona; (b) si registri
      usando il nome di un&apos;altra persona o un nome fittizio o uno pseudonimo; (c)
      scelga un nome utente che costituisca o suggerisca un&apos;impersonificazione di
      qualsiasi altra persona (reale o fittizia) o entità o che lasci intendere che
      un Utente Autorizzato sia un rappresentante di un&apos;entità quando non lo è, o che
      sia offensivo; o (d) scelga un nome utente allo scopo di ingannare o fuorviare
      gli utenti e/o Oro Labs sulla sua vera identità. L&apos;Utente autorizzato accetta
      che le informazioni relative alla registrazione dell’account vengano conservate
      e aggiornate allo scopo di garantirne la veridicità, l’accuratezza, e la
      completezza. Se parte delle informazioni fornite dall&apos;Utente autorizzato
      dovesse risultare falsa, inaccurata, non aggiornata, incompleta, o dovesse
      violare i vincoli di cui sopra, Oro Labs avrebbe il diritto di chiudere
      l&apos;account dell&apos;Utente autorizzato e rifiutare l’utilizzo dei Servizi a partire
      da quella data.  </p>

      <p
      > </p>

      <p className={styles.subtitle}><b>3. Contenuto; feedback </b></p>

      <p 
      ><b>3.1 </b>Qualsiasi informazione o contenuto caricato,
      condiviso, memorizzato, fornito o trasferito attraverso i Servizi dagli Utenti
      autorizzati è inteso come &quot;Contenuto&quot; del Fornitore, comprese le
      informazioni sul profilo, le transazioni e gli altri dati che l&apos;Utente invia ai
      Servizi, le informazioni promozionali, i dati/dettagli delle transazioni, gli
      elenchi dei clienti, i dati che l&apos;Utente conserva sui propri clienti e
      fornitori, i dati personali, le informazioni di marketing o quelle correlate.
      Alcuni Contenuti possono essere visualizzati da altri utenti. L&apos;utente è
      l&apos;unico responsabile di tutti i Contenuti trasmessi ai Servizi. L&apos;utente
      dichiara che tutti i Contenuti da lui inviati sono accurati, completi,
      aggiornati e conformi a tutte le leggi, norme e regolamenti applicabili.
      L&apos;utente accetta di non pubblicare, caricare, condividere, archiviare o fornire
      in altro modo attraverso i Servizi contributi che: (i) violino i diritti
      d&apos;autore o altri diritti di terzi (ad esempio, marchi, diritti alla privacy,
      ecc.); (ii) contengano contenuti sessualmente espliciti o pornografici; (iii)
      contengano contenuti diffamatori o discriminatori o che incitino all&apos;odio
      contro qualsiasi individuo o gruppo; (iv) sfruttino i minori; (v) ritraggano
      atti illeciti o violenza estrema; (vi) ritraggano crudeltà verso gli animali o
      violenza estrema verso gli animali; (vii) promuovano schemi fraudolenti, schemi
      di marketing multilivello (MLM), schemi di arricchimento rapido, giochi
      d&apos;azzardo, presunti regali in denaro, attività lavorative da casa o qualsiasi
      altra dubbia attività di guadagno; o (viii) che violino qualsiasi legge. </p>

      <p 
      ><b>3.2.  </b><span>Per
      tutti i contenuti da esso forniti, il Fornitore con i presenti Termini concede 
      a Oro Labs il permesso di visualizzarli, eseguirli, tradurli, modificarli (per
      scopi tecnici, ad esempio per assicurarsi che essi siano visualizzabili su un
      dispositivo mobile), distribuirli, conservarli, riprodurli e agire in altro
      modo rispetto a essi tali (queste azioni sono collettivamente indicate come
      &quot;<b>Utilizzo</b>&quot;), in ogni caso per consentire a Oro Labs di offrire
      i propri Servizi, dato che ciò include anche include la fornitura di Contenuti
      ai Clienti con cui il Fornitore ha deciso di condividerli o pubblicarli.</span><span
     > </span></p>

      <p 
      ><b> 3.3. </b>L’utilizzo dei Contenuti da parte di Oro Labs
      sarà soggetto all&apos;Addendum sul Trattamento dei Dati, incorporato nel presente
      Accordo. L&apos;Addendum sul trattamento dei dati prevarrà, a seconda dei casi, in
      caso di conflitto con l&apos;Informativa sulla privacy o con il presente Accordo.
      L&apos;utente può contattare Oro Labs per ottenere una copia firmata dell’Addendum
      sul trattamento dei dati, se necessario, per la conformità alle leggi locali. </p>

      <p 
      ><b>3.4 </b>Il Fornitore è responsabile di tutti i Contenuti
      caricati, pubblicati o memorizzati attraverso il proprio utilizzo dei Servizi.
      Oro Labs non è responsabile per alcun Contenuto perso o non recuperabile se non
      come risultato di una grave negligenza o di un comportamento doloso da parte
      della stessa. Sebbene Oro Labs non abbia l&apos;obbligo di monitorare i Contenuti o
      l&apos;utilizzo dei Servizi da parte del Fornitore, può, a sua esclusiva
      discrezione, rimuovere completamente o parzialmente qualsiasi Contenuto, o
      proibire qualsiasi utilizzo dei Servizi presumibilmente inaccettabile, indesiderato,
      inappropriato o in violazione del presente Accordo. </p>

      <p 
      ><b>3.5. </b>Il Fornitore può richiedere che Oro Labs
      cancelli i Dati a esso associati, come stabilito nella Sezione 1.5. Tuttavia,
      il Fornitore riconosce e accetta specificamente che, nella misura in cui il
      Contenuto è stato precedentemente fornito a, o copiato o memorizzato da altri
      utenti (inclusi, ad esempio, i Clienti), tale Contenuto può essere conservato
      da Oro Labs allo scopo di continuare a fornire l&apos;accesso a tale Contenuto a
      tali utenti (e le concessioni qui stabilite rimarranno valide per tutto il
      tempo in cui tale accesso verrà fornito).<b> </b></p>

      <p 
      ><b>3.6. </b>Occasionalmente Oro Labs può fornire agli
      utenti l&apos;opportunità di inviare feedback e idee per il miglioramento dei
      Servizi su base volontaria. Il Fornitore accetta che (a) il suo feedback e
      l&apos;espressione delle sue idee e/o miglioramenti divengano automaticamente di
      proprietà di Oro Labs; (b) Oro Labs possa utilizzare o ridistribuire il
      feedback del Fornitore e il suo contenuto per qualsiasi scopo e in qualsiasi
      modo, senza alcuna restrizione, ad eccezione del fatto che Oro Labs si impegna
      di mantenere riservato il nome del Fornitore associato a tale feedback; (c) Oro
      Labs non ha l&apos;obbligo di esaminare alcun feedback; (d) non ha l&apos;obbligo di
      mantenere riservato alcun feedback; e (e) Oro Labs non ha alcun obbligo nei
      confronti del Fornitore o del contratto con lo stesso, implicito o meno.
      Fornendo feedback o idee, il Fornitore riconosce e accetta che Oro Labs e i
      suoi incaricati possano creare da soli o raccogliere numerosi contributi che
      possono risultare simili o identici ai feedback o alle idee che il Fornitore
      invia attraverso i Servizi o altri canali e mezzi. Il Fornitore con il presente
      accordo rinuncia a qualsiasi pretesa che possa aver avuto, possa avere al
      momento e/o in futuro, relativamente al fatto che i contributi accettati,
      rivisti e/o utilizzati da Oro Labs e dai suoi incaricati possano risultare
      simili ai propri. </p>

      <p
      ><b> </b></p>

      <p className={styles.subtitle}><b>4. Riservatezza; diritti di proprietà </b></p>

      <p 
      ><b>4.1. </b>Ciascuna Parte (la &quot;<b>Parte ricevente</b>&quot;)
      comprende che l&apos;altra Parte (la &quot;<b>Parte divulgatrice</b>&quot;) ha
      divulgato o può divulgare informazioni commerciali, tecniche o finanziarie
      relative all&apos;attività della Parte divulgatrice (di seguito denominate &quot;<b>Informazioni
      proprietarie</b>&quot; della Parte divulgatrice). Le Informazioni proprietarie
      di Oro Labs includono informazioni non pubbliche relative a caratteristiche,
      funzionalità e prestazioni dei Servizi. Le Informazioni proprietarie di ciascun
      Fornitore includono dati non pubblici su quel Fornitore comunicati a Oro Labs
      (&quot;<b>Dati del Fornitore</b>&quot;), Contenuti, e qualsiasi dato o
      informazione derivante dall&apos;uso dei Servizi da parte da parte di quest’ultimo.
      A scanso di equivoci, i Dati del Fornitore non includono i Dati Aggregati (come
      definiti di seguito) o qualsiasi dato, informazione o contenuto caricato da
      terze parti diverse dal Fornitore. La Parte ricevente si impegna a prendere
      ragionevoli precauzioni per proteggere tali Informazioni proprietarie e, ad
      eccezione dell&apos;utilizzo o dell&apos;esecuzione dei Servizi o di quanto altrimenti
      consentito nel presente documento, a non utilizzare o divulgare a terzi tali
      Informazioni proprietarie; a condizione, tuttavia, che queste ultime possano
      essere condivise con i propri appaltatori e/o agenti che abbiano una legittima
      necessità di conoscerle e che siano vincolati da obblighi di riservatezza
      almeno altrettanto rigorosi di quelli contenuti nel presente documento. La
      Parte divulgatrice conviene che quanto sopra non si applicherà a informazioni
      proprietarie dopo cinque (5) anni dalla loro divulgazione, o a informazioni che
      la Parte ricevente possa documentare (a) essere diventate di dominio pubblico
      senza che la Parte ricevente abbia agito in violazione del presente Accordo,
      (b) essere state in suo possesso o note prima di riceverle dalla Parte
      divulgatrice, (c) essere state legittimamente divulgate senza restrizioni da
      terze parti, o (d) essere state realizzate in modo indipendente senza
      l&apos;utilizzo di informazioni proprietarie della Parte divulgatrice. </p>

      <p 
      ><b>4.2. </b>Le Parti riconoscono e concordano che qualsiasi
      violazione o inadempimento degli obblighi di riservatezza di una Parte ai sensi
      del presente Accordo causerà un danno all&apos;altra Parte di importo difficilmente
      accertabile.  Di conseguenza, oltre a qualsiasi altro rimedio a cui una Parte
      possa avere diritto, la Parte non inadempiente avrà il diritto, senza prova di
      danni effettivi, di chiedere qualsiasi provvedimento ingiuntivo ordinato da
      qualsiasi tribunale della giurisdizione competente, compresa, ma non solo,
      un&apos;ingiunzione che impedisca qualsiasi violazione degli obblighi di
      riservatezza della Parte inadempiente ai sensi del presente accordo. </p>

      <p 
      ><b>4.3.</b> Se la Parte ricevente o uno dei suoi
      rappresentanti è costretta dalla legge a divulgare informazioni proprietarie,
      allora, nella misura consentita dalla legge, la Parte ricevente dovrà: (a)
      notificare prontamente, e prima di tale divulgazione, per iscritto alla Parte
      divulgatrice tale obbligo, in modo che quest&apos;ultima possa chiedere un ordine di
      protezione o un altro rimedio, o rinunciare al proprio diritto alla
      riservatezza ai sensi dei termini del presente Contratto; e (b) fornire
      un&apos;assistenza ragionevole alla Parte divulgatrice, a spese e costi esclusivi di
      quest&apos;ultima, nell&apos;opporsi a tale divulgazione o nel chiedere un ordine di protezione
      o altre limitazioni alla divulgazione. Se la Parte divulgatrice rinuncia
      all&apos;adempimento o, dopo aver fornito la comunicazione e l&apos;assistenza richieste
      ai sensi della presente Sezione 4.3, la Parte ricevente rimane obbligata per
      legge a divulgare Informazione proprietarie, la Parte ricevente divulgherà solo
      la parte delle Informazioni proprietarie che, su consiglio del consulente
      legale della Parte ricevente, è legalmente obbligata a divulgare e, su
      richiesta della Parte divulgatrice, farà ogni sforzo commercialmente
      ragionevole per ottenere garanzie dal tribunale competente o da altra autorità
      presiedente che tali Informazioni proprietarie saranno trattate in modo
      riservato. La divulgazione forzata da parte della Parte ricevente non influirà
      in alcun modo sugli obblighi della Parte ricevente in relazione alle
      Informazioni proprietarie così divulgate. </p>

      <p 
      ><b><span>4.4. Il </span></b><span
      >Fornitore sarà titolare e manterrà tutti i diritti e gli
      interessi relativi alle sue Informazioni Proprietarie, compresi i disegni, i marchi
      di fabbrica e di servizio e i loghi. Oro Labs deterrà e manterrà tutti i
      diritti, i titoli e gli interessi relativi alle sue Informazioni Proprietarie,
      inclusi (a) i Servizi e il Software, e tutte le migliorie o le modifiche ad
      essi, (b) qualsiasi software, applicazione, invenzione o altra tecnologia
      sviluppata in relazione ai Servizi di Implementazione o al supporto, (c) tutti
      i diritti di proprietà intellettuale relativi a quanto sopra, e (d) i disegni,
      i marchi di fabbrica e di servizio e i loghi di Oro Labs e dei Servizi, sia di
      proprietà di Oro Labs che concessi in licenza a Oro Labs.   </span></p>

      <p
      ><b><span>4.5. </span></b><span
      >Fatto salvo quanto diversamente previsto nel presente
      Contratto, Oro Labs avrà il diritto (nel corso del Periodo di validità del
      presente Contratto e al termine di esso) di utilizzare i dati e le informazioni
      relative all&apos;utilizzo dei Servizi da parte del Fornitore in maniera aggregata e
      anonima (&quot;Dati aggregati&quot;) per i propri scopi aziendali interni al
      fine di migliorare e potenziare i Servizi, compilare informazioni statistiche e
      sulle prestazioni, e per altri scopi di sviluppo, diagnostici e correttivi in
      relazione ai Servizi e alle altre offerte di Oro Labs. Tutti i diritti non
      espressamente concessi nel presente documento sono considerati negati. </span></p>

      <p
      ><b><span>4.6 </span></b><span
      >In aggiunta a quanto sopra, con riferimento ai soli
      Sottoscrittori, Oro Labs (i) si impegnerà ad adottare misure tecniche e
      organizzative commercialmente ragionevoli e appropriate, progettate per
      proteggere i Dati del Fornitore da perdite, accessi o divulgazioni non
      autorizzati e illegali, (ii) manterrà salvaguardie fisiche, elettroniche e
      procedurali in conformità alle leggi sulla privacy applicabili, tra cui, ma non
      solo: (a) il mantenimento di adeguate salvaguardie per limitare l&apos;accesso ai
      Dati del Fornitore ai dipendenti, agenti, licenziatari o fornitori di servizi
      di Oro Labs che necessitino di tali informazioni per adempiere agli obblighi di
      Oro Labs ai sensi del presente Contratto; (b) procedure e pratiche per la
      trasmissione sicura dei Dati del Fornitore; e (c) il mantenimento di adeguate
      salvaguardie per prevenire l&apos;accesso non autorizzato ai Dati del Fornitore. </span></p>

      <p
      > </p>

      <p className={styles.subtitle}><b>5. Garanzia ed esonero di responsabilità </b></p>

      <p
      ><b><span>5.1. </span></b><span
      >Ciascuna Parte dichiara, conviene e garantisce: (a) di
      essere conforme a tutte le leggi e normative vigenti durante il Periodo di
      validità nell&apos;esecuzione del presente Contratto; (b) di avere il pieno diritto,
      il potere e l&apos;autorità di stipulare il presente Contratto; (c) che il rispetto
      dei propri obblighi ai sensi del presente Contratto non viola e non violerà
      alcun altro accordo di cui è parte; e (d) che il presente Contratto costituisce
      un&apos;obbligazione legale, valida e vincolante al momento dell&apos;accettazione. Il
      Fornitore dichiara e garantisce inoltre di possedere o di avere le licenze, i
      diritti, i consensi e i permessi necessari per pubblicare e inviare i Contenuti
      e i Dati del Fornitore. Il Fornitore accetta inoltre che i Contenuti e i Dati
      del Fornitore che invia ai Servizi non debbano contenere materiale protetto da
      copyright di terzi o materiale soggetto ad altri diritti di proprietà di terzi,
      a meno che il Fornitore non abbia l&apos;autorizzazione del legittimo proprietario
      del materiale o sia altrimenti legalmente autorizzato a pubblicare il materiale
      e a concedere alla Società tutti i diritti di licenza qui concessi. </span></p>

      <p
      ><b><span>5.2. </span></b><span
      >Il Fornitore riconosce che i Servizi sono controllati e
      gestiti da Oro Labs dagli Stati Uniti. Se il Cliente che desidera acquistare i
      servizi dal Fornitore si trova al di fuori degli Stati Uniti, il Contenuto,
      incluse le informazioni personali, comunicate dal Fornitore saranno elaborate
      nel centro dati più vicino alla sede del Cliente, che potrebbe essere in un
      Paese diverso da quello in cui si trova il Fornitore. Oro Labs non dichiara o
      garantisce che i Servizi, o qualsiasi parte di essi, siano appropriati o
      disponibili per l&apos;uso in qualsiasi giurisdizione particolare. Il Fornitore e i
      suoi utenti autorizzati sono soggetti ai controlli sulle esportazioni degli
      Stati Uniti in relazione all&apos;uso dei Servizi e/o dei servizi ad essi correlati
      e sono responsabili di eventuali violazioni di tali controlli, compresi, senza
      eccezioni, eventuali embarghi degli Stati Uniti o altre norme e regolamenti
      federali che limitano le esportazioni. </span></p>

      <p
      ><b><span>5.3. </span></b><span
      >AD ECCEZIONE DELLE ESPLICITE GARANZIE DI CUI ALLA SEZIONE
      5.1, I SERVIZI SONO FORNITI &quot;COSÌ COME SONO&quot;. ORO LABS DECLINA
      SPECIFICAMENTE TUTTE LE GARANZIE IMPLICITE DI COMMERCIABILITÀ, IDONEITÀ PER UNO
      SCOPO PARTICOLARE E TITOLO. SENZA LIMITARE QUANTO SOPRA, ORO LABS NON FORNISCE
      ALCUN TIPO DI GARANZIA CHE I SERVIZI, I PRODOTTI DI TERZI, I CONTENUTI DI TERZI
      O I RISULTATI DELL&apos;USO DEI SERVIZI SODDISFINO I REQUISITI DEL FORNITORE O DI </span></p>

      <p
      ><span>QUALSIASI ALTRA
      PERSONA, CHE FUNZIONINO SENZA INTERRUZIONI, CHE RAGGIUNGANO I RISULTATI
      PREVISTI, CHE SIANO COMPATIBILI O CHE FUNZIONINO CON QUALSIASI SOFTWARE,
      SISTEMA O ALTRI SERVIZI, CHE SIANO SICURI, ACCURATI, COMPLETI, PRIVI DI CODICE
      DANNOSO O DI ERRORI. </span></p>

      <p
      > </p>

      <p className={styles.subtitle}><b>6. Limitazione di responsabilità </b></p>

      <p
      ><b><span>6.1. </span></b><span
      >AD ECCEZIONE DI VIOLAZIONI DELLA SEZIONE 1. 3, NELLA MISURA
      MASSIMA CONSENTITA DALLA NORMATIVA APPLICABILE, IN NESSUN CASO UNA DELLE PARTI
      SARÀ RESPONSABILE PER DANNI SPECIALI, INCIDENTALI, INDIRETTI, ESEMPLARI O
      CONSEQUENZIALI DI QUALSIASI TIPO (INCLUSI, SENZA LIMITAZIONI, DANNI PER PERDITA
      DI PROFITTI COMMERCIALI, INTERRUZIONE DELL&apos;ATTIVITÀ, PERDITA DI INFORMAZIONI
      COMMERCIALI, RICAVI, VENDITE O RISPARMI ANTICIPATI, O QUALSIASI ALTRA PERDITA
      PECUNIARIA), DERIVANTI DA O IN QUALSIASI MODO CORRELATI AL PRESENTE CONTRATTO,
      AI SERVIZI, AI PRODOTTI DI TERZI, AI SITI DI TERZI O AI CONTENUTI DI TERZI RESI
      DISPONIBILI ATTRAVERSO I SERVIZI, SIANO ESSI DERIVANTI DA ILLECITO CIVILE
      (INCLUSA LA NEGLIGENZA), DA CONTRATTO O DA QUALSIASI ALTRA TEORIA LEGALE, ANCHE
      SE TALE PARTE È STATA AVVISATA DELLA POSSIBILITÀ DI TALI DANNI.   </span></p>

      <p
      ><b><span>6.2. </span></b><span
      >AD ECCEZIONE DI VIOLAZIONI DELLA SEZIONE 1. 3, IN NESSUN
      CASO LA RESPONSABILITÀ COLLETTIVA AGGREGATA DI UNA DELLE PARTI O DELLE SUE
      AFFILIATE DERIVANTE DA O IN QUALSIASI MODO CORRELATA AL PRESENTE CONTRATTO, AI
      SERVIZI, AI PRODOTTI DI TERZI, AI SITI DI TERZI O AI CONTENUTI DI TERZI RESI
      DISPONIBILI ATTRAVERSO I SERVIZI, CHE SIA DERIVANTE DA O CORRELATA ALLA
      VIOLAZIONE DEL CONTRATTO, TORTO (INCLUSA LA NEGLIGENZA), RESPONSABILITÀ
      OGGETTIVA O QUALSIASI ALTRA TEORIA LEGALE O EQUA, POTRÀ SUPERARE IL MAGGIORE
      TRA (I) CENTO DOLLARI ($100) E (II) GLI IMPORTI TOTALI PAGATI (ED EVENTUALI
      IMPORTI MATURATI MA NON ANCORA PAGATI) DAL FORNITORE A ORO LABS NEL PERIODO DI
      6 MESI PRECEDENTE L&apos;EVENTO CHE HA DATO ORIGINE AL RECLAMO. </span></p>

      <p
      > </p>

      <p className={styles.subtitle}><b>7. Varie </b></p>

      <p
      ><b><span>7.1.
      Sopravvivenza</span></b><span>. Le seguenti sezioni del
      presente Contratto sopravvivranno alla risoluzione o alla scadenza dello
      stesso: Sezione 1.2, 1.3, 1.5, 3.4, 3.5, 4, 5, 6 e 7. </span></p>

      <p
      ><b><span>7.2.
      Separabilità</span></b><span>. Se una qualsiasi
      disposizione del presente Contratto è ritenuta inapplicabile o non valida, tale
      disposizione sarà limitata o eliminata nella misura minima necessaria affinché
      il presente Contratto rimanga altrimenti pienamente valido, efficace e
      applicabile. <b> </b> </span></p>

      <p
      ><b><span>7.3. Cessione</span></b><span
      >. Il presente Accordo non è cedibile, trasferibile o
      surrogabile da nessuna delle Parti, salvo previo consenso scritto dell&apos;altra;
      tuttavia, ciascuna Parte può cedere o trasferire il presente Accordo: (a) a una
      società affiliata qualora (i) il cessionario abbia accettato per iscritto di
      essere vincolato dai termini del presente Accordo, (ii) la Parte cedente
      rimanga responsabile degli obblighi previsti dal presente Accordo in caso di
      inadempienza del cessionario e (iii) la Parte cedente abbia notificato per
      iscritto all&apos;altra Parte la cessione; e (b) in caso di fusione, vendita di
      sostanzialmente tutte le azioni, i beni o l&apos;attività, o altra riorganizzazione
      che coinvolga la Parte cedente, e in tal caso non sarà necessario il previo
      consenso scritto della Parte non cedente, con l&apos;espressa intesa che, nei casi
      in cui la Parte cedente non sia l&apos;entità sopravvissuta, il presente Contratto
      vincolerà il successore nell&apos;interesse della Parte cedente in relazione a tutti
      gli obblighi qui previsti. Qualsiasi altro tentativo di trasferimento o
      cessione è da ritenersi non valido. </span></p>

      <p
      ><b><span>7.4. Forza
      maggiore</span></b><span>. Nel caso in cui una delle Parti
      incontri ritardi, ostacoli o impedimenti all&apos;esecuzione di qualsiasi atto
      previsto dal presente Contratto, ad eccezione di un obbligo di pagamento, a causa
      di scioperi, serrate, problemi di lavoro, impossibilità di procurarsi materiali
      o servizi, mancanza di energia elettrica, sommosse, insurrezioni, guerra o
      altre ragioni di natura analoga non imputabili alla Parte in ritardo
      nell&apos;esecuzione del lavoro o nell&apos;esecuzione di atti richiesti ai sensi del
      presente Accordo, tale Parte dovrà immediatamente informare l&apos;altra Parte di
      tale ritardo e l&apos;esecuzione di tale atto sarà esonerata per il periodo di
      ritardo e il termine per l&apos;esecuzione di tale atto sarà prorogato per un
      periodo equivalente al periodo di tale ritardo. </span></p>

      <p
      ><b><span>7.5.
      Completezza</span></b><span>. Il presente Contratto
      rappresenta la dichiarazione completa ed esclusiva della comprensione reciproca
      delle Parti e sostituisce e annulla tutti i precedenti accordi scritti e orali,
      le comunicazioni e le altre intese relative all&apos;oggetto del presente Contratto.
      Tutte le rinunce e le modifiche devono essere formulate per iscritto e firmate
      da entrambe le Parti, salvo quanto diversamente previsto nel presente
      documento. </span></p>

      <p
      ><b><span>7.6. Modifiche</span></b><span
      >. Oro Labs può occasionalmente rivedere e aggiornare questi
      Termini e Condizioni per i Fornitori a sua esclusiva discrezione. Tutte le
      modifiche hanno effetto immediato quando vengono rese disponibili su questo
      sito web e si applicheranno a tutti gli accessi e all&apos;utilizzo dei Servizi
      avvenuti in seguito. Tuttavia, qualsiasi modifica alle disposizioni sulla
      risoluzione delle controversie di cui alla Sezione </span></p>

      <p
      ><span>7.13 non si
      applicherà alle controversie per le quali le Parti abbiano ricevuto una
      notifica effettiva alla data o prima della pubblicazione della stessa su questo
      sito web.  Il proseguimento dell’utilizzo dei Servizi da parte del Fornitore
      dopo la pubblicazione dei Termini di servizio rivisti implica che il Fornitore
      accetta e concorda con le modifiche. Il Fornitore è invitato a controllare
      periodicamente questa pagina in modo da essere a conoscenza di eventuali
      modifiche, in quanto queste ultime sono per esso vincolanti. </span></p>

      <p
      ><b><span>7.7. Rapporti
      tra le parti</span></b><span>. Il presente Accordo non
      istituisce alcuna attività di agenzia, partnership, joint venture o impiego e
      il Fornitore non ha alcun tipo di autorità per vincolare Oro Labs in alcun
      modo. </span></p>

      <p
      ><b><span>7.8. Siti di
      terze parti</span></b><span>. I Servizi possono contenere
      link a inserzionisti, siti web o servizi di terze parti (&quot;<b>Siti di Terze
      Parti</b>&quot;). Il Fornitore riconosce e concorda che Oro Labs non è
      responsabile o perseguibile per: (i) la disponibilità o l&apos;accuratezza di tali
      Siti di Terze Parti, o (ii) il contenuto, i prodotti o le risorse presenti o
      disponibili su tali Siti di Terze Parti. Qualsiasi Sito di Terze Parti non
      implica alcuna approvazione da parte di Oro Labs di tali siti web o servizi. Se
      il Fornitore decide di accedere a uno qualsiasi dei Siti di Terze Parti
      collegati ai Servizi, il Fornitore lo fa interamente a proprio rischio e
      soggetto ai termini e alle condizioni d&apos;uso di tali Siti di Terze Parti,
      riconoscendo la sola propria responsabilità e assumendosi tutti i rischi derivanti
      dall&apos;uso di tali Siti di Terze Parti. </span></p>

      <p
      ><b><span>7.9. Prodotti
      di terze parti e contenuti di terze parti</span></b><span>.
      In relazione ai Servizi, il Fornitore può avere accesso o utilizzare
      applicazioni, integrazioni, software, servizi, sistemi o altri prodotti non
      sviluppati da Oro Labs (&quot;<b>Prodotti di Terze Parti</b>&quot;), o
      dati/contenuti derivati da tali Prodotti di Terze Parti o derivanti da un
      accordo tra Oro Labs e le suddette terze parti (collettivamente, &quot;<b>Contenuti
      di Terze Parti</b>&quot;). Oro Labs non può garantire che tali Contenuti di
      Terze Parti siano privi di materiale che l&apos;utente potrebbe trovare discutibile
      o altro. Inoltre, Oro Labs non garantisce o supporta i Prodotti o Contenuti di
      Terze Parti (sia che questi elementi siano o meno designati da Oro Labs come
      verificati o integrati con i Servizi) e declina ogni responsabilità per questi
      elementi e il loro accesso o integrazione con i Servizi, inclusa la loro
      modifica, cancellazione o divulgazione. Il Fornitore riconosce e accetta che
      tali Prodotti e Contenuti di terze parti costituiscano &quot;informazioni
      riservate&quot; del proprietario dei suddetti, in quanto tali, il Fornitore
      accetta di prendere ragionevoli precauzioni per proteggere tali Prodotti e
      Contenuti di terze parti, e a non utilizzarli (se non in relazione ai Servizi o
      come altrimenti consentito per iscritto dal proprietario) o divulgarli a terzi,
      ad eccezione dei propri appaltatori e/o agenti che ne hanno una legittima
      necessità e che sono vincolati da obblighi di riservatezza almeno altrettanto
      rigorosi di quelli esplicitati nel presente documento. </span></p>

      <p
      ><b><span>7.10.
      Comunicazioni</span></b><span>. Tutte le comunicazioni ai
      sensi del presente Contratto saranno effettuate per iscritto e si riterranno
      debitamente fornite al momento della ricezione, se consegnate personalmente; al
      momento della conferma elettronica della ricezione, se trasmesse via fax o
      e-mail; il giorno successivo all&apos;invio, se spedite per la consegna il giorno
      successivo tramite un servizio di consegna notturno riconosciuto; e al momento
      della ricezione, se inviate tramite posta certificata o raccomandata, con
      richiesta di ricevuta di ritorno. Qualsiasi comunicazione a Oro Labs può essere
      inviata a [EMAIL] o per posta indirizzata a <Address />. </span></p>

      <p
      ><b><span>7.11. Legge
      applicabile</span></b><span>. Il presente Contratto è
      disciplinato dalle leggi dello Stato del Delaware, senza alcun riferimento ai
      principi di incompatibilità. Qualsiasi controversia tra le Parti derivante da o
      correlata al presente Contratto sarà risolta esclusivamente mediante arbitrato
      JAMS, che si terrà in California o in un altro luogo concordato di comune
      accordo, e sarà condotto in conformità alle norme JAMS in vigore. La sentenza
      sul lodo emesso sarà definitiva e non appellabile e potrà essere emessa in
      qualsiasi tribunale competente. La Parte vincitrice avrà diritto al recupero di
      tutte le sue ragionevoli spese legali dall&apos;altra Parte, oltre a qualsiasi altro
      risarcimento danni. Entrambe le Parti rinunciano al diritto di partecipare a
      qualsiasi azione collettiva che coinvolga controversie tra le Parti e ciascuna
      di esse rinuncia al diritto a un processo con giuria. Tutte le richieste di
      risarcimento devono essere presentate a titolo individuale dalle Parti e non
      come attori o membri di una classe in presunte class action o presunti
      procedimenti rappresentativi e, salvo diverso accordo di Oro Labs, il giudice
      non può accorpare le richieste di risarcimento di più di una persona. Questa
      rinuncia all&apos;azione collettiva è una parte essenziale del presente accordo di
      arbitrato e non può essere separata. Se per qualsiasi motivo la rinuncia
      all&apos;azione collettiva dovesse risultare inapplicabile, l&apos;intero accordo di
      arbitrato sarà da considerare non valido. Tuttavia, la rinuncia al diritto al
      processo con giuria di cui alla presente Sezione 7.12 rimarrà in vigore a tutti
      gli effetti. </span></p>

      <p
      ><span>IL FORNITORE E
      ORO LABS CONCORDANO CHE QUALSIASI CAUSA DI AZIONE LEGALE DERIVANTE DA O
      CORRELATA AI SERVIZI O AL PRESENTE CONTRATTO DEVE ESSERE AVVIATA ENTRO UN (1)
      ANNO DALLA DATA DI MATURAZIONE DELLA CAUSA STESSA. IN CASO CONTRARIO, TALE
      CAUSA DI AZIONE È DA RITENERSI DEFINITIVAMENTE PRECLUSA. </span></p>

      <p
      ><b><span>7.13.
      Politica sul copyright</span></b><span>. Oro Labs rispetta
      i diritti di proprietà intellettuale di terzi e si aspetta che gli utenti dei
      Servizi facciano lo stesso. Oro Labs risponderà alle segnalazioni di presunte
      violazioni del copyright che siano conformi alle leggi vigenti e che siano
      correttamente fornite all&apos;agente designato di Oro Labs per il copyright (&quot;<b>Agente
      per il Copyright</b>&quot;). L&apos;Agente per il Copyright designato da Oro Labs
      per ricevere le segnalazioni in merito a presunte violazioni è:</span></p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>

      <p
      >&nbsp;</p>

      <p
      ><b><span>AVVERTENZA:</span></b><span
      > Questa è una traduzione non ufficiale fornita a solo scopo
      informativo. La versione originale in inglese dei Termini e Condizioni del
      Fornitore  (<OroButton label='disponibile qui inserire
      link' type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />) 
      è legalmente vincolante e prevale in caso di conflitto o discrepanza con questa
      traduzione non ufficiale.</span></p>
    </div>
  )
}
