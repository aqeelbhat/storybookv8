/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import { Address } from './EnSTC'
import styles from './stc.module.scss'
import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'

export function FrSTC (props: {
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro Labs, Inc. Conditions
      générales pour les fournisseurs Date d&apos;entrée en vigueur {getLocalDateString((new Date()).toString(), 'fr')}</b></p>

      <p
      >Ces Conditions générales pour les
      fournisseurs régissent votre accès et votre utilisation des services (les
      &quot;<b>Services</b>&quot;), propriété de Oro Labs, Inc., une société du
      Delaware (&quot;<b>Oro Labs</b>&quot;). EN UTILISANT LES SERVICES, OU EN
      ACCEPTANT AUTREMENT CES TERMES EN ACCÉDANT À CE SITE WEB, EN CLIQUANT SUR
      &quot;<span>CONTINUER</span>&quot;, VOUS (« <b>FOURNISSEUR</b>
      ») ACCEPTEZ D&apos;ÊTRE LIÉ ET DE RESPECTER CES CONDITIONS GÉNÉRALES POUR LES
      FOURNISSEURS. SI VOUS NE SOUHAITEZ PAS ACCEPTER CES CONDITIONS GÉNÉRALES, VOUS
      NE DEVEZ PAS ACCÉDER NI UTILISER LES SERVICES. Si vous acceptez cet accord au
      nom d&apos;une société, d&apos;une entreprise, d&apos;une corporation ou d&apos;une autre entité,
      vous et ladite société, entreprise, corporation ou autre entité respective
      déclarez et garantissez chacun avoir le pouvoir de lier ladite entité à cet
      accord, auquel cas les termes &quot;<b>vous</b>&quot; ou &quot;<b>Fournisseur</b>&quot;
      désigneront ladite entité. Oro Labs et le Fournisseur sont chacun désignés
      ci-après comme une &quot;<b>Partie</b>&quot; et ensemble comme les &quot;<b>Parties</b>&quot;.
      </p>

      <p
      >Les Services comprennent l&apos;accès à la
      plateforme d&apos;Oro Labs pour faciliter la soumission et la gestion des matériaux
      d&apos;approvisionnement entre le Fournisseur et un ou plusieurs clients d&apos;Oro Labs
      (chacun, un &quot;<b>Client</b>&quot;) afin de participer aux activités
      d&apos;approvisionnement par le Fournisseur pour ledit Client. Chaque Client avec
      lequel vous interagissez via les Services peut vous demander d&apos;accepter des
      termes supplémentaires dans le cadre de votre relation avec ledit Client. De
      tels termes supplémentaires peuvent vous être présentés pour acceptation via
      les Services. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >1.<span>&nbsp; </span></span>Portée
      du Service ; Durée </b></p>

      <p
      ><b>1.1.</b> Pendant la Durée (telle
      que définie ci-dessous), Oro Labs accorde au Fournisseur et à ses employés,
      contractants et agents (&quot;<b>Utilisateurs Autorisés</b>&quot;) une licence
      limitée, non exclusive, non transférable (sauf conformément à la Section 7.3)
      pour accéder et utiliser les Services à des fins commerciales internes du
      Fournisseur conformément aux termes de cet Accord. Oro Labs se réserve tous les
      droits non expressément accordés dans et aux Services. </p>

      <p
      ><b>1.2.</b> Les Services sont
      actuellement disponibles gratuitement pour le Fournisseur, mais Oro Labs se
      réserve le droit de facturer certains ou l&apos;ensemble des Services à l&apos;avenir.
      Oro Labs vous informera avant que tout Service que vous utilisez alors commence
      à être facturé, et si vous souhaitez continuer à utiliser de tels Services,
      vous devrez payer tous les frais applicables pour ces Services. </p>

      <p
      ><b>1.3. </b>En condition de
      l&apos;utilisation par le Fournisseur des Services et de l&apos;accès à ceux-ci, le
      Fournisseur accepte de ne pas utiliser les Services à des fins illicites ou
      d&apos;une manière violant cet Accord. Toute utilisation des Services en violation
      de cet Accord peut entraîner, entre autres choses, la résiliation ou la
      suspension du compte du Fournisseur et de sa capacité à utiliser les Services.
      Le Fournisseur ne peut pas s&apos;engager dans l&apos;une des activités interdites
      suivantes : (a) directement ou indirectement, rétroconcevoir, décompiler,
      désassembler, séparer ou tenter autrement de découvrir ou de dériver le code
      source, le code objet ou la structure sous-jacente, les idées, le savoir-faire
      ou les algorithmes pertinents aux Services ou à tout logiciel, documentation ou
      données liés aux Services (&quot;<b>Logiciel</b>&quot;) ; (b) copier,
      distribuer, transmettre ou divulguer une partie quelconque des Services dans
      quelque support que ce soit, y compris, sans limitation, par tout
      &quot;exploration de données web&quot; automatisé ou non automatisé ; (c)
      collecter ou récolter des Données Personnelles (&quot;DP&quot;), y compris des
      noms de compte, à partir des Services ; (d) modifier, adapter, traduire ou
      créer des œuvres dérivées basées sur les Services ou le Logiciel ; (e)
      transférer, vendre, louer, syndiquer, sous-syndiquer, prêter ou utiliser les
      Services ou tout Logiciel à des fins de co-marquage, de temps partagé ou de
      bureau de services ou autrement pour le bénéfice d&apos;un tiers ; (f) utiliser tout
      système automatisé, y compris, sans limitation, des &quot;robots&quot;, des
      &quot;araignées&quot;, des &quot;lecteurs hors ligne&quot;, etc., pour accéder
      aux Services, ou accéder à tout contenu ou fonctionnalité des Services par le
      biais de toute technologie ou moyen autre que ceux fournis ou autorisés par les
      Services ; (g) transmettre du spam, des chaînes de lettres ou d&apos;autres e-mails
      non sollicités ; (h) intentionnellement ou sciemment s&apos;engager dans toute
      activité qui interfère avec ou perturbe les Services ou les serveurs ou réseaux
      connectés aux Services ; (i) supprimer, défigurer, obscurcir ou altérer toute
      mention ou étiquette de propriété ; (j) intentionnellement ou sciemment
      utiliser les Services d&apos;une manière violant toute loi ou réglementation
      applicable ; (k) tenter d&apos;interférer avec, compromettre l&apos;intégrité ou la
      sécurité du système, ou déchiirer toute transmission vers ou depuis les
      serveurs exécutant les Services ; télécharger des données invalides, des virus,
      des vers ou d&apos;autres agents logiciels via les Services ; contourner les mesures
      qu&apos;Oro Labs peut utiliser pour empêcher ou restreindre l&apos;accès aux Services, y
      compris, sans limitation, les fonctionnalités qui empêchent ou restreignent
      l&apos;utilisation ou la copie de tout contenu ou fonctionnalité ou imposent des
      limitations sur l&apos;utilisation des Services ou du contenu ou des fonctionnalités
      qui y sont ; (l) se faire passer pour une autre personne ou représenter
      autrement l&apos;aiiliation du Fournisseur avec une personne ou une entité, mener
      une fraude, cacher ou tenter de cacher l&apos;identité du Fournisseur ; ou (m)
      accéder, distribuer ou utiliser à des fins commerciales toute partie des
      Services ou tout service ou matériel disponible via les Services. </p>

      <p
      ><b>1.4.</b> La &quot;<b>Durée</b>&quot;
      de l&apos;utilisation par le Fournisseur des Services sera aussi longtemps que le
      Fournisseur continuera à avoir une relation commerciale avec un Client
      nécessitant l&apos;utilisation ou l&apos;accès aux Services, sauf si Oro Labs met fin
      plus tôt à l&apos;accès du Fournisseur aux Services pour une raison quelconque. </p>

      <p
      ><b>1.5.</b> À la résiliation ou à
      l&apos;expiration de cet Accord, tous les droits et licences accordés par Oro Labs
      au Fournisseur prendront fin immédiatement (sauf indication contraire à la
      présente Section 1.5). À la demande du Fournisseur, Oro Labs fera des eiorts
      raisonnables pour supprimer les Données du Fournisseur (définies ci-dessous)
      fournies par le Fournisseur aux Services ; cependant, Oro Labs peut conserver
      des copies des Données du Fournisseur : (i) fournies indépendamment par les
      Clients d&apos;Oro Labs ; (ii) si nécessaire pour se conformer à la loi, à la
      réglementation ou aux normes professionnelles applicables ; (iii) sur des
      serveurs ou des sources de sauvegarde si ces Données du Fournisseur sont
      supprimées des disques durs locaux et qu&apos;aucune tentative n&apos;est faite pour
      récupérer ces Données du Fournisseur à partir de ces serveurs ou sources de
      sauvegarde, et/ou (iv) comme indiqué autrement dans la Section 3.5. </p>

      <p
      ><b>1.6.</b> Le Fournisseur est
      entièrement responsable de maintenir la confidentialité de son mot de passe et
      de son compte. De plus, le Fournisseur est entièrement responsable de toutes
      les activités sur son compte. Le Fournisseur accepte de notifier immédiatement
      Oro Labs de toute utilisation non autorisée connue ou suspectée de son nom
      d&apos;utilisateur et de son mot de passe ou de toute autre violation de la
      sécurité. Le Fournisseur, et non Oro Labs, sera responsable de toute perte que
      le Fournisseur, Oro Labs et toute autre partie pourraient subir en raison de
      l&apos;utilisation par une autre personne du nom d&apos;utilisateur, du mot de passe ou
      du compte du Fournisseur, uniquement dans la mesure où cette utilisation est
      autorisée par le Fournisseur ou résulte de la négligence du Fournisseur dans le
      maintien de la confidentialité de son mot de passe et de ses informations de
      compte. Le Fournisseur ne peut pas utiliser le compte de quelqu&apos;un d&apos;autre à
      tout moment, sans la permission écrite du titulaire du compte. Le compte du
      Fournisseur est unique et ne peut pas être transféré à un tiers. </p>

      <p
      ><b>1.7.</b> Les Services peuvent être
      modifiés par Oro Labs à sa discrétion de temps à autre. Oro Labs : (a) se
      réserve le droit de retirer ou de modifier les Services à sa seule discrétion
      et sans préavis ; et (b) ne sera pas responsable si, pour une raison
      quelconque, tout ou partie des Services ne sont pas disponibles à tout moment
      ou pour toute période. </p>

      <p
      ><b>1.8.</b> Le Fournisseur est
      responsable de l&apos;obtention et de la maintenance de tout équipement et services
      auxiliaires nécessaires pour se connecter aux Services, y accéder ou les
      utiliser, y compris, sans limitation, les modems, le matériel, les serveurs, les
      logiciels, les systèmes d&apos;exploitation, les réseaux, les serveurs web et
      similaires. </p>

      <p><span
      > </span></p>s

      <p className={styles.subtitle}><b><span
      >2.<span>&nbsp; </span></span>Enregistrement
      du compte </b></p>

      <p
      ><b>2.1.</b> Avant d&apos;utiliser les
      Services, le Fournisseur doit compléter le processus d&apos;inscription en
      fournissant à Oro Labs des informations actuelles, complètes et exactes telles
      que demandées par le formulaire d&apos;inscription applicable. Chaque Utilisateur
      Autorisé ne s&apos;inscrira qu&apos;une seule fois en utilisant un seul nom d&apos;utilisateur
      et le Fournisseur veillera à ce qu&apos;aucun Utilisateur Autorisé ne (a) s&apos;inscrive
      au nom d&apos;une autre personne ; (b) s&apos;inscrive sous le nom d&apos;une autre personne
      ou sous un nom fictif ou un alias ; (c) choisisse un nom d&apos;utilisateur qui
      constitue ou suggère une impersonation de toute autre personne (réelle ou
      fictive) ou entité ou que l&apos;Utilisateur Autorisé soit un représentant d&apos;une
      entité alors qu&apos;il ne l&apos;est pas, ou qui est oiensant ; ou (d) choisisse un nom
      d&apos;utilisateur dans le but de tromper ou de tromper les utilisateurs et/ou Oro
      Labs quant à la véritable identité d&apos;un Utilisateur Autorisé. L&apos;Utilisateur
      Autorisé accepte de maintenir et de mettre à jour toutes les informations
      d&apos;inscription au compte afin de les conserver véridiques, exactes, à jour et
      complètes. Si les informations fournies par l&apos;Utilisateur Autorisé sont
      fausses, inexactes, non à jour, incomplètes, ou enfreignent autrement les
      restrictions énoncées cidessus, Oro Labs se réserve le droit de résilier le
      compte de l&apos;Utilisateur Autorisé et de refuser toute utilisation actuelle ou
      future des Services. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >3.<span>&nbsp; </span></span>Contenu
      ; Retours d&apos;information </b></p>

      <p
      ><b>3.1.</b> Toute information ou
      contenu téléchargé, partagé, stocké, fourni ou transféré par les Utilisateurs
      Autorisés à travers les Services est le &quot;Contenu&quot; du Fournisseur, y
      compris les informations de profil, les données de transaction et autres
      données que vous envoyez aux Services, les informations promotionnelles, les
      détails des transactions, les listes de clients, les données que vous maintenez
      sur vos clients et fournisseurs, les données personnelles, les informations marketing
      ou les informations connexes. Certains contenus peuvent être consultables par
      d&apos;autres utilisateurs. Vous êtes seul responsable de tout Contenu que vous
      contribuez aux Services. Vous déclarez que tout Contenu soumis par vous est
      exact, complet, à jour et conforme à toutes les lois, règles et réglementations
      applicables. Vous acceptez de ne pas publier, télécharger, partager, stocker ou
      fournir autrement via les Services toute Soumission d&apos;Utilisateur qui : (i)
      enfreint les droits d&apos;auteur ou autres droits de tiers (par exemple, droits des
      marques, droits de confidentialité, etc.) ; (ii) contient un contenu
      sexuellement explicite ou de la pornographie ; (iii) contient un contenu
      haineux, diiamatoire ou discriminatoire ou incite à la haine contre un individu
      ou un groupe ; (iv) exploite les mineurs ; (v) dépeint des actes illégaux ou
      une violence extrême ; (vi) dépeint la cruauté envers les animaux ou une
      violence extrême envers les animaux ; (vii) promeut des schémas frauduleux, des
      schémas de marketing de réseau (MLM), des schémas pour devenir riche
      rapidement, des jeux et jeux d&apos;argent en ligne, des dons d&apos;argent, des
      entreprises de travail à domicile, ou tout autre entreprise douteuse pour
      gagner de l&apos;argent ; ou (viii) qui enfreint toute loi. </p>

      <p
      ><b>3.2.</b> Pour tout Contenu, le
      Fournisseur accorde par la présente à Oro Labs une licence pour aiicher,
      exécuter, traduire, modifier (à des fins techniques, par exemple, s&apos;assurer que
      le Contenu est visible sur un appareil mobile), distribuer, conserver, reproduire
      et agir autrement à l&apos;égard de ce Contenu (collectivement,
      &quot;Utilisation&quot;), dans chaque cas pour permettre à Oro Labs de fournir
      les Services, ce qui comprend la fourniture du Contenu aux Clients avec
      lesquels le Fournisseur a décidé de partager ou de publier ce Contenu. </p>

      <p
      ><b>3.3.</b> L&apos;utilisation par Oro
      Labs du Contenu sera soumise à l&apos;Addendum de Traitement des Données, incorporé
      dans le présent Accord. L&apos;Addendum de Traitement des Données contrôlera, le cas
      échéant, en cas de conflit avec la Politique de Confidentialité ou le présent
      Accord. Vous pouvez contacter Oro Labs pour obtenir une copie signée de
      l&apos;extrait de l&apos;Addendum de Traitement des Données si nécessaire, pour la
      conformité à la loi locale. </p>

      <p
      ><b>3.4.</b> Le Fournisseur est
      responsable de tout Contenu téléchargé, publié ou stocké par le biais de
      l&apos;utilisation par le Fournisseur des Services. Oro Labs n&apos;est pas responsable
      de tout Contenu perdu ou irrécupérable, sauf en cas de négligence grave ou de
      faute intentionnelle de la part d&apos;Oro Labs. Bien qu&apos;Oro Labs n&apos;ait aucune
      obligation de surveiller le Contenu ou l&apos;utilisation par le Fournisseur des
      Services, Oro Labs peut, à sa seule discrétion, supprimer tout Contenu, en tout
      ou en partie, ou interdire toute utilisation des Services présumée
      inacceptable, indésirable, inappropriée, ou en violation de cet Accord. </p>

      <p
      ><b>3.5.</b> Le Fournisseur peut
      demander à Oro Labs de supprimer les Données du Fournisseur conformément à la
      Section 1.5. Cependant, le Fournisseur reconnaît et accepte spécifiquement que,
      dans la mesure où le Contenu a précédemment été fourni à, ou copié ou stocké
      par d&apos;autres utilisateurs (y compris, par exemple, les Clients), ce Contenu
      peut être conservé par Oro Labs dans le but de continuer à fournir l&apos;accès à ce
      Contenu à ces utilisateurs (et les licences énoncées ici continueront tant que
      cet accès sera fourni). </p>

      <p
      ><b>3.6.</b> De temps à autre, Oro
      Labs peut oirir aux utilisateurs la possibilité de soumettre volontairement des
      retours d&apos;informations et des idées d&apos;améliorations liées aux Services. Le
      Fournisseur convient que (a) ses retours d&apos;informations et l&apos;expression de ses
      idées et/ou améliorations deviendront automatiquement la propriété d&apos;Oro Labs
      et seront détenus par Oro Labs ; (b) Oro Labs peut utiliser ou redistribuer les
      retours d&apos;informations du Fournisseur et leur contenu à des fins et de quelque
      manière que ce soit et sans aucune restriction, à l&apos;exception qu&apos;Oro Labs
      accepte de garder confidentiel le nom du Fournisseur associé à ces retours
      d&apos;informations ; (c) il n&apos;y a aucune obligation pour Oro Labs de passer en
      revue les retours d&apos;informations ; (d) il n&apos;y a aucune obligation de garder
      confidentielles les retours d&apos;informations ; et (e) Oro Labs n&apos;a aucune
      obligation envers le Fournisseur ou aucun contrat avec le Fournisseur,
      implicite ou autre. En fournissant des retours d&apos;informations ou des idées, le
      Fournisseur reconnaît et accepte qu&apos;Oro Labs et ses mandataires puissent créer
      de leur propre chef ou obtenir de nombreuses soumissions qui peuvent être
      similaires ou identiques aux retours d&apos;informations ou aux idées que le
      Fournisseur soumet via les Services ou d&apos;autres canaux et moyens. Le
      Fournisseur renonce par la présente à toute réclamation qu&apos;il aurait pu avoir,
      peut avoir, et/ou pourrait avoir à l&apos;avenir, selon laquelle les soumissions acceptées,
      examinées et/ou utilisées par Oro Labs et ses mandataires pourraient être
      similaires aux retours d&apos;informations ou aux idées du Fournisseur. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >4.<span>&nbsp; </span></span>Confidentialité
      ; Droits de Propriété </b></p>

      <p
      ><b>4.1.</b> Chaque Partie (la &quot;<b>Partie
      Réceptrice</b> &quot;) comprend que l&apos;autre Partie (la &quot;<b>Partie
      Divulgatrice</b>&quot;) a divulgué ou peut divulguer des informations
      commerciales, techniques ou financières relatives à l&apos;activité de la Partie
      Divulgatrice (ci-après dénommées &quot;<b>Informations confidentielles</b>&quot;
      de la Partie Divulgatrice). Les Informations confidentielles d&apos;Oro Labs
      comprennent des informations non publiques concernant les fonctionnalités, la
      performance et les performances des Services. Les Informations confidentielles
      de chaque Fournisseur comprennent des données non publiques sur ce Fournisseur
      fournies par ce Fournisseur à Oro Labs (&quot;<b>Données du Fournisseur</b>&quot;),
      le Contenu, et toutes les données ou informations dérivées de l&apos;utilisation par
      le Fournisseur des Services. Pour éviter toute confusion, les Données du
      Fournisseur n&apos;incluent pas les Données Agrégées (telles que définies
      ci-dessous) ou toute donnée, information ou contenu téléchargé par des tiers
      autres que le Fournisseur. La Partie Réceptrice accepte de prendre des
      précautions raisonnables pour protéger de telles Informations confidentielles,
      et, sauf pour utiliser ou exécuter les Services ou tel que autrement permis
      dans les présentes, de ne pas utiliser ou divulguer à une tierce personne de
      telles Informations confidentielles ; cependant, la Partie Réceptrice peut
      divulguer les Informations confidentielles à ses entrepreneurs et/ou agents qui
      ont un besoin légitime de connaître les Informations confidentielles et qui
      sont liés par des obligations de confidentialité au moins aussi strictes que
      celles contenues dans les présentes. La Partie Divulgatrice convient que ce qui
      précède ne s&apos;appliquera pas à toute information après cinq (5) ans suivant la
      divulgation de celle-ci, ou toute information que la Partie Réceptrice peut
      documenter (a) est ou devient généralement disponible au public sans aucune
      action de la Partie Réceptrice en violation de cet Accord, (b) était en sa
      possession ou connue de celle-ci avant la réception de la Partie Divulgatrice,
      (c) lui a été divulguée de manière licite sans restriction par un tiers, ou (d)
      a été développée indépendamment sans utiliser aucune Information Propriétaire de
      la Partie Divulgatrice. </p>

      <p
      ><b>4.2.</b> Les Parties reconnaissent
      et conviennent par les présentes qu&apos;une violation ou un défaut des obligations
      de confidentialité d&apos;une Partie en vertu du présent Accord causera des dommages
      à l&apos;autre Partie dans une mesure diiicile à établir. En conséquence, en plus de
      tout autre recours auquel une Partie peut avoir droit, la Partie non
      défaillante aura droit, sans preuve de dommages réels, à rechercher tout
      recours injonctif ordonné par tout tribunal compétent, y compris, mais sans s&apos;y
      limiter, une injonction interdisant toute violation par la Partie défaillante
      de ses obligations de confidentialité aux termes des présentes. </p>

      <p
      ><b>4.3.</b> Si la Partie Réceptrice
      ou l&apos;un de ses représentants est contraint par la loi applicable de divulguer
      des Informations confidentielles, alors, dans la mesure permise par la loi
      applicable, la Partie Réceptrice doit : (a) notifier immédiatement et par écrit
      à la Partie Divulgatrice de cette exigence afin que la Partie Divulgatrice
      puisse demander une ordonnance de protection ou tout autre recours, ou renoncer
      à son droit à la confidentialité conformément aux termes du présent Accord ; et
      (b) fournir une assistance raisonnable à la Partie Divulgatrice, aux seuls
      frais et dépens de la Partie Divulgatrice, pour s&apos;opposer à cette divulgation
      ou demander une ordonnance de protection ou d&apos;autres limitations de
      divulgation. Si la Partie Divulgatrice renonce à se conformer ou, après avoir
      fourni l&apos;avis et l&apos;assistance requis en vertu de cette Section 4.3, la Partie
      Réceptrice demeure tenue par la loi de divulguer des Informations
      confidentielles, la Partie Réceptrice ne divulguera que la portion des
      Informations confidentielles que, sur les conseils du conseiller juridique de
      la Partie Réceptrice, la Partie Réceptrice est légalement tenue de divulguer
      et, sur demande de la Partie Divulgatrice, fera des eiorts commercialement
      raisonnables pour obtenir des assurances de la part du tribunal compétent ou de
      toute autre autorité compétente que de telles Informations confidentielles
      bénéficieront d&apos;un traitement confidentiel. Aucune divulgation contrainte par
      la Partie Réceptrice n&apos;aiectera autrement les obligations de la Partie
      Réceptrice en vertu du présent Accord concernant les Informations
      confidentielles ainsi divulguées. </p>

      <p
      ><b>4.4.</b> Le Fournisseur possédera
      et conservera tous les droits, titres et intérêts sur ses Informations
      confidentielles, y compris les conceptions, marques de commerce, marques de
      service et logos du Fournisseur. Oro Labs possédera et conservera tous les
      droits, titres et intérêts sur ses Informations confidentielles, y compris (a)
      les Services et le Logiciel, ainsi que toutes les améliorations, améliorations
      ou modifications y apportées, (b) tout logiciel, applications, inventions ou
      autre technologie développés dans le cadre des Services de Mise en œuvre ou du
      support, (c) tous les droits de propriété intellectuelle liés à ce qui précède,
      et (d) les conceptions, marques de commerce, marques de service et logos d&apos;Oro
      Labs et des Services, qu&apos;ils soient détenus ou concédés en licence à Oro Labs. </p>

      <p
      ><b>4.5.</b> Nonobstant toute
      disposition contraire du présent Accord, Oro Labs aura le droit (pendant et
      après la durée des présentes) d&apos;utiliser les données et informations relatives
      à l&apos;utilisation des Services par le Fournisseur de manière agrégée et
      anonymisée (&quot;<b>Données Agrégées</b>&quot;) à des fins internes visant à
      améliorer et à renforcer les Services, à compiler des informations statistiques
      et de performance, et à d&apos;autres fins de développement, diagnostiques et
      correctives en relation avec les Services et les autres oires d&apos;Oro Labs. Tous
      les droits non expressément accordés aux présentes sont réputés réservés. </p>

      <p
      ><b>4.6</b> En plus de ce qui précède,
      en ce qui concerne uniquement les Abonnés, Oro Labs (i) maintiendra des mesures
      techniques et organisationnelles commercialement raisonnables et appropriées
      conçues pour protéger les Données du Fournisseur contre toute perte, accès ou
      divulgation non autorisés et illégaux, (ii) maintiendra des mesures de
      sauvegarde physiques, électroniques et procédurales conformes aux lois sur la
      confidentialité applicables, notamment : (a) le maintien de mesures de
      sauvegarde appropriées pour restreindre l&apos;accès aux Données du Fournisseur aux
      employés, agents, concédants de licences ou fournisseurs de services d&apos;Oro Labs
      qui ont besoin de ces informations pour remplir les obligations d&apos;Oro Labs en
      vertu de cet Accord ; (b) des procédures et pratiques pour la transmission ou
      le transport sécurisé des Données du Fournisseur ; et (c) le maintien de mesures
      de sauvegarde appropriées pour empêcher l&apos;accès non autorisé aux Données du
      Fournisseur. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >5.<span>&nbsp; </span></span>Garantie
      et Clause de non-responsabilité </b></p>

      <p
      ><b>5.1.</b> Chaque Partie déclare,
      garantit et atteste par les présentes que : (a) elle sera en conformité avec
      toutes les lois et réglementations applicables pendant la durée du présent
      Accord ; (b) elle a le plein droit, le pouvoir et l&apos;autorité d&apos;entrer dans le
      présent Accord ; (c) l&apos;exécution de ses obligations en vertu du présent Accord
      ne viole pas et ne violera pas tout autre accord auquel elle est partie ; et
      (d) le présent Accord constitue une obligation légale, valide et contraignante
      lorsqu&apos;il est accepté. Le Fournisseur déclare en outre et garantit qu&apos;il
      possède ou dispose des licences, droits, consentements et autorisations
      nécessaires pour publier et soumettre le Contenu et les Données du Fournisseur.
      Le Fournisseur convient en outre que le Contenu et les Données du Fournisseur
      qu&apos;il soumet aux Services ne contiendront pas de matériel protégé par des
      droits d&apos;auteur de tiers, ou de matériel qui est soumis à d&apos;autres droits de
      propriété de tiers, à moins que le Fournisseur n&apos;ait la permission du
      propriétaire légitime du matériel ou que le Fournisseur ait légalement le droit
      de publier le matériel et de concéder à la Société tous les droits de licence
      accordés aux présentes. </p>

      <p
      ><b>5.2.</b> Le Fournisseur reconnaît
      que les Services sont contrôlés et exploités par Oro Labs depuis les ÉtatsUnis.
      Si le Client qui souhaite se procurer des services auprès du Fournisseur est
      situé en dehors des États-Unis, le Contenu, y compris les informations
      personnelles, fournies par le Fournisseur sera traité dans le centre de données
      le plus proche de l&apos;emplacement du Client, qui peut se trouver dans un pays
      diiérent de celui où se trouve le Fournisseur. Oro Labs ne déclare ni ne
      garantit que les Services, ou une partie de ceux-ci, sont appropriés ou
      disponibles pour une utilisation dans une juridiction particulière. Le
      Fournisseur et ses utilisateurs autorisés sont soumis aux contrôles à
      l&apos;exportation des États-Unis en relation avec l&apos;utilisation des Services et/ou
      des services connexes et sont responsables de toute violation de ces contrôles,
      y compris, sans s&apos;y limiter, tout embargo des États-Unis ou d&apos;autres règles et
      réglementations fédérales restreignant les exportations. </p>

      <p
      ><b>5.3.</b> SAUF POUR LES GARANTIES
      EXPLICITES ÉNONCÉES À LA SECTION 5.1, LES SERVICES SONT FOURNIS &quot;TEL
      QUEL&quot;. ORO LABS DÉCLINE SPÉCIFIQUEMENT TOUTE GARANTIE IMPLICITE DE QUALITÉ
      MARCHANDE, D&apos;ADÉQUATION À UN USAGE PARTICULIER ET DE TITRE. SANS LIMITER LA
      PORTÉE DE CE QUI PRÉCÈDE, ORO LABS NE FAIT AUCUNE GARANTIE DE QUE LES SERVICES,
      LES PRODUITS TIERS, LE CONTENU TIERS, OU LES RÉSULTATS DE L&apos;UTILISATION DES
      SERVICES, RÉPONDRONT AUX EXIGENCES DU FOURNISSEUR OU DE TOUTE AUTRE PERSONNE, FONCTIONNERONT
      SANS INTERRUPTION, ATTEINDRONT UN RÉSULTAT PRÉVU, SERONT COMPATIBLES OU
      FONCTIONNERONT AVEC TOUT LOGICIEL, SYSTÈME, OU AUTRES SERVICES, SERONT
      SÉCURISÉS, EXACTS, COMPLETS, EXEMPTS DE CODES NUISIBLES, OU EXEMPTS D&apos;ERREURS. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >6.<span>&nbsp; </span></span>Limitation
      de responsabilité </b></p>

      <p
      ><b>6.1.</b> SAUF EN CAS DE VIOLATION
      DE LA SECTION 1.3, DANS LA MESURE MAXIMALE AUTORISÉE PAR LA LOI APPLICABLE,
      AUCUNE PARTIE NE SERA RESPONSABLE DE QUELQUE DOMMAGE SPÉCIAL, ACCESSOIRE,
      INDIRECT, EXEMPLAIRE OU CONSÉCUTIF QUE CE SOIT (Y COMPRIS, SANS LIMITATION, LES
      DOMMAGES-INTÉRÊTS POUR PERTE DE BÉNÉFICES COMMERCIAUX, INTERRUPTION DES
      ACTIVITÉS COMMERCIALES, PERTE D&apos;INFORMATIONS COMMERCIALES, REVENUS, VENTES
      PRÉVUES OU ÉCONOMIES, OU TOUTE AUTRE PERTE PÉCUNIAIRE), DÉCOULANT DE OU LIÉS DE
      QUELQUE MANIÈRE QUE CE SOIT À CET ACCORD, LES SERVICES, LES PRODUITS TIERS, LES
      SITES TIERS, OU LE CONTENU TIERS MIS À DISPOSITION PAR LES SERVICES, QUE CE
      SOIT DANS LE CADRE D&apos;UN DÉLIT (Y COMPRIS LA NÉGLIGENCE), D&apos;UN CONTRAT OU DE
      TOUTE AUTRE THÉORIE JURIDIQUE, MÊME SI UNE TELLE PARTIE A ÉTÉ INFORMÉE DE LA
      POSSIBILITÉ DE TELS DOMMAGES. </p>

      <p
      ><b>6.2.</b> SAUF EN CAS DE VIOLATION
      DE LA SECTION 1.3, EN AUCUN CAS LA RESPONSABILITÉ AGGREGÉE COLLECTIVE DE L&apos;UNE
      OU L&apos;AUTRE PARTIE OU DE SES AFFILIÉS DÉCOULANT DE OU LIÉE DE QUELQUE MANIÈRE QUE
      CE SOIT À CET ACCORD, LES SERVICES, LES PRODUITS TIERS, LES SITES TIERS, OU LE
      CONTENU TIERS MIS À DISPOSITION PAR LES SERVICES, QUE CE SOIT DANS LE CADRE
      D&apos;UNE VIOLATION DE CONTRAT, D&apos;UN DÉLIT (Y COMPRIS LA NÉGLIGENCE), DE LA
      RESPONSABILITÉ STRICTE, OU DE TOUTE AUTRE THÉORIE JURIDIQUE OU ÉQUITABLE,
      N&apos;EXCÉDERA PAS LE PLUS ÉLEVÉ ENTRE (I) CENT DOLLARS ($100) ET (II) LE MONTANT
      TOTAL PAYÉ (ET TOUT MONTANT COMPTABILISÉ CUMULÉ MAIS NON ENCORE PAYÉ) PAR LE
      FOURNISSEUR À ORO LABS AU COURS DE LA PÉRIODE DE 6 MOIS PRÉCÉDANT L&apos;ÉVÉNEMENT À
      L&apos;ORIGINE DE LA RÉCLAMATION. </p>

      <p><span
      > </span></p>

      <p className={styles.subtitle}><b><span
      >7.<span>&nbsp; </span></span>Divers </b></p>

      <p
      ><b>7.1.</b> <b>Survie.</b> Les
      sections suivantes de cet accord survivront à la résiliation ou à l&apos;expiration
      de cet accord : Section 1.2, 1.3, 1.5, 3.4, 3.5, 4, 5, 6 et 7. </p>

      <p
      ><b>7.2. Séparation.</b> Si une
      disposition de cet accord est jugée inexécutable ou invalide, cette disposition
      sera limitée ou éliminée dans la mesure minimale nécessaire pour que cet accord
      reste par ailleurs eiectif et exécutoire. </p>

      <p
      ><b>7.3. Cession.</b> Cet accord n&apos;est
      pas cessible, transférable ou sous-licenciable par l&apos;une ou l&apos;autre des
      parties, sauf avec le consentement écrit préalable de l&apos;autre partie ;
      cependant, l&apos;une ou l&apos;autre des parties peut céder ou transférer cet accord :
      (a) à une société aiiliée où (i) le cessionnaire a accepté par écrit d&apos;être lié
      par les termes de cet accord, (ii) la partie cédante reste responsable des
      obligations en vertu de cet accord si le cessionnaire y fait défaut, et (iii)
      la partie cédante a notifié à l&apos;autre partie la cession, par écrit ; et (b) en
      cas de fusion, de vente de la quasi-totalité des actions, des actifs ou de
      l&apos;activité, ou d&apos;une autre réorganisation impliquant la partie cédante, et le
      consentement écrit préalable de la partie non cédante ne sera pas requis dans
      un tel cas avec la compréhension expresse que dans les cas où la partie cédante
      n&apos;est pas l&apos;entité survivante, cet accord liera le successeur d&apos;intérêt de la
      partie cédante à l&apos;égard de toutes les obligations en vertu de cet accord.
      Toute autre tentative de transfert ou d&apos;assignation est nulle. </p>

      <p
      ><b>7.4. Force majeure.</b> Dans le
      cas où l&apos;une des parties serait retardée, entravée ou empêchée de l&apos;exécution
      de tout acte requis en vertu des présentes, à l&apos;exception d&apos;une obligation de
      paiement, pour cause de grèves, de lock-out, de troubles du travail,
      d&apos;incapacité à se procurer des matériaux ou des services, de défaillance de
      l&apos;alimentation électrique, d&apos;émeutes, d&apos;insurrections, de guerre ou d&apos;autres
      raisons d&apos;une nature similaire non imputables à la faute de la partie retardée
      dans l&apos;exécution des travaux ou des actes requis aux termes du présent accord,
      cette partie notifiera immédiatement à l&apos;autre partie un tel retard, et
      l&apos;exécution de cet acte sera excusée pour la période du retard et la période
      pour l&apos;exécution de tout tel acte sera prolongée pour une période équivalente à
      celle du retard. </p>

      <p
      ><b>7.5. Accord intégral.</b> Le
      présent Accord constitue la déclaration complète et exclusive de la
      compréhension mutuelle des Parties et remplace et annule tous les accords,
      communications et autres ententes écrits ou verbaux antérieurs relatifs à
      l&apos;objet du présent Accord. Toutes les renonciations et modifications doivent
      être faites par écrit et signées par les deux Parties, sauf disposition
      contraire expresse dans les présentes. </p>

      <p
      ><b>7.6. Modification.</b> Oro Labs se
      réserve le droit de réviser et de mettre à jour ces Conditions Générales de
      Fourniture de temps à autre à sa seule discrétion. Toutes les modifications
      prennent eiet immédiatement dès leur mise à disposition sur ce site web et
      s&apos;appliqueront à tout accès et utilisation des Services par la suite.
      Cependant, toute modification des dispositions de résolution des litiges
      énoncées à la Section 7.13 ne s&apos;appliquera pas à tout litige pour lequel les
      Parties ont un avis eiectif à la date de publication de la modification sur ce
      site web. L&apos;utilisation continue des Services par le Fournisseur après la
      publication des Conditions d&apos;Utilisation révisées signifie que le Fournisseur
      accepte et accepte les modifications. Il est recommandé au Fournisseur de
      consulter cette page de temps à autre afin d&apos;être informé de toute
      modification, car de telles modifications sont contraignantes pour le
      Fournisseur. </p>

      <p
      ><b>7.7. Relation des Parties.</b>
      Aucune agence, partenariat, coentreprise ou relation d&apos;emploi n&apos;est créée du
      fait du présent Accord et le Fournisseur n&apos;a aucune autorité de quelque nature
      que ce soit pour lier Oro Labs de quelque manière que ce soit. </p>

      <p
      ><b>7.8. Sites de Tiers. </b>Les
      Services peuvent contenir des liens vers des annonceurs, des sites web ou des
      services tiers (&quot;<b>Sites de Tiers</b>&quot;). Le Fournisseur reconnaît et
      accepte qu&apos;Oro Labs n&apos;est pas responsable de: (i) la disponibilité ou
      l&apos;exactitude de ces Sites de Tiers, ou (ii) le contenu, les produits ou les
      ressources sur ou disponibles à partir de ces Sites de Tiers. Tout Site de
      Tiers ne signifie aucune approbation de la part d&apos;Oro Labs de ces sites web ou
      services. Si le Fournisseur décide d&apos;accéder à l&apos;un des Sites de Tiers liés aux
      Services, il le fait entièrement à ses propres risques et sous réserve des
      modalités et conditions d&apos;utilisation de tels Sites de Tiers et reconnaît la
      responsabilité exclusive et assume tous les risques découlant de son
      utilisation de tout Site de Tiers. </p>

      <p
      ><b>7.9. Produits et Contenus de
      Tiers.</b> Dans le cadre des Services, le Fournisseur peut avoir accès à des
      applications, des intégrations, des logiciels, des services, des systèmes ou
      d&apos;autres produits non développés par Oro Labs (&quot;Produits de Tiers&quot;),
      ou des données/contenus dérivés de tels Produits de Tiers ou découlant d&apos;un
      accord entre Oro Labs et un tel tiers (collectivement, &quot;Contenu de
      Tiers&quot;). Oro Labs ne peut garantir que de tels Contenus de Tiers seront
      exempts de matériel que vous pourriez trouver objectionnable ou autrement. De
      plus, Oro Labs ne garantit ni ne prend en charge les Produits de Tiers ou le
      Contenu de Tiers (que ces éléments soient ou non désignés par Oro Labs comme
      vérifiés ou intégrés aux Services) et décline toute responsabilité et
      obligation pour ces éléments et leur accès ou intégration avec les Services, y
      compris leur modification, suppression ou divulgation. Le Fournisseur reconnaît
      et accepte que de tels Produits de Tiers et Contenus de Tiers constituent les
      &quot;informations confidentielles&quot; du propriétaire de tels Produits de
      Tiers et Contenus de Tiers, et en tant que tel, le Fournisseur accepte de
      prendre des précautions raisonnables pour protéger de tels Produits de Tiers et
      Contenus de Tiers, et de ne pas utiliser (sauf dans le cadre des Services ou
      comme autrement autorisé par le propriétaire par écrit) ou divulguer à un tiers
      de tels Produits de Tiers ou Contenus de Tiers, sauf à ses entrepreneurs et/ou
      agents qui ont un besoin légitime de savoir et qui sont liés par des
      obligations de confidentialité au moins aussi strictes que celles contenues
      ici. </p>

      <p
      ><b>7.10. Avis.</b> Tous les avis en
      vertu du présent Accord seront donnés par écrit et seront réputés avoir été
      dûment donnés lorsqu&apos;ils sont reçus, si livrés en personne ; lorsque la
      réception est confirmée électroniquement, si transmis par télécopie ou par
      courriel électronique; le jour suivant son envoi, si envoyé pour livraison le
      lendemain par un service de livraison de nuit reconnu ; et dès réception, si
      envoyé par courrier recommandé avec accusé de réception. Tout avis à Oro Labs
      peut être envoyé à [COURRIEL ELECTRONIQUE] ou par courrier adressé à <Address />.
      </p>

      <p
      ><b>7.11. Loi Applicable.</b> Le
      présent Accord sera régi par les lois de l&apos;État du Delaware sans référence aux
      principes de conflit de lois. Tout litige entre les Parties découlant de ou lié
      au présent Accord sera résolu exclusivement par arbitrage JAMS, qui se tiendra
      en Californie ou dans un autre lieu convenu mutuellement, et sera conduit
      conformément aux règles de la JAMS en vigueur à ce moment-là. Le jugement sur
      la décision rendue sera définitif et non susceptible d&apos;appel et pourra être
      inscrit dans tout tribunal compétent. La Partie ayant obtenu gain de cause aura
      droit à la récupération de tous ses honoraires d&apos;avocat raisonnables de la part
      de l&apos;autre Partie en plus de toute autre indemnité. Les deux Parties renoncent
      à tout droit de participer à toute action collective impliquant des litiges
      entre les Parties, et les Parties renoncent chacune au droit à un procès devant
      jury. Toutes les réclamations doivent être portées dans la capacité
      individuelle des Parties, et non en tant que demandeur ou membre d&apos;une classe
      dans toute prétendue action collective ou représentative, et, sauf accord
      contraire d&apos;Oro Labs, l&apos;arbitre ne peut pas regrouper les réclamations de plus
      d&apos;une personne. Cette renonciation à l&apos;action collective fait partie intégrante
      de cet accord d&apos;arbitrage et ne peut être dissociée. Si, pour une raison
      quelconque, cette renonciation à l&apos;action collective est jugée inapplicable,
      alors l&apos;intégralité de l&apos;accord d&apos;arbitrage ne s&apos;appliquera pas. Cependant, la
      renonciation au droit à un procès devant jury énoncée dans cette Section 7.12
      restera en vigueur et en plein eiet. LE FOURNISSEUR ET ORO LABS CONVIENNENT QUE
      TOUTE ACTION EN JUSTICE DÉCOULANT DES SERVICES OU DE CET ACCORD DOIT COMMENCER
      DANS UN DÉLAI D&apos;UN (1) AN APRÈS L&apos;ACCROISSEMENT DE L&apos;ACTION EN JUSTICE. SINON,
      UNE TELLE ACTION EN JUSTICE EST DÉFINITIVEMENT EXCLUE. </p>

      <p
      ><b>7.13. Politique en matière de
      droits d&apos;auteur.</b> Oro Labs respecte les droits de propriété intellectuelle
      d&apos;autrui et attend des utilisateurs des Services qu&apos;ils fassent de même. Oro
      Labs répondra aux avis présumés de violation de droits d&apos;auteur conformes à la
      loi applicable et dûment fournis à l&apos;agent des droits d&apos;auteur désigné par Oro
      Labs (&quot;<b>Agent des droits d&apos;auteur</b>&quot;). L&apos;Agent des droits d&apos;auteur
      désigné par Oro Labs pour recevoir les notifications de violation présumée de
      droits d&apos;auteur est :</p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>

      <p
      >&nbsp;</p>

      <p
      ><b><span>MENTIONS LEGALES</span></b>: Cette traduction en
      Français n&apos;est pas certifié, elle est proposée à titre informatif. Ainsi, il
      convient de noter que dans le cadre de ce contrat et de cette prestation, en
      cas de contentieux, seule la version originale (<OroButton label='en Anglais' type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />) ci-jointe, prévaut.</p>
    </div>
  )
}
