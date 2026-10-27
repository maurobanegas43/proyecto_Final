# Proyecto Final de la Carrera

## Documento base para el desarrollo del proyecto

## 1. Descripción de la idea

El proyecto consiste en diseñar y desarrollar un prototipo de una
plataforma digital de financiamiento colectivo orientada a desarrollos
inmobiliarios. La plataforma busca conectar a empresas constructoras o
desarrolladoras que necesitan financiar una obra con personas
interesadas en invertir en proyectos inmobiliarios.

Una desarrolladora podrá presentar un proyecto con su descripción,
presupuesto estimado, cronograma, documentación y objetivos financieros.
Antes de publicarlo, el proyecto pasará por una revisión legal, técnica
y financiera simulada. Si cumple las condiciones definidas, podrá
habilitarse para que los inversores consulten la información y simulen
su participación.

La plataforma gestionará el registro de usuarios, la validación simulada
de identidad y elegibilidad, la publicación de proyectos, las
inversiones, el portfolio del inversor y el seguimiento del avance de
obra. La participación económica podrá representarse mediante un token
registrado en una red blockchain de prueba. El token no representa por
sí mismo una parte física del edificio: debe asociarse a un derecho
económico definido por un instrumento jurídico subyacente, cuya
estructura concreta queda sujeta al análisis legal correspondiente.

También se contempla un mercado secundario interno demostrativo. Los
usuarios habilitados podrán crear órdenes de compra o venta de
participaciones. La lógica de órdenes y matching se ejecutará fuera de
la blockchain; la transferencia tokenizada podrá integrarse con una red
EVM de prueba y contratos inteligentes con restricciones de
transferencia.

El prototipo tendrá fines exclusivamente académicos. No recibirá dinero
real, no realizará ofertas públicas, no custodiará activos de clientes
ni realizará una emisión real de valores negociables. Los pagos,
controles KYC/AML y operaciones de inversión serán simulados o se
ejecutarán en entornos de prueba.

## 2. Objetivo general

Diseñar e implementar un prototipo seguro, modular y escalable de una
plataforma de financiamiento colectivo para desarrollos inmobiliarios,
utilizando arquitectura hexagonal, React en el frontend, Go con Gin en
el backend, PostgreSQL como base transaccional principal y MongoDB para
información documental o semiestructurada, con una integración
demostrativa de blockchain para representar participaciones y aportar
trazabilidad.

## 3. Objetivos específicos

-   Gestionar usuarios, perfiles, roles y estados de validación
    simulada.
-   Permitir que las desarrolladoras registren proyectos y referencias a
    su documentación.
-   Implementar revisión y aprobación antes de publicar una oportunidad
    de inversión.
-   Gestionar emisiones simuladas, suscripciones, inversiones y
    portfolio.
-   Mantener un ledger financiero auditable, con movimientos
    consistentes y trazables.
-   Representar participaciones mediante tokens en una red EVM de
    prueba, sin desarrollar una blockchain propia.
-   Implementar un mercado secundario interno con órdenes, matching y
    reglas de elegibilidad.
-   Registrar hitos de construcción y el avance declarado de los
    proyectos.
-   Aplicar controles de autorización, validación de entradas, auditoría
    y protección de datos.
-   Evaluar la calidad mediante pruebas unitarias, de integración,
    end-to-end y de rendimiento.

## 4. Alcance

### Incluido

-   Registro e inicio de sesión, roles básicos y perfiles.
-   KYC y validación de elegibilidad simulados.
-   Alta y gestión de desarrolladoras y proyectos inmobiliarios.
-   Gestión de documentación mediante metadatos y referencias a
    archivos.
-   Revisión legal, técnica y financiera simulada.
-   Publicación y consulta de proyectos aprobados.
-   Inversión primaria y pagos simulados.
-   Ledger contable y consulta de movimientos.
-   Portfolio del inversor.
-   Tokenización demostrativa en una red blockchain de prueba.
-   Mercado secundario interno con órdenes y matching off-chain.
-   Seguimiento de hitos de obra y simulación de distribuciones.
-   Auditoría de acciones relevantes y pruebas de seguridad y
    rendimiento.

### Fuera de alcance

-   Recepción, custodia o transferencia de dinero real.
-   Oferta pública real de instrumentos financieros.
-   Custodia de criptomonedas o claves privadas de clientes.
-   Operación productiva como plataforma de financiamiento colectivo,
    agente o PSAV.
-   Validación legal real de títulos, permisos de obra o documentación
    societaria.
-   Blockchain propia o negociación en exchanges descentralizados.
-   Integraciones productivas con bancos, proveedores de pagos o
    servicios de identidad.
-   Promesas de rentabilidad o asesoramiento de inversión.

## 5. Arquitectura general

Se utilizará una **arquitectura hexagonal (Ports and Adapters)** para
separar las reglas de negocio de los detalles técnicos. El dominio no
debe depender de Gin, PostgreSQL, MongoDB, React ni de un proveedor
blockchain concreto.

La primera versión se organizará como un **monolito modular**. Esto
reduce la complejidad operativa inicial y permite mantener límites
internos claros. Los microservicios no forman parte de la primera etapa;
podrían evaluarse más adelante solo si existe una necesidad concreta.

### Componentes

-   **Frontend:** React con TypeScript, responsable de la interfaz y de
    comunicarse con la API.
-   **Adaptador HTTP:** Go con Gin, que expone la API REST.
-   **Aplicación:** casos de uso que coordinan las operaciones.
-   **Dominio:** entidades, objetos de valor, reglas e invariantes del
    negocio.
-   **Puertos:** interfaces que describen las capacidades requeridas por
    la aplicación.
-   **Adaptadores de salida:** implementaciones concretas para
    PostgreSQL, MongoDB, blockchain y pagos simulados.
-   **PostgreSQL:** fuente principal de verdad para los datos
    transaccionales y financieros.
-   **MongoDB:** almacenamiento de datos documentales flexibles y
    semiestructurados.
-   **Blockchain EVM de prueba:** capa demostrativa de representación
    digital y registro de transferencias tokenizadas.

### Diagrama lógico

``` mermaid
flowchart LR
    U[Usuario] --> FE[Frontend React + TypeScript]
    FE -->|HTTPS / JSON| HTTP[Adaptador HTTP: Gin]
    HTTP --> APP[Casos de uso / Aplicación]
    APP --> DOM[Dominio y reglas de negocio]
    APP --> PORTS[Puertos / Interfaces]
    PORTS --> PG[Adaptador PostgreSQL]
    PORTS --> MG[Adaptador MongoDB]
    PORTS --> CH[Adaptador blockchain EVM]
    PORTS --> PAY[Adaptador de pagos simulados]
    PG --> PGDB[(PostgreSQL)]
    MG --> MGDB[(MongoDB)]
    CH --> EVM[(Red EVM de prueba)]
```

**Regla de dependencias:** el dominio no importa ni conoce los
adaptadores. Los adaptadores implementan interfaces definidas hacia el
interior de la aplicación. El punto de composición conecta las
interfaces con sus implementaciones concretas.

## 6. Organización hexagonal del backend Go

``` text
backend/
├── cmd/api/main.go
├── internal/
│   ├── domain/
│   │   ├── user/
│   │   ├── investor/
│   │   ├── developer/
│   │   ├── project/
│   │   ├── investment/
│   │   ├── ledger/
│   │   └── market/
│   ├── application/
│   │   ├── ports/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── services/
│   ├── adapters/
│   │   ├── inbound/http/gin/
│   │   └── outbound/
│   │       ├── postgres/
│   │       ├── mongodb/
│   │       ├── blockchain/
│   │       └── payments/mock/
│   ├── config/
│   └── platform/
│       ├── logging/
│       └── observability/
├── migrations/
├── tests/
├── go.mod
└── README.md
```

### Responsabilidades

-   **Dominio (`domain`):** define entidades, objetos de valor, estados
    y reglas; no importa Gin, drivers SQL, SDKs de MongoDB ni librerías
    blockchain.
-   **Aplicación (`application`):** implementa casos de uso como
    `CreateProject`, `ApproveProject`, `SubscribeInvestment`,
    `PlaceSellOrder` y `RecordConstructionMilestone`.
-   **Puertos (`application/ports`):** declaran contratos como
    `ProjectRepository`, `InvestmentRepository`, `LedgerRepository`,
    `DocumentRepository`, `TokenizationGateway` y `PaymentGateway`.
-   **Adaptadores de entrada:** convierten peticiones HTTP en
    comandos/consultas, validan el formato y construyen respuestas. No
    contienen las reglas centrales del negocio.
-   **Adaptadores de salida:** implementan los puertos usando
    PostgreSQL, MongoDB, blockchain o pagos simulados.
-   **Punto de composición (`cmd/api/main.go`):** carga configuración,
    inicializa conexiones, construye repositorios y servicios, registra
    rutas y arranca Gin.

## 7. Frontend React

Se recomienda React con TypeScript. Una estructura inicial posible es:

``` text
frontend/src/
├── app/
├── routes/
├── components/
├── features/
│   ├── auth/
│   ├── projects/
│   ├── investments/
│   ├── portfolio/
│   ├── secondary-market/
│   └── admin/
├── services/
├── hooks/
├── schemas/
├── types/
└── styles/
```

El frontend presentará proyectos, estados de revisión, presupuestos y
avance de obra; permitirá el onboarding simulado, mostrará inversiones y
portfolio y permitirá crear órdenes de mercado secundario. Las reglas
definitivas de autorización y elegibilidad siempre se validarán en el
backend. La API REST se versionará, por ejemplo, con el prefijo
`/api/v1`; el navegador no se conectará directamente a las bases de
datos.

## 8. Backend Go con Gin

Gin actuará como adaptador HTTP. Los módulos funcionales iniciales
serán:

1.  Identidad y acceso.
2.  Inversores y cumplimiento simulado.
3.  Desarrolladoras.
4.  Proyectos y revisión.
5.  Emisiones e inversiones.
6.  Ledger y conciliación.
7.  Portfolio.
8.  Mercado secundario.
9.  Tokenización.
10. Seguimiento de obra y distribuciones.
11. Administración y auditoría.

### Convenciones de API

-   Rutas versionadas (`/api/v1/...`).
-   DTOs HTTP separados de las entidades de dominio.
-   Validación de entradas en el servidor y errores estructurados.
-   Paginación, filtros y ordenamiento para listados.
-   Claves de idempotencia en comandos financieros para evitar
    operaciones duplicadas ante reintentos.
-   Documentación de endpoints con OpenAPI.
-   Middleware de autenticación, autorización, logging, límites de
    solicitudes y manejo consistente de errores.

## 9. Persistencia: PostgreSQL y MongoDB

Las bases de datos tendrán responsabilidades diferentes. No se duplicará
la misma información transaccional en ambas ni se permitirá que cada una
mantenga una versión distinta de los saldos o inversiones.

### PostgreSQL: base transaccional principal

Será la fuente de verdad para usuarios, roles, desarrolladoras, datos
centrales de proyectos, estados de revisión y publicación, emisiones,
suscripciones, inversiones, órdenes, operaciones, liquidaciones, ledger
financiero, distribuciones simuladas, conciliaciones, claves de
idempotencia, referencias a transacciones blockchain y auditoría
transaccional.

Las operaciones financieras deberán utilizar transacciones SQL cuando
corresponda. El ledger debe conservar los movimientos y permitir
reconstruir los saldos; no se dependerá únicamente de un campo de saldo
editable. Se definirán claves foráneas, restricciones únicas e índices
según las consultas reales.

### MongoDB: datos documentales y semiestructurados

Se reservará para información de estructura variable, por ejemplo:

-   Formularios y respuestas detalladas de due diligence.
-   Evaluaciones técnicas y listas de verificación de proyectos.
-   Metadatos variables de evidencias de hitos de construcción.
-   Versiones estructuradas de informes de riesgo o revisión.
-   Datos complementarios que evolucionen con mayor frecuencia que el
    modelo relacional.

MongoDB no será la fuente de verdad de inversiones, órdenes,
transferencias ni saldos. Tampoco sustituirá el almacenamiento de
archivos: PDFs, imágenes, planos y otros binarios deberían guardarse en
un almacenamiento de objetos (por ejemplo, S3 o MinIO), mientras que las
bases de datos conservan metadatos y referencias.

  -----------------------------------------------------------------------
  Tipo de dato            Persistencia inicial    Motivo
  ----------------------- ----------------------- -----------------------
  Inversiones y           PostgreSQL              Integridad referencial
  suscripciones                                   y transacciones

  Ledger y movimientos    PostgreSQL              Consistencia,
  financieros                                     trazabilidad y
                                                  restricciones

  Órdenes y operaciones   PostgreSQL              Actualizaciones
                                                  coordinadas y consultas
                                                  relacionales

  Datos principales de    PostgreSQL              Relaciones y estados
  proyectos                                       controlados

  Cuestionarios variables MongoDB                 Estructura documental
  de due diligence                                flexible

  Metadatos variables de  MongoDB                 Evolución de campos por
  evidencias                                      tipo de evidencia

  Archivos originales     S3/MinIO u otro         Adecuado para binarios
                          almacenamiento de       
                          objetos                 

  Titularidad blockchain  Proyección consultable  Consultas de la
  indexada                en PostgreSQL,          aplicación y
                          reconciliada con la     trazabilidad de la
                          cadena                  fuente en cadena
  -----------------------------------------------------------------------

### Consistencia entre sistemas

PostgreSQL y MongoDB no se tratarán como una única transacción
distribuida. Cuando una operación de negocio necesite actualizar
PostgreSQL y luego interactuar con blockchain, se registrará primero la
intención de forma durable y se procesará la integración de manera
asíncrona. Se recomienda evaluar el patrón **Transactional Outbox**,
junto con consumidores idempotentes, reintentos y estados de
confirmación.

## 10. Integración con blockchain

La blockchain será una integración externa mediante un puerto, por
ejemplo `TokenizationGateway`, con un adaptador EVM que podrá
sustituirse sin modificar el dominio.

-   Utilizar una red EVM de prueba; no desarrollar una blockchain
    propia.
-   Mantener datos personales y documentación privada fuera de la
    cadena.
-   Registrar identificadores de transacción, estado y bloque de
    confirmación.
-   Tratar los eventos blockchain como mensajes que pueden repetirse o
    llegar con demora.
-   Restringir transferencias del token de demostración a participantes
    habilitados según las reglas del prototipo.
-   No considerar que el token crea por sí solo el derecho jurídico: ese
    derecho debe definirse en la documentación del instrumento
    subyacente.
-   No integrar billeteras de clientes ni custodiar claves privadas en
    esta versión académica.

## 11. Seguridad y protección de datos

-   Autenticación segura y autorización basada en roles y permisos.
-   Validación de todas las entradas en el servidor.
-   TLS en las comunicaciones desplegadas.
-   Secretos y credenciales fuera del código fuente.
-   CORS restrictivo, límites de solicitudes y controles contra abuso.
-   Protección contra inyección SQL, XSS, CSRF y errores de
    autorización, según el flujo.
-   Registro de acciones administrativas y operaciones relevantes.
-   Minimización de datos personales y acceso restringido a documentos
    sensibles.
-   No almacenar DNI, datos financieros privados ni información KYC en
    la blockchain.
-   Errores sin credenciales, consultas ni detalles internos expuestos.
-   Copias de seguridad y pruebas de restauración.
-   Dependencias actualizadas y revisión de vulnerabilidades.

La validación KYC/AML del prototipo será simulada. El sistema no deberá
presentarse como habilitado para operar con dinero real ni como solución
de cumplimiento regulatorio productivo.

## 12. Pruebas y calidad

-   **Unitarias:** entidades, objetos de valor y reglas del dominio.
-   **Casos de uso:** flujos de aplicación con puertos simulados.
-   **Integración:** repositorios PostgreSQL/MongoDB y adaptadores
    externos.
-   **HTTP:** handlers Gin, validación, autorización y códigos de
    respuesta.
-   **End-to-end:** registro, alta de proyecto, aprobación simulada,
    inversión, portfolio y mercado secundario.
-   **Seguridad:** permisos, entradas inválidas, límites y manejo de
    errores.
-   **Rendimiento:** latencia, tasa de error y comportamiento de API y
    bases con carga controlada.

Los casos financieros deben comprobar idempotencia, ausencia de
movimientos duplicados y consistencia del ledger.

## 13. Entorno y despliegue inicial

Para desarrollo se recomienda Docker Compose con servicios separados
para frontend React, API Go/Gin, PostgreSQL y MongoDB. Si se incorpora
gestión de archivos, se puede agregar un almacenamiento compatible con
S3, como MinIO. La red EVM puede ser externa de prueba o un nodo local
de desarrollo.

Las credenciales se suministrarán mediante variables de entorno o un
gestor de secretos, nunca mediante valores sensibles en el repositorio.
Se incluirán migraciones versionadas para PostgreSQL y una estrategia
controlada para evolucionar los documentos de MongoDB. La API deberá
exponer health checks y logs estructurados.

## 14. Orden sugerido de implementación

1.  Confirmar alcance, actores, reglas de negocio y decisiones jurídicas
    que condicionan el modelo.
2.  Crear repositorios, estructura de frontend/backend, Docker Compose y
    configuración.
3.  Implementar dominio y casos de uso sin acoplarlos a infraestructura.
4.  Definir puertos y adaptar PostgreSQL; incorporar migraciones y
    pruebas.
5.  Implementar usuarios, roles, proyectos y estados de revisión.
6.  Incorporar MongoDB solo para los casos documentales definidos.
7.  Desarrollar el frontend React y conectarlo a la API versionada.
8.  Implementar inversiones simuladas, ledger y portfolio.
9.  Incorporar el mercado secundario interno.
10. Integrar el adaptador blockchain en una red de prueba.
11. Añadir seguridad, auditoría, observabilidad y pruebas de
    rendimiento.
12. Completar documentación técnica y académica, demostración y
    evaluación final.

## 15. Decisiones pendientes

Deben documentarse como ADRs (*Architecture Decision Records*):

-   Vehículo jurídico e instrumento económico que representaría el token
    en un escenario real.
-   Roles y permisos exactos de inversores, desarrolladoras, revisores y
    administradores.
-   Estados y reglas de aprobación de proyectos.
-   Modelo contable del ledger y reglas de distribución.
-   Reglas del mercado secundario, elegibilidad, cancelación y
    liquidación de órdenes.
-   Criterio preciso para almacenar cada dato en MongoDB o PostgreSQL.
-   Red de prueba, estándar de token y sincronización de eventos
    blockchain.
-   Almacenamiento y ciclo de vida de documentos privados.
-   Objetivos medibles de disponibilidad, rendimiento, recuperación y
    retención de auditoría.

Cada ADR debe indicar contexto, alternativas, decisión, consecuencias y
fecha de revisión.

## 16. Principios de diseño

1.  Las reglas de negocio deben ser independientes de frameworks e
    infraestructura.
2.  PostgreSQL será la fuente principal de verdad de las operaciones
    transaccionales y del ledger.
3.  MongoDB se utilizará solo cuando la flexibilidad documental aporte
    una ventaja clara.
4.  La blockchain será un adaptador externo y no sustituirá la base
    operacional.
5.  Los flujos financieros serán idempotentes, auditables y verificables
    mediante pruebas.
6.  Los datos personales permanecerán fuera de la cadena.
7.  Se priorizará un monolito modular mantenible antes de introducir
    microservicios.
8.  El prototipo académico distinguirá claramente las simulaciones de
    cualquier operación financiera real.
