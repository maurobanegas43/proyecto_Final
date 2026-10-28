# Guía de documentación del proyecto de Ingeniería Informática

> **Propósito:** usar este documento como guía de trabajo para
> planificar, redactar y revisar la documentación de un proyecto final o
> tesis de Informática. Adaptar las secciones al tipo de proyecto y a
> las indicaciones del director o de la carrera.

## 1. Criterio general

La documentación debe ser **académica, profesional y fácil de
comprender**. Tiene que permitir que una persona que no participó del
desarrollo entienda:

1.  Qué problema existe y por qué importa.
2.  Qué objetivos se plantearon.
3.  Qué antecedentes y conceptos fundamentan la solución.
4.  Cómo se diseñó y construyó el sistema.
5.  Cómo se verificó su funcionamiento.
6.  Qué resultados se obtuvieron, cuáles son sus límites y qué podría
    mejorarse.

**Importante:** esta es una propuesta de formato general, no un
reglamento oficial de la UNSTA. Antes de entregar, confirmar con la
carrera y el director si existe una plantilla, reglamento o norma de
citación obligatoria. Si una regla institucional difiere de esta guía,
prevalece la institucional.

------------------------------------------------------------------------

## 2. Formato visual recomendado

Las pautas varían entre universidades; los valores siguientes forman una
base conservadora y legible, no una norma oficial de la UNSTA. Varias
guías universitarias recomiendan fuentes estándar, tamaños de cuerpo
cercanos a 11--12 puntos, interlineado de 1,5 o doble y márgenes
consistentes.

  -----------------------------------------------------------------------
  Elemento                            Recomendación inicial
  ----------------------------------- -----------------------------------
  Tamaño de página                    A4

  Fuente principal                    **Arial 11 pt** para una apariencia
                                      moderna y clara; alternativa:
                                      **Times New Roman 12 pt** para un
                                      estilo académico tradicional

  Fuente para títulos                 La misma familia que el texto; usar
                                      tamaño y negrita para crear
                                      jerarquía

  Fuente para código                  Consolas o Courier New, 9--10 pt,
                                      solo para fragmentos de código

  Color del texto                     Negro o gris muy oscuro

  Título de capítulo                  16--18 pt, negrita

  Encabezado de sección               13--14 pt, negrita

  Subencabezado                       11--12 pt, negrita

  Texto principal                     11--12 pt

  Notas, pies de figura y tablas      9--10 pt, siempre legibles

  Interlineado del cuerpo             1,5

  Alineación                          A la izquierda. Si se usa
                                      justificado, revisar que no queden
                                      espacios excesivos entre palabras

  Márgenes                            2,5 cm en todos los lados como
                                      punto de partida; consultar si se
                                      requiere margen adicional para
                                      encuadernación

  Espacio entre párrafos              6 pt después de cada párrafo, sin
                                      agregar líneas vacías manualmente

  Sangría                             Elegir una sola convención: sangría
                                      de primera línea o separación entre
                                      párrafos. No mezclar ambas sin
                                      criterio

  Numeración                          Páginas consecutivas; ubicación
                                      constante, por ejemplo, abajo a la
                                      derecha

  Figuras y tablas                    Numeradas, tituladas y mencionadas
                                      en el texto

  Exportación                         PDF con fuentes incrustadas, texto
                                      seleccionable y enlaces funcionales
  -----------------------------------------------------------------------

### 2.1 ¿Qué tipografía conviene elegir?

**Opción recomendada para priorizar la lectura: Arial 11 pt.** Es una
tipografía sans serif, limpia y familiar, adecuada para documentación
técnica. Utilizá la misma familia en todo el documento.

**Alternativa tradicional: Times New Roman 12 pt.** Tiene una apariencia
académica clásica y es frecuente en trabajos universitarios.

También pueden funcionar Calibri 11--12 pt, Aptos 11 pt o Georgia 11--12
pt, si la institución lo permite. Lo importante es elegir una sola
familia principal y mantenerla de forma consistente.

Evitá fuentes decorativas, manuscritas, condensadas o demasiado finas.
No uses varios colores, subrayados o cursivas para destacar cada idea.
Reservá la cursiva para términos extranjeros no incorporados al español,
títulos según el estilo de citación y usos técnicos específicos.

### 2.2 Jerarquía de títulos

Usá estilos de título reales en Word, Google Docs o LibreOffice, no solo
texto agrandado manualmente. Esto permite generar el índice
automáticamente y mantener una estructura accesible.

-   **Título de capítulo:** `1. Introducción`
-   **Sección:** `1.1 Contexto del proyecto`
-   **Subsección:** `1.1.1 Situación actual`

No profundices en demasiados niveles: normalmente tres niveles son
suficientes. Evitá títulos enteros en mayúsculas y títulos que sean
párrafos completos.

### 2.3 Párrafos y estilo de escritura

-   Desarrollá **una idea principal por párrafo**.
-   Empezá por la idea importante y luego explicá sus detalles.
-   Preferí oraciones claras y relativamente cortas.
-   Definí las siglas la primera vez: "Interfaz de Programación de
    Aplicaciones (API)".
-   Explicá los términos técnicos que no sean evidentes para el lector.
-   Evitá expresiones vagas como "es muy rápido" o "funciona
    perfectamente"; respaldalas con métricas o pruebas.
-   No afirmes que algo se logró si no hay evidencia.
-   Usá el mismo tiempo verbal de manera coherente. Por ejemplo,
    presente para describir el documento y el sistema; pasado para
    actividades ya realizadas.
-   Mantené un tono formal y directo, sin convertir el texto en lenguaje
    innecesariamente complicado.
-   Evitá párrafos de una sola oración repetidos, bloques enormes de
    texto y listas que podrían explicarse mejor en prosa.

**Ejemplo de redacción**

Menos claro: \> El sistema es muy rápido y tiene una arquitectura
moderna que permite realizar muchas cosas de manera eficiente.

Más claro: \> El sistema separa la interfaz, la lógica de negocio y el
acceso a datos en módulos independientes. El rendimiento se evaluó
mediante pruebas con 100 solicitudes simultáneas; los resultados se
presentan en la sección 9.3.

------------------------------------------------------------------------

## 3. Índice sugerido de la documentación

La estructura exacta depende del proyecto. No todas las secciones son
obligatorias en todos los trabajos; acordar con el director cuáles
corresponden.

### Elementos iniciales

-   Portada
-   Agradecimientos (opcional)
-   Resumen
-   Palabras clave
-   Abstract y keywords (si se solicitan)
-   Índice general
-   Índice de figuras y tablas (si corresponde)
-   Glosario y lista de siglas (si son necesarios)

### Capítulo 1. Introducción

1.1 Contexto del proyecto\
1.2 Motivación y relevancia\
1.3 Descripción general de la solución\
1.4 Organización del documento

### Capítulo 2. Planteamiento del problema

2.1 Situación actual\
2.2 Problema identificado\
2.3 Necesidad o justificación\
2.4 Alcance del proyecto\
2.5 Limitaciones y supuestos\
2.6 Usuarios o beneficiarios

### Capítulo 3. Objetivos

3.1 Objetivo general\
3.2 Objetivos específicos\
3.3 Criterios de éxito o indicadores de cumplimiento

Los objetivos deben describir resultados verificables, no una lista de
tareas. Por ejemplo, "evaluar el rendimiento bajo tres cargas de
trabajo" es más verificable que "investigar el rendimiento".

### Capítulo 4. Antecedentes y marco teórico

4.1 Trabajos relacionados\
4.2 Conceptos fundamentales\
4.3 Tecnologías, herramientas y estándares\
4.4 Comparación de soluciones existentes\
4.5 Fundamentos de las decisiones adoptadas

Diferenciá las ideas tomadas de fuentes externas de las decisiones
propias del proyecto. Citá las fuentes de forma consistente.

### Capítulo 5. Metodología y planificación

5.1 Enfoque de desarrollo o investigación\
5.2 Etapas de trabajo\
5.3 Herramientas de gestión y desarrollo\
5.4 Organización del equipo y responsabilidades (si corresponde)\
5.5 Planificación y entregables\
5.6 Estrategia de pruebas y evaluación

### Capítulo 6. Requisitos y análisis

6.1 Actores y usuarios\
6.2 Requisitos funcionales\
6.3 Requisitos no funcionales\
6.4 Casos de uso o historias de usuario\
6.5 Reglas de negocio y restricciones\
6.6 Criterios de aceptación\
6.7 Priorización y trazabilidad de requisitos

### Capítulo 7. Diseño y arquitectura

7.1 Arquitectura general\
7.2 Componentes y responsabilidades\
7.3 Flujo de datos y procesos\
7.4 Modelo de datos o diseño de almacenamiento\
7.5 Diseño de interfaces (si corresponde)\
7.6 Protocolos e integraciones\
7.7 Seguridad, privacidad y manejo de errores\
7.8 Decisiones de diseño y alternativas consideradas

Incluí diagramas solo cuando ayuden a entender la solución. Cada
diagrama debe tener número, título, leyenda cuando haga falta y una
explicación en el texto.

### Capítulo 8. Implementación

8.1 Entorno de desarrollo\
8.2 Tecnologías y dependencias\
8.3 Organización del código\
8.4 Implementación de los módulos principales\
8.5 Integraciones relevantes\
8.6 Manejo de errores y registros\
8.7 Problemas encontrados y soluciones adoptadas

No copies todo el código fuente en el cuerpo de la tesis. Mostrá
fragmentos breves cuando sean necesarios para explicar una decisión; el
repositorio o los anexos pueden contener el resto.

### Capítulo 9. Pruebas y evaluación

9.1 Estrategia de pruebas\
9.2 Entorno y datos de prueba\
9.3 Casos de prueba\
9.4 Pruebas unitarias e integración (si corresponden)\
9.5 Pruebas funcionales y de aceptación\
9.6 Rendimiento, robustez o precisión (según el proyecto)\
9.7 Resultados, fallos y correcciones\
9.8 Trazabilidad entre requisitos y pruebas

Para cada prueba relevante, registrá: identificador, objetivo,
condiciones, pasos, resultado esperado, resultado obtenido y estado. En
trabajos experimentales, documentá también los datos, las métricas y las
condiciones para poder repetir el experimento.

### Capítulo 10. Resultados y discusión

10.1 Resultados principales\
10.2 Indicadores y métricas\
10.3 Comparación con los objetivos o una línea base\
10.4 Interpretación de los resultados\
10.5 Limitaciones y amenazas a la validez

Separá los datos observados de su interpretación. Si una prueba no
alcanzó el resultado esperado, informalo y explicá sus posibles causas.

### Capítulo 11. Conclusiones y trabajo futuro

11.1 Síntesis del trabajo realizado\
11.2 Cumplimiento de los objetivos\
11.3 Aportes del proyecto\
11.4 Limitaciones pendientes\
11.5 Mejoras y líneas futuras

Las conclusiones no deben introducir resultados nuevos que no se hayan
explicado antes.

### Referencias bibliográficas

Incluí todas las fuentes citadas y no agregues referencias que no hayas
consultado. Usá el estilo exigido por la carrera. Si no hay uno
indicado, consultá al director antes de elegir APA, IEEE u otro estilo.

### Anexos

Según corresponda:

-   Manual de instalación y configuración
-   Manual de usuario
-   Especificaciones complementarias
-   Cuestionarios o instrumentos de evaluación
-   Tablas extensas
-   Diagramas adicionales
-   Evidencias de pruebas
-   Enlace al repositorio y versión entregada

Los anexos complementan la explicación; no deben contener información
esencial para comprender los resultados que falte en los capítulos
principales.

------------------------------------------------------------------------

## 4. Reglas para figuras, tablas, código y ecuaciones

### Figuras y diagramas

-   Numerá de forma consistente:
    `Figura 7.1. Arquitectura general del sistema`.
-   Colocá el título debajo o arriba según el estilo elegido y mantenelo
    en todo el documento.
-   Mencioná cada figura en el texto: "Como se observa en la Figura
    7.1...".
-   Si la figura proviene de otra fuente, citá esa fuente.
-   Asegurá que el texto del diagrama sea legible al exportar a PDF.
-   No uses únicamente colores para distinguir estados o categorías;
    agregá etiquetas, formas o patrones.

### Tablas

-   Numerá y titulá cada tabla.
-   Explicá las abreviaturas y unidades.
-   Indicá la fuente cuando los datos no sean propios.
-   Evitá tablas excesivamente anchas; dividilas o pasalas a un anexo si
    hace falta.

### Código y comandos

-   Usá una fuente monoespaciada para fragmentos de código.
-   Incluí solo el fragmento necesario y explicá qué demuestra.
-   Identificá el lenguaje o la herramienta.
-   No incluyas contraseñas, tokens, claves privadas ni datos
    personales.
-   Registrá versiones de dependencias y requisitos para reproducir la
    ejecución.

### Ecuaciones y símbolos

-   Definí las variables al introducirlas.
-   Numerá las ecuaciones solo si luego las vas a referenciar.
-   Conservá las mismas notaciones en todo el documento.

------------------------------------------------------------------------

## 5. Citación y uso de fuentes

-   Citá afirmaciones, definiciones, datos, métodos o ideas que procedan
    de otras fuentes.
-   Priorizá artículos científicos, libros, normas oficiales y
    documentación primaria de las tecnologías.
-   No uses una cita como sustituto de la explicación: resumí con tus
    palabras y explicá su relevancia.
-   Verificá que cada cita aparezca en la bibliografía y viceversa.
-   No copies texto sin marcarlo como cita y referenciarlo.
-   Registrá los enlaces y la fecha de consulta cuando el estilo elegido
    lo requiera.
-   Mantené un único estilo de citación en todo el trabajo.

Para proyectos de software o ingeniería, IEEE suele ser una opción
práctica; APA también puede ser válida. **La elección definitiva debe
ajustarse a la normativa de la carrera y a la indicación del director.**

------------------------------------------------------------------------

## 6. Documentación técnica complementaria

Además de la tesis, conviene mantener archivos separados para que otra
persona pueda instalar, ejecutar y mantener el proyecto.

### Manual de instalación

1.  Propósito y alcance.
2.  Requisitos de hardware y software.
3.  Versiones de herramientas y dependencias.
4.  Variables de entorno y configuración.
5.  Pasos de instalación.
6.  Instrucciones para ejecutar.
7.  Procedimiento para verificar que funciona.
8.  Problemas frecuentes y soluciones.

### Manual de usuario

1.  Propósito del sistema.
2.  Requisitos previos.
3.  Inicio de sesión o puesta en marcha (si corresponde).
4.  Descripción de las pantallas, módulos o controles.
5.  Procedimientos para las tareas principales.
6.  Mensajes de error y recuperación.
7.  Limitaciones conocidas.
8.  Canal o procedimiento de soporte, si corresponde.

### README del repositorio

Debe incluir una descripción breve, funcionalidades, arquitectura
resumida, tecnologías, requisitos, instalación, configuración,
ejecución, pruebas, estructura de carpetas, licencia y datos de contacto
del proyecto cuando corresponda. Nunca incluyas secretos ni
credenciales.

------------------------------------------------------------------------

## 7. Control de calidad antes de entregar

### Contenido

-   [ ] El problema está explicado de forma concreta.
-   [ ] Los objetivos son claros y verificables.
-   [ ] Los requisitos están documentados.
-   [ ] Las decisiones técnicas importantes están justificadas.
-   [ ] Las pruebas tienen resultados y evidencias.
-   [ ] Las conclusiones se apoyan en los resultados.
-   [ ] Las limitaciones están declaradas.
-   [ ] Todas las fuentes están citadas.

### Presentación

-   [ ] La tipografía, los tamaños y los espacios son consistentes.
-   [ ] El índice coincide con los títulos y las páginas.
-   [ ] Figuras y tablas están numeradas y referenciadas.
-   [ ] No hay páginas vacías, títulos aislados ni tablas ilegibles.
-   [ ] Se revisaron ortografía, puntuación y siglas.
-   [ ] Los enlaces funcionan.
-   [ ] El PDF conserva fuentes, símbolos y diagramas.
-   [ ] El documento se revisó tanto en pantalla como en una vista de
    impresión.

### Reproducibilidad

-   [ ] Se indica la versión del software entregado.
-   [ ] La instalación se probó siguiendo el manual desde cero.
-   [ ] Los pasos de ejecución son claros.
-   [ ] Los datos de prueba y resultados pueden interpretarse.
-   [ ] Se eliminaron secretos, credenciales y datos sensibles.

------------------------------------------------------------------------

## 8. Referencias útiles sobre formato y legibilidad

Estas guías universitarias muestran convenciones frecuentes de
presentación académica. **No reemplazan el reglamento de la UNSTA** y
pueden tener requisitos distintos entre sí.

-   Texas Tech University Graduate School, *Thesis-Dissertation
    Formatting Manual*:
    https://www.depts.ttu.edu/gradschool/academic/thesis_diss/forms/2026-2027/Formatting_Manual_2026_Update.pdf
-   University of California, San Francisco, *Formatting Your
    Dissertation or Thesis*:
    https://graduate.ucsf.edu/students/dissertation-thesis-guidelines/format-dissertation
-   Harvard Kenneth C. Griffin Graduate School of Arts and Sciences,
    *Dissertation Formatting Guidance*:
    https://gsas.harvard.edu/resource/dissertation-formatting-guidance
-   University of Iowa, *Readability Standards for Thesis and
    Dissertation*:
    https://grad.uiowa.edu/academics/thesis-and-dissertation/readability-standards-thesis-and-dissertation

## 9. Decisión recomendada para empezar

Si todavía no existe una plantilla institucional, empezá con esta
configuración provisional:

-   Página A4.
-   Arial 11 pt para el texto principal.
-   Títulos jerárquicos de 16, 14 y 12 pt.
-   Interlineado 1,5.
-   Márgenes de 2,5 cm.
-   Texto negro, alineado a la izquierda.
-   Espaciado de 6 pt después de cada párrafo.
-   Numeración automática de capítulos, figuras y tablas.
-   Referencias con un único estilo, aprobado por el director.
-   Exportación final a PDF y verificación de legibilidad.

Antes de cerrar el formato, confirmá las pautas oficiales de la carrera
de Ingeniería Informática de la UNSTA y acordá el índice con el
director. Esta guía es un punto de partida para trabajar de forma
ordenada, no una garantía de cumplimiento de requisitos institucionales.
