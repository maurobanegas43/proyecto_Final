Te conviene definir la validación de vida como una especificación funcional y visual, para que tu agente de programación no improvise la interfaz ni dependa completamente de una librería externa que está funcionando mal.

La idea es separar tres responsabilidades:

1. Interfaz visual: lo que ve y hace el usuario frente a la cámara.
2. Validación de vida: el proceso que determina si hay evidencia suficiente de que se trata de una persona real presente frente a la cámara.
3. Integración técnica: la comunicación entre el frontend, la librería de validación y tu backend en Go con Gin.

El documento debe indicar qué mostrar en cada estado, cómo guiar al usuario, qué hacer cuando falla la cámara y cómo evitar que el sistema informe un éxito cuando la validación todavía no terminó.

Te dejo un documento listo para pasarle a tu agente. Está pensado para que pueda implementarlo sin depender de una librería específica y adaptarlo a tu arquitectura con Go + Gin.

# Especificación funcional y visual: Validación de vida mediante cámara

**Proyecto:** Sistema de autenticación y verificación de identidad\
**Módulo:** Verificación de vida (*Liveness Detection*)\
**Backend:** Go + Gin\
**Objetivo:** Implementar una experiencia visual clara, confiable y robusta, desacoplada de la librería externa de reconocimiento facial.

---

## 1. Objetivo

Implementar una interfaz de validación de vida mediante cámara que permita comprobar que el usuario está presente frente al dispositivo y que la verificación finalice únicamente cuando el motor de validación confirme el resultado.

La interfaz debe ser sencilla, moderna, accesible y comprensible para usuarios sin conocimientos técnicos.

La aplicación no debe limitarse a mostrar una cámara con un botón de continuar. Debe guiar al usuario durante todo el proceso, informarle qué necesita hacer y comunicar correctamente cada estado de la verificación.

### Principios obligatorios

- La cámara debe ser el elemento visual principal.
- Las instrucciones deben ser breves y cambiar según el estado del proceso.
- El usuario debe saber siempre qué está ocurriendo.
- Los errores deben tener una explicación y una acción para resolverlos.
- La interfaz no debe afirmar que existe una persona real únicamente porque detectó un rostro.
- La validación visual del frontend no debe sustituir la decisión del motor de liveness.
- La interfaz debe funcionar aunque se reemplace la librería externa.

---

## 2. Diseño general de la pantalla

La pantalla debe organizarse en tres áreas: encabezado, zona de cámara y área de instrucciones y acciones.

### 2.1 Encabezado

Debe contener:

- Título: **Verificación de identidad**.
- Subtítulo: "Necesitamos comprobar que eres una persona real".
- Indicador de progreso: por ejemplo, "Paso 2 de 3", si forma parte de un proceso de registro.
- Acción secundaria para cancelar o volver, siempre que el flujo lo permita.

No utilizar textos técnicos como "Face Detection", "Inference", "Tensor Processing" o "Liveness API".

### 2.2 Zona de cámara

La cámara debe ocupar la mayor parte del espacio visual.

Elementos:

1. Vista previa de la cámara frontal.
2. Marco de referencia para posicionar el rostro.
3. Indicador de estado.
4. Instrucción contextual.
5. Indicador de carga cuando sea necesario.

El marco facial debe ser una guía visual, no una representación de que el usuario ya está verificado.

**Comportamiento visual:**

- Rostro no detectado: mostrar un marco neutro.
- Rostro detectado y mal posicionado: mostrar una instrucción específica.
- Rostro correctamente posicionado: indicar que la posición es adecuada.
- Verificación en curso: mostrar un estado de procesamiento.
- Verificación aprobada: mostrar una confirmación únicamente después de recibir el resultado válido.
- Verificación rechazada: mostrar un mensaje de error recuperable cuando corresponda.

El color no debe ser la única forma de comunicar los estados. Cada estado debe incluir texto o un icono comprensible.

### 2.3 Área de instrucciones y acciones

Debajo de la cámara debe existir un espacio estable para:

- Instrucción principal.
- Descripción breve.
- Botón principal, cuando corresponda.
- Acción secundaria para reintentar o cancelar.

El botón principal debe cambiar según el estado. No debe habilitarse antes de que se cumplan los requisitos necesarios para iniciar la validación.

---

## 3. Flujo visual completo

La implementación debe modelarse como una máquina de estados explícita. No utilizar una colección de condiciones visuales independientes que puedan producir estados contradictorios.

### Estado 1. Inicial

**Título:** Verifica tu identidad.

**Descripción:** Coloca tu rostro frente a la cámara para comenzar.

**Acción principal:** Activar cámara.

**Comportamiento:**

- No solicitar acceso a la cámara automáticamente sin una acción del usuario, salvo que el flujo y el navegador lo permitan de forma justificada.
- Al activar la cámara, solicitar permiso mediante las API estándar del navegador.
- Mostrar un indicador de carga mientras se inicializa.
- Evitar mostrar una pantalla vacía durante la inicialización.

### Estado 2. Solicitando acceso a la cámara

**Mensaje:** Estamos preparando la cámara...

**Comportamiento:**

- Deshabilitar acciones que puedan iniciar solicitudes duplicadas.
- Mostrar un indicador de carga.
- Esperar a que la cámara esté realmente disponible.
- Pasar al estado de cámara lista únicamente cuando el flujo de vídeo esté activo.

### Estado 3. Cámara no disponible

Debe contemplar:

- Permiso denegado.
- Cámara inexistente.
- Cámara ocupada por otra aplicación.
- Error de inicialización.
- Navegador o contexto no compatible.

Ejemplo para permiso denegado:

**Título:** Necesitamos acceso a tu cámara.

**Descripción:** Habilita el permiso de cámara en tu navegador para continuar.

**Acción principal:** Volver a intentar.

No reintentar indefinidamente ni mantener un indicador de carga permanente.

Si el navegador no permite recuperar el permiso desde la página, explicar cómo habilitarlo en la configuración correspondiente.

### Estado 4. Cámara lista, sin rostro detectado

**Título:** Coloca tu rostro dentro del marco.

**Descripción:** Mira hacia la cámara y asegúrate de que tu rostro esté bien iluminado.

**Comportamiento:**

- Mostrar la vista previa.
- Mantener el botón de inicio deshabilitado si el motor necesita detectar previamente el rostro.
- No iniciar la validación final.
- No mostrar errores técnicos por la ausencia temporal de un rostro.

### Estado 5. Rostro detectado, posición incorrecta

Mostrar una instrucción dinámica según la información disponible:

- "Acércate un poco".
- "Aléjate un poco".
- "Centra tu rostro".
- "Mira directamente a la cámara".
- "Busca un lugar con mejor iluminación".

Solo mostrar instrucciones que estén respaldadas por mediciones reales del detector. No inventar estimaciones de distancia o iluminación si la librería no las proporciona.

La instrucción debe cambiar cuando cambie la condición detectada, evitando alternancias constantes entre mensajes.

### Estado 6. Preparado para verificar

**Título:** Perfecto, estamos listos.

**Descripción:** Mantén el rostro centrado y sigue las instrucciones.

**Acción principal:** Comenzar verificación.

En este estado:

- El vídeo está activo.
- Se cumplen las condiciones de posicionamiento exigidas por el motor.
- No existen errores que impidan comenzar.
- La sesión de verificación está disponible, si el backend requiere crearla previamente.

La detección del rostro no significa que el usuario haya superado la prueba de vida.

### Estado 7. Verificación en curso

**Título:** Verificando que estás presente.

**Descripción:** Sigue las instrucciones que aparecen en pantalla y mantén el rostro visible.

La prueba puede utilizar acciones guiadas, como movimientos de cabeza, según las capacidades del proveedor.

Ejemplos de instrucciones, únicamente si el motor las admite:

- "Mira directamente a la cámara".
- "Gira ligeramente la cabeza hacia la izquierda".
- "Gira ligeramente la cabeza hacia la derecha".
- "Vuelve a mirar al frente".

No imponer estas acciones si el motor requiere otra secuencia.

**Comportamiento:**

- Mostrar la instrucción activa de forma destacada.
- Mostrar el progreso real, si el motor lo proporciona.
- Mantener la cámara activa durante la prueba.
- Deshabilitar el inicio de nuevas verificaciones mientras exista una operación en curso.
- Establecer tiempos máximos de espera.
- Permitir cancelar si es seguro hacerlo.
- No mostrar éxito basándose únicamente en una animación o en la finalización del temporizador.

### Estado 8. Resultado aprobado

Este estado solo puede mostrarse cuando el resultado final del motor sea válido y el backend haya confirmado que la verificación puede aceptarse.

**Título:** Verificación completada.

**Descripción:** Hemos confirmado el resultado de tu verificación.

**Acción principal:** Continuar.

Comportamiento:

- Mostrar un icono de confirmación.
- Detener la cámara cuando ya no sea necesaria.
- Liberar los recursos del vídeo.
- Impedir que el mismo resultado se reutilice fuera de su sesión.
- Continuar con el proceso de autenticación o registro.

No considerar aprobado un resultado desconocido, incompleto o que todavía esté procesándose.

### Estado 9. Resultado no aprobado

**Título:** No pudimos completar la verificación.

**Descripción:** Inténtalo nuevamente con el rostro bien iluminado y centrado.

**Acción principal:** Intentar nuevamente.

**Acción secundaria:** Cancelar o volver, si corresponde.

Distinguir entre:

- Resultado negativo del motor.
- Tiempo de espera agotado.
- Error de comunicación.
- Sesión expirada.
- Fallo interno del proveedor.

No mostrar mensajes internos, trazas, tokens ni detalles de infraestructura al usuario.

El reintento debe iniciar una nueva operación válida, sin reutilizar automáticamente una sesión expirada o un resultado anterior.

---

## 4. Esquema visual de referencia

La siguiente estructura representa la distribución general de la pantalla. No es una implementación literal ni obliga a utilizar componentes específicos.

```
┌──────────────────────────────────────────┐
│  Verificación de identidad               │
│  Comprueba tu identidad para continuar   │
│                                          │
│  Paso 2 de 3                             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │          VISTA DE CÁMARA           │  │
│  │                                    │  │
│  │         ┌──────────────┐           │  │
│  │         │              │           │  │
│  │         │    ROSTRO    │           │  │
│  │         │              │           │  │
│  │         └──────────────┘           │  │
│  │                                    │  │
│  │        Cámara activa               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Centra tu rostro                        │
│  Mira directamente a la cámara           │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │        Comenzar verificación        │  │
│  └────────────────────────────────────┘  │
│                                          │
│                Cancelar                  │
└──────────────────────────────────────────┘
```

### Adaptación a dispositivos

- En escritorio, centrar el contenido y limitar el ancho del panel.
- En dispositivos móviles, priorizar la vista de cámara y mantener las acciones accesibles.
- Respetar el área segura de los dispositivos.
- Evitar que el botón principal quede oculto por el teclado o la interfaz del navegador.
- No estirar la imagen de la cámara para ajustarla al contenedor.
- Si se utiliza vídeo espejado para facilitar la interacción, conservar correctamente la orientación y el procesamiento requerido por el motor.

---

## 5. Reglas de integración con la librería externa

La librería debe tratarse como un proveedor intercambiable, no como el dueño de toda la interfaz.

Crear una capa de adaptación propia que traduzca sus eventos y resultados a estados internos estables.

Ejemplo conceptual:

```
Interfaz de usuario
        │
        ▼
Controlador de verificación
        │
        ▼
Adaptador de liveness
        │
        ▼
Librería externa / SDK
```

El adaptador debe exponer operaciones equivalentes a:

- Inicializar el motor.
- Iniciar una verificación.
- Consultar o recibir el estado.
- Cancelar una operación.
- Liberar recursos.
- Obtener el resultado final.

Los nombres concretos dependerán de la API real del proveedor.

### Normalización de estados

El controlador debe traducir los eventos externos a estados internos, por ejemplo:

```
idle
camera_requesting
camera_ready
camera_error
face_not_detected
face_positioning
ready
verifying
approved
rejected
timeout
error
cancelled
```

No todos estos estados tienen que provenir directamente del SDK. Algunos pertenecen a la interfaz y otros al motor de verificación.

El adaptador debe separar los errores recuperables de los errores terminales y evitar que eventos tardíos sobrescriban el resultado de una sesión nueva.

### Si la librería funciona mal

No resolver los problemas agregando más condiciones visuales sobre los eventos defectuosos.

Investigar por separado:

1. Si el vídeo se captura correctamente.
2. Si el detector encuentra el rostro.
3. Si el SDK recibe los fotogramas adecuados.
4. Si el motor produce resultados válidos.
5. Si los eventos y promesas se procesan correctamente.
6. Si el backend interpreta correctamente la respuesta.
7. Si la interfaz representa fielmente el resultado.

Si el proveedor falla, mostrar un error controlado y registrar información técnica sin exponer datos biométricos innecesarios.

La interfaz no debe declarar que una persona está viva como mecanismo alternativo cuando el motor falla.

---

## 6. Arquitectura recomendada con Go + Gin

La cámara y la interfaz se ejecutan en el frontend. Gin coordina la sesión, aplica las reglas de autorización y recibe o verifica el resultado según la arquitectura del proveedor.

Un flujo de referencia es:

```
Frontend
   │
   ├── Solicita sesión de liveness
   │           │
   │           ▼
   │      Backend Gin
   │           │
   │           ▼
   │      Sesión temporal
   │
   ├── Ejecuta la prueba con el SDK
   │
   ├── Envía el resultado o referencia de sesión
   │           │
   │           ▼
   │      Backend Gin
   │           │
   │           ▼
   │    Verifica el resultado
   │           │
   │           ▼
   └── Muestra el estado confirmado
```

Los nombres de rutas son orientativos. Deben adaptarse a los endpoints existentes y al método de integración real del proveedor.

Posibles operaciones:

- `POST /liveness/session`: crear una sesión temporal.
- `POST /liveness/verify`: solicitar la verificación o consultar el resultado, según el proveedor.
- `GET /liveness/status/:id`: consultar el estado cuando el procesamiento sea asíncrono.

No es necesario implementar las tres rutas si el proveedor utiliza otro flujo.

### Reglas de seguridad

- Crear identificadores de sesión únicos y con expiración.
- Vincular la sesión al usuario o al intento de autenticación correspondiente.
- Validar los resultados en el backend cuando el proveedor lo permita.
- Verificar firmas de webhooks, si existen.
- No aceptar como prueba suficiente un booleano `true` enviado libremente por el frontend.
- No almacenar vídeo o imágenes biométricas si no son necesarios.
- No registrar imágenes, fotogramas, tokens de sesión ni datos biométricos en logs ordinarios.
- Aplicar límites de intentos y controles contra la reutilización de sesiones.
- Si la verificación falla, no completar la autenticación protegida.

La interfaz solo muestra el resultado; el backend debe decidir si ese resultado permite continuar.

---

## 7. Gestión de errores

| Situación                  | Respuesta visual                                                   | Recuperación                            |
| -------------------------- | ------------------------------------------------------------------ | --------------------------------------- |
| Permiso de cámara denegado | Explicar cómo habilitarlo                                          | Volver a intentar                       |
| Cámara ocupada             | Informar que otra aplicación podría estar utilizándola             | Liberar cámara y reintentar             |
| No se detecta rostro       | Mostrar guía de posicionamiento                                    | Ajustar posición                        |
| Iluminación insuficiente   | Solicitar mejor iluminación, si se detecta                         | Ajustar entorno                         |
| Conexión perdida           | Informar que no se pudo completar la operación                     | Reintentar según el estado de la sesión |
| Tiempo agotado             | Indicar que la verificación tardó demasiado                        | Crear una operación nueva               |
| Sesión expirada            | Informar que debe reiniciarse                                      | Crear nueva sesión                      |
| Resultado negativo         | Explicar que no se pudo verificar                                  | Reintentar según la política            |
| Error del proveedor        | Mostrar mensaje genérico y permitir recuperación cuando sea seguro | Registrar diagnóstico técnico           |
| Resultado desconocido      | No mostrar éxito                                                   | Consultar o validar nuevamente          |

Los mensajes deben ser breves y orientados a la acción. No revelar detalles que permitan manipular el sistema.

---

## 8. Reglas de implementación de la interfaz

1. Utilizar una única fuente de verdad para el estado actual.
2. Evitar que dos operaciones de verificación se ejecuten simultáneamente para el mismo intento.
3. Limpiar los recursos de cámara al salir de la pantalla, cancelar o finalizar.
4. Evitar fugas de memoria y listeners duplicados al reintentar.
5. Controlar los eventos tardíos de operaciones anteriores.
6. No bloquear toda la pantalla cuando solo una acción debe estar deshabilitada.
7. Mostrar indicadores de carga únicamente mientras exista una operación real.
8. Implementar estados vacíos y errores; no asumir que la cámara siempre funciona.
9. Mantener las instrucciones estables para que no cambien continuamente.
10. No confundir detección facial con verificación de vida.
11. No mostrar un resultado positivo hasta contar con una confirmación válida.
12. Mantener separadas las responsabilidades visuales, de integración y de seguridad.

---

## 9. Pruebas de aceptación

La implementación no se considera terminada hasta superar estas pruebas.

### Interfaz

- La pantalla explica claramente para qué sirve la verificación.
- El usuario puede activar la cámara y entiende cómo posicionarse.
- Los estados de carga, preparación, verificación y resultado son distinguibles.
- Las instrucciones se actualizan según las condiciones reales.
- La interfaz funciona en escritorio y dispositivos móviles.
- Los errores tienen mensajes claros y opciones de recuperación.

### Cámara y recursos

- Se gestiona correctamente el permiso denegado.
- Se contempla la ausencia de cámara.
- La cámara se libera al salir de la pantalla.
- Los reintentos no duplican streams, listeners ni operaciones.
- Los errores de inicialización no dejan la interfaz bloqueada.

### Verificación

- Detectar un rostro no equivale a aprobar la prueba.
- El éxito solo aparece tras una respuesta final válida.
- Una respuesta desconocida no se interpreta como aprobada.
- Se manejan los tiempos de espera y las sesiones expiradas.
- Un error del SDK no produce una aprobación alternativa.
- Se prueban fotografías impresas, imágenes mostradas en pantallas y vídeos reproducidos frente a la cámara, según las capacidades del motor.
- Se evalúa el comportamiento ante cambios de iluminación, diferentes cámaras y conexiones lentas.

### Backend y seguridad

- No es posible completar la autenticación enviando únicamente `liveness: true` desde el frontend.
- Los resultados se vinculan con la sesión correcta.
- Las sesiones expiradas o reutilizadas se rechazan.
- Los errores técnicos no filtran datos biométricos ni secretos.
- Las pruebas distinguen los fallos de interfaz de los fallos reales del motor.

Las pruebas con fotos, pantallas y vídeos deben realizarse en un entorno controlado. Una interfaz correcta no demuestra por sí sola que el motor resista ataques de suplantación.

---

## 10. Entregables esperados del agente

Antes de finalizar, el agente debe entregar:

1. La pantalla de verificación completa.
2. Los estados visuales definidos en este documento.
3. La máquina de estados y sus transiciones.
4. El adaptador que desacopla la interfaz de la librería externa.
5. La integración con el flujo de sesiones del backend Gin.
6. El manejo de errores y recuperación.
7. Las pruebas de aceptación automatizadas que sean viables.
8. Una lista de limitaciones conocidas del proveedor.
9. Una explicación de cómo reemplazar la librería sin rehacer toda la interfaz.

### Instrucción final

Primero inspecciona el código existente, identifica la librería externa, sus eventos, sus limitaciones y la estructura real del frontend y del backend. No reemplaces componentes ni inventes métodos del SDK sin comprobar su API.

Después implementa la solución siguiendo esta especificación, reutilizando la arquitectura existente cuando sea razonable. Prioriza una interfaz coherente, estados explícitos, manejo robusto de errores y una integración que pueda cambiar de proveedor sin reescribir la experiencia visual.

No des por terminado el trabajo porque la cámara se vea en pantalla. El flujo completo debe funcionar desde el permiso inicial hasta un resultado validado, incluyendo errores, cancelación, reintentos y liberación de recursos.

## Cómo usar este documento con tu agente

Pasale el documento junto con esta instrucción adicional:

> No empieces a modificar código inmediatamente. Primero inspecciona la implementación actual e identifica por qué falla la librería de liveness. Devuelve un diagnóstico que distinga los problemas de interfaz, captura de cámara, integración del SDK y validación del resultado. Luego propone los cambios mínimos necesarios, implementa la solución y verifica los criterios de aceptación. No simules una validación exitosa para ocultar fallos del proveedor.

Mi recomendación: antes de cambiar de librería, identifica si el problema está en la captura de cámara, en la detección facial o en el algoritmo de liveness. Son problemas diferentes y requieren soluciones diferentes.

Si me decís qué librería externa estás usando y con qué tecnología está construido tu frontend (React, Next.js, Vue u otra), puedo adaptar esta especificación a su API real y definir exactamente qué componentes visuales, eventos y métodos debe implementar tu agente.