/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import { Address } from './EnSTC'
import styles from './stc.module.scss'
import { getLocalDateString } from '../Form'
import { OroButton } from '../controls'

export function PtSTC (props: {
  onToggleLanguage: () => void
}) {
  return (
    <div className={styles.stc}>
      <p className={styles.subtitle}><b>Oro Labs, Inc. Termos e condições do fornecedor </b></p>

      <p className={styles.subtitle}><b>Data de vigência: {getLocalDateString((new Date()).toString(), 'pt')}</b></p>

      <p
      ><span>Estes Termos e condições do fornecedor regem
      seu acesso e uso dos serviços (os &quot;Serviços&quot;), de propriedade ou
      controlados pela Oro Labs, Inc., uma corporação de Delaware (&quot;Oro
      Labs&quot;). AO USAR OS SERVIÇOS, OU AO ACEITAR ESTES TERMOS DE OUTRA FORMA,
      ACESSANDO ESTE SITE E CLICANDO EM &quot;CONTINUAR&quot;, O SENHOR
      (&quot;FORNECEDOR&quot;) CONCORDA EM SE VINCULAR E CUMPRIR ESTES TERMOS E
      CONDIÇÕES DO FORNECEDOR. SE O SENHOR NÃO QUISER CONCORDAR COM ESTES TERMOS E
      CONDIÇÕES, NÃO DEVERÁ ACESSAR OU USAR OS SERVIÇOS. Se estiver aceitando este
      Contrato em nome de uma empresa, negócio, corporação ou outra entidade, o
      senhor e a empresa, negócio, corporação ou outra entidade aplicável representam
      e garantem que têm autoridade para vincular essa entidade a este Contrato, caso
      em que os termos &quot;o senhor&quot; ou &quot;Fornecedor&quot; se referirão a
      essa entidade. A Oro Labs e o Fornecedor são aqui referidos como uma
      &quot;Parte&quot; e, em conjunto, como as &quot;Partes&quot;. </span></p>

      <p
      ><span>Os Serviços incluem o acesso à plataforma da
      Oro Labs para facilitar o envio e o gerenciamento de materiais de aquisição
      entre o Fornecedor e um ou mais clientes da Oro Labs (cada um, um
      &quot;Cliente&quot;), a fim de participar de atividades de aquisição pelo
      Fornecedor para tal Cliente.  Cada Cliente com o qual o senhor interage por
      meio dos Serviços pode exigir que o senhor concorde com termos adicionais
      relacionados ao seu relacionamento com esse Cliente.  Esses termos adicionais
      poderão ser apresentados ao senhor para aceitação por meio dos Serviços.   </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>1. Escopo do serviço; prazo </b></p>

      <p
      ><b><span>1.1.</span></b><span> Durante o
      Prazo (conforme definido abaixo), a Oro Labs concede ao Fornecedor e seus
      funcionários, contratados e agentes (&quot;Usuários Autorizados&quot;) uma
      licença limitada, não exclusiva e intransferível (exceto de acordo com a Seção
      7.3) para acessar e usar os Serviços para fins comerciais internos do
      Fornecedor, de acordo com os termos deste Contrato. A Oro Labs se reserva todos
      os direitos não expressamente concedidos nós e para os Serviços. </span></p>

      <p
      ><b><span>1.2.</span></b><span> Os Serviços
      são atualmente disponibilizados ao Fornecedor gratuitamente, mas a Oro Labs se
      reserva o direito de cobrar por alguns ou todos os Serviços no futuro.  A Oro
      Labs o notificará antes que quaisquer Serviços que o usuário esteja usando
      comecem a ser cobrados e, se o usuário desejar continuar usando tais Serviços,
      deverá pagar todas as taxas aplicáveis a tais Serviços. </span></p>

      <p
      ><b><span>1.3. </span></b><span>Como
      condição para o uso e acesso do Fornecedor aos Serviços, o Fornecedor concorda
      em não usar os Serviços para qualquer finalidade ilegal ou de qualquer forma
      que viole este Contrato. Qualquer uso dos Serviços que viole este Contrato
      poderá resultar, entre outras coisas, na rescisão ou suspensão da conta do
      Fornecedor e de sua capacidade de usar os Serviços. O Fornecedor não poderá se
      envolver em nenhuma das seguintes atividades proibidas:</span><b><span>
      </span></b><span>(a) direta ou indiretamente, fazer engenharia reversa,
      descompilar, desmontar, separar ou tentar descobrir ou derivar o código-fonte,
      código-objeto ou estrutura subjacente, ideias, conhecimento ou algoritmos
      relevantes para os Serviços ou qualquer software, documentação ou dados
      relacionados aos Serviços (&quot;Software&quot;); (b) copiar, distribuir,
      transmitir ou divulgar qualquer parte dos Serviços em qualquer meio, inclusive,
      sem limitação, por meio de qualquer &quot;raspagem&quot; automatizada ou não
      automatizada; (c) coletar ou colher quaisquer informações de identificação
      pessoal (&quot;PII&quot;), inclusive nomes de contas, dos Serviços; (d)
      modificar, adaptar, traduzir ou criar trabalhos derivados com base nos Serviços
      ou nos Softwares; (e) transferir, vender, arrendar, sindicalizar, subsindicalizar,
      emprestar ou usar os Serviços ou qualquer Software para fins de cobranding,
      timesharing ou bureau de serviços ou, de outra forma, para o benefício de
      terceiros; (f) usar qualquer sistema automatizado, incluindo, sem limitação,
      &quot;robôs&quot;, &quot;spiders&quot;, &quot;leitores off-line&quot;, etc.,
      para acessar os Serviços ou acessar qualquer conteúdo ou recurso dos Serviços
      por meio de qualquer tecnologia ou meio que não seja o fornecido ou autorizado
      pelos Serviços(g) transmitir spam, correntes ou outros emails não solicitados;
      (h) envolver-se, intencional ou conscientemente, em qualquer atividade que
      interfira ou perturbe os Serviços ou servidores ou redes conectadas aos
      Serviços; (i) remover, desfigurar, ocultar ou alterar quaisquer avisos ou
      rótulos de propriedade; (j) usar os Serviços, intencional ou conscientemente,
      de qualquer forma que viole quaisquer leis ou regulamentos aplicáveis; (k)
      tentar interferir, comprometer a integridade ou a segurança do sistema ou
      decifrar quaisquer transmissões de ou para os servidores que executam os
      Serviços; carregar dados inválidos, vírus, worms ou outros agentes de software
      por meio dos Serviços; contornar as medidas que a Oro Labs possa usar para
      impedir ou restringir o acesso aos Serviços, incluindo, sem limitação, recursos
      que impeçam ou restrinjam o uso ou a cópia de qualquer conteúdo ou recurso ou
      que imponham limitações ao uso dos Serviços ou do conteúdo ou dos recursos
      neles contidos; (l) fazer-se passar por outra pessoa ou, de outra forma,
      deturpar a afiliação do Fornecedor com uma pessoa ou entidade, realizar
      fraudes, ocultar ou tentar ocultar a identidade do Fornecedor; ou (m) acessar,
      distribuir ou usar para fins comerciais qualquer parte dos Serviços ou
      quaisquer serviços ou materiais disponíveis por meio dos Serviços. </span></p>

      <p
      ><b><span>1.4.</span></b><span> A
      &quot;Vigência&quot; do uso dos Serviços pelo Fornecedor será pelo tempo em que
      o Fornecedor continuar a ter um relacionamento comercial com qualquer Cliente
      que exija o uso ou acesso aos Serviços, a menos que a Oro Labs encerre
      antecipadamente o acesso do Fornecedor aos Serviços por qualquer motivo. </span><b><span
     >1.5.</span></b><span> Após a rescisão ou expiração deste
      Contrato, todos os direitos e licenças concedidos pela Oro Labs ao Fornecedor
      cessarão imediatamente (exceto conforme estabelecido nesta Seção 1.5). 
      Mediante solicitação do Fornecedor, a Oro Labs envidará esforços razoáveis para
      excluir os Dados do Fornecedor (definidos abaixo) fornecidos pelo Fornecedor
      aos Serviços; desde que, no entanto, a Oro Labs possa reter cópias dos Dados do
      Fornecedor: (i) fornecidos de forma independente pelos Clientes da Oro Labs;
      (ii) conforme necessário para cumprir as leis, regulamentos ou padrões
      profissionais aplicáveis; (iii) em servidores ou fontes de back-up se tais
      Dados do Fornecedor forem excluídos dos discos rígidos locais e nenhuma tentativa
      for feita para recuperar tais Dados do Fornecedor de tais servidores ou fontes
      de backup, e/ou (iv) conforme estabelecido de outra forma na Seção 3.5. </span></p>

      <p
      ><b><span>1.6. </span></b><span>O Fornecedor
      é totalmente responsável por manter a confidencialidade de sua senha e conta.
      Além disso, o Fornecedor é inteiramente responsável por toda e qualquer
      atividade que ocorra em sua conta. O Fornecedor concorda em notificar a Oro
      Labs imediatamente sobre qualquer uso não autorizado, conhecido ou suspeito, de
      seu nome de usuário e senha ou qualquer outra violação de segurança. O
      Fornecedor, e não a Oro Labs, será responsável por qualquer perda em que o
      Fornecedor, a Oro Labs e qualquer outra parte possam incorrer como resultado do
      uso do nome de usuário, senha ou conta do Fornecedor por outra pessoa, somente
      no caso e na medida em que tal uso seja permitido pelo Fornecedor ou seja
      resultado da falha do Fornecedor em manter a confidencialidade da senha e das
      informações da conta do Fornecedor. O Fornecedor não poderá usar a conta de
      outra pessoa em nenhum momento, sem a permissão por escrito do titular da
      conta. A conta do Fornecedor é exclusiva do Fornecedor e não pode ser
      transferida a terceiros. </span></p>

      <p
      ><b><span>1.7. </span></b><span>Os Serviços
      podem ser modificados pela Oro Labs a seu critério, de tempos em tempos. A Oro
      Labs: (a) reserva-se o direito de retirar ou alterar os Serviços a seu
      exclusivo critério, sem aviso prévio; e (b) não será responsável se, por
      qualquer motivo, todos ou qualquer parte dos Serviços estiverem indisponíveis a
      qualquer momento ou por qualquer período.  </span></p>

      <p
      ><b><span>1.8. </span></b><span>O Fornecedor
      será responsável por obter e manter qualquer equipamento e serviços auxiliares
      necessários para se conectar, acessar ou usar os Serviços, incluindo, sem
      limitação, modems, hardware, servidores, software, sistemas operacionais, redes,
      servidores da Web e similares. </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>2. Registro de conta </b></p>

      <p
      ><b><span>2.1. </span></b><span>Antes de
      usar os Serviços, o Fornecedor deverá concluir o processo de registro da conta,
      fornecendo à Oro Labs informações atuais, completas e precisas, conforme
      solicitado pelo formulário de registro aplicável. Cada Usuário Autorizado
      deverá se registrar apenas uma vez usando um único nome de usuário e o
      Fornecedor garantirá que nenhum Usuário Autorizado (a) se registrará em nome de
      outra pessoa; (b) registrar-se com o nome de outra pessoa ou com um nome
      fictício ou pseudônimo; (c) escolher um nome de usuário que constitua ou sugira
      a personificação de qualquer outra pessoa (real ou fictícia) ou entidade ou que
      um Usuário Autorizado seja representante de uma entidade quando não o for, ou
      que seja ofensivo; ou (d) escolher um nome de usuário com a finalidade de
      enganar ou iludir os usuários e/ou a Oro Labs quanto à verdadeira identidade de
      um Usuário Autorizado. O Usuário Autorizado concorda em manter e atualizar
      todas as informações de registro de conta para mantê-las verdadeiras, precisas,
      atuais e completas. Se qualquer informação fornecida pelo Usuário autorizado
      for falsa, imprecisa, desatualizada, incompleta ou violar as restrições
      estabelecidas acima, a Oro Labs tem o direito de encerrar a conta do Usuário
      autorizado e recusar todo e qualquer uso atual ou futuro dos Serviços.  </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>3. Conteúdo; comentários </b></p>

      <p
      ><b><span>3.1 </span></b><span>Qualquer
      informação ou conteúdo carregado, compartilhado, armazenado, fornecido ou
      transferido por meio dos Serviços por Usuários Autorizados é o
      &quot;Conteúdo&quot; do Fornecedor, incluindo informações de perfil, transações
      e outros dados que o Usuário envia aos Serviços, informações promocionais,
      dados/detalhes de transações, listas de clientes, dados que o Usuário mantém
      sobre seus clientes e fornecedores, dados pessoais, informações de marketing ou
      informações relacionadas. Alguns Conteúdos podem ser visualizados por outros
      usuários. O senhor é o único responsável por todo o Conteúdo com o qual
      contribui para os Serviços. O senhor declara que todo o Conteúdo enviado pelo
      senhor é preciso, completo, atualizado e está em conformidade com todas as
      leis, regras e regulamentos aplicáveis. O usuário concorda que não publicará,
      carregará, compartilhará, armazenará ou, de outra forma, fornecerá por meio dos
      Serviços quaisquer Envios de Usuário que: (i) infrinjam direitos autorais ou
      outros direitos de terceiros (por exemplo, marca registrada, direitos de
      privacidade etc.); (ii) contenham conteúdo sexualmente explícito ou
      pornografia; (iii) contenham conteúdo de ódio, difamatório ou discriminatório
      ou incitem o ódio contra qualquer indivíduo ou grupo; (iv) explorem menores de
      idade; (v) retratam atos ilegais ou de extrema violência; (vi) retratam
      crueldade contra animais ou extrema violência contra animais; (vii) promovem
      esquemas fraudulentos, esquemas de marketing multinível (MLM), esquemas de
      enriquecimento rápido, jogos e apostas on-line, presentes em dinheiro, negócios
      de trabalho em casa ou quaisquer outros empreendimentos duvidosos para ganhar
      dinheiro; ou (viii) que violam qualquer lei. </span></p>

      <p
      ><b><span>3.2. </span></b><span> Para todo o
      Conteúdo, o Fornecedor concede à Oro Labs uma licença para exibir, executar,
      traduzir, modificar (para fins técnicos, por exemplo, certificando-se de que o
      Conteúdo seja visível em um dispositivo móvel), distribuir, reter, reproduzir e
      de outra forma agir com relação a tal Conteúdo (coletivamente,
      &quot;Uso&quot;), em cada caso para permitir que a Oro Labs forneça os
      Serviços, o que inclui o fornecimento de Conteúdo aos Clientes com os quais o
      Fornecedor decidiu compartilhar ou publicar tal Conteúdo. </span></p>

      <p
      ><b><span>3.3. </span></b><span>O uso do
      Conteúdo pela Oro Labs estará sujeito ao Adendo de Processamento de Dados,
      incorporado a este Contrato. O Adendo sobre Processamento de Dados prevalecerá,
      conforme aplicável, se houver conflito entre ele e a Política de Privacidade ou
      este Contrato. O senhor poderá entrar em contato com a Oro Labs para obter uma
      cópia assinada da exposição do Adendo sobre Processamento de Dados, se
      necessário, para o cumprimento da legislação local. </span></p>

      <p
      ><b><span>3.4 </span></b><span>O Fornecedor é
      responsável por todo o Conteúdo carregado, postado ou armazenado por meio do
      uso dos Serviços pelo Fornecedor. A Oro Labs não é responsável por qualquer
      Conteúdo perdido ou irrecuperável que não seja resultado de negligência grave
      ou má conduta intencional da Oro Labs. Embora a Oro Labs não tenha nenhuma
      obrigação de monitorar o Conteúdo ou o uso dos Serviços pelo Fornecedor, a Oro
      Labs poderá, a seu exclusivo critério, remover qualquer Conteúdo, no todo ou em
      parte, ou proibir qualquer uso dos Serviços alegadamente inaceitável,
      indesejável, inapropriado ou em violação deste Contrato. </span></p>

      <p
      ><b><span>3.5. </span></b><span>O Fornecedor
      poderá solicitar que a Oro Labs exclua os Dados do Fornecedor, conforme
      estabelecido na Seção 1.5. No entanto, o Fornecedor reconhece e concorda
      especificamente que, na medida em que o Conteúdo tenha sido previamente
      fornecido, ou copiado ou armazenado por outros usuários (incluindo, por
      exemplo, Clientes), tal Conteúdo poderá ser retido pela Oro Labs com a
      finalidade de continuar a fornecer acesso a tal Conteúdo a tais usuários (e as
      licenças aqui estabelecidas continuarão enquanto tal acesso for fornecido). </span></p>

      <p
      ><b><span>3.6. </span></b><span>De tempos em
      tempos, a Oro Labs poderá oferecer oportunidades para que os usuários enviem
      voluntariamente feedback e ideias para melhorias relacionadas aos Serviços. O
      Fornecedor concorda que (a) seu feedback e a expressão de suas ideias e/ou
      melhorias se tornarão automaticamente propriedade da Oro Labs; (b) A Oro Labs
      pode usar ou redistribuir o feedback do Fornecedor e seu conteúdo para qualquer
      finalidade e de qualquer forma e sem quaisquer restrições, exceto que a Oro
      Labs concorda em manter o nome do Fornecedor associado a tal feedback
      confidencial; (c) não há obrigação da Oro Labs de analisar qualquer feedback;
      (d) não há obrigação de manter qualquer feedback confidencial; e (e) a Oro Labs
      não terá nenhuma obrigação para com o Fornecedor ou contrato com o Fornecedor,
      implícito ou não. Ao fornecer feedback ou ideias, o Fornecedor reconhece e
      concorda que a Oro Labs e seus representantes podem criar por conta própria ou
      obter muitos envios que podem ser semelhantes ou idênticos ao feedback ou às
      ideias que o Fornecedor envia por meio dos Serviços ou de outros canais e
      meios. O Fornecedor, por meio deste instrumento, renuncia a toda e qualquer
      reivindicação que possa ter tido, possa ter e/ou possa ter no futuro, de que os
      envios aceitos, revisados e/ou usados pela Oro Labs e seus designados possam
      ser semelhantes ao feedback ou às ideias do Fornecedor. </span></p>

      <p
      ><b><span> </span></b></p>

      <p className={styles.subtitle}><b>4. Confidencialidade; direitos de propriedade </b></p>

      <p
      ><b><span>4.1. </span></b><span>Cada Parte
      (a &quot;Parte Receptora&quot;) entende que a outra Parte (a &quot;Parte
      Divulgadora&quot;) divulgou ou poderá divulgar informações comerciais, técnicas
      ou financeiras relacionadas aos negócios da Parte Divulgadora (doravante
      denominadas &quot;Informações Proprietárias&quot; da Parte Divulgadora). As
      informações proprietárias da Oro Labs incluem informações não públicas
      relacionadas a recursos, funcionalidade e desempenho dos Serviços.  As
      Informações Proprietárias de cada Fornecedor incluem dados não públicos sobre
      esse Fornecedor fornecidos por ele à Oro Labs (&quot;Dados do
      Fornecedor&quot;), Conteúdo e quaisquer dados ou informações derivadas do uso
      dos Serviços pelo Fornecedor. Para evitar dúvidas, os Dados do Fornecedor não
      incluem Dados Agregados (conforme definido abaixo) ou quaisquer dados,
      informações ou conteúdo carregados por terceiros que não sejam o Fornecedor. A
      Parte Receptora concorda em tomar precauções razoáveis para proteger tais
      Informações Proprietárias e, exceto para usar ou executar os Serviços ou
      conforme permitido de outra forma neste documento, não usar ou divulgar a
      terceiros quaisquer Informações Proprietárias; desde que, no entanto, a Parte
      Receptora possa divulgar Informações Proprietárias a seus contratados e/ou
      agentes que tenham uma necessidade legítima de conhecer as Informações
      Proprietárias e que estejam vinculados a obrigações de confidencialidade pelo
      menos tão rigorosas quanto as contidas neste documento. A Parte Divulgadora
      concorda que o acima exposto não se aplicará com relação a qualquer informação
      após cinco (5) anos da divulgação da mesma, ou qualquer informação que a Parte
      Receptora possa documentar que (a) está ou se torna geralmente disponível ao
      público sem qualquer ação da Parte Receptora em violação a este Contrato, (b)
      estava em sua posse ou era de seu conhecimento antes do recebimento da Parte
      Divulgadora, (c) foi legitimamente divulgada a ela sem restrições por um
      terceiro, ou (d) foi desenvolvida independentemente sem o uso de qualquer
      Informação Proprietária da Parte Divulgadora. </span></p>

      <p
      ><b><span>4.2. </span></b><span>As Partes
      reconhecem e concordam que qualquer violação ou inadimplemento das obrigações
      de confidencialidade de uma Parte nos termos deste Contrato causará danos à
      outra Parte em um valor difícil de determinar.  Dessa forma, além de qualquer
      outra medida a que uma Parte possa ter direito, a Parte não inadimplente terá o
      direito, sem prova de danos reais, de buscar qualquer medida cautelar ordenada
      por qualquer tribunal de jurisdição competente, incluindo, mas não se limitando
      a, uma medida cautelar que restrinja qualquer violação das obrigações de
      confidencialidade da Parte inadimplente nos termos deste instrumento. </span></p>

      <p
      ><b><span>4.3.</span></b><span> Se a Parte
      Receptora ou qualquer um de seus representantes for obrigada pela lei aplicável
      a divulgar qualquer Informação Proprietária, então, na medida permitida pela
      lei aplicável, a Parte Receptora deverá: (a) prontamente, e antes de tal
      divulgação, notificar a Parte Divulgadora por escrito de tal exigência para que
      a Parte Divulgadora possa buscar uma ordem de proteção ou outro recurso, ou
      renunciar ao seu direito à confidencialidade de acordo com os termos deste Contrato;
      e (b) fornecer assistência razoável à Parte Divulgadora, a custo e despesa
      exclusivos da Parte Divulgadora, para se opor a essa divulgação ou buscar uma
      ordem de proteção ou outras limitações à divulgação. Se a Parte Divulgadora
      renunciar à conformidade ou, após fornecer a notificação e a assistência
      exigidas nesta Seção 4.3, a Parte Receptora continuar obrigada por lei a
      divulgar qualquer Informação Proprietária, a Parte Receptora divulgará apenas a
      parte das Informações Proprietárias que, segundo a orientação do consultor
      jurídico da Parte Receptora, a Parte Receptora é legalmente obrigada a divulgar
      e, mediante solicitação da Parte Divulgadora, envidará esforços comercialmente
      razoáveis para obter garantias do tribunal aplicável ou de outra autoridade
      presidente de que essas Informações Proprietárias receberão tratamento
      confidencial. Nenhuma divulgação forçada pela Parte Receptora afetará de outra
      forma as obrigações da Parte Receptora nos termos deste instrumento com relação
      às Informações Proprietárias assim divulgadas. </span></p>

      <p
      ><b><span>4.4. </span></b><span>O Fornecedor
      deverá possuir e reter todos os direitos, títulos e interesses em relação às
      suas Informações Proprietárias, incluindo os designs, marcas registradas,
      marcas de serviço e logotipos do Fornecedor. A Oro Labs será proprietária e
      manterá todos os direitos, títulos e interesses sobre suas Informações
      Proprietárias, incluindo (a) os Serviços e o Software, e todas as melhorias,
      aprimoramentos ou modificações dos mesmos, (b) qualquer software, aplicativos,
      invenções ou outra tecnologia desenvolvida em conexão com os Serviços de
      Implementação ou suporte, (c) todos os direitos de propriedade intelectual
      relacionados a qualquer um dos itens acima e (d) os designs, marcas
      registradas, marcas de serviço e logotipos da Oro Labs e dos Serviços, sejam de
      propriedade da Oro Labs ou licenciados para ela.   </span></p>

      <p
      ><b><span>4.5. </span></b><span>Não obstante
      qualquer disposição em contrário neste Contrato, a Oro Labs terá o direito
      (durante e após a vigência deste instrumento) de usar dados e informações
      relacionados ao uso dos Serviços pelo Fornecedor de forma agregada e anônima
      (&quot;Dados Agregados&quot;) para seus fins comerciais internos, para melhorar
      e aprimorar os Serviços, para compilar informações estatísticas e de
      desempenho, e para outros fins de desenvolvimento, diagnóstico e correção em
      relação aos Serviços e outras ofertas da Oro Labs. Quaisquer direitos não
      expressamente concedidos neste documento são considerados retidos. </span></p>

      <p
      ><b><span>4.6</span></b><span> Além do acima
      exposto, com relação apenas aos Assinantes, a Oro Labs (i) manterá medidas
      técnicas e organizacionais comercialmente razoáveis e apropriadas destinadas a
      proteger os Dados do Fornecedor contra perda, acesso ou divulgação não
      autorizados e ilegais, (ii) manterá salvaguardas físicas, eletrônicas e
      processuais em conformidade com as leis de privacidade aplicáveis, incluindo,
      mas não se limitando a: (a) a manutenção de salvaguardas apropriadas para
      restringir o acesso aos Dados do Fornecedor aos funcionários, agentes,
      licenciadores ou prestadores de serviços da Oro Labs que precisem dessas
      informações para cumprir as obrigações da Oro Labs nos termos deste Contrato;
      (b) procedimentos e práticas para a transmissão ou transporte seguro dos Dados
      do Fornecedor; e (c) a manutenção de proteções adequadas para evitar o acesso
      não autorizado aos Dados do Fornecedor. </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>5. Garantia e isenção de responsabilidade </b></p>

      <p
      ><b><span>5.1. </span></b><span>Cada Parte
      declara, convence e garante que: (a) estará em conformidade com todas as leis e
      regulamentos aplicáveis durante a Vigência na execução deste Contrato; (b) tem
      pleno direito, poder e autoridade para celebrar este Contrato; (c) o
      cumprimento de suas obrigações nos termos deste Contrato não viola e não
      violará nenhum outro contrato do qual seja parte; e (d) este Contrato constitui
      uma obrigação legal, válida e vinculante quando acordado. O Fornecedor também
      declara e garante que possui ou tem as licenças, direitos, consentimentos e
      permissões necessários para publicar e enviar o Conteúdo e os Dados do
      Fornecedor. O Fornecedor concorda ainda que o Conteúdo e os Dados do Fornecedor
      enviados aos Serviços não conterão material protegido por direitos autorais de
      terceiros ou material que esteja sujeito a outros direitos de propriedade de
      terceiros, a menos que o Fornecedor tenha permissão do proprietário legítimo do
      material ou que o Fornecedor tenha o direito legal de publicar o material e </span></p>

      <p
      ><span>conceder à Empresa todos os direitos de
      licença aqui concedidos. </span></p>

      <p
      ><b><span>5.2. </span></b><span>O Fornecedor
      reconhece que os Serviços são controlados e operados pela Oro Labs a partir dos
      Estados Unidos. Se o Cliente que deseja adquirir serviços do Fornecedor estiver
      localizado fora dos Estados Unidos, o Conteúdo, incluindo informações pessoais,
      fornecido pelo Fornecedor será processado no centro de dados mais próximo da
      localização do Cliente, que pode estar em um país diferente daquele onde o
      Fornecedor está localizado. A Oro Labs não declara nem garante que os Serviços,
      ou qualquer parte deles, sejam apropriados ou estejam disponíveis para uso em
      qualquer jurisdição específica. O Fornecedor e seus usuários autorizados estão
      sujeitos aos controles de exportação dos Estados Unidos em relação ao uso dos
      Serviços e/ou serviços relacionados a eles e são responsáveis por quaisquer
      violações de tais controles, incluindo, sem limitação, quaisquer embargos dos
      Estados Unidos ou outras regras e regulamentos federais que restrinjam as
      exportações. </span></p>

      <p
      ><b><span>5.3. </span></b><span>EXCETO PELAS
      GARANTIAS EXPRESSAS ESTABELECIDAS NA SEÇÃO 5.1, OS SERVIÇOS SÃO FORNECIDOS
      &quot;NO ESTADO EM QUE SE ENCONTRAM&quot;. A ORO LABS SE ISENTA ESPECIFICAMENTE
      DE TODAS AS GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UMA FINALIDADE
      ESPECÍFICA E TÍTULO. SEM LIMITAR O ACIMA EXPOSTO, A ORO LABS NÃO OFERECE NENHUMA
      GARANTIA DE QUALQUER TIPO DE QUE OS SERVIÇOS, QUALQUER PRODUTO DE TERCEIROS,
      CONTEÚDO DE TERCEIROS OU QUAISQUER RESULTADOS DO USO DOS SERVIÇOS ATENDERÃO AOS
      REQUISITOS DO FORNECEDOR OU DE QUALQUER OUTRA PESSOA, OPERARÃO SEM INTERRUPÇÃO,
      ALCANÇARÃO QUALQUER RESULTADO PRETENDIDO, SERÃO COMPATÍVEIS OU FUNCIONARÃO COM
      QUALQUER SOFTWARE, SISTEMA OU OUTROS SERVIÇOS, SERÃO SEGUROS, PRECISOS,
      COMPLETOS, LIVRES DE CÓDIGOS PREJUDICIAIS OU LIVRES DE ERROS.  </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>6. Limitação de responsabilidade </b></p>

      <p
      ><b><span>6.1. </span></b><span>EXCETO POR
      UMA VIOLAÇÃO DA SEÇÃO 1. 3, ATÉ O LIMITE MÁXIMO PERMITIDO PELA LEI APLICÁVEL,
      EM NENHUMA HIPÓTESE QUALQUER UMA DAS PARTES SERÁ RESPONSÁVEL POR DANOS
      ESPECIAIS, INCIDENTAIS, INDIRETOS, EXEMPLARES OU CONSEQUENCIAIS DE QUALQUER
      NATUREZA (INCLUINDO, SEM LIMITAÇÃO, DANOS POR PERDA DE LUCROS COMERCIAIS,
      INTERRUPÇÃO DE NEGÓCIOS, PERDA DE INFORMAÇÕES COMERCIAIS, RECEITAS, VENDAS OU
      ECONOMIAS ANTECIPADAS, OU QUALQUER OUTRA PERDA PECUNIÁRIA), DECORRENTES DE OU
      DE ALGUMA FORMA RELACIONADOS A ESTE CONTRATO, AOS SERVIÇOS, AOS PRODUTOS DE
      TERCEIROS, AOS SITES DE TERCEIROS OU AO CONTEÚDO DE TERCEIROS DISPONIBILIZADO
      POR MEIO DOS SERVIÇOS, SEJAM ELES DECORRENTES DE ATO ILÍCITO (INCLUINDO
      NEGLIGÊNCIA), CONTRATO OU QUALQUER OUTRA TEORIA JURÍDICA, MESMO QUE TAL PARTE
      TENHA SIDO AVISADA DA POSSIBILIDADE DE TAIS DANOS.   </span></p>

      <p
      ><b><span>6.2. </span></b><span>EXCETO POR
      UMA INFRAÇÃO DA SEÇÃO 1. 3, EM NENHUMA HIPÓTESE A RESPONSABILIDADE COLETIVA
      AGREGADA DE QUALQUER UMA DAS PARTES OU DE SUAS AFILIADAS DECORRENTE DE OU DE
      ALGUMA FORMA RELACIONADA A ESTE CONTRATO, AOS SERVIÇOS, AOS PRODUTOS DE
      TERCEIROS, AOS SITES DE TERCEIROS OU AO CONTEÚDO DE TERCEIROS DISPONIBILIZADO
      POR MEIO DOS SERVIÇOS, SEJA DECORRENTE DE OU RELACIONADA À VIOLAÇÃO DE
      CONTRATO, RESPONSABILIDADE CIVIL (INCLUINDO NEGLIGÊNCIA), RESPONSABILIDADE ESTRITA
      OU QUALQUER OUTRA TEORIA LEGAL OU EQUITATIVA, EXCEDA O MAIOR VALOR ENTRE (I)
      CEM DÓLARES (US$ 100) E (II) OS VALORES TOTAIS PAGOS (E QUAISQUER VALORES
      ACUMULADOS, MAS AINDA NÃO PAGOS) PELO FORNECEDOR À ORO LABS NO PERÍODO DE SEIS
      MESES ANTERIOR AO EVENTO QUE DEU ORIGEM À REIVINDICAÇÃO. </span></p>

      <p
      ><span> </span></p>

      <p className={styles.subtitle}><b>7. Diversos </b></p>

      <p
      ><b><span>7.1. Sobrevivência</span></b><span
     >. As seguintes Seções deste Contrato sobreviverão à rescisão ou
      expiração deste Contrato: Seção 1.2, 1.3, 1.5, 3.4, 3.5, 4, 5, 6 e 7. </span></p>

      <p
      ><b><span>7.2. Severability</span></b><span>.
      Se qualquer disposição deste Contrato for considerada inexequível ou inválida,
      essa disposição será limitada ou eliminada na medida mínima necessária para que
      este Contrato permaneça em pleno vigor e efeito e seja exequível.   </span></p>

      <p
      ><b><span>7.3. Atribuição</span></b><span>.
      Este Contrato não é passível de cessão, transferência ou sublicenciamento por
      qualquer uma das Partes, exceto com o consentimento prévio por escrito da
      outra; desde que, no entanto, qualquer uma das Partes possa ceder ou transferir
      este Contrato: (a) para uma afiliada em que (i) o cessionário tenha concordado
      por escrito em se vincular aos termos deste Contrato, (ii) a Parte cedente
      permanece responsável pelas obrigações previstas neste Contrato se o
      cessionário não as cumprir, e (iii) a Parte cedente notificou a outra Parte
      sobre a cessão, por escrito; e (b) em caso de fusão, venda de substancialmente
      todas as ações, ativos ou negócios, ou outra reorganização que envolva a Parte
      cedente, e o consentimento prévio por escrito da Parte não cedente não será
      exigido em tal caso, com o entendimento expresso de que, nos casos em que a
      Parte cedente não for a entidade sobrevivente, este Contrato vinculará o
      sucessor em interesse da Parte cedente com relação a todas as obrigações aqui
      estabelecidas. Qualquer outra tentativa de transferência ou cessão é nula. </span></p>

      <p
      ><b><span>7.4. Força Maior</span></b><span>.
      No caso de qualquer uma das Partes ser atrasada, prejudicada ou impedida de
      realizar qualquer ato exigido neste instrumento, que não seja uma obrigação de
      pagamento, em razão de greves, lock-outs, problemas trabalhistas, incapacidade
      de obter materiais ou serviços, falta de energia, tumultos, insurreições,
      guerras ou outros motivos de natureza semelhante que não sejam culpa da Parte
      atrasada na realização do trabalho ou na realização de atos exigidos nos termos
      deste Contrato, guerra ou outros motivos de natureza semelhante que não sejam
      culpa da Parte atrasada na execução do trabalho ou na realização de atos
      exigidos nos termos deste Contrato, essa Parte deverá notificar imediatamente a
      outra Parte sobre esse atraso, e a execução desse ato será dispensada pelo
      período do atraso e o período para a execução de qualquer ato será prorrogado
      por um período equivalente ao período desse atraso. </span><b><span>7.5.
      Contrato integral</span></b><span>. Este Contrato é a declaração
      completa e exclusiva do entendimento mútuo das Partes e substitui e cancela
      todos os acordos, comunicações e outros entendimentos anteriores, escritos e
      verbais, relacionados ao objeto deste Contrato. Todas as renúncias e
      modificações devem ser feitas por escrito e assinadas por ambas as Partes,
      salvo disposição em contrário neste documento. </span></p>

      <p
      ><b><span>7.6. Modificação</span></b><span>.
      A Oro Labs poderá revisar e atualizar estes Termos e Condições do Fornecedor de
      tempos em tempos, a seu exclusivo critério. Todas as alterações entrarão em
      vigor imediatamente quando disponibilizadas neste site e se aplicarão a todo
      acesso e uso dos Serviços a partir de então. No entanto, quaisquer alterações
      nas disposições de resolução de disputas estabelecidas na Seção 7.13 não se
      aplicarão a quaisquer disputas para as quais as Partes tenham notificação real
      na data ou antes da data em que a alteração for publicada neste site.  O uso
      continuado dos Serviços pelo Fornecedor após a publicação dos Termos de Serviço
      revisados significa que o Fornecedor aceita e concorda com as alterações.
      Recomenda-se que o Fornecedor verifique esta página periodicamente para que
      esteja ciente de quaisquer alterações, uma vez que tais alterações são
      obrigatórias para o Fornecedor. </span></p>

      <p
      ><b><span>7.7. Relacionamento das partes</span></b><span
     >. Nenhuma agência, parceria, joint venture ou emprego é criado como
      resultado deste Contrato e o Fornecedor não tem autoridade de qualquer tipo
      para vincular a Oro Labs em qualquer aspecto. </span></p>

      <p
      ><b><span>7.8. Sites de terceiros</span></b><span
     >. Os Serviços podem conter links para anunciantes, sites ou serviços de
      terceiros (&quot;Sites de Terceiros&quot;). O Fornecedor reconhece e concorda
      que a Oro Labs não é responsável por: (i) a disponibilidade ou precisão de tais
      Sites de Terceiros, ou (ii) o conteúdo, produtos ou recursos em ou disponíveis
      em tais Sites de Terceiros. Quaisquer Sites de Terceiros não implicam em
      qualquer endosso da Oro Labs a esses sites ou serviços. Se o Fornecedor decidir
      acessar qualquer um dos Sites de Terceiros vinculados aos Serviços, o
      Fornecedor o faz integralmente por sua conta e risco e sujeito aos termos e
      condições de uso de tais Sites de Terceiros e reconhece a responsabilidade
      exclusiva e assume todos os riscos decorrentes do uso de tais Sites de
      Terceiros. </span></p>

      <p
      ><b><span>7.9. Produtos de terceiros e conteúdo de
      terceiros</span></b><span>. Em conexão com os Serviços, o Fornecedor
      pode ter acesso ou usar aplicativos, integrações, software, serviços, sistemas
      ou outros produtos não desenvolvidos pela Oro Labs (&quot;Produtos de
      Terceiros&quot;), ou dados/conteúdo derivados de tais Produtos de Terceiros ou
      decorrentes de um acordo entre a Oro Labs e tal terceiro (coletivamente,
      &quot;Conteúdo de Terceiros&quot;). A Oro Labs não pode garantir que tal
      Conteúdo de Terceiros estará livre de material que o senhor possa considerar censurável
      ou não. Além disso, a Oro Labs não garante ou dá suporte a Produtos de
      Terceiros ou Conteúdo de Terceiros (quer esses itens sejam ou não designados
      pela Oro Labs como verificados ou integrados aos Serviços) e se isenta de toda
      e qualquer responsabilidade e obrigação por esses itens e seu acesso ou
      integração com os Serviços, incluindo sua modificação, exclusão ou divulgação.
      O Fornecedor reconhece e concorda que tais Produtos de Terceiros e Conteúdo de
      Terceiros constituem as &quot;informações confidenciais&quot; do proprietário
      de tais Produtos de Terceiros e Conteúdo de Terceiros e, como tal, o Fornecedor
      concorda em tomar precauções razoáveis para proteger tais Produtos de Terceiros
      e Conteúdo de Terceiros, e não usar (exceto em conexão com os Serviços ou
      conforme permitido pelo proprietário por escrito) ou divulgar a terceiros
      quaisquer Produtos de Terceiros ou Conteúdo de Terceiros, exceto para seus
      contratados e/ou agentes que tenham uma necessidade legítima de conhecer e que
      estejam vinculados a obrigações de confidencialidade pelo menos tão rigorosas
      quanto as contidas neste documento. </span></p>

      <p
      ><b><span>7.10. Avisos</span></b><span>.
      Todas as notificações previstas neste Contrato serão feitas por escrito e serão
      consideradas devidamente entregues quando recebidas, se entregues pessoalmente;
      quando o recebimento for confirmado eletronicamente, se transmitidas por
      fac-símile ou e-mail; no dia seguinte ao envio, se enviadas para entrega no dia
      seguinte por serviço reconhecido de entrega noturna; e após o recebimento, se
      enviadas por correio certificado ou registrado, com aviso de recebimento
      solicitado. Quaisquer avisos à Oro Labs podem ser enviados para [EMAIL] ou por
      correio endereçado a <Address />. </span></p>

      <p
      ><b><span>7.11. Legislação aplicável</span></b><span
     >. Este Contrato será regido pelas leis do Estado de Delaware, sem
      referência a princípios de conflito de leis. Qualquer controvérsia entre as
      Partes decorrente ou relacionada a este Contrato deverá ser resolvida
      exclusivamente por arbitragem da JAMS, que deverá ser realizada na Califórnia
      ou em outro local mutuamente acordado, e conduzida de acordo com a JAMS então
      em vigor. O julgamento sobre a sentença proferida será final e não passível de
      recurso e poderá ser apresentado em qualquer tribunal com jurisdição. A Parte
      vencedora terá direito à recuperação de todos os seus honorários advocatícios
      razoáveis da outra Parte, além de qualquer outra indenização. Ambas as Partes
      renunciam a qualquer direito de participar de qualquer ação coletiva envolvendo
      disputas entre as Partes, e cada uma delas renuncia ao direito a um julgamento
      por júri. Todas as reivindicações devem ser apresentadas na capacidade
      individual das Partes, e não como autor ou membro de classe em qualquer
      processo supostamente coletivo ou representativo, e, salvo acordo em contrário
      da Oro Labs, o árbitro não poderá consolidar as reivindicações de mais de uma
      pessoa. Esta renúncia a ações coletivas é uma parte essencial desta convenção
      de arbitragem e não pode ser separada. Se, por qualquer motivo, esta renúncia a
      ações coletivas for considerada inexequível, a convenção de arbitragem inteira
      não se aplicará. No entanto, a renúncia ao direito de julgamento por júri
      estabelecido nesta Seção 7.12 permanecerá em pleno vigor e efeito. O FORNECEDOR
      E A ORO LABS CONCORDAM QUE QUALQUER CAUSA DE AÇÃO DECORRENTE OU RELACIONADA AOS
      SERVIÇOS OU A ESTE CONTRATO DEVE SER INICIADA DENTRO DE UM (1) ANO APÓS O
      INÍCIO DA CAUSA DE AÇÃO. CASO CONTRÁRIO, TAL CAUSA DE AÇÃO SERÁ PERMANENTEMENTE
      BARRADA. </span></p>

      <p
      ><b><span>7.13. Política de direitos autorais</span></b><span
     >. A Oro Labs respeita os direitos de propriedade intelectual de
      terceiros e espera que os usuários dos Serviços façam o mesmo. A Oro Labs
      responderá a avisos de suposta violação de direitos autorais que estejam em
      conformidade com a lei aplicável e sejam devidamente fornecidos ao agente de
      direitos autorais designado pela Oro Labs (&quot;Agente de direitos
      autorais&quot;). O agente de direitos autorais designado pela Oro Labs para
      receber notificações de violação alegada é:</span></p>

      <p><span
      >Oro Labs, Inc.<br />
      <Address /></span></p>

      <p
      >&nbsp;</p>

      <p
      ><b><span>AVISO LEGAL:</span></b><span
      > Esta é uma tradução não oficial fornecida apenas para fins informativos. A
      versão original em inglês dos Termos e Condições do Fornecedor  (<OroButton label='disponível aqui inserir link' 
      type='link' className={styles.languageToggleBtn} onClick={props.onToggleLanguage} />) é
      legalmente vinculativa e prevalecerá em caso de qualquer conflito ou
      discrepância com esta tradução não oficial.</span></p>
    </div>
  )
}
