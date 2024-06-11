/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import { Address } from './EnSTC'
import styles from './stc.module.scss'
import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'

export function EsSTC (props: {
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro
      Labs, Inc. Términos y condiciones del proveedor </b></p>

      <p className={styles.subtitle}><b>Fecha
      de efectividad: {getLocalDateString((new Date()).toString(), 'es')}</b></p>

      <p><span
      >Las
      presentes Condiciones del proveedor regulan su acceso y uso de los servicios
      (los &quot;Servicios&quot;), propiedad o bajo el control de Oro Labs, Inc. una
      corporación de Delaware (&quot;Oro Labs&quot;). AL UTILIZAR LOS SERVICIOS, O AL
      ACEPTAR DE OTRO MODO ESTAS CONDICIONES AL ACCEDER A ESTE SITIO WEB Y HACER CLIC
      EN &quot;CONTINUAR&quot;, USTED (&quot;PROVEEDOR&quot;) ACEPTA QUEDAR VINCULADO
      Y CUMPLIR ESTAS CONDICIONES DEL PROVEEDOR. SI NO DESEA ACEPTAR ESTAS
      CONDICIONES, NO DEBE ACCEDER A LOS SERVICIOS NI UTILIZARLOS. Si acepta este
      Acuerdo en nombre de una empresa, negocio, corporación u otra entidad, usted y
      la empresa, negocio, corporación u de otra entidad, declaran y garantizan que,
      tienen autorización para vincular a dicha entidad a este Acuerdo, en cuyo caso,
      los términos &quot;usted&quot; o &quot;Proveedor&quot; se referirán a dicha
      entidad. Oro Labs y el Proveedor se denominan cada uno en el presente Acuerdo como
      una &quot;Parte&quot; y conjuntamente como las &quot;Partes&quot;.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><span
      >Los
      Servicios incluyen el acceso a la plataforma de Oro Labs para facilitar la
      presentación y gestión de materiales de adquisición entre el Proveedor y uno o
      más clientes de Oro Labs (cada uno, un &quot;Cliente&quot;) con el fin de
      participar en actividades de adquisición por parte del Proveedor a dicho
      Cliente. Cada Cliente con el que usted interactúe a través de los Servicios
      puede exigirle a usted, que acepte condiciones adicionales con relación a su
      relación con dicho Cliente. Dichas condiciones adicionales podrán serle
      presentadas</span></p>

      <p><span
      >para
      su aceptación a través de los Servicios.</span></p>

      <p><b><span
      >&nbsp;</span></b></p>

      <p><b><span
      >1.
      Alcance del servicio; Plazo</span></b></p>

      <p><b><span
      >1.1.</span></b><span
      >
      Durante el Plazo (según se define a continuación) Oro Labs concede al Proveedor
      y a sus empleados, contratistas y agentes (&quot;Usuarios autorizados&quot;)
      una licencia limitada, no exclusiva e intransferible (salvo de conformidad con
      la Sección 7.3) para acceder a los Servicios y utilizarlos con fines
      comerciales internos propios del Proveedor de conformidad con los términos del
      presente Acuerdo. Oro Labs se reserva todos los derechos no concedidos
      expresamente sobre los Servicios.</span></p>

      <p><b><span
      >1.2.</span></b><span
      > Los
      Servicios se ponen actualmente a disposición del Proveedor de forma gratuita,
      pero Oro Labs se reserva el derecho a cobrar por algunos o todos los Servicios
      en el Futuro. Oro Labs le notificará antes de que cualquiera de los Servicios
      que esté utilizando en ese momento comience a conllevar una tarifa. Y, si desea
      continuar utilizando dichos Servicios, deberá pagar todas las tarifas
      aplicables a dichos Servicios.</span></p>

      <p><b><span
      >1.3.</span></b><span
      > Como
      condición para que el Proveedor pueda utilizar y acceder a los Servicios, el Proveedor
      se compromete a no utilizar los Servicios con fines ilícitos o de cualquier
      forma que infrinja el presente Acuerdo. Cualquier uso de los Servicios que
      infrinja el presente Acuerdo podrá dar lugar, entre otras cosas, a la rescisión
      o suspensión de la cuenta del Proveedor y de su capacidad para utilizar los
      Servicios. El Proveedor no podrá realizar ninguna de las siguientes actividades
      prohibidas: (a) directa o indirectamente, realizar ingeniería inversa,
      descompilar, desensamblar, separar o intentar descubrir o derivar el código
      fuente, el código objeto o la estructura subyacente, ideas, conocimientos
      técnicos o algoritmos relevantes para los Servicios o cualquier software, documentación
      o datos relacionados con los Servicios (&quot;Software&quot;); (b) copiar,
      distribuir, transmitir o divulgar cualquier parte de los Servicios en cualquier
      medio, incluyendo sin limitación cualquier &quot;extracción&quot; automatizada
      o no automatizada; (c) recoger o recopilar cualquier información de
      identificación personal (&quot;IIP&quot;), incluyendo nombres de cuentas, de
      los Servicios; (d) modificar, adaptar, traducir o crear obras derivadas basadas
      en los Servicios o el Software; (e) transferir, vender, arrendar, sindicar,
      subsindicar, prestar o utilizar los Servicios o cualquier Software con fines de
      marca compartida, multipropiedad u oficina de servicios, o de cualquier otro
      modo en beneficio de terceros; (f) utilizar cualquier sistema automatizado,
      incluyendo sin limitación &quot;robots&quot;, &quot;rastreadores
      automatizados&quot;, &quot;lectores sin conexión&quot;, etc., para acceder a
      los Servicios, o acceder a cualquier contenido o características de los
      Servicios a través de cualquier tecnología o medio distinto de los
      proporcionados o autorizados por los Servicios; (g) transmitir correo basura, correos
      en cadena, u otros correos electrónicos no solicitados; (h) participar
      intencionadamente o con conocimiento, en cualquier actividad que interfiera o
      interrumpa los Servicios o los servidores o redes conectados a los Servicios;
      (i) eliminar, desfigurar, ocultar o alterar cualquier aviso o etiqueta de propiedad;
      (j) utilizar los Servicios, intencionadamente o con conocimiento, de cualquier
      forma que infrinja las leyes o normativas aplicables; (k) intentar interferir,
      comprometer la integridad o la seguridad del sistema, o descifrar cualquier
      transmisión hacia o desde los servidores que ejecutan los Servicios; cargar datos
      inválidos, virus, gusanos u otros agentes de software a través de los
      Servicios; eludir las medidas que Oro Labs pueda utilizar para impedir o restringir
      el acceso a los Servicios, incluidas, entre otras, las funciones que impiden o
      restringen el uso o la copia de cualquier contenido o función o imponer limitaciones
      en el uso de los Servicios o del contenido o las funciones de estos; (l) suplantar
      la identidad de otra persona o falsificar de cualquier otro modo la afiliación
      del Proveedor con una persona o entidad, realizar fraude, ocultar o intentar
      ocultar la identidad del Proveedor; o (m) acceder, distribuir o utilizar con
      fines comerciales cualquier parte de los Servicios o cualquier servicio o
      material disponible a través de los Servicios.</span></p>

      <p><b><span
      >1.4.</span></b><span
      > El
      &quot;Plazo&quot; para el uso de los Servicios por parte del Proveedor será
      durante el tiempo que el Proveedor siga manteniendo una relación comercial con
      cualquier Cliente que requiera el uso o el acceso a los Servicios, a menos que
      Oro Labs rescinda antes el acceso del Proveedor a los Servicios por cualquier motivo.</span></p>

      <p><b><span
      >1.5.</span></b><span
      > A la
      terminación o expiración del presente Acuerdo, cesarán inmediatamente todos los
      derechos y licencias concedidos por Oro Labs al Proveedor (salvo lo dispuesto
      en la presente Sección 1.5). A petición del Proveedor, Oro Labs hará todo lo
      posible por eliminar los Datos del Proveedor (definidos a continuación) y que
      fueron proporcionados por el Proveedor para los Servicios; no obstante, Oro
      Labs podrá conservar copias de los Datos del Proveedor: (i) proporcionada de forma
      independiente por los clientes de Oro Labs; (ii) según sea necesario para
      cumplir la legislación, la reglamentación o las normas profesionales aplicables;
      (iii) en servidores o fuentes de copia de seguridad si dichos Datos del Proveedor
      se borran de los discos duros locales y no se intenta recuperar dichos Datos
      del Proveedor de dichos servidores o fuentes de copia de seguridad, y/o (iv)
      según lo dispuesto en la Sección 3.5.</span></p>

      <p><b><span
      >1.6.</span></b><span
      > El
      Proveedor es enteramente responsable de mantener la confidencialidad de su
      contraseña y de su cuenta. Además, el Proveedor es enteramente responsable de
      todas y cada una de las actividades que se produzcan en su cuenta. El Proveedor
      se compromete a notificar inmediatamente a Oro Labs cualquier uso no
      autorizado, conocido o sospechado, de su nombre de usuario y contraseña o
      cualquier otra violación de la seguridad. El Proveedor, y no Oro Labs, será
      responsable de cualquier pérdida en la que el Proveedor, Oro Labs y cualquier
      otra parte puedan incurrir como resultado de que otra persona utilice el nombre
      de usuario, la contraseña o la cuenta del Proveedor, sólo en el caso y en la
      medida en que dicho uso esté permitido por el Proveedor o sea resultado de que
      el Proveedor no haya mantenido la confidencialidad de la contraseña y la
      información de la cuenta del Proveedor. El Proveedor no podrá utilizar la
      cuenta de otra persona en ningún momento sin el permiso por escrito del titular
      de la cuenta. La cuenta del Proveedor es exclusiva del Proveedor y no se puede
      transferir a terceros.</span></p>

      <p><b><span
      >1.7.</span></b><span
      > Oro
      Labs podrá modificar los Servicios a su discreción de vez en cuando. Oro Labs:
      (a) se reserva el derecho a retirar o modificar los Servicios a su entera discreción
      y sin previo aviso; y (b) no será responsable si, por cualquier motivo, la
      totalidad o parte de los Servicios no están disponibles en cualquier momento o
      durante cualquier período.</span></p>

      <p><b><span
      >1.8.</span></b><span
      > El
      Proveedor será responsable de obtener y mantener cualquier equipo y servicios
      auxiliares necesarios para conectarse a los Servicios, acceder a ellos o
      utilizarlos de cualquier otro modo, incluidos, entre otros, módems, hardware,
      servidores, software, sistemas operativos, redes, servidores web y similares.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >2.
      Registro de cuentas</span></b></p>

      <p><b><span
      >2.1.</span></b><span
      >
      Antes de utilizar los Servicios, el Proveedor debe completar el proceso de
      registro de la cuenta   proporcionando a Oro Labs, proporcionando información
      actual, completa y precisa, tal y como se solicita en el  formulario de
      registro correspondiente. Cada Usuario autorizado se registrará una sola vez
      utilizando un único nombre de usuario, y el Proveedor se asegurará de que
      ningún Usuario autorizado (a) se registre en nombre de otra persona; (b) se
      registre bajo el nombre de otra persona o bajo un nombre ficticio o alias; (c)
      elija un nombre de usuario que constituya o sugiera una suplantación de
      cualquier otra persona (real o ficticia) o entidad, o que un Usuario Autorizado
      es representante de una entidad cuando no lo es, o que sea ofensivo; o (d)
      elija un nombre de usuario con el fin de engañar o confundir a los usuarios y/o
      a Oro Labs en cuanto a la verdadera identidad de un Usuario autorizado. El
      Usuario Autorizado se compromete a mantener y actualizar cualquier información
      de registro de cuenta para mantenerla verdadera, precisa, actual y completa. Si,
      cualquier información proporcionada por el Usuario autorizado es falsa,
      inexacta, no actual, incompleta, o viola de otra manera las restricciones según
      lo dispuesto anteriormente, Oro Labs tiene el derecho de cancelar la cuenta del
      Usuario autorizado y rechazar cualquier y todo uso actual o futuro de los
      Servicios.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >3.
      Contenido; Comentarios</span></b></p>

      <p><b><span
      >3.1 </span></b><span
      >Cualquier
      información o contenido cargado, compartido, almacenado, proporcionado o
      transferido a través de los Servicios por los Usuarios Autorizados es
      &quot;Contenido&quot; del Proveedor, incluyendo información de perfil, datos de
      transacciones y otros datos que envíe a los Servicios, información promocional,
      datos/detalles de transacciones, listas de clientes, datos que mantenga sobre
      sus clientes y proveedores, datos personales, información de mercadeo o
      información relacionada. Algunos Contenidos pueden ser vistos por otros
      usuarios. Usted es el único responsable de todo el Contenido que aporte a los
      Servicios. Usted declara que todo el Contenido enviado por usted es exacto,
      completo, actualizado y cumple con todas las leyes, normas y reglamentos
      aplicables. Usted acepta que no publicará, cargará, compartirá, almacenará ni
      proporcionará de ningún otro modo a través de los Servicios ningún Contenido de
      Usuario que: (i) infrinja los derechos de autor u otros derechos de terceros
      (por ejemplo, marcas comerciales, derechos de privacidad, etc.); (ii) contenga
      contenido sexual explícito o pornografía; (iii) contenga contenido censurable,
      difamatorio o discriminatorio o incite al odio contra cualquier individuo o
      grupo; (iv) exploten a menores; (v) representen actos ilícitos o violencia
      extrema; (vi) representen crueldad animal o violencia extrema hacia los
      animales; (vii) promuevan esquemas fraudulentos, esquemas de marketing
      multinivel (MLM), esquemas para hacerse rico rápidamente, juegos y apuestas en
      línea, regalos en efectivo, negocios para trabajar desde casa o cualquier otra
      empresa de dudosa rentabilidad; o (viii) que infrinjan cualquier ley.</span></p>

      <p><b><span
      >3.2. </span></b><span
      >Para
      todo el Contenido, el Proveedor concede por el presente Acuerdo a Oro Labs una
      licencia para mostrar, ejecutar, traducir, modificar (con fines técnicos, por
      ejemplo, para asegurarse de que el Contenido se pueda ver en un dispositivo
      móvil), distribuir, conservar, reproducir y actuar de cualquier otro modo con
      respecto a dicho Contenido (colectivamente, &quot;Uso&quot;), en cada caso para
      permitir a Oro Labs prestar los Servicios, lo que incluye proporcionar
      Contenido a Clientes con los que el Proveedor haya decidido compartir o
      publicar dicho Contenido.</span></p>

      <p><b><span
      >3.3. </span></b><span
      >El
      uso del Contenido por parte de Oro Labs estará sujeto al Anexo sobre
      procesamiento de datos, incorporado al presente Acuerdo. El Anexo de
      procesamiento de datos prevalecerá, según corresponda, en caso de conflicto
      entre éste y la Política de privacidad o el presente Acuerdo. Usted se puede
      poner en contacto con Oro Labs para obtener una copia firmada del Anexo de
      procesamiento de datos, si es necesario, para el cumplimiento de la legislación
      local.</span></p>

      <p><b><span
      >3.4 </span></b><span
      >El
      Proveedor es responsable de todo el Contenido cargado, publicado o almacenado a
      través del uso de los Servicios por parte del Proveedor. Oro Labs no es
      responsable de ningún Contenido perdido o irrecuperable que no sea el resultado
      de negligencia grave o mala conducta intencional de Oro Labs. Aunque Oro Labs
      no tiene obligación de supervisar el Contenido o el uso de los Servicios por
      parte del Proveedor, Oro Labs podrá, a su entera discreción, eliminar cualquier
      Contenido, en su totalidad o en parte, o prohibir cualquier uso de los
      Servicios que se considere inaceptable, indeseable, inapropiado o que infrinja
      el presente Acuerdo.</span></p>

      <p><b><span
      >3.5. </span></b><span
      >El
      Proveedor podrá solicitar a Oro Labs que elimine los Datos del proveedor según
      lo establecido en la Sección 1.5. Sin embargo, el Proveedor reconoce y acepta
      específicamente que, en la medida en que el Contenido haya sido proporcionado,
      copiado o almacenado previamente por otros usuarios (incluidos, por ejemplo,
      los Clientes), dicho Contenido podrá ser conservado por Oro Labs con el fin de seguir
      proporcionando acceso a dicho Contenido a dichos usuarios (y las licencias
      establecidas en el presente Acuerdo continuarán mientras se proporcione dicho
      acceso).</span></p>

      <p><b><span
      >3.6. </span></b><span
      >De
      vez en cuando, Oro Labs puede ofrecer oportunidades para que los usuarios
      envíen voluntariamente comentarios e ideas para mejoras relacionadas con los
      Servicios. El Proveedor acepta que (a) sus comentarios y la expresión de sus
      ideas y/o mejoras se convertirán automáticamente en propiedad de Oro Labs y
      serán de su propiedad; (b) Oro Labs podrá utilizar o redistribuir los comentario
      del Proveedor y su contenido para cualquier fin y de cualquier forma y sin
      ninguna restricción, con la salvedad de que Oro Labs se compromete a mantener
      la confidencialidad del nombre del Proveedor asociado a dichos comentarios; (c)
      Oro Labs no está obligado a revisar ningún comentario; (d) no existe obligación
      alguna de mantener la confidencialidad de los comentarios; y (e) Oro Labs no
      tendrá ninguna obligación con el Proveedor ni contrato alguno con el Proveedor,
      implícito o de otro tipo. Al proporcionar comentarios o ideas, el Proveedor
      reconoce y acepta que, Oro Labs y las personas designadas por éste, pueden
      crear por su cuenta u obtener, solicitudes que pueden ser similares o idénticos
      a los comentarios o ideas que el Proveedor envíe a través de los Servicios u
      otros canales y medios. Por la presente, el Proveedor renuncia a todas y cada
      una de las reclamaciones que haya tenido, pueda tener y/o pudiera tener en el
      futuro, de que las presentaciones aceptadas, revisadas y/o utilizadas por Oro Labs
      y sus personas designadas puedan ser similares a los comentarios o ideas del
      Proveedor.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >4.
      Confidencialidad; derechos de propiedad</span></b></p>

      <p><span
      >4.1.
      Cada Parte (la &quot;Parte Receptora&quot;) entiende que la otra Parte (la
      &quot;Parte Divulgante&quot;) ha divulgado o puede divulgar información
      comercial, técnica o financiera relacionada con el negocio de la Parte Divulgante
      (en lo sucesivo denominada &quot;Información Privilegiada&quot; de la Parte
      Divulgante). La Información de propiedad exclusiva de Oro Labs incluye
      información no pública sobre las características, funcionalidad y rendimiento
      de los Servicios. La Información de propiedad exclusiva de cada Proveedor incluye
      datos no públicos sobre dicho Proveedor proporcionados por éste a Oro Labs
      (&quot;Datos del Proveedor&quot;), Contenido y cualquier dato o información
      derivados del uso de los Servicios por parte del Proveedor. Para evitar
      cualquier duda, los Datos del Proveedor no incluyen los Datos Agregados (tal y como
      se definen a continuación) ni, ningún dato, información o contenido cargado por
      terceros distintos del Proveedor. La Parte Receptora se compromete a tomar las
      precauciones razonables para proteger dicha Información Privilegiada y, salvo
      para utilizar o prestar los Servicios o según lo permitido en el presente Acuerdo,
      a no utilizar ni divulgar a terceros dicha Información Privilegiada. No obstante,
      la Parte Receptora podrá revelar Información Privilegiada a sus contratistas
      y/o agentes que tengan una necesidad legítima de conocer la Información Privilegiada
      y que estén sujetos a obligaciones de confidencialidad al menos tan estrictas
      como las contenidas en el presente Acuerdo. La Parte Divulgante acuerda que, lo
      anterior no se aplicará con respecto a cualquier información después de los cinco
      (5) años siguientes a la divulgación de la misma, o cualquier información que
      la Parte Receptora pueda documentar que (a) está o pasa a estar a disposición
      general del público sin que medie acción alguna de la Parte Receptora en
      violación del presente Acuerdo, (b) estaba en su posesión o era conocida por
      ella antes de recibirla de la Parte Divulgante, (c) le fue legítimamente
      revelada sin restricciones por un tercero, o (d) fue desarrollada de forma
      independiente sin utilizar ninguna Información Privilegiada de la Parte
      Divulgante.</span></p>

      <p><b><span
      >4.2. </span></b><span
      >Por
      la presente, las Partes reconocen y acuerdan que, cualquier infracción o
      incumplimiento de las obligaciones de confidencialidad de una de las Partes en
      virtud del presente Acuerdo causará daños a la otra Parte en una cuantía
      difícil de determinar. En consecuencia, además de cualquier otra reparación a la
      que una Parte pueda tener derecho, la Parte no incumplidora tendrá derecho, sin
      prueba de daños reales, a solicitar cualquier medida cautelar ordenada por
      cualquier tribunal de jurisdicción competente, incluyendo, pero sin limitarse
      a, una medida cautelar que restrinja cualquier violación de las obligaciones de
      confidencialidad de la Parte incumplidora en virtud del presente Acuerdo.</span></p>

      <p><b><span
      >4.3.</span></b><span
      > Si,
      la Parte Receptora o cualquiera de sus representantes se ve obligada por
      legislación aplicable a revelar cualquier Información Privilegiada, entonces,
      en la medida en que lo permita la legislación aplicable, la Parte Receptora
      deberá: (a) notificar por escrito a la Parte Divulgante, sin demora y antes de
      dicha divulgación, dicho requerimiento para que la Parte Divulgante pueda
      solicitar una orden de protección u otro recurso, o renunciar a su derecho a la
      confidencialidad de conformidad con los términos de este Acuerdo; (b) prestar
      asistencia razonable a la Parte Divulgante, a su exclusivo cargo y coste, para
      oponerse a dicha divulgación o solicitar una orden de protección u otras
      limitaciones a la divulgación. Si la Parte Divulgante renuncia al cumplimiento
      o, después de proporcionar la notificación y la asistencia requeridas en virtud
      de la presente Cláusula 4.3, la Parte Receptora sigue estando obligada por ley
      a divulgar cualquier Información Privilegiada, la Parte Receptora divulgará
      únicamente la parte de la Información Privilegiada que, por consejo del asesor
      jurídico de la Parte Receptora, la Parte Receptora esté legalmente obligada a
      divulgar y, a petición de la Parte Divulgante, realizará esfuerzos comercialmente
      razonables para obtener garantías del tribunal competente u otra autoridad que presida
      el tribunal de que dicha Información Privilegiada recibirá un tratamiento
      confidencial. Dicha divulgación forzosa por la Parte Receptora no afectará en
      modo alguno a las obligaciones de la Parte Receptora en virtud del presente
      Contrato con respecto a la Información Privilegiada así divulgada.</span></p>

      <p><b><span
      >4.4.</span></b><span
      > El
      Proveedor será propietario y conservará todos los derechos, títulos e intereses
      sobre su Información de Propiedad, incluidos los diseños, marcas comerciales,
      marcas de servicio y logotipos del Proveedor. Oro Labs poseerá y conservará
      todos los derechos, títulos e intereses sobre su Información de propiedad exclusiva,
      incluidos (a) los Servicios y el Software, y todas las mejoras, ampliaciones o modificaciones
      de los mismos, (b) cualquier software, aplicación, invención u otra tecnología desarrollada
      en relación con los Servicios de implementación o asistencia, (c) todos los
      derechos de propiedad intelectual relacionados con cualquiera de los
      anteriores, y (d) los diseños, marcas comerciales, marcas de servicio y
      logotipos de Oro Labs y los Servicios, ya sean propiedad de Oro Labs o con
      licencia a Oro Labs.</span></p>

      <p><b><span
      >4.5.</span></b><span
      > Sin
      perjuicio de cualquier disposición en contrario en el presente Acuerdo, Oro
      Labs tendrá derecho (durante y después de la Vigencia del mismo) a utilizar los
      datos y la información relacionados con el uso de los Servicios por parte del
      Proveedor de forma agregada y anónima (&quot;Datos agregados&quot;) para sus fines
      comerciales internos con el fin de mejorar y perfeccionar los Servicios,
      recopilar información estadística y de rendimiento, y para otros fines de
      desarrollo, diagnóstico y corrección en relación con los Servicios y otras
      ofertas de Oro Labs. Todos los derechos no concedidos expresamente en el presente
      Acuerdo se consideran retenidos.</span></p>

      <p><b><span
      >4.6 </span></b><span
      >Además
      de lo anterior, únicamente respecto a los Suscriptores, Oro Labs (i) mantendrá medidas
      técnicas y organizativas comercialmente razonables y apropiadas diseñadas para
      proteger los Datos del Proveedor contra la pérdida, el acceso o la divulgación
      no autorizados e ilícitos, (ii) mantendrá salvaguardas físicas, electrónicas y
      de procedimiento en cumplimiento de las leyes de privacidad aplicables,
      incluidas, entre otras, las siguientes: (a) el mantenimiento de salvaguardias
      adecuadas para restringir el acceso a los Datos del proveedor a los empleados,
      agentes, licenciantes o proveedores de servicios de Oro Labs que necesiten esa
      información para cumplir las obligaciones de Oro Labs en virtud del presente
      Acuerdo; (b) procedimientos y prácticas para la transmisión o el transporte
      seguros de los Datos del proveedor; y (c) el mantenimiento de salvaguardias
      adecuadas para impedir el acceso no autorizado a los Datos del proveedor.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >5.
      Garantía y exención de responsabilidad</span></b></p>

      <p><b><span
      >5.1. </span></b><span
      >Cada
      una de las Partes declara, acuerda y garantiza que: (a) cumplirá todas las
      leyes y reglamentos aplicables durante la Vigencia en la ejecución del presente
      Acuerdo; (b) tiene pleno derecho, poder y autoridad para suscribir el presente
      Acuerdo; (c) el cumplimiento de sus obligaciones en virtud del presente Acuerdo
      no viola ni violará ningún otro acuerdo del que sea parte; and (d) el presente
      Acuerdo constituye una obligación legal, válida y vinculante en el momento de
      su aceptación. Asimismo, el Proveedor declara y garantiza, que posee o dispone
      de las licencias, derechos, consentimientos y permisos necesarios para publicar
      y enviar el Contenido y los Datos del Proveedor. Asimismo, el Proveedor acepta,
      que el Contenido y los Datos del Proveedor que envíe a los Servicios no
      contendrán material de terceros protegido por derechos de autor, ni material
      sujeto a otros derechos de propiedad de terceros, a menos que el Proveedor cuente
      con el permiso del propietario legítimo del material o que el Proveedor esté
      legalmente facultado para publicar el material y conceder a la Empresa todos
      los derechos de licencia otorgados en el Acuerdo.</span></p>

      <p><b><span
      >5.2. </span></b><span
      >El
      Proveedor reconoce que Oro Labs controla y opera los Servicios desde Estados
      Unidos. Si el Cliente que desea contratar los servicios del Proveedor, y se
      encuentra fuera de Estados Unidos, el Contenido, incluida la información
      personal, proporcionado por el Proveedor se procesará en el centro de datos más
      cercano a la ubicación del Cliente, que puede estar en un país diferente al de
      la ubicación del Proveedor. Oro Labs no declara ni garantiza que los Servicios,
      o cualquier parte de los mismos, sean apropiados o estén disponibles para su
      uso en una jurisdicción determinada. El Proveedor y sus usuarios autorizados están
      sujetos a los controles de exportación de Estados Unidos en relación con el uso
      de los Servicios y/o los servicios relacionados con estos y son responsables de
      cualquier infracción de dichos controles, incluidos, entre otros, los embargos
      de Estados Unidos u otras normas y reglamentos federales que restrinjan las
      exportaciones.</span></p>

      <p><b><span
      >5.3.</span></b><span
      >
      SALVO LAS GARANTÍAS EXPRESAS ESTABLECIDAS EN LA SECCIÓN 5.1, LOS SERVICIOS SE
      PRESTAN &quot;TAL CUAL&quot;. ORO LABS RECHAZA ESPECÍFICAMENTE TODAS LAS
      GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN DETERMINADO Y
      TITULARIDAD. SIN PERJUICIO DE LO ANTERIOR, ORO LABS NO GARANTIZA DE NINGÚN MODO
      QUE LOS SERVICIOS, LOS PRODUCTOS DE TERCEROS, LOS CONTENIDOS DE TERCEROS O LOS
      RESULTADOS DEL USO DE LOS SERVICIOS SATISFAGAN LOS REQUISITOS DEL PROVEEDOR O
      DE CUALQUIER OTRA PERSONA, FUNCIONEN SIN INTERRUPCIONES, LOGREN LOS RESULTADOS
      PREVISTOS, SEAN COMPATIBLES O FUNCIONEN CON CUALQUIER SOFTWARE, SISTEMA U OTROS
      SERVICIOS, SEAN SEGUROS, PRECISOS, COMPLETOS, ESTÉN LIBRES DE CÓDIGOS DAÑINOS O
      NO CONTENGAN ERRORES.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >6.
      Limitación de responsabilidad</span></b></p>

      <p><b><span
      >6.1.</span></b><span
      >
      EXCEPTO EN CASO DE INCUMPLIMIENTO DE LA SECCIÓN 1.3, EN LA MEDIDA MÁXIMA  PERMITIDA
      POR LA LEGISLACIÓN APLICABLE, EN NINGÚN CASO, NINGUNA DE LAS PARTES SERÁ RESPONSABLE
      POR NINGÚN DAÑO ESPECIAL, INCIDENTAL, INDIRECTO, EJEMPLAR O CONSECUENTE DE
      NINGÚN TIPO (INCLUYENDO, SIN LIMITACIÓN, DAÑOS POR PÉRDIDA DE BENEFICIOS
      EMPRESARIALES, INTERRUPCIÓN DE NEGOCIO, PÉRDIDA DE INFORMACIÓN EMPRESARIAL,
      INGRESOS, VENTAS ANTICIPADAS O AHORROS, O CUALQUIER OTRA PÉRDIDA PECUNIARIA),
      QUE SE DERIVEN O ESTÉN RELACIONADOS DE ALGÚN MODO CON EL PRESENTE ACUERDO, LOS
      SERVICIOS, LOS PRODUCTOS DE TERCEROS, LOS SITIOS DE TERCEROS O LOS CONTENIDOS
      DE TERCEROS PUESTOS A DISPOSICIÓN A TRAVÉS DE LOS SERVICIOS, YA SE DERIVEN DE
      UN ACTO ILÍCITO (INCLUIDA LA NEGLIGENCIA), UN CONTRATO O CUALQUIER OTRA TEORÍA
      JURÍDICA, INCLUSO SI DICHA PARTE HA SIDO ADVERTIDA DE LA POSIBILIDAD DE QUE SE PRODUZCAN
      TALES DAÑOS.</span></p>

      <p><b><span
      >6.2. </span></b><span
      >EXCEPTO
      EN CASO DE INCUMPLIMIENTO DE LA SECCIÓN 1.3, EN NINGÚN CASO, LA RESPONSABILIDAD
      COLECTIVA AGREGADA DE CUALQUIERA DE LAS PARTES O DE SUS FILIALES DERIVADA O
      RELACIONADA DE ALGÚN MODO CON EL PRESENTE ACUERDO, LOS SERVICIOS, LOS PRODUCTOS
      DE TERCEROS, LOS SITIOS DE TERCEROS O EL CONTENIDO DE TERCEROS PUESTO A
      DISPOSICIÓN A TRAVÉS DE LOS SERVICIOS, YA SEA DERIVADA O RELACIONADA CON EL
      INCUMPLIMIENTO DE UN CONTRATO, RESPONSABILIDAD EXTRACONTRACTUAL (INCLUIDA LA
      NEGLIGENCIA), RESPONSABILIDAD OBJETIVA O CUALQUIER OTRA TEORÍA LEGAL O
      EQUITATIVA, EXCEDERÁ EL MONTO MAYOR ENTRE (I) CIEN DÓLARES ($100) Y (II) LOS
      MONTOS TOTALES PAGADOS (Y CUALQUIER MONTO DEVENGADO PERO AÚN NO PAGADO) POR EL
      PROVEEDOR A ORO LABS EN EL PERÍODO DE 6 MESES ANTERIOR AL HECHO QUE DIO LUGAR A
      LA RECLAMACIÓN.</span></p>

      <p><span
      >&nbsp;</span></p>

      <p><b><span
      >7.
      Varios</span></b></p>

      <p><b><span
      >7.1.</span></b><span
      >
      Supervivencia. Las siguientes Secciones de este Acuerdo sobrevivirán a la
      terminación o expiración de este: Artículos 1.2, 1.3, 1.5, 3.4, 3.5, 4, 5, 6 y
      7.</span></p>

      <p><b><span
      >7.2.</span></b><span
      >
      Divisibilidad. Si alguna de las disposiciones del presente Acuerdo se considera
      inaplicable o inválida, dicha disposición se limitará o eliminará en la medida
      mínima necesaria para que el presente Acuerdo siga siendo plenamente vigente y
      aplicable.</span></p>

      <p><b><span
      >7.3.</span></b><span
      > Cesión.
      El presente Acuerdo no podrá ser cedido, transferido o sublicenciado por
      ninguna de las Partes, salvo con el consentimiento previo por escrito de la
      otra; no obstante, cualquiera de las Partes podrá ceder o transferir el
      presente Acuerdo: (a) a una filial cuando (i) el cesionario haya aceptado por escrito
      quedar vinculado por los términos del presente Acuerdo, (ii) la Parte cedente
      siga siendo responsable de las obligaciones derivadas del presente Acuerdo si
      el cesionario las incumple, y (iii) la Parte cedente haya notificado por
      escrito la cesión a la otra Parte; (b) en caso de fusión, venta de la práctica totalidad
      de las acciones, activos o negocios, u otro tipo de reorganización que implique
      a la Parte cedente, y en tal caso no será necesario el consentimiento previo
      por escrito de la Parte no cedente, entendiéndose expresamente que en los casos
      en que la Parte cedente no sea la entidad superviviente, el presente Acuerdo
      vinculará al sucesor en interés de la Parte cedente con respecto a todas las
      obligaciones derivadas de este. Cualquier otro intento de transferencia o
      cesión será nulo.</span></p>

      <p><b><span
      >7.4. </span></b><span
      >Fuerza
      mayor. En caso de que una de las Partes se retrase, obstaculice o impida la
      realización de cualquier acto exigido en virtud del presente Acuerdo, distinto
      de una obligación de pago, debido a huelgas, cierres patronales, problemas
      laborales, imposibilidad de obtener materiales o servicios, corte de suministro
      eléctrico, disturbios, insurrecciones, guerra u otras razones de naturaleza
      similar que no sean culpa de la Parte retrasada en la ejecución de los trabajos
      o actos exigidos en virtud del presente Acuerdo, dicha Parte notificará
      inmediatamente a la otra Parte dicho retraso, y la ejecución de dicho acto
      quedará excusada durante el periodo de retraso y el plazo para la ejecución de
      dicho acto se prorrogará por un periodo equivalente al periodo de dicho
      retraso.</span></p>

      <p><b><span
      >7.5.</span></b><span
      >
      Acuerdo completo. El presente Acuerdo constituye la declaración completa y
      exclusiva del entendimiento mutuo de las Partes, y substituye y anula todos los
      acuerdos, comunicaciones y otros entendimientos anteriores, tanto escritos como
      orales, relativos al objeto del presente Acuerdo. Todas las renuncias y
      modificaciones deberán constar por escrito y estar firmadas por ambas Partes,
      salvo que se disponga lo contrario en el presente Acuerdo.</span></p>

      <p><b><span
      >7.6.</span></b><span
      >
      Modificación. Oro Labs puede revisar y actualizar estos Términos y condiciones
      del Proveedor de vez en cuando, a su entera discreción. Todos los cambios
      entrarán en vigor inmediatamente cuando estén disponibles en este sitio web y
      se aplicarán a todo acceso y uso de los Servicios a partir de entonces. Sin embargo,
      cualquier cambio en las disposiciones de resolución de disputas establecidas en
      la Sección 7.13 no se aplicará a ninguna disputa para la que las Partes tengan
      notificación real en o antes de la fecha en que el cambio se publique en este
      sitio web. El uso continuado de los Servicios por parte del Proveedor tras la
      publicación de las Condiciones del Servicio revisadas significa que el
      Proveedor acepta y está de acuerdo con los cambios. Se recomienda al Proveedor
      que consulte esta página de vez en cuando para  estar al tanto de cualquier
      cambio, ya que dichos cambios son vinculantes para el Proveedor.</span></p>

      <p><b><span
      >7.7.</span></b><span
      >
      Relación entre las partes. No se crea ninguna agencia, asociación, empresa
      conjunta o empleo como resultado de este Acuerdo y el Proveedor no tiene
      ninguna autoridad de ningún tipo para obligar a Oro Labs en ningún aspecto.</span></p>

      <p><b><span
      >7.8.</span></b><span
      >
      Sitios web de terceros. Los Servicios pueden contener enlaces a anunciantes, a sitios
      web o servicios de terceros (&quot;Sitios web de terceros&quot;). El Proveedor
      reconoce y acepta que Oro Labs no es responsable de: (i) la disponibilidad o
      exactitud de dichos Sitios de terceros, o (ii) el contenido, los productos o
      los recursos de dichos Sitios de terceros o disponibles en ellos. Los Sitios de
      terceros no implican ninguna aprobación por parte de Oro Labs de dichos sitios
      Web o servicios. Si el Proveedor decide acceder a cualquiera de los Sitios de
      Terceros vinculados a los Servicios, lo hace por su cuenta y riesgo y sujeto a los
      términos y condiciones de uso de dichos Sitios de Terceros, y reconoce ser el
      único responsable y asume todos los riesgos derivados de su uso de cualquiera
      de dichos Sitios de Terceros.</span></p>

      <p><b><span
      >7.9.</span></b><span
      >
      Productos y Contenidos de Terceros. En relación con los Servicios, el Proveedor
      puede tener acceso o utilizar aplicaciones, integraciones, software, servicios,
      sistemas u otros productos no desarrollados por Oro Labs (&quot;Productos de
      Terceros&quot;), o datos/contenidos derivados de dichos Productos de terceros o
      que surjan de un acuerdo entre Oro Labs y dicho tercero (colectivamente,
      &quot;Contenido de Terceros&quot;). Oro Labs no puede garantizar que dicho
      Contenido de Terceros esté libre de material que usted pueda considerar objetable
      o de otro tipo. Además, Oro Labs no garantiza ni respalda los Productos de Terceros
      ni el Contenido de Terceros (independientemente de que Oro Labs designe o no
      estos elementos como verificados o integrados en los Servicios) y rechaza toda
      responsabilidad por estos elementos y su acceso o integración en los Servicios,
      incluida su modificación, eliminación o divulgación. El Proveedor reconoce y
      acepta, que dichos Productos de Terceros y Contenidos de Terceros constituyen la
      &quot;información confidencial&quot; del propietario de dichos Productos de
      Terceros y Contenidos de Terceros, y como tal, el Proveedor acepta tomar las
      precauciones razonables para proteger dichos Productos de Terceros y Contenidos
      de Terceros, y a no utilizar (salvo en relación con los Servicios o si el
      propietario lo permite por escrito) ni divulgar a terceros dichos Productos o
      Contenidos de Terceros, salvo a sus contratistas y/o agentes que tengan una
      necesidad legítima de conocerlos y que estén sujetos a obligaciones de
      confidencialidad al menos tan estrictas como las contenidas en el presente Acuerdo.</span></p>

      <p><b><span
      >7.10.</span></b><span
      >
      Avisos. Todos los avisos bajo este Acuerdo deberán ser por escrito, y se
      considerarán debidamente entregados cuando se reciban, si fueron entregados
      personalmente; cuando se confirme electrónicamente la recepción, si se
      transmite por fax o correo electrónico; al día siguiente de que fue enviado, si
      fue enviado por medio servicio de entrega de noche reconocido; y contra
      recepción, si fue enviado por el correo certificado o registrado, acuse de
      recibo solicitado. Cualquier aviso a Oro Labs puede ser enviado a [CORREO
      ELECTRÓNICO] o por correo dirigido a [DIRECCIÓN].</span></p>

      <p><b><span
      >7.11.</span></b><span
      > Ley
      aplicable. El presente Acuerdo se regirá por las leyes del Estado de Delaware,
      sin referencia a los principios de conflicto de leyes. Cualquier disputa entre
      las Partes que surja de o esté relacionada con este Acuerdo se resolverá
      exclusivamente mediante arbitraje JAMS, que se celebrará en California o en otro
      lugar acordado mutuamente, y se llevará a cabo de conformidad con el JAMS
      vigente en ese momento. La resolución sobre el laudo dictado será definitiva e
      inapelable y podrá ser dictada por cualquier tribunal competente. La Parte
      vencedora tendrá derecho a recuperar de la otra Parte todos los honorarios
      razonables de sus abogados, además de cualquier otra indemnización por daños y
      perjuicios. Ambas Partes renuncian a cualquier derecho a participar en
      cualquier acción colectiva que implique disputas entre las Partes, y cada una
      de las Partes renuncia al derecho a un juicio con jurado. Todas las reclamaciones
      se deben presentar a título individual de las Partes, y no como demandante o
      miembro de una clase en un supuesto procedimiento colectivo o representativo,
      y, a menos que Oro Labs acuerde lo contrario, el árbitro no podrá consolidar
      las reclamaciones de más de una persona. Esta renuncia a la demanda colectiva
      es una parte esencial de este acuerdo de arbitraje y no se puede separar. Si
      por alguna razón esta renuncia a la demanda colectiva se considera inaplicable,
      no se aplicará la totalidad del acuerdo de arbitraje. Sin embargo, la renuncia
      al derecho a juicio por jurado establecida en esta Sección 7.12 permanecerá en
      pleno vigor y efecto. EL PROVEEDOR Y ORO LABS ACUERDAN QUE TODA CAUSA DE ACCIÓN
      QUE SURJA DE O ESTÉ RELACIONADA CON LOS SERVICIOS O CON EL PRESENTE ACUERDO SE DEBERÁ
      INICIAR DENTRO DEL PLAZO DE UN (1) AÑO A PARTIR DE LA FECHA EN QUE SE ORIGINE LA
      CAUSA DE ACCIÓN. DE LO CONTRARIO, DICHA CAUSA DE ACCIÓN PRESCRIBIRÁ PERMANENTEMENTE.</span></p>

      <p><b><span
      >7.13.</span></b><span
      >
      Política de derechos de autor. Oro Labs respeta los derechos de propiedad
      intelectual de terceros y espera que los usuarios de los Servicios hagan lo
      mismo. Oro Labs responderá a las notificaciones de supuestas infracciones de
      derechos de autor que cumplan con la legislación aplicable y que se proporcionen
      correctamente al agente de derechos de autor designado por Oro Labs
      (&quot;Agente de derechos de autor&quot;). El agente de derechos de autor
      designado por Oro Labs para recibir notificaciones de supuestas infracciones es:</span></p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>

      <p
      >&nbsp;</p>

      <p
      ><b><span>DESCARGO DE
      RESPONSABILIDAD:</span></b><span
      > Esta es una traducción no oficial
      proporcionada únicamente con fines informativos. La versión original en inglés
      de los Términos y Condiciones del Proveedor (<OroButton label='disponible
      aquí insertar enlace' type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />) 
      es legalmente
      vinculante y prevalecerá en caso de cualquier conflicto o discrepancia con esta
      traducción no oficial.</span></p>
    </div>
  )
}
