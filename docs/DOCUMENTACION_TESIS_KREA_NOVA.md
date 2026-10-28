# KREA NOVA: PLATAFORMA FINTECH DE FINANCIAMIENTO COLECTIVO INMOBILIARIO CON ARQUITECTURA HEXAGONAL Y TOKENIZACIÓN DE ACTIVOS DEL MUNDO REAL (RWA)

**Proyecto Final de Grado para optar al título de Ingeniero en Informática**  
**Universidad del Norte Santo Tomás de Aquino (UNSTA)**  
**Facultad de Ingeniería**  
**Autor:** Mauro Banegas  
**Fecha:** Octubre de 2026  
**Documento Word editable generado:** [`docs/Tesis_Ingenieria_Krea_Nova.docx`](file:///Users/maurobanegas43/Documents/proyecto_final/docs/Tesis_Ingenieria_Krea_Nova.docx)

---

## Resumen Ejecutivo

El financiamiento tradicional de desarrollos inmobiliarios en economías emergentes presenta severas fricciones: altas barreras de entrada de capital, iliquidez de los activos subyacentes, falta de transparencia contable y una densa carga de intermediación burocrática. Esta tesis de ingeniería presenta el diseño, desarrollo formal y evaluación rigurosa de **Krea Nova**, una plataforma de financiamiento colectivo (*crowdfunding*) para proyectos inmobiliarios basada en la representación digital de derechos económicos (*Real-World Assets* o RWA).

El sistema está estructurado mediante una **Arquitectura Hexagonal (Ports and Adapters)** implementada en **Go 1.23+** con Gin en el backend, un frontend reactivo desarrollado en **React 19** con TypeScript, y una estrategia de persistencia políglota desacoplada: **PostgreSQL 16+** como fuente de verdad transaccional de partida doble (*double-entry bookkeeping*) bajo normalización 3FN/BCNF, **MongoDB 7+** para expedientes documentales no estructurados de debida diligencia (*due diligence*), **MinIO/S3** para almacenamiento de binarios cifrados en reposo, y una capa desacoplada de abstracción blockchain sobre una testnet EVM para el sellado y trazabilidad de participaciones.

La solución implementa una estricta adhesión al marco normativo de la República Argentina, incorporando validación matemática Módulo 11 (AFIP/ARCA) para CUIT/CUIL, cumplimiento de la **Ley 25.326 de Protección de Datos Personales** con cifrado simétrico autenticado **AES-256-GCM** para información de identificación personal (PII), auditoría inmutable de consentimientos legales, y prevención de operaciones no autorizadas mediante compuertas de verificación KYC/AML conforme a la **Res. UIF 49/2024** y la **RG CNV 1172/2026**.

La evaluación experimental del prototipo demostró una latencia media de 18.2 ms para transacciones financieras con partida doble en base de datos, un tiempo de procesamiento end-to-end de 90 ms en escenarios de integración HTTP, y un aislamiento de dominio total frente a dependencias de infraestructura y redes blockchain.

---

## Estructura de Capítulos y Correspondencia Académica

El documento maestro Word compilado en [`docs/Tesis_Ingenieria_Krea_Nova.docx`](file:///Users/maurobanegas43/Documents/proyecto_final/docs/Tesis_Ingenieria_Krea_Nova.docx) contiene la totalidad de las secciones exigidas por la [`guia_documentacion_tesis_informatica.md`](file:///Users/maurobanegas43/Documents/proyecto_final/guia_documentacion_tesis_informatica.md):

1. **Portada y Elementos Iniciales:** Portada reglamentaria UNSTA, Resumen (español), Abstract (inglés), Palabras clave e Índice General estructurado.
2. **Capítulo 1. Introducción y Motivación:** Contexto macroeconómico en Argentina, formulación de la hipótesis de ingeniería de sistemas y mapa de contribuciones técnicas originales.
3. **Capítulo 2. Planteamiento del Problema:** Diagnóstico del real estate tradicional, problemas técnicos de acoplamiento blockchain y mutabilidad contable, delimitación de alcance y actores.
4. **Capítulo 3. Objetivos:** Objetivo general, objetivos específicos verificables y tabla de criterios cuantitativos de éxito.
5. **Capítulo 4. Marco Teórico, Normativo y Estado del Arte:** Patrones arquitectónicos (Hexagonal, DDD), contabilidad de partida doble (Pacioli), criptografía aplicada (AES-256-GCM, Bcrypt, Módulo 11), marco regulatorio argentino (Ley 25.326, Ley 27.349, RG CNV 1172/2026, Res. UIF 49/2024) y cuadro comparativo frente a soluciones existentes.
6. **Capítulo 5. Metodología de Desarrollo y Planificación:** Ciclo iterativo Organic Driven Development (ODD), justificación del stack tecnológico (Go, Gin, React 19, PostgreSQL, MongoDB) y pirámide de pruebas automatizadas.
7. **Capítulo 6. Especificación de Requisitos y Análisis:** Matriz clasificada de Requisitos Funcionales (RF-01 a RF-08) y No Funcionales (RNF-01 a RNF-04) con criterios de aceptación.
8. **Capítulo 7. Diseño Arquitectónico y Modelado:** Arquitectura del monolito modular hexagonal, diagrama de árbol del backend Go, modelado relacional en 3FN/BCNF, diseño del libro mayor contable y esquemas JSON para debida diligencia.
9. **Capítulo 8. Implementación del Software:** Extractos de código fuente fundamentales: invariantes de dominio en Go, servicio financiero de asignación de capital con compuerta KYC, repositorios SQL pgx nativos, módulo de cifrado AES-256 y validador reactivo Módulo 11 en TypeScript.
10. **Capítulo 9. Verificación, Pruebas y Evaluación Empírica:** Batería de pruebas unitarias (`go test`), pruebas de integración E2E del circuito financiero y tablas de microbenchmarks con latencias p50 y p95.
11. **Capítulo 10. Discusión, Limitaciones y Amenazas a la Validez:** Análisis de resultados frente a hipótesis, honestidad académica sobre limitaciones (simulación de KYC y testnet blockchain) y compensaciones de diseño.
12. **Capítulo 11. Conclusiones y Trabajo Futuro:** Síntesis de aportes ingenieriles, cumplimiento de la hipótesis y roadmap evolutivo (Transactional Outbox y biometría).
13. **Referencias Bibliográficas:** 13 citas primarias en formato académico (Cockburn, Martin, Evans, NIST, leyes nacionales y resoluciones de CNV/UIF).
14. **Anexos:**
    - **Anexo A:** Manual de instalación y despliegue reproducible paso a paso.
    - **Anexo B:** Manual de usuario y flujo operativo del inversor.
    - **Anexo C:** Diccionario de datos DDL completo para PostgreSQL.
