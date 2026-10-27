# Requisitos legales del proyecto, registro de usuarios e incorporación de proyectos inmobiliarios

**Proyecto:** plataforma fintech académica para financiar proyectos inmobiliarios mediante derechos económicos representados digitalmente (RWA/tokenización).  
**Jurisdicción:** República Argentina.  
**Fecha de revisión:** 27 de octubre de 2026.  
**Versión:** 1.0.

> **Advertencia:** este documento es una base de análisis para un proyecto académico, no un dictamen legal. Antes de captar fondos, ofrecer inversiones, custodiar activos o habilitar transferencias reales, se necesita asesoramiento de profesionales argentinos especializados en mercado de capitales, prevención del lavado de activos y derecho inmobiliario. La normativa aplicable depende de la estructura jurídica, del instrumento y de las actividades efectivamente realizadas.

## 1. Objetivo

Identificar los requisitos legales que deben contemplarse para:

1. Constituir y operar la plataforma.
2. Determinar si corresponde registrarse o solicitar autorización ante la Comisión Nacional de Valores (CNV), la Unidad de Información Financiera (UIF) o el Banco Central de la República Argentina (BCRA).
3. Registrar inversores, desarrolladores y representantes de personas jurídicas.
4. Revisar la documentación de los proyectos inmobiliarios.
5. Proteger datos personales y formalizar la aceptación de contratos digitales.
6. Evitar que una cuenta pueda invertir antes de completar las verificaciones obligatorias.

## 2. Prototipo académico frente a plataforma comercial

| Funcionalidad | Prototipo académico | Plataforma comercial |
|---|---|---|
| Registro | Datos ficticios o mínimos. Si se recopilan datos personales reales, debe respetarse la normativa de privacidad. | Identificación y validaciones según la actividad regulada y el producto. |
| Proyectos inmobiliarios | Ejemplos simulados, claramente identificados. | Debida diligencia legal, registral, técnica, urbanística y financiera. |
| Inversiones | Simuladas, sin dinero real ni derechos económicos exigibles. | Instrumento jurídico definido, contratos y autorizaciones aplicables. |
| Tokens | Tokens de demostración en testnet, sin derechos reales. | Representación de un derecho jurídicamente definido y cumplimiento regulatorio. |
| Pagos y custodia | No recibir fondos reales. | Utilizar entidades habilitadas cuando corresponda y determinar quién custodia los fondos. |
| KYC/AML | Simulación con datos ficticios. | Controles de identidad y prevención según el régimen aplicable. |

### Requisitos mínimos del prototipo

- No recibir, transferir ni custodiar dinero real.
- No aceptar suscripciones de inversión vinculantes.
- No publicar ofertas dirigidas a captar capital real.
- No afirmar que un token representa propiedad directa sobre un inmueble si la estructura jurídica no otorga ese derecho.
- Mostrar una advertencia visible: **“Prototipo académico. Las inversiones, los saldos y las operaciones son simulados. No se reciben fondos ni se ofrecen inversiones reales”.**
- Usar datos ficticios durante las pruebas.
- No solicitar DNI, datos bancarios o documentación sensible real si no resulta necesario.
- Si se recopilan datos personales reales, informar su finalidad y protegerlos adecuadamente.

## 3. Decisión jurídica fundamental: ¿qué representa el token?

No debe definirse el producto únicamente como “tokens de un inmueble”. Antes de desarrollar una inversión real, hay que determinar:

1. **Activo subyacente:** inmueble, desarrollo o flujo económico.
2. **Vehículo jurídico:** sociedad, fideicomiso u otra estructura legal admisible.
3. **Instrumento o derecho:** acciones, deuda, certificados de participación u otro derecho jurídicamente válido.
4. **Emisor:** quién emite el instrumento y asume las obligaciones.
5. **Derechos del inversor:** cobros, distribución de resultados, voto, información y salida.
6. **Representación digital:** qué representa el token, cómo se acredita la titularidad y qué transferencias se permiten.
7. **Custodia y pagos:** quién recibe, administra, custodia y devuelve el dinero.
8. **Mercado secundario:** si se habilita, quién lo opera y bajo qué régimen.
9. **Tratamiento tributario:** impuestos y obligaciones informativas del emisor, el vehículo y el inversor.

### 3.1. El token no transfiere automáticamente el dominio del inmueble

La emisión de un token no equivale, por sí sola, a transferir la propiedad inmobiliaria. Los derechos reales sobre inmuebles se rigen por el Código Civil y Comercial y por las normas registrales correspondientes, incluida la Ley 17.801.

El token podría representar otro derecho —por ejemplo, un valor negociable o un derecho contractual—, pero ese derecho debe estar definido e instrumentado legalmente. No se debe promocionar el producto como “propiedad fraccionada del inmueble” salvo que la estructura jurídica efectivamente otorgue esa titularidad y se cumplan las formalidades e inscripciones aplicables.

## 4. Regímenes regulatorios que deben evaluarse

### 4.1. Mercado de capitales y oferta pública

La Ley 26.831 de Mercado de Capitales y las Normas CNV deben analizarse si la plataforma ofrece, coloca, negocia, intermedia, administra o facilita inversiones en instrumentos que puedan ser valores negociables.

Antes de operar, se debe determinar:

- si el instrumento es un valor negociable;
- si existe oferta pública;
- quién es el emisor;
- qué autorización o régimen resulta aplicable;
- qué agentes registrados deben intervenir;
- qué información debe entregarse al inversor;
- qué reglas de negociación, custodia, liquidación y transferencia corresponden.

No se debe asumir que una oferta queda fuera de la regulación por realizarse en una aplicación, usar blockchain, limitarse a un grupo de usuarios o denominarse “token”.

Fuente: [Ley 26.831 — Mercado de Capitales](https://www.argentina.gob.ar/normativa/nacional/ley-26831-206592/actualizacion).

### 4.2. Tokenización de valores negociables

Al 27 de octubre de 2026, debe revisarse el Título XXII de las Normas CNV y sus modificaciones, entre ellas las RG 1069/2025, 1081/2025 y 1150/2026.

El régimen contempla la representación digital de determinados valores negociables, sujetos a las condiciones de la normativa vigente. Entre los instrumentos incluidos se encuentran, según el régimen y sus condiciones, acciones, obligaciones negociables, CEDEARs, ciertos valores de fideicomisos financieros con activos del mundo real, cuotapartes de fondos comunes de inversión cerrados y otros instrumentos expresamente admitidos.

Para el régimen de representación digital, entre otras condiciones:

- El instrumento subyacente debe estar legalmente emitido y contar con las autorizaciones aplicables.
- Deben cumplirse los requisitos de depósito, titularidad registral y custodia correspondientes.
- Debe intervenir una entidad especializada en tecnología de registro distribuido o similar.
- La infraestructura debe preservar la identificación, integridad, trazabilidad y sincronización de los registros.
- Las transferencias deben respetar las restricciones regulatorias y contractuales.
- Los contratos inteligentes deben impedir transferencias no permitidas por el régimen.
- Los PSAV que participen en este régimen deben estar registrados ante la CNV en las categorías exigidas por la normativa.
- La documentación de emisión debe describir las características de la representación digital y los riesgos pertinentes.

**Implicación para el desarrollo:** primero se define y autoriza el instrumento; después se implementa su representación digital.

Fuentes: [RG 1069/2025](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1069-2025-414017/texto) y [RG 1150/2026](https://www.argentina.gob.ar/normativa/nacional/norma-426586/texto).

### 4.3. Plataforma de Financiamiento Colectivo (PFC)

Si el modelo encuadra como Plataforma de Financiamiento Colectivo bajo la Ley 27.349:

- La plataforma debe cumplir los requisitos societarios, de autorización y de registro ante la CNV que correspondan.
- Deben utilizarse las formas de participación permitidas por la ley y la reglamentación vigente. La ley contempla acciones de SA/SAS, préstamos convertibles en acciones y participación en fideicomisos.
- Deben respetarse los límites aplicables a proyectos e inversores.
- La información del proyecto debe ser objetiva, suficiente y accesible.
- No deben garantizarse rendimientos ni la captación total o parcial de los fondos.
- No deben administrarse inversiones de los usuarios de manera incompatible con el régimen.
- No debe brindarse asesoramiento financiero prohibido.
- El mercado secundario, si existe, debe ajustarse al mecanismo permitido por la regulación.

La ley contiene límites a la inversión y delega otros requisitos a la reglamentación CNV. Antes de codificar límites en el sistema, se debe confirmar cuál está vigente para el tipo de oferta y categoría de inversor.

Fuente: [Ley 27.349 — Sistema de Financiamiento Colectivo](https://www.argentina.gob.ar/normativa/nacional/ley-27349-273567/actualizacion).

### 4.4. Proveedor de Servicios de Activos Virtuales (PSAV)

La Ley 25.246, modificada por la Ley 27.739, contempla actividades que pueden encuadrar como servicios de activos virtuales, incluyendo intercambio entre activos virtuales y moneda fiduciaria, intercambio entre activos virtuales, transferencias, custodia/administración y servicios financieros vinculados con la oferta o venta de activos virtuales.

La **RG CNV 1172/2026**, publicada el 15 de octubre de 2026 y vigente desde el día siguiente, reordenó el régimen PSAV. Debe considerarse para analizar la situación regulatoria actual.

Si la actividad encuadra como PSAV:

- La inscripción ante la CNV debe realizarse antes de comenzar las actividades alcanzadas.
- La persona jurídica local debe cumplir la forma societaria admitida por la normativa y tener un objeto social expreso que contemple actuar como PSAV.
- Debe presentarse la documentación societaria, tributaria, de autoridades, accionistas, responsables y patrimonio exigida por la CNV.
- Deben identificarse las categorías de actividad que realizará.
- Debe cumplirse el patrimonio neto mínimo y los requisitos de capital aplicables.
- Deben designarse los responsables regulatorios requeridos.
- Deben implementarse procedimientos, sistemas informáticos, seguridad, gestión de riesgos, auditoría y reportes.
- Debe publicarse la leyenda de inscripción en los medios exigidos.
- Debe mantenerse información veraz, completa y actualizada durante toda la inscripción.

La RG 1172/2026 establece patrimonios netos mínimos diferenciados: USD 150.000 para las categorías 1, 2 y 4; USD 75.000 para la categoría 3; y USD 35.000 para la categoría 5. Prevé una reducción en ciertos casos de bajo volumen, con condiciones específicas. Si se solicita más de una categoría, se aplica la exigencia patrimonial más alta. Estos importes y sus condiciones deben verificarse con asesoramiento legal y contable antes de constituir la empresa.

Las categorías comprenden, en términos generales, intercambio de activos virtuales por moneda fiduciaria, intercambio entre activos virtuales, transferencia, custodia/administración y servicios financieros relacionados con la oferta o venta de activos virtuales.

No todo uso de blockchain ni todo desarrollo de software convierte automáticamente a una empresa en PSAV. La clasificación debe realizarse según las actividades reales. No debe presumirse una exclusión sin análisis jurídico.

Fuente: [RG CNV 1172/2026 — régimen PSAV](https://www.argentina.gob.ar/normativa/nacional/norma-431259/texto).

### 4.5. Prevención de lavado de activos y financiación del terrorismo

La Ley 25.246, modificada por la Ley 27.739, incluye a los PSAV entre los sujetos obligados. La Resolución UIF 49/2024 establece requisitos de prevención de lavado de activos, financiación del terrorismo y financiación de la proliferación de armas de destrucción masiva (LA/FT/FP) para el sector PSAV.

Cuando la empresa sea sujeto obligado, debe implementar las obligaciones que correspondan, entre ellas:

- Evaluación documentada de riesgos.
- Políticas y procedimientos aprobados y actualizados.
- Identificación y verificación del cliente.
- Identificación de representantes y beneficiarios finales cuando corresponda.
- Conocimiento del propósito de la relación y del perfil transaccional.
- Verificación del origen de los fondos y, según el riesgo, del patrimonio.
- Identificación y tratamiento de Personas Expuestas Políticamente (PEP).
- Controles de listas y sanciones aplicables.
- Monitoreo y análisis de operaciones inusuales.
- Reportes a la UIF cuando corresponda, sin alertar indebidamente al cliente.
- Conservación de legajos y evidencias durante los plazos legales.
- Capacitación, responsables y controles internos exigidos.

La diligencia depende del riesgo y del régimen aplicable. No se debe exigir indiscriminadamente la misma documentación a todos los usuarios si no es necesaria; tampoco se debe permitir operar cuando no se hayan completado los controles legalmente obligatorios.

La inscripción PSAV ante la CNV y el cumplimiento de las obligaciones ante la UIF son regímenes distintos. Debe confirmarse el procedimiento aplicable ante ambos organismos.

Fuentes: [Ley 25.246](https://www.argentina.gob.ar/normativa/nacional/norma-62977/actualizacion) y [Resolución UIF 49/2024](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-49-2024-397597/texto).

### 4.6. Servicios de pago y custodia de dinero

Si la plataforma ofrece cuentas de pago, administra saldos, recibe fondos, inicia pagos o presta otras funciones alcanzadas, debe analizarse el régimen de Proveedores de Servicios de Pago del BCRA y cualquier otra regulación financiera aplicable.

Para la operación real:

- Utilizar una entidad financiera o proveedor de pagos habilitado cuando corresponda.
- Documentar quién recibe el dinero, dónde se mantiene y quién puede disponer de él.
- Separar fondos propios y fondos de clientes cuando la normativa lo exija.
- No presentar un saldo interno como cuenta bancaria o cuenta de pago regulada si no lo es.
- No custodiar dinero o activos de terceros sin analizar las autorizaciones y obligaciones aplicables.
- Definir conciliación, devoluciones, errores de pago, fraude, reclamos y cierre del servicio.

El uso de un proveedor externo no elimina automáticamente las responsabilidades propias de la plataforma.

Fuente: [BCRA — Registro de Proveedores de Servicios de Pago](https://www.bcra.gob.ar/registro-de-proveedores-de-servicios-de-pago/).

## 5. Requisitos legales de la empresa operadora

### 5.1. Constitución y situación societaria

Antes de operar comercialmente, la empresa debe completar, según corresponda:

- Constitución de la sociedad o vehículo.
- Inscripción ante el Registro Público competente.
- Objeto social preciso y compatible con las actividades reales.
- CUIT y altas tributarias ante ARCA.
- Domicilio legal y medios de contacto.
- Libros, contabilidad, autoridades, poderes y representación.
- Identificación de accionistas, controlantes y beneficiarios finales.
- Contratos con proveedores tecnológicos, custodios, agentes, emisores y procesadores de pagos.
- Licencias, registros y autorizaciones sectoriales.
- Obligaciones impositivas nacionales, provinciales y municipales.

La estructura de una PFC y la de un PSAV no son intercambiables. Si se pretende realizar ambas actividades, deben evaluarse las compatibilidades y los requisitos de cada régimen.

### 5.2. Contratos, transparencia y reclamos

Preparar, según el modelo:

- Términos y Condiciones.
- Política de Privacidad.
- Política de cookies o tecnologías de seguimiento, si corresponde.
- Política de comisiones y costos.
- Procedimiento de reclamos y soporte.
- Política de conflictos de intereses.
- Reglas de elegibilidad y suspensión de cuentas.
- Contratos de suscripción o adquisición del instrumento.
- Documento de emisión y descripción del derecho representado.
- Advertencias de riesgo y condiciones de salida.
- Reglas de custodia, transferencias y mercado secundario, si corresponde.
- Política de conservación documental.
- Procedimiento para incidentes de seguridad y continuidad operativa.

La información debe ser clara, accesible y coherente con el producto real. Una cláusula general de exención no elimina responsabilidades legales inderogables.

### 5.3. Protección de consumidores y usuarios

La Ley 24.240 puede resultar aplicable según el servicio y la relación. La plataforma debe contemplar:

- Información cierta, clara y detallada.
- Precio, comisiones y costos totales visibles antes de contratar.
- Identificación de la empresa y medios de contacto.
- Explicación de las características esenciales del servicio.
- Comunicación no engañosa y sin promesas de rentabilidad garantizada.
- Disponibilidad de copia de los contratos y documentos aceptados.
- Canal de reclamos y registro de su resolución.
- Reglas de baja/cancelación y sus efectos.
- Respeto de los derechos irrenunciables que correspondan.

No utilizar mensajes como “inversión segura”, “rentabilidad garantizada” o “propiedad inmobiliaria directa” si no son jurídicamente correctos y demostrables.

Fuente: [Ley 24.240 — Defensa del Consumidor](https://www.argentina.gob.ar/normativa/nacional/ley-24240-638/actualizacion).

### 5.4. Protección de datos personales

La Ley 25.326 se aplica al tratamiento de datos personales. Antes de recopilarlos, la plataforma debe:

- Identificar al responsable del tratamiento y publicar sus datos de contacto.
- Informar finalidades, destinatarios, carácter obligatorio o facultativo de los datos y consecuencias de no proporcionarlos.
- Recopilar datos adecuados, pertinentes y no excesivos.
- Mantenerlos exactos y actualizados.
- Definir plazos y criterios de conservación y eliminación.
- Implementar controles de acceso, confidencialidad y seguridad.
- Permitir el ejercicio de derechos de acceso, rectificación, actualización y supresión, con las limitaciones legales correspondientes.
- Revisar cesiones a terceros, proveedores de KYC, servicios en la nube y transferencias internacionales.
- Evaluar si corresponde registrar la base de datos ante la autoridad competente conforme a la ley y reglas vigentes.
- Documentar la base jurídica de cada tratamiento.

El consentimiento debe ser libre, expreso e informado cuando sea la base legal aplicable. No todo tratamiento requiere consentimiento si existe otra base jurídica válida, como una obligación legal o una necesidad contractual; esto debe documentarse. Los consentimientos para marketing deben ser opcionales y separados de las condiciones esenciales del servicio.

**No almacenar en blockchain** DNI, domicilio, correo, teléfono, datos fiscales, datos bancarios ni documentos personales. Las direcciones de billetera también pueden constituir datos personales cuando se vinculan con una persona.

Fuente: [Ley 25.326 — Protección de Datos Personales](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion).

### 5.5. Contratación y firma electrónica

La Ley 25.506 distingue la firma digital de la firma electrónica. Un clic, un OTP o una firma electrónica no deben describirse automáticamente como “firma digital” en el sentido legal específico.

La plataforma debe:

- Conservar la versión exacta de cada contrato o política aceptada.
- Registrar fecha/hora, usuario, versión y evidencia de la acción.
- Permitir descargar o consultar los documentos aceptados.
- Separar aceptación de términos, consentimiento de datos, consentimiento comercial y aceptación del contrato de inversión.
- Usar un mecanismo de firma adecuado al riesgo y al tipo de instrumento.
- Obtener asesoramiento cuando se exija escritura pública, certificación o inscripción registral.

Fuente: [Ley 25.506 — Firma Digital](https://www.argentina.gob.ar/normativa/nacional/ley-25506-70749/actualizacion).

### 5.6. Impuestos y contabilidad

Antes de la operación real, definir con profesionales tributarios:

- Tratamiento fiscal de la sociedad y del vehículo que recibe la inversión.
- Impuestos sobre emisión, adquisición, transferencia y rendimientos.
- Retenciones, percepciones y comprobantes.
- Información a ARCA y otros organismos.
- Documentación del origen y destino de fondos.
- Reportes contables y conciliación de operaciones.

No asumir que un token está exento de impuestos por ser digital o utilizar blockchain.

## 6. Requisitos de los proyectos inmobiliarios

Cada proyecto debe pasar por una evaluación legal documentada antes de publicarse o recibir inversiones reales. Los documentos exactos varían según provincia, municipio, inmueble y estructura de financiación.

### 6.1. Identidad y capacidad del desarrollador

Solicitar y verificar, según el tipo de solicitante:

- Nombre o razón social.
- DNI o documento equivalente de las personas relevantes.
- CUIT/CUIL/CDI, según corresponda.
- Domicilio legal y datos de contacto.
- Estatuto o contrato social y constancia de inscripción.
- Autoridades, representantes y poderes vigentes.
- Accionistas y beneficiarios finales, cuando corresponda.
- Situación fiscal y documentación contable necesaria.
- Declaración de conflictos de intereses.
- Identificación de quién puede obligar jurídicamente al desarrollador.
- Declaraciones y verificaciones de prevención LA/FT/FP cuando correspondan.

### 6.2. Titularidad y situación registral del inmueble

Obtener, verificar y conservar evidencia adecuada de:

- Título de propiedad o documento que acredite el derecho que se aportará.
- Informe o certificado registral actualizado de dominio.
- Gravámenes, hipotecas, embargos, inhibiciones y restricciones.
- Nomenclatura catastral, plano de mensura y datos identificatorios.
- Situación de ocupación, locaciones, posesión y derechos de terceros.
- Autorización del titular si el desarrollador no es propietario.
- Contratos de compra, opción, aporte, fideicomiso o derechos de desarrollo.
- Litigios y contingencias relevantes.

Una copia de escritura cargada por el usuario no reemplaza por sí sola la revisión registral y legal independiente.

Fuente: [Ley 17.801 — Registro de la Propiedad Inmueble](https://www.argentina.gob.ar/normativa/nacional/ley-17801-53050/actualizacion).

### 6.3. Permisos y factibilidad de obra

Según la jurisdicción y el tipo de obra, solicitar:

- Zonificación y uso permitido.
- Factibilidad urbanística y de servicios.
- Planos y documentación técnica.
- Permiso de construcción y aprobaciones municipales/provinciales.
- Estudios ambientales o de suelo cuando correspondan.
- Matriculación y responsabilidad de profesionales.
- Contratos con constructora, dirección de obra y proveedores principales.
- Seguros, garantías y habilitaciones exigibles.
- Cronograma de obra e hitos de certificación.
- Documentación laboral y de seguridad de contratistas cuando corresponda.

La plataforma debe distinguir entre **documentación recibida**, **documentación verificada** y **aprobación formal emitida por una autoridad**.

### 6.4. Información económica y del instrumento

El expediente debe incluir:

- Monto a financiar y destino de los fondos.
- Presupuesto, contingencias y fuentes adicionales de financiación.
- Cronograma, hitos y responsables.
- Valuación y metodología utilizada.
- Supuestos de ingresos, costos y escenarios.
- Comisiones de plataforma, gastos legales, fiduciarios y administrativos.
- Derechos del inversor, prioridad de cobro y distribución de resultados.
- Tratamiento de sobrecostos, atrasos, incumplimientos y pérdidas.
- Condiciones de rescate, vencimiento, venta o salida.
- Limitaciones de transferencia y reglas del mercado secundario.
- Conflictos de intereses y partes vinculadas.
- Riesgos jurídicos, registrales, constructivos, de mercado, liquidez, tecnología y contraparte.
- Instrumento, emisor, vehículo, custodios y responsables.
- Contratos y documentos de emisión revisados legalmente.

No publicar proyecciones como rendimientos garantizados. Separar datos verificados, estimaciones del desarrollador y supuestos de simulación.

## 7. Requisitos del usuario al registrarse

**Crear una cuenta no debe habilitar automáticamente la inversión.**

### 7.1. Registro básico

Para una cuenta que solo permite navegar o guardar proyectos, recopilar lo mínimo necesario, por ejemplo:

- Correo electrónico.
- Teléfono, si se usa para verificación o comunicaciones.
- Nombre de usuario.
- Contraseña segura o método de autenticación.
- Constancia de recepción del aviso de privacidad.
- Aceptación de Términos y Condiciones.
- Preferencia de comunicaciones comerciales, opcional y desmarcada por defecto.

Si se recopilan datos personales reales, la privacidad y seguridad son necesarias incluso si la actividad de inversión está simulada.

### 7.2. Cuenta de inversor para operación real

Cuando el régimen aplicable exige identificación formal, el expediente del cliente persona humana debe contemplar, como mínimo y según corresponda:

- Nombre y apellido completos.
- Tipo y número de documento válido.
- Nacionalidad.
- Fecha y lugar de nacimiento.
- CUIT, CUIL, CDI o identificador fiscal equivalente cuando corresponda.
- Domicilio real completo.
- Teléfono y correo electrónico.
- Verificación de identidad con documentos, registros públicos u otras fuentes confiables.
- Evidencia del método y resultado de la verificación.
- Actividad u ocupación y finalidad de la relación cuando lo requiera la regulación.
- Información necesaria para establecer el perfil transaccional.
- Origen de fondos y, según el riesgo, origen del patrimonio.
- Declaración PEP y verificación de beneficiarios finales cuando corresponda.
- Controles de listas y sanciones aplicables.
- Documentación adicional proporcional al riesgo y al producto.
- Actualización de datos y monitoreo durante la relación.

La Resolución UIF 49/2024 detalla requisitos mínimos de identificación para sujetos obligados PSAV, incluidos documento, nacionalidad, fecha y lugar de nacimiento, identificador tributario y domicilio.

**No asumir que todos estos campos son obligatorios para cualquier aplicación.** Los requisitos de KYC/AML dependen de la actividad de la empresa, del producto y de la normativa aplicable. Recopilar más datos no autoriza a la plataforma a realizar una actividad regulada para la que no está habilitada.

### 7.3. Edad y capacidad

Para el MVP de inversión se recomienda permitir inversiones solo a personas de **18 años o más**, con verificación de edad y capacidad. El Código Civil y Comercial considera menor de edad a quien no ha cumplido 18 años, aunque existen reglas específicas de capacidad progresiva y emancipación.

Si se desea admitir menores o personas representadas, debe diseñarse un flujo legal separado y validado por abogados; no habilitarlo por defecto.

Fuente: [Código Civil y Comercial de la Nación](https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion).

### 7.4. Inversor persona jurídica

Si el inversor es una sociedad, fondo u otra persona jurídica, puede requerirse:

- Razón social, forma jurídica, país de constitución y domicilio.
- CUIT/CDI/CIE o identificación fiscal equivalente.
- Estatuto o contrato social y constancia de inscripción.
- Actividad y datos fiscales.
- Autoridades y representantes.
- Poder o documento que autorice al representante a operar.
- Composición accionaria y beneficiarios finales.
- Condición PEP de personas relevantes cuando corresponda.
- Origen de fondos y perfil de actividad.
- Declaraciones y documentación adicional exigidas por el régimen.

Quien crea la cuenta no debe poder invertir en nombre de una empresa sin acreditar representación suficiente.

### 7.5. Billetera y operaciones blockchain

Si el producto utiliza billeteras o tokens reales, definir:

- Si la billetera es autocustodiada o administrada por un tercero.
- Quién controla las claves y quién puede ordenar transferencias.
- Cómo se verifica el control de la dirección declarada, cuando sea necesario.
- Cómo se revisan direcciones y operaciones según el régimen aplicable.
- Cómo se gestionan errores, direcciones equivocadas, bloqueos y recuperación de acceso.
- Qué restricciones de transferencia impone el instrumento.
- Cómo se reconcilia el registro interno con la blockchain.

No solicitar ni almacenar la frase semilla o clave privada del usuario. No registrar datos de identidad en blockchain. La aceptación de un contrato no reemplaza la identificación y autorización regulatoria requeridas.

### 7.6. Aceptaciones y declaraciones

Separar en la interfaz:

1. **Términos y Condiciones:** aceptación obligatoria para usar el servicio cuando corresponda.
2. **Aviso de Privacidad:** constancia de que se informó al usuario; solicitar consentimiento específico cuando el tratamiento se base en él.
3. **Marketing:** opt-in independiente y opcional.
4. **Veracidad de los datos:** declaración de que la información es exacta y se actualizará.
5. **Declaraciones AML/PEP/origen de fondos:** cuando correspondan al producto y la regulación.
6. **Riesgos de inversión:** aceptación informada antes de la primera suscripción o compra.
7. **Comunicaciones electrónicas:** elección expresa cuando la normativa exija optar por soporte electrónico.
8. **Contrato de inversión/suscripción:** aceptación separada del documento que establece derechos, riesgos, comisiones y condiciones.

Una casilla no debe usarse para obtener una renuncia general a derechos legales ni para agrupar consentimientos independientes.

## 8. Flujo recomendado de registro y habilitación

1. **Crear cuenta:** correo, autenticación y verificación de contacto.
2. **Informar privacidad y términos:** guardar la versión presentada y la evidencia de aceptación.
3. **Elegir perfil:** inversor, desarrollador o representante de persona jurídica.
4. **Verificar identidad y capacidad:** aplicar los controles que correspondan.
5. **Ejecutar KYC/AML:** identificación, PEP, beneficiario final, origen de fondos y análisis de riesgo, cuando corresponda.
6. **Revisar elegibilidad:** aplicar límites de inversión y requisitos de la oferta concreta.
7. **Aprobar la cuenta:** estados sugeridos: `pendiente`, `verificada`, `requiere_documentacion`, `rechazada`, `suspendida`.
8. **Mostrar documentación del proyecto/instrumento:** derechos, riesgos, comisiones, uso de fondos y salida.
9. **Recabar aceptación de inversión:** registrar el documento y su versión antes de aceptar la orden.
10. **Recibir o transferir fondos mediante el canal autorizado:** no habilitar pagos reales antes de completar controles y estructura legal.
11. **Monitorear y actualizar:** cambios de datos, operaciones, alertas, reclamos y vencimientos documentales.

### Regla de bloqueo

Si un control obligatorio de identidad, prevención, elegibilidad o autorización está pendiente o falla, la aplicación debe impedir la operación afectada. No permitir “invertir ahora y completar KYC después” cuando la norma exige completar controles antes de iniciar o continuar la relación.

## 9. Matriz de aplicabilidad

| Requisito | Aplicación |
|---|---|
| Aviso de privacidad, finalidad y seguridad | Obligatorio cuando se tratan datos personales reales, conforme a la Ley 25.326. |
| Términos claros, información y canal de reclamos | Obligación según el servicio y la relación; recomendable en todos los casos. |
| DNI y verificación formal | Condicionado al servicio y al régimen; obligatorio para sujetos obligados en los términos aplicables. |
| PEP, beneficiario final y origen de fondos | Condicionado al régimen LA/FT/FP y al riesgo. |
| Registro PSAV ante CNV | Obligatorio antes de realizar actividades alcanzadas, salvo exclusión normativa efectivamente aplicable. |
| Registro/autorización PFC ante CNV | Obligatorio si la actividad encuadra en ese régimen. |
| Autorización de oferta pública | Debe resolverse antes de ofrecer instrumentos que la requieran. |
| Registro BCRA de PSP | Condicionado a las funciones de pago efectivamente prestadas. |
| Edad mínima de 18 años | Criterio recomendado para el MVP de inversión; validar excepciones si se pretende admitir menores. |
| Perfil de riesgo y elegibilidad | Según instrumento y régimen; recomendable como control adicional cuando corresponda. |
| Firma digital certificada para todo clic | No es exigencia universal; depende del acto y la formalidad aplicable. |
| Datos personales en blockchain | No hacerlo; aplicar minimización y privacidad desde el diseño. |
| Debida diligencia legal y técnica del inmueble | Esencial para ofrecer un proyecto real; alcance según el proyecto y la regulación. |

## 10. Requisitos técnicos para conservar evidencia legal

### 10.1. Evidencia de aceptación

Conservar con acceso restringido:

- Identificador de usuario.
- Tipo y versión del documento aceptado.
- Hash del documento contractual.
- Fecha/hora de aceptación.
- Acción y resultado.
- Método de autenticación.
- Constancia de aceptación o firma.
- Historial de modificaciones y revocaciones de consentimiento cuando corresponda.

### 10.2. Separación de datos

- **PostgreSQL:** cuentas, estados KYC, aprobaciones, consentimientos y versiones, roles, órdenes, ledger y auditoría.
- **MongoDB:** informes de debida diligencia y datos semiestructurados.
- **Almacenamiento de objetos cifrado:** documentos de identidad, escrituras, permisos, contratos y archivos originales.
- **Blockchain:** solo la información necesaria para registrar la operación y los derechos permitidos; nunca DNI, domicilio, correo, datos fiscales ni documentos.
- **Logs:** no incluir contraseñas, claves privadas, documentos completos ni información de identidad innecesaria.

### 10.3. Controles mínimos

- Cifrado en tránsito y en reposo.
- Acceso basado en roles y mínimo privilegio.
- Registro de accesos a documentación sensible.
- Gestión segura de secretos.
- Copias de seguridad y pruebas de restauración.
- Política de retención y eliminación.
- Respuesta a incidentes.
- Separación de ambientes de desarrollo y producción.
- Datos ficticios en pruebas.
- Auditoría de cambios de estado y decisiones manuales.
- Procedimientos para solicitudes de acceso, rectificación o supresión, respetando retenciones legales.

## 11. Lista de tareas antes de operar comercialmente

### 11.1. Bloqueantes jurídicos

- [ ] Definir si el producto es un valor negociable, una PFC, un servicio PSAV, una estructura contractual privada u otra figura.
- [ ] Definir el vehículo, el emisor y el derecho exacto del inversor.
- [ ] Obtener dictamen sobre oferta pública, autorización CNV y régimen de tokenización aplicable.
- [ ] Determinar si la empresa debe inscribirse como PSAV y en qué categorías conforme a la RG 1172/2026.
- [ ] Determinar las obligaciones ante la UIF y establecer el sistema LA/FT/FP si corresponde.
- [ ] Determinar si las funciones de pago requieren intervención de una entidad o proveedor registrado ante el BCRA.
- [ ] Definir quién recibirá, custodiará, administrará y devolverá los fondos.
- [ ] Aprobar Términos y Condiciones, Política de Privacidad, contratos, documento de emisión y advertencias de riesgo.
- [ ] Definir el tratamiento tributario del instrumento y los flujos de fondos.
- [ ] Verificar la normativa provincial y municipal de cada inmueble.

### 11.2. Bloqueantes de registro de usuarios

- [ ] Definir campos obligatorios por tipo de usuario y la base legal de cada dato.
- [ ] Implementar verificación de identidad conforme al régimen aplicable.
- [ ] Implementar controles PEP, beneficiario final y origen de fondos cuando correspondan.
- [ ] Definir la matriz de riesgo y el procedimiento de escalamiento.
- [ ] Crear estados de aprobación y bloqueos que impidan operar sin controles completos.
- [ ] Registrar versiones de contratos, aceptaciones y consentimientos.
- [ ] Crear procedimientos de actualización y revisión periódica.
- [ ] Crear canales de soporte y reclamos.
- [ ] Probar suspensión, cierre y baja de cuentas sin perder evidencia que legalmente deba conservarse.

### 11.3. Bloqueantes de admisión de proyectos

- [ ] Verificar identidad y facultades del desarrollador.
- [ ] Revisar título, situación registral, gravámenes y derechos de terceros.
- [ ] Revisar permisos, zonificación y factibilidad técnica.
- [ ] Aprobar la estructura legal y el instrumento de financiación.
- [ ] Revisar presupuesto, valuación, cronograma, contratos y riesgos.
- [ ] Publicar solo información verificada y marcar las estimaciones como tales.
- [ ] Definir seguimiento, certificación de hitos, distribución de fondos y tratamiento de incumplimientos.
- [ ] Documentar quién aprobó el proyecto, cuándo y con qué evidencia.

## 12. Decisiones que no deben quedar implícitas

Antes de implementar el registro definitivo, responder por escrito:

1. ¿El token representa una acción, deuda, participación en fideicomiso, otro valor negociable o un derecho contractual?
2. ¿Quién es el emisor y qué entidad mantiene el derecho sobre el inmueble?
3. ¿La plataforma ofrece, coloca, intermedia, negocia o custodia el instrumento?
4. ¿La oferta será pública? ¿Qué autorización o régimen CNV aplica?
5. ¿La plataforma realiza alguna actividad comprendida en la definición de PSAV?
6. ¿La empresa manejará fondos de clientes o solo redirigirá pagos a un proveedor habilitado?
7. ¿Qué usuarios pueden invertir y qué límites les aplican?
8. ¿Qué información de identidad es obligatoria para cada perfil?
9. ¿Qué datos se compartirán con proveedores de KYC, pagos, nube o custodia y en qué jurisdicciones se procesarán?
10. ¿Qué plazos de conservación se aplican a cada expediente?
11. ¿Quién atenderá reclamos y cómo se actuará ante fraude, error, incumplimiento o pérdida?
12. ¿Qué derechos pueden transferirse y cómo se garantiza la correspondencia entre el registro digital y el registro legal del instrumento?

## 13. Fuentes normativas oficiales

Los enlaces llevan a textos oficiales o páginas de organismos públicos. Deben revisarse nuevamente antes del lanzamiento.

1. [Ley 26.831 — Mercado de Capitales](https://www.argentina.gob.ar/normativa/nacional/ley-26831-206592/actualizacion).
2. [Ley 27.349 — Apoyo al Capital Emprendedor y Financiamiento Colectivo](https://www.argentina.gob.ar/normativa/nacional/ley-27349-273567/actualizacion).
3. [Ley 25.246 — Prevención de lavado de activos](https://www.argentina.gob.ar/normativa/nacional/norma-62977/actualizacion).
4. [Ley 25.326 — Protección de Datos Personales](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion).
5. [Ley 24.240 — Defensa del Consumidor](https://www.argentina.gob.ar/normativa/nacional/ley-24240-638/actualizacion).
6. [Ley 25.506 — Firma Digital](https://www.argentina.gob.ar/normativa/nacional/ley-25506-70749/actualizacion).
7. [Ley 26.994 — Código Civil y Comercial](https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion).
8. [Ley 17.801 — Registro de la Propiedad Inmueble](https://www.argentina.gob.ar/normativa/nacional/ley-17801-53050/actualizacion).
9. [Ley 19.550 — Ley General de Sociedades](https://www.argentina.gob.ar/normativa/nacional/ley-19550-25553/actualizacion).
10. [CNV — RG 1069/2025, régimen inicial de tokenización](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1069-2025-414017/texto).
11. [CNV — RG 1150/2026, ampliación del régimen de tokenización](https://www.argentina.gob.ar/normativa/nacional/norma-426586/texto).
12. [CNV — RG 1172/2026, régimen PSAV vigente desde octubre de 2026](https://www.argentina.gob.ar/normativa/nacional/norma-431259/texto).
13. [UIF — Resolución 49/2024, prevención LA/FT/FP para PSAV](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-49-2024-397597/texto).
14. [UIF — Personas Expuestas Políticamente (PEP)](https://www.argentina.gob.ar/uif/personas-expuestas-politicamente).
15. [BCRA — Registro de Proveedores de Servicios de Pago](https://www.bcra.gob.ar/registro-de-proveedores-de-servicios-de-pago/).

## 14. Conclusión

Para el proyecto académico, la opción prudente es mantener el MVP completamente simulado y utilizar datos ficticios. Para convertirlo en un producto real, el primer hito no es programar el formulario de registro: es definir el instrumento jurídico, el vehículo, la actividad regulada y la entidad responsable de recibir o custodiar los fondos.

Con esa decisión, un abogado y un contador pueden convertir esta matriz en una lista definitiva de obligaciones, documentos, autorizaciones y controles aplicables.
