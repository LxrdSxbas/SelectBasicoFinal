// engineTests.js - Suite de Pruebas Unitarias del Motor SQL y Convertidor
// Conforme a la Constitución del Proyecto (Art. VI.3) y Esquema Oficial Oracle HR

import { OracleSqlEngine } from '../js/engine/oracleSqlEngine.js';
import { AlgebraConverter } from '../js/engine/algebraConverter.js';
import { universityDb } from '../js/data/universityDb.js';

const engine = new OracleSqlEngine(universityDb);
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    testsFailed++;
  }
}

console.log('\n--- INICIANDO SUITE DE PRUEBAS DE EXPO-DB BÁSICO (ESQUEMA ORACLE HR) ---\n');

// 1. SELECT *
console.log('1. SELECT * y Proyección Simple');
{
  const res = engine.execute('SELECT * FROM EMPLOYEES;');
  assert(res.success === true, 'Ejecución SELECT * exitosa');
  assert(res.rowCount === 19, `Número de tuplas retornadas es 19 (obtenido ${res.rowCount})`);
}

// 2. Proyección con Alias
console.log('\n2. Proyección de Columnas y Alias (AS)');
{
  const res = engine.execute('SELECT first_name, salary AS salario FROM EMPLOYEES;');
  assert(res.success === true, 'Ejecución con alias exitosa');
  assert(res.columns.some(c => c.alias === 'salario'), 'Columna proyectada tiene alias "salario"');
  assert(res.rows[0].salario !== undefined, 'Tupla contiene la propiedad con el alias "salario"');
}

// 3. DISTINCT
console.log('\n3. Cláusula DISTINCT');
{
  const res = engine.execute('SELECT DISTINCT job_id FROM EMPLOYEES;');
  assert(res.success === true, 'Ejecución DISTINCT exitosa');
  assert(res.rowCount === 10, `Retorna exactamente 10 cargos únicos en EMPLOYEES (obtenido ${res.rowCount})`);
}

// 4. Operador =
console.log('\n4. Operador = (Igualdad)');
{
  const res = engine.execute("SELECT * FROM EMPLOYEES WHERE job_id = 'IT_PROG';");
  assert(res.success === true, 'Ejecución = exitosa');
  assert(res.rowCount === 5, `Retorna 5 empleados IT_PROG (obtenido ${res.rowCount})`);
  assert(res.rows.every(r => r.job_id === 'IT_PROG'), 'Todos los resultados son IT_PROG');
}

// 5. Operadores <> y !=
console.log('\n5. Operadores <> y != (Desigualdad)');
{
  const res1 = engine.execute("SELECT * FROM EMPLOYEES WHERE job_id <> 'IT_PROG';");
  const res2 = engine.execute("SELECT * FROM EMPLOYEES WHERE job_id != 'IT_PROG';");
  assert(res1.success && res2.success, 'Soporte tanto de <> como de !=');
  assert(res1.rowCount === 14 && res2.rowCount === 14, 'Ambos operadores retornan exactamente 14 filas no-IT_PROG');
}

// 6. Operadores <, >, <=, >=
console.log('\n6. Operadores Numéricos (<, >, <=, >=)');
{
  const resGte = engine.execute("SELECT * FROM EMPLOYEES WHERE salary >= 10000;");
  assert(resGte.success === true, 'Filtro >= 10000');
  assert(resGte.rowCount === 5, `Retorna 5 empleados con salary >= 10000 (obtenido ${resGte.rowCount})`);

  const resLt = engine.execute("SELECT * FROM EMPLOYEES WHERE salary < 3000;");
  assert(resLt.success === true, 'Filtro < 3000');
  assert(resLt.rowCount === 2, `Retorna 2 empleados con salary < 3000 (Randall y Peter) (obtenido ${resLt.rowCount})`);
}

// 7. Conectores Lógicos AND y OR con Paréntesis
console.log('\n7. Lógica Booleana (AND, OR, Paréntesis)');
{
  const resAnd = engine.execute("SELECT * FROM EMPLOYEES WHERE job_id = 'IT_PROG' AND salary >= 5000;");
  assert(resAnd.success === true, 'AND simple');
  assert(resAnd.rowCount === 2, `2 programadores con salario >= 5000 (Alexander, Bruce) (obtenido ${resAnd.rowCount})`);

  const resGrouped = engine.execute("SELECT * FROM EMPLOYEES WHERE (department_id = 50 OR department_id = 60) AND salary >= 5000;");
  assert(resGrouped.success === true, 'AND con OR agrupado entre paréntesis');
  assert(resGrouped.rowCount === 3, `3 empleados (Matthew en Dept 50, Alexander y Bruce en Dept 60) (obtenido ${resGrouped.rowCount})`);
}

// 8. Operador BETWEEN
console.log('\n8. Operador BETWEEN');
{
  const resBetween = engine.execute("SELECT * FROM EMPLOYEES WHERE salary BETWEEN 4000 AND 9000;");
  assert(resBetween.success === true, 'Filtro BETWEEN 4000 AND 9000');
  assert(resBetween.rowCount === 10, `Retorna 10 empleados (inclusivo en extremos 4000 y 9000) (obtenido ${resBetween.rowCount})`);
}

// 9. Operador IN
console.log('\n9. Operador IN');
{
  const resIn = engine.execute("SELECT * FROM EMPLOYEES WHERE department_id IN (10, 20, 90);");
  assert(resIn.success === true, 'Filtro IN con lista');
  assert(resIn.rowCount === 6, `Retorna 6 empleados en departamentos 10, 20 o 90 (obtenido ${resIn.rowCount})`);
}

// 10. Operador LIKE con % y _
console.log('\n10. Operador LIKE (% y _)');
{
  const resLikePct = engine.execute("SELECT * FROM EMPLOYEES WHERE first_name LIKE 'D%';");
  assert(resLikePct.success === true, 'Filtro LIKE con comodín %');
  assert(resLikePct.rowCount === 2, 'David y Diana inician por "D"');

  const resLikeUnderscore = engine.execute("SELECT * FROM JOBS WHERE job_id LIKE 'SA____';");
  assert(resLikeUnderscore.success === true, 'Filtro LIKE con comodín _');
  assert(resLikeUnderscore.rowCount === 2, 'Cargos SA_MAN y SA_REP cumplen longitud fija 6');
}

// 11. Cláusula ORDER BY
console.log('\n11. Cláusula ORDER BY (ASC y DESC)');
{
  const resAsc = engine.execute("SELECT first_name, salary FROM EMPLOYEES ORDER BY salary ASC;");
  assert(resAsc.rows[0].salary <= resAsc.rows[resAsc.rows.length - 1].salary, 'ORDER BY ASC ordena de menor a mayor');

  const resDesc = engine.execute("SELECT first_name, salary FROM EMPLOYEES ORDER BY salary DESC;");
  assert(resDesc.rows[0].salary >= resDesc.rows[resDesc.rows.length - 1].salary, 'ORDER BY DESC ordena de mayor a menor');
  assert(resDesc.rows[0].first_name === 'Steven', 'Steven King tiene el mayor salario (24000)');
}

// 12. Restricciones Constitucionales (Art. II.2)
console.log('\n12. Restricciones Constitucionales (Artículo II.2)');
{
  const testCases = [
    { sql: 'SELECT * FROM EMPLOYEES JOIN DEPARTMENTS ON 1=1;', label: 'JOIN rechazado' },
    { sql: 'SELECT COUNT(*) FROM EMPLOYEES;', label: 'COUNT() rechazado' },
    { sql: 'SELECT department_id, AVG(salary) FROM EMPLOYEES GROUP BY department_id;', label: 'GROUP BY rechazado' },
    { sql: 'SELECT * FROM EMPLOYEES HAVING salary > 4000;', label: 'HAVING rechazado' },
    { sql: "INSERT INTO EMPLOYEES VALUES (999, 'Test');", label: 'INSERT rechazado' },
    { sql: "DELETE FROM EMPLOYEES WHERE employee_id = 100;", label: 'DELETE rechazado' },
    { sql: 'DROP TABLE EMPLOYEES;', label: 'DROP rechazado' }
  ];

  testCases.forEach(tc => {
    const res = engine.execute(tc.sql);
    assert(res.success === false && res.isConstitutionalViolation === true, `Constitución: ${tc.label}`);
  });
}

// 13. Convertidor a Álgebra Relacional (π y σ)
console.log('\n13. Álgebra Relacional (Convertidor π y σ)');
{
  const parsed = engine.parseQuery("SELECT first_name, salary FROM EMPLOYEES WHERE job_id = 'IT_PROG' AND salary >= 5000;");
  const algebra = AlgebraConverter.convert(parsed);
  console.log('  [DEBUG algebra.text]:', algebra.text);
  assert(algebra.text.includes('π_{first_name, salary}'), 'Contiene operador π con columnas proyectadas');
  assert(algebra.text.includes("job_id = 'IT_PROG'") && algebra.text.includes('salary ≥ 5000'), 'Contiene operador σ con condiciones');
  assert(!algebra.text.includes('⨝'), 'NUNCA contiene operador join (⨝)');
}

console.log(`\n========================================`);
console.log(`TOTAL PRUEBAS: ${testsPassed + testsFailed}`);
console.log(`PASADAS: ${testsPassed}`);
console.log(`FALLADAS: ${testsFailed}`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS PRUEBAS CONSTITUCIONALES PASARON CON ÉXITO.\n');
}
