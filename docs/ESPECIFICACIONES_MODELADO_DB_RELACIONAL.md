# Especificaciones y Principios para el Modelado y Diseño de la Base de Datos Relacional

**Proyecto:** Krea Nova — Real Estate Investments  
**Ámbito:** Base de Datos Relacional Transaccional (PostgreSQL)  
**Alcance de Persistencia:** Cuentas, fondos de inversión, aportes, movimientos financieros, contratos y entidades legales.  
**Delimitación de Alcance:** Todo lo referente a tokens, transacciones on-chain y blockchain se gestiona de forma desestructurada / desacoplada (capa documental y registro de eventos). La base de datos relacional es la **fuente de verdad ACID para la custodia de fondos, integridad contable y relaciones contractuales**.

---

## 1. Contexto de Arquitectura y Delimitación de Responsabilidad

El diseño de la base de datos relacional tiene como objetivo garantizar la consistencia estricta, evitar la duplicación de datos, eliminar anomalías de modificación/inserción/borrado y asegurar la integridad referencial.

- **Base de Datos Relacional (PostgreSQL):** Modela de manera normalizada (mínimo 3FN / BCNF) la gestión de fondos, movimientos de capital, usuarios, contratos y propiedades subyacentes.
- **Tokens y Blockchain:** La emisión, balances tokenizados y eventos de smart contracts se tratan como datos desestructurados o de bitácora en capas separadas. La base relacional no almacena lógica on-chain volátil como columnas sueltas ni estados no verificados; únicamente registra los fondos reales, comprobantes transaccionales y respaldos jurídicos.

---

## 2. Reglas Fundamentales del Diseño Relacional

### 2.1. Identificación de Entidades
Cada tabla debe representar un concepto del dominio con identidad, responsabilidades y ciclo de vida propios. No deben crearse tablas por conveniencia visual o separación arbitraria en interfaces de usuario.

**Ejemplo aplicado al negocio:**
- **Cliente / Inversor:** Personas físicas o jurídicas que aportan fondos o participan en proyectos.
- **Fondo / Proyecto:** Vehículo de inversión o activo inmobiliario con presupuesto, estado y cuentas de recaudación.
- **Movimiento de Fondos:** Registro inmutable de ingresos, egresos y rendimientos monetarios.
- **Contrato:** Vínculo jurídico vinculante entre el inversor, el fondo y la entidad gestora.

---

### 2.2. Definición de Claves Primarias (PK)
Cada tabla debe contar con un mecanismo único, inmutable y determinista para identificar sus filas.

```sql
CREATE TABLE clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
```

**Reglas obligatorias:**
1. **Estabilidad:** La clave primaria no debe cambiar a lo largo del tiempo.
2. **Inmutabilidad:** Evitar claves primarias de negocio que puedan modificarse (por ejemplo: email, CUIT o nombre). Usar identificadores subrogados (`BIGINT GENERATED ALWAYS AS IDENTITY` o `UUIDv7`/`UUIDv4`).
3. **No nulidad y unicidad:** La base de datos debe impedir nulos y duplicados por definición de clave primaria.

---

### 2.3. Definición de Relaciones y Claves Foráneas (FK)
Las claves foráneas garantizan la integridad referencial en todo momento.

```sql
CREATE TABLE contratos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fondo_id BIGINT NOT NULL REFERENCES fondos(id),
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE
);
```

**Tipos de Relaciones:**

| Cardinalidad | Ejemplo en el Dominio | Implementación Técnica |
| :--- | :--- | :--- |
| **1:1** | Usuario y perfil fiscal/legajo | Clave foránea con restricción `UNIQUE`. |
| **1:N** | Un fondo contiene múltiples aportes de capital | Clave foránea en la tabla dependiente (lado N). |
| **N:M** | Clientes que participan en múltiples fondos | **Tabla intermedia formal** con claves foráneas cruzadas y clave primaria compuesta o subrogada. |

> **Regla de oro:** Jamás almacenar listas o arreglos de identificadores (`IDs`) separados por comas o en campos JSON para representar relaciones N:M entre entidades del dominio transaccional.

---

### 2.4. Restricciones de Integridad (Integrity Constraints)
Las reglas críticas de negocio deben quedar garantizadas a nivel de motor de base de datos, independientemente de las validaciones en frontend o backend.

| Restricción | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `PRIMARY KEY` | Identifica unívocamente cada fila. | `id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` |
| `FOREIGN KEY` | Evita referencias a registros huérfanos o inexistentes. | `REFERENCES fondos(id) ON DELETE RESTRICT` |
| `NOT NULL` | Impide campos vacíos en atributos obligatorios. | `monto NUMERIC(16, 2) NOT NULL` |
| `UNIQUE` | Evita registros duplicados en una columna o combinación. | `UNIQUE (fondo_id, codigo_cuenta)` |
| `CHECK` | Valida condiciones de dominio y estados permitidos. | `CHECK (monto > 0)` |

```sql
CREATE TABLE fondos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    objetivo_recaudacion NUMERIC(16, 2) NOT NULL CHECK (objetivo_recaudacion > 0),
    monto_recaudado NUMERIC(16, 2) NOT NULL DEFAULT 0.00 CHECK (monto_recaudado >= 0),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('borrador', 'abierto', 'financiado', 'cerrado', 'liquidado'))
);
```

---

## 3. Proceso de Normalización

### 3.1. Primera Forma Normal (1FN)
- **Principio:** Cada campo debe contener un valor atómico y no deben existir listas, arrays o grupos repetitivos en una misma celda.

**Incorrecto (No 1FN):**
| cliente_id | nombre | telefonos |
| :--- | :--- | :--- |
| 1 | Juan | 381111111, 381222222 |

**Correcto (1FN):**
Tabla `clientes`:
| id | nombre |
| :--- | :--- |
| 1 | Juan |

Tabla `telefonos_cliente`:
| id | cliente_id (FK) | telefono |
| :--- | :--- | :--- |
| 1 | 1 | 381111111 |
| 2 | 1 | 381222222 |

---

### 3.2. Segunda Forma Normal (2FN)
- **Principio:** Estar en 1FN y que todos los atributos que no formen parte de una clave candidata dependan de la **clave primaria completa**, no de una parte de una clave compuesta.

**Ejemplo en Detalle de Aportes/Subscripciones:**
Si la clave es `(fondo_id, aportante_id)`, el nombre del fondo o su tasa de retorno estimada no deben estar en la tabla de aportes, sino en la tabla `fondos`.

- `fondos(fondo_id, nombre, tasa_objetivo)`
- `aportes_fondo(aporte_id, fondo_id, aportante_id, monto, fecha)`

---

### 3.3. Tercera Forma Normal (3FN)
- **Principio:** Estar en 2FN y **no presentar dependencias transitivas** de atributos no clave respecto a la clave candidata. Todo atributo no clave debe depender directamente de la clave primaria.

**Incorrecto (Dependencia transitiva):**
En una tabla de cuentas de fondos:
| cuenta_id | fondo_id | banco_id | banco_nombre |
| :--- | :--- | :--- | :--- |
| 101 | 1 | 15 | Banco Galicia |

El `banco_nombre` depende de `banco_id`, no de `cuenta_id`.

**Correcto (3FN):**
- `bancos(banco_id, nombre)`
- `cuentas_fondos(cuenta_id, fondo_id, banco_id, cbu_cvu)`

---

### 3.4. Forma Normal de Boyce-Codd (BCNF) y Formas Superiores
- **BCNF:** Versión estricta de 3FN donde para cada dependencia funcional no trivial $X \rightarrow Y$, el determinante $X$ debe ser una superclave. Resuelve dependencias entre atributos cuando existen claves candidatas solapadas.
- **4FN y 5FN:** Abordan dependencias multivaluadas y de reunión (join dependencies), aplicables en esquemas de alta complejidad multidimensional.

---

## 4. Síntesis Visual del Proceso de Normalización

```
[Tabla Inicial]
      │
      ▼
   ( 1FN ) ───► Valores atómicos, eliminación de grupos repetitivos y listas.
      │
      ▼
   ( 2FN ) ───► Eliminación de dependencias parciales de claves compuestas.
      │
      ▼
   ( 3FN ) ───► Eliminación de dependencias transitivas (cada atributo depende solo de la PK).
      │
      ▼
  ( BCNF ) ───► Determinantes convertidos en superclaves; eliminación de anomalías solapadas.
```

---

## 5. Reglas de Ingeniería y Buenas Prácticas de Persistencia

1. **Tipos de Datos Rigurosos:**
   - **Moneda y Fondos:** Utilizar `NUMERIC(16, 2)` o `NUMERIC(18, 4)`. **Nunca utilizar `FLOAT` o `DOUBLE`** para importes monetarios o balances debido a errores de redondeo de punto flotante.
   - **Fechas y Horas:** Utilizar `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`) para transacciones y eventos; `DATE` únicamente para fechas puras de calendario sin huso horario.
   - **Identificadores:** `BIGINT` autonumérico (`GENERATED ALWAYS AS IDENTITY`) o `UUID` v7 (ordenables por tiempo).
2. **Convenciones de Nomenclatura:**
   - Nombres en plural para tablas (`fondos`, `clientes`, `transacciones`).
   - `snake_case` estricto en nombres de tablas, columnas y restricciones.
   - Claves foráneas con sufijo `_id` (`fondo_id`, `cliente_id`).
3. **Estrategia de Indexación:**
   - Índices automáticos en claves primarias y campos con restricción `UNIQUE`.
   - Índices explícitos tipo B-Tree en todas las claves foráneas (`FOREIGN KEY`) para optimizar operaciones de `JOIN`.
   - Índices compuestos ordenados para filtros habituales (ej: `(fondo_id, estado, fecha_creacion)`).
4. **Integridad Transaccional (ACID):**
   - Toda operación que involucre movimiento de fondos debe ejecutarse dentro de un bloque transaccional (`BEGIN ... COMMIT / ROLLBACK`).
   - Aplicar el principio de partida doble o ledger inmutable para transferencias de fondos entre cuentas y proyectos.
5. **Políticas de Integridad Referencial (`ON DELETE` / `ON UPDATE`):**
   - En entidades financieras y de fondos, la política por defecto debe ser `RESTRICT` o `NO ACTION` para evitar borrados accidentales en cascada.
   - Implementar borrado lógico (`deleted_at TIMESTAMPTZ`) o archivado histórico para preservar auditoría legal.
6. **Seguridad y Permisos:**
   - Aplicar principio de mínimo privilegio: usuarios de aplicación sin permisos de `DROP` o `ALTER TABLE`.
   - Cifrado en reposo y en tránsito (SSL/TLS obligatorio).

---

## 6. Criterio de Normalización vs. Desnormalización

- **Punto de partida:** El diseño debe iniciar y mantenerse en **3FN** (o BCNF cuando aplique).
- **Desnormalización controlada:** Se prohíbe la desnormalización prematura. Cualquier redundancia o pre-cálculo debe fundamentarse en métricas reales de rendimiento de lectura, implementándose preferentemente mediante:
  - Vistas materializadas (`MATERIALIZED VIEW`) con refresco periódico.
  - Triggers transaccionales estrictos que garanticen la coherencia de datos agregados.

---

## 7. Checklist de Verificación de Diseño de Base de Datos

Antes de escribir sentencias DDL o aplicar migraciones, verificar los siguientes 8 puntos:

- [ ] **1. Entidades:** Cada tabla modela un concepto concreto del negocio con límites claros.
- [ ] **2. Claves:** Identificadas las PKs estables, claves candidatas y claves foráneas.
- [ ] **3. Cardinalidades:** Relaciones 1:1, 1:N y N:M implementadas con la estructura correspondiente (tablas intermedias para N:M).
- [ ] **4. Normalización:** Verificado el cumplimiento de 1FN, 2FN y 3FN (sin redundancias transitivas).
- [ ] **5. Restricciones:** Configuradas restricciones `NOT NULL`, `UNIQUE`, `CHECK` y `FOREIGN KEY`.
- [ ] **6. Consultas e Índices:** Definidas las consultas frecuentes y creados los índices para las FKs y filtros críticos.
- [ ] **7. Integridad Transaccional:** Diseñadas las transacciones para operaciones atómicas de fondos y balances.
- [ ] **8. Historial y Seguridad:** Definidos mecanismos de auditoría, retención de datos históricos y políticas de privilegios mínimos.
