# ⚡ ExpoDB Básico — Plataforma Educativa Oracle SQL (SELECT)

> Plataforma web interactiva para la enseñanza y dominio exclusivo de la sentencia `SELECT` básica en **Oracle SQL**, con especial énfasis en la cláusula `WHERE`, operadores de comparación, lógicos, rangos y deduplicación.

Desarrollada bajo las directrices estrictas de la **Constitución del Proyecto** (`Constitucion.md`).

---

## 🌟 Características Principales

1. **Motor Emulador Oracle SQL en JS Puro (`oracleSqlEngine.js`)**:
   - Compilación y ejecución de consultas `SELECT [DISTINCT] (columnas | *) FROM tabla [WHERE ...] [ORDER BY ...]`.
   - Soporte completo para operadores: `=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`, `AND`, `OR`, `NOT`, `BETWEEN ... AND ...`, `IN (...)`, `LIKE` (`%` y `_`).
   - Validación constitucional estricta (Art. II.2): Restricción pedagógica amigable ante `JOIN`, `GROUP BY`, `COUNT()`, DML o DDL.
2. **Visualizador Animado del Pipeline Lógico (`visualizer.js`)**:
   - Muestra el orden real de evaluación interna de Oracle:
     $$\text{FROM} \longrightarrow \text{WHERE} \longrightarrow \text{DISTINCT} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY}$$
   - Resaltado interactivo de tuplas que pasan el filtro (verde) y tuplas descartadas (rojo).
3. **Traductor a Álgebra Relacional Canónica (`algebraConverter.js`)**:
   - Traduce cualquier consulta a su expresión formal en álgebra relacional con operadores puros de Proyección ($\pi$) y Selección ($\sigma$).
4. **🎤 Modo Exposición Dual para Profesores / Ponencias (`presentationComponent.js`)**:
   - Activable con la tecla **`F5`** o **`Alt + E`**.
   - Cada tema cuenta con 2 fases:
     - **Fase 1 (Concepto):** Diapositiva a pantalla completa con tipografía gigante, ideas clave y regla mnemotécnica para explicar a la clase.
     - **Fase 2 (Demostración en Vivo):** Consulta interactiva con editor SQL en tiempo real y visualizador animado sobre la base de datos real.
5. **Playground Libre (SQL Developer Worksheet)**:
   - Consola interactiva acumulativa con historial, atajo `Ctrl + Enter`, chips de pruebas rápidas e inspección de esquema.
6. **Quiz Final Evaluativo**:
   - 7 preguntas alineadas 1:1 con cada sección temática, retroalimentación instantánea explicativa y tarjeta de certificación final.

---

## 📚 Estructura de Secciones (Art. IV)

1. `SELECT` y `FROM` (Sintaxis básica y alias `AS`)
2. `DISTINCT` (Deduplicación de tuplas)
3. `WHERE` y operadores de comparación (`=`, `<`, `>`, `<=`, `>=`, `<>`, `!=`)
4. `AND` / `OR` (Lógica booleana compuesta y precedencia con paréntesis)
5. `BETWEEN` (Rangos cerrados e inclusivos)
6. `IN` (Pertenencia a conjuntos discretos)
7. `LIKE` (Comodines `%` y `_`)
8. **Playground Libre** (Consola interactiva acumulativa)
9. **Quiz Final** (Evaluación y certificación)

---

## 🗄️ Esquema Oracle HR (`universityDb.js` / `hrDb.js`)

- **`EMPLOYEES`**: 19 tuplas maestros con datos de empleados (`employee_id`, `first_name`, `last_name`, `email`, `phone_number`, `hire_date`, `job_id`, `salary`, `commission_pct`, `manager_id`, `department_id`).
- **`DEPARTMENTS`**: Departamentos operativos y administrativos (`department_id`, `department_name`, `manager_id`, `location_id`).
- **`JOBS`**: Cargos con salarios mínimos y máximos (`job_id`, `job_title`, `min_salary`, `max_salary`).
- **`LOCATIONS`**: Sedes físicas de la organización (`location_id`, `street_address`, `postal_code`, `city`, `state_province`, `country_id`).
- **`COUNTRIES`**: Países asignados a regiones (`country_id`, `country_name`, `region_id`).
- **`REGIONS`**: Regiones mundiales de operación (`region_id`, `region_name`).
- **`JOB_HISTORY`**: Historial cronológico de puestos (`employee_id`, `start_date`, `end_date`, `job_id`, `department_id`).

---

## 🧪 Pruebas Unitarias Automatizadas

El proyecto cuenta con una suite de **41 pruebas unitarias** que cubren el 100% de los operadores y restricciones constitucionales:

```bash
node tests/engineTests.js
```

Resultado:
```text
========================================
TOTAL PRUEBAS: 41
PASADAS: 41
FALLADAS: 0
========================================
🎉 TODAS LAS PRUEBAS CONSTITUCIONALES PASARON CON ÉXITO.
```

---

## 🚀 Despliegue y Ejecución Local

No requiere backend, base de datos externa ni dependencias pesadas. Es 100% estático y desplegable en Vercel, Netlify o GitHub Pages.

Para ejecutar localmente con Python o Node:

```bash
# Con Python
python -m http.server 8080

# O con npx serve
npx serve .
```

Luego abre tu navegador en:
```
http://localhost:8080
```

---

## 👥 Créditos Académicos

- **Presentador / Estudiante:** Juan Sebastián Patiño
- **Docente:** Ing. Amílkar Sierra
- **Programa:** Ingeniería de Sistemas

---

## 📜 Licencia y Constitución

Proyecto gobernado por la **Constitución del Proyecto** (`Constitucion.md`).
Repositorio Oficial: [https://github.com/LxrdSxbas/SelectBasicoFinal](https://github.com/LxrdSxbas/SelectBasicoFinal)
