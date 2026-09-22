# CONSTITUCIÓN DEL PROYECTO — ExpoDB Básico
### Plataforma educativa de sentencias SELECT básicas (Oracle SQL)
 
> Este documento es la fuente única de verdad para el desarrollo del proyecto.
> Cualquier decisión de diseño, alcance o implementación debe remitirse a estos artículos.
> Prioridad: cuando exista conflicto entre este documento y una instrucción puntual, **este documento gobierna**, salvo que el usuario lo modifique explícitamente.
 
---
 
## ARTÍCULO I — Propósito y Misión
 
ExpoDB Básico es una plataforma web educativa e interactiva diseñada para enseñar **exclusivamente** la sentencia `SELECT` básica en Oracle SQL, con énfasis en la cláusula `WHERE` y sus operadores lógicos y de comparación fundamentales.
 
**Misión:** que un estudiante sin conocimientos previos de SQL pueda, al recorrer la plataforma, entender y escribir consultas `SELECT` que usen `WHERE`, `AND`, `OR`, `IN`, `LIKE`, `BETWEEN` y `DISTINCT` con confianza.
 
---
 
## ARTÍCULO II — Alcance del Contenido
 
### II.1 — Incluido (temario cerrado)
 
1. `SELECT` / `FROM` — sintaxis básica, selección de columnas, alias (`AS`)
2. `DISTINCT` — eliminación de duplicados
3. `WHERE` — condiciones y operadores de comparación (`=`, `<`, `>`, `<=`, `>=`, `<>`/`!=`)
4. `AND` / `OR` — combinación de condiciones, precedencia lógica, uso de paréntesis
5. `BETWEEN ... AND ...` — rangos numéricos y de fechas
6. `IN (...)` — listas de valores
7. `LIKE` con comodines `%` y `_`
8. `ORDER BY` — ordenamiento ascendente/descendente (se incluye por ser inseparable de la práctica de SELECT, aunque no esté en la lista original del usuario)
### II.2 — Explícitamente excluido (fuera de alcance)
 
Queda **prohibido** implementar, documentar o insinuar disponibilidad de:
 
- JOINs de cualquier tipo (INNER, LEFT, RIGHT, FULL, CROSS)
- Subconsultas (subqueries, sentencias anidadas)
- Funciones de agregación y `GROUP BY` / `HAVING`
- DML: `INSERT`, `UPDATE`, `DELETE`, `MERGE`
- DDL: `CREATE`, `ALTER`, `DROP`
- Funciones propias de Oracle avanzadas: `NVL`, `DECODE`, `CASE`, concatenación `||`, funciones de fecha/cadena complejas
- `ROWNUM`, `FETCH FIRST`, paginación
- Tabla `DUAL` (salvo mención textual opcional de una línea, sin ejercicios)
- Álgebra relacional con operador de unión (⨝ join) — el conversor solo debe producir **π (proyección)** y **σ (selección)**
Si en algún momento del desarrollo surge la tentación de "agregar solo un poquito más" (ej. un JOIN simple "para que se vea completo"), esto se considera una **violación de esta constitución** y debe rechazarse.
 
---
 
## ARTÍCULO III — Arquitectura Técnica
 
### III.1 — Estructura de carpetas (obligatoria)
 
```
expodb-basico/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── visualizer.css
└── js/
    ├── data/
    │   └── universityDb.js
    ├── engine/
    │   ├── oracleSqlEngine.js
    │   └── algebraConverter.js
    ├── components/
    │   ├── visualizer.js
    │   ├── playground.js
    │   └── quiz.js
    └── app.js
```
 
### III.2 — Responsabilidad de cada módulo
 
| Archivo | Responsabilidad | Límites |
|---|---|---|
| `universityDb.js` | Datos de ejemplo en memoria (2–3 tablas simples: `ESTUDIANTES`, `CURSOS`, opcionalmente `MATRICULAS`) | No modelar relaciones que impliquen necesidad de JOIN en los ejercicios |
| `oracleSqlEngine.js` | Parsear y ejecutar `SELECT` con `WHERE`, `DISTINCT`, `ORDER BY`; evaluar predicados `IN`, `LIKE`, `BETWEEN`, `AND`/`OR` | No debe aceptar ni intentar parsear sentencias fuera del alcance (Art. II.2); ante sentencia fuera de alcance, debe responder con mensaje educativo, no error críptico |
| `algebraConverter.js` | Traducir la sentencia SELECT ejecutada a notación π (proyección) y σ (selección) | Nunca generar notación de join (⨝) |
| `visualizer.js` | Animar el pipeline lógico: `FROM → WHERE → DISTINCT → SELECT → ORDER BY` | El pipeline debe reflejar el orden lógico real de evaluación de Oracle, no el orden de escritura |
| `playground.js` | Consola interactiva tipo SQL Developer donde el usuario escribe y ejecuta sus propias sentencias | Debe validar contra el alcance antes de ejecutar |
| `quiz.js` | Cuestionario de retroalimentación instantánea, alineado 1:1 con las 6–7 secciones del temario | Cada pregunta debe mapear a un ítem del Art. II.1 |
| `app.js` | Inicialización, estado global, navegación entre secciones | — |
 
### III.3 — Identidad visual
 
Se conserva la paleta temática Oracle/Cyber-académica del proyecto original:
- Rojo Oracle (`#f80000`) como acento
- Fondo dark obsidian
- Cian y ámbar como colores secundarios/semánticos
- Tipografías: Outfit (encabezados), Inter (cuerpo), JetBrains Mono (código SQL)
---
 
## ARTÍCULO IV — Estructura de Navegación (index.html)
 
La navegación principal debe exponer **exactamente estas secciones**, en este orden, sin añadir ni quitar:
 
1. Introducción — `SELECT` y `FROM`
2. `DISTINCT`
3. `WHERE` y operadores de comparación
4. `AND` / `OR`
5. `BETWEEN`
6. `IN`
7. `LIKE`
8. Playground libre (consola interactiva, acumulativa — usa todo lo anterior)
9. Quiz final
Cada sección de contenido (1–7) debe seguir esta plantilla fija:
1. Explicación corta (2–4 párrafos máximo)
2. Ejemplo de sintaxis Oracle SQL
3. Visualización animada del pipeline de ejecución
4. Al menos un ejercicio práctico en mini-consola embebida
---
 
## ARTÍCULO V — Principios de Diseño Pedagógico
 
1. **Progresión estricta:** cada sección debe poder resolverse solo con lo enseñado hasta ese punto. No se permite usar `IN` en un ejemplo de la sección de `WHERE` básico si `IN` aún no fue introducido.
2. **Ejemplos con datos reales del dataset:** todos los ejemplos de código deben ejecutarse contra `universityDb.js`, nunca datos inventados ad-hoc que no existen en el motor.
3. **Feedback inmediato:** todo ejercicio en el playground debe mostrar resultado tabular o mensaje de error educativo en menos de 1 segundo, sin recargar página.
4. **Sin jerga sin explicar:** términos como "predicado", "operador lógico" o "proyección" deben introducirse con una definición breve la primera vez que aparecen.
---
 
## ARTÍCULO VI — Reglas para Antigravity (agente de desarrollo)
 
1. Antes de implementar cualquier feature, verificar contra el **Artículo II** si está dentro del alcance.
2. Si una petición del usuario durante el desarrollo pide algo del Artículo II.2 (fuera de alcance), Antigravity debe señalar el conflicto con esta constitución antes de proceder, no implementarlo silenciosamente.
3. El motor SQL (`oracleSqlEngine.js`) es el componente crítico: debe tener cobertura de pruebas manuales para cada operador (`=`, `<>`, `AND`, `OR`, `IN`, `LIKE` con `%` y `_`, `BETWEEN`) antes de considerarse completo.
4. No se elimina el modo presentación (`presentation.css` / `presentation.js`) salvo que el usuario lo pida explícitamente — se mantiene como opcional, pero no es prioridad de esta fase.
5. El resultado final debe ser desplegable de la misma forma que el proyecto original (ej. Vercel), sin dependencias de backend — todo debe ejecutarse en el navegador (motor SQL emulado en JS puro, sin conexión a una base de datos real).
---
 
## ARTÍCULO VII — Enmiendas
 
Este documento puede modificarse únicamente por instrucción explícita del usuario. Ninguna sección puede ampliarse "por iniciativa propia" del agente de desarrollo durante la implementación.
 
---
 
**Versión:** 1.0
**Alcance:** SELECT básico (WHERE, AND, OR, IN, LIKE, BETWEEN, DISTINCT)
**Estado:** Listo para entregarse a Antigravity como especificación rectora del proyecto