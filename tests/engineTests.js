// engineTests.js - Suite de Pruebas Unitarias del Motor SQL y Convertidor
// Conforme a la Constitución del Proyecto (Art. VI.3)

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

console.log('\n--- INICIANDO SUITE DE PRUEBAS DE EXPO-DB BÁSICO ---\n');

// 1. SELECT *
console.log('1. SELECT * y Proyección Simple');
{
  const res = engine.execute('SELECT * FROM ESTUDIANTES;');
  assert(res.success === true, 'Ejecución SELECT * exitosa');
  assert(res.rowCount === 12, 'Número de tuplas retornadas es 12');
}

// 2. Proyección con Alias
console.log('\n2. Proyección de Columnas y Alias (AS)');
{
  const res = engine.execute('SELECT nombre, promedio AS nota FROM ESTUDIANTES;');
  assert(res.success === true, 'Ejecución con alias exitosa');
  assert(res.columns.some(c => c.alias === 'nota'), 'Columna proyectada tiene alias "nota"');
  assert(res.rows[0].nota !== undefined, 'Tupla contiene la propiedad con el alias "nota"');
}

// 3. DISTINCT
console.log('\n3. Cláusula DISTINCT');
{
  const res = engine.execute('SELECT DISTINCT carrera FROM ESTUDIANTES;');
  assert(res.success === true, 'Ejecución DISTINCT exitosa');
  assert(res.rowCount === 4, 'Retorna exactamente 4 carreras únicas (Sistemas, Industrial, Medicina, Derecho)');
}

// 4. Operador =
console.log('\n4. Operador = (Igualdad)');
{
  const res = engine.execute("SELECT * FROM ESTUDIANTES WHERE carrera = 'Medicina';");
  assert(res.success === true, 'Ejecución = exitosa');
  assert(res.rowCount === 3, 'Retorna 3 estudiantes de Medicina (Diana, Helena, Laura)');
  assert(res.rows.every(r => r.carrera === 'Medicina'), 'Todos los resultados son de Medicina');
}

// 5. Operadores <> y !=
console.log('\n5. Operadores <> y != (Desigualdad)');
{
  const res1 = engine.execute("SELECT * FROM ESTUDIANTES WHERE carrera <> 'Sistemas';");
  const res2 = engine.execute("SELECT * FROM ESTUDIANTES WHERE carrera != 'Sistemas';");
  assert(res1.success && res2.success, 'Soporte tanto de <> como de !=');
  assert(res1.rowCount === 8 && res2.rowCount === 8, 'Ambos operadores retornan exactamente 8 filas no-Sistemas');
}

// 6. Operadores <, >, <=, >=
console.log('\n6. Operadores Numéricos (<, >, <=, >=)');
{
  const resGte = engine.execute("SELECT * FROM ESTUDIANTES WHERE promedio >= 4.5;");
  assert(resGte.success === true, 'Filtro >= 4.5');
  assert(resGte.rowCount === 5, 'Retorna 5 estudiantes con promedio >= 4.5');

  const resLt = engine.execute("SELECT * FROM ESTUDIANTES WHERE semestre < 4;");
  assert(resLt.success === true, 'Filtro < 4');
  assert(resLt.rowCount === 3, 'Retorna 3 estudiantes de semestre < 4 (Esteban, Helena, Kevin)');
}

// 7. Conectores Lógicos AND y OR con Paréntesis
console.log('\n7. Lógica Booleana (AND, OR, Paréntesis)');
{
  const resAnd = engine.execute("SELECT * FROM ESTUDIANTES WHERE carrera = 'Sistemas' AND promedio >= 4.5;");
  assert(resAnd.success === true, 'AND simple');
  assert(resAnd.rowCount === 2, '2 estudiantes de Sistemas con promedio >= 4.5 (Alejandro, Juliana)');

  const resGrouped = engine.execute("SELECT * FROM ESTUDIANTES WHERE (carrera = 'Sistemas' OR carrera = 'Medicina') AND promedio >= 4.5;");
  assert(resGrouped.success === true, 'AND con OR agrupado entre paréntesis');
  assert(resGrouped.rowCount === 5, '5 estudiantes (2 de Sistemas + 3 de Medicina con promedio >= 4.5)');
}

// 8. Operador BETWEEN
console.log('\n8. Operador BETWEEN');
{
  const resBetween = engine.execute("SELECT * FROM ESTUDIANTES WHERE semestre BETWEEN 4 AND 6;");
  assert(resBetween.success === true, 'Filtro BETWEEN 4 AND 6');
  assert(resBetween.rowCount === 6, 'Retorna 6 estudiantes (inclusivo en extremos 4 y 6)');
}

// 9. Operador IN
console.log('\n9. Operador IN');
{
  const resIn = engine.execute("SELECT * FROM ESTUDIANTES WHERE ciudad IN ('Cali', 'Barranquilla');");
  assert(resIn.success === true, 'Filtro IN con lista');
  assert(resIn.rowCount === 3, 'Retorna 3 estudiantes residentes en Cali o Barranquilla');
}

// 10. Operador LIKE con % y _
console.log('\n10. Operador LIKE (% y _)');
{
  const resLikePct = engine.execute("SELECT * FROM ESTUDIANTES WHERE nombre LIKE 'A%';");
  assert(resLikePct.success === true, 'Filtro LIKE con comodín %');
  assert(resLikePct.rowCount === 1, 'Alejandro inicia por "A"');

  const resLikeUnderscore = engine.execute("SELECT * FROM CURSOS WHERE id_curso LIKE 'SIS___';");
  assert(resLikeUnderscore.success === true, 'Filtro LIKE con comodín _');
  assert(resLikeUnderscore.rowCount === 2, 'Cursos SIS101 y SIS102 cumplen la longitud fija 6');
}

// 11. Cláusula ORDER BY
console.log('\n11. Cláusula ORDER BY (ASC y DESC)');
{
  const resAsc = engine.execute("SELECT nombre, promedio FROM ESTUDIANTES ORDER BY promedio ASC;");
  assert(resAsc.rows[0].promedio <= resAsc.rows[resAsc.rows.length - 1].promedio, 'ORDER BY ASC ordena de menor a mayor');

  const resDesc = engine.execute("SELECT nombre, promedio FROM ESTUDIANTES ORDER BY promedio DESC;");
  assert(resDesc.rows[0].promedio >= resDesc.rows[resDesc.rows.length - 1].promedio, 'ORDER BY DESC ordena de mayor a menor');
  assert(resDesc.rows[0].nombre === 'Laura', 'Laura tiene el mayor promedio (4.9)');
}

// 12. Restricciones Constitucionales (Art. II.2)
console.log('\n12. Restricciones Constitucionales (Artículo II.2)');
{
  const testCases = [
    { sql: 'SELECT * FROM ESTUDIANTES JOIN CURSOS ON 1=1;', label: 'JOIN rechazado' },
    { sql: 'SELECT COUNT(*) FROM ESTUDIANTES;', label: 'COUNT() rechazado' },
    { sql: 'SELECT carrera, AVG(promedio) FROM ESTUDIANTES GROUP BY carrera;', label: 'GROUP BY rechazado' },
    { sql: 'SELECT * FROM ESTUDIANTES HAVING promedio > 4;', label: 'HAVING rechazado' },
    { sql: "INSERT INTO ESTUDIANTES VALUES (999, 'Test');", label: 'INSERT rechazado' },
    { sql: "DELETE FROM ESTUDIANTES WHERE id = 101;", label: 'DELETE rechazado' },
    { sql: 'DROP TABLE ESTUDIANTES;', label: 'DROP rechazado' }
  ];

  testCases.forEach(tc => {
    const res = engine.execute(tc.sql);
    assert(res.success === false && res.isConstitutionalViolation === true, `Constitución: ${tc.label}`);
  });
}

// 13. Convertidor a Álgebra Relacional (π y σ)
console.log('\n13. Álgebra Relacional (Convertidor π y σ)');
{
  const parsed = engine.parseQuery("SELECT nombre, carrera FROM ESTUDIANTES WHERE carrera = 'Sistemas' AND promedio >= 4.0;");
  const algebra = AlgebraConverter.convert(parsed);
  console.log('  [DEBUG algebra.text]:', algebra.text);
  assert(algebra.text.includes('π_{nombre, carrera}'), 'Contiene operador π con columnas proyectadas');
  assert(algebra.text.includes('carrera = \'Sistemas\'') && algebra.text.includes('promedio ≥ 4'), 'Contiene operador σ con condiciones');
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
