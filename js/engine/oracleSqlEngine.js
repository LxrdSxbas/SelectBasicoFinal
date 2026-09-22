// oracleSqlEngine.js - Motor emulador de Oracle SQL Básico
// Conforme a la Constitución del Proyecto (Art. II.1, II.2, III.2 y VI.3)

import { universityDb } from '../data/universityDb.js';

// Lista de restricciones del Artículo II.2 de la Constitución
const CONSTITUTIONAL_RESTRICTIONS = [
  {
    regex: /\b(INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|CROSS\s+JOIN|JOIN)\b/i,
    topic: 'JOINs (Uniones de Tablas)',
    message: 'El uso de JOINs está estrictamente fuera del alcance de ExpoDB Básico (Artículo II.2). Esta plataforma está dedicada a dominar el SELECT sobre tablas individuales.'
  },
  {
    regex: /\bGROUP\s+BY\b/i,
    topic: 'GROUP BY (Agrupamiento)',
    message: 'La cláusula GROUP BY y la agregación están fuera del temario constitucional (Artículo II.2). Para consultas básicas nos enfocamos en filtrado fila a fila con WHERE.'
  },
  {
    regex: /\bHAVING\b/i,
    topic: 'HAVING',
    message: 'HAVING es para filtrar grupos. Está prohibido por el Artículo II.2. En consultas básicas de una sola tabla, el filtrado se realiza exclusivamente con WHERE.'
  },
  {
    regex: /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i,
    topic: 'Funciones de Agregación',
    message: 'Las funciones de agregación (COUNT, SUM, AVG, etc.) no forman parte de este nivel (Artículo II.2). El objetivo es dominar la proyección directa y el filtrado WHERE.'
  },
  {
    regex: /\b(INSERT|UPDATE|DELETE|MERGE)\b/i,
    topic: 'DML (Modificación de Datos)',
    message: 'Las sentencias de modificación de datos (INSERT, UPDATE, DELETE) están excluidas por la Constitución (Artículo II.2). ExpoDB se enfoca en consulta y recuperación de datos (SELECT).'
  },
  {
    regex: /\b(CREATE|ALTER|DROP|TRUNCATE)\b/i,
    topic: 'DDL (Definición de Esquema)',
    message: 'Las instrucciones DDL (CREATE, ALTER, DROP) no corresponden al alcance educativo de sentencias SELECT básicas (Artículo II.2).'
  },
  {
    regex: /\b(NVL|DECODE|CASE)\b/i,
    topic: 'Funciones Condicionales Avanzadas',
    message: 'Funciones como NVL, DECODE o expresiones CASE están excluidas por el Artículo II.2 para mantener el foco en la lógica de predicados básica.'
  },
  {
    regex: /\b(ROWNUM|FETCH\s+FIRST)\b/i,
    topic: 'Paginación (ROWNUM / FETCH FIRST)',
    message: 'La paginación con ROWNUM o FETCH FIRST está excluida por el Artículo II.2.'
  },
  {
    regex: /\bSELECT\b[\s\S]*\bFROM\b[\s\S]*\bSELECT\b/i,
    topic: 'Subconsultas (Subqueries)',
    message: 'Las subconsultas anidadas están prohibidas por el Artículo II.2 de la Constitución. Debe formularse una consulta plana simple.'
  }
];

export class OracleSqlEngine {
  constructor(db = universityDb) {
    this.db = db;
  }

  /**
   * Ejecuta una consulta SQL en texto plano y retorna el resultado junto a la traza pedagógica.
   * @param {string} sqlText
   * @returns {Object} Resultado de la ejecución
   */
  execute(sqlText) {
    const startTime = performance.now();

    if (!sqlText || !sqlText.trim()) {
      return {
        success: false,
        error: 'Por favor ingresa una sentencia SQL para ejecutar.',
        isEmpty: true
      };
    }

    const cleanSql = sqlText.trim().replace(/;+\s*$/, '');

    // 1. Verificación contra el Artículo II.2 de la Constitución
    for (const restriction of CONSTITUTIONAL_RESTRICTIONS) {
      if (restriction.regex.test(cleanSql)) {
        return {
          success: false,
          isConstitutionalViolation: true,
          topic: restriction.topic,
          error: `🚫 [Constitución Art. II.2] ${restriction.message}`,
          rawSql: cleanSql
        };
      }
    }

    // 2. Parseo de la consulta
    let parsed;
    try {
      parsed = this.parseQuery(cleanSql);
    } catch (err) {
      return {
        success: false,
        error: `Error de sintaxis SQL: ${err.message}`,
        rawSql: cleanSql
      };
    }

    // 3. Ejecución del pipeline lógico según el estándar Oracle:
    // ORDEN REAL: FROM -> WHERE -> DISTINCT -> SELECT -> ORDER BY
    const pipelineTrace = [];

    // FASE 1: FROM
    const tableName = parsed.fromTable.toUpperCase();
    const tableDef = this.db.tables[tableName];

    if (!tableDef) {
      const validTables = Object.keys(this.db.tables).join(', ');
      return {
        success: false,
        error: `La tabla "${parsed.fromTable}" no existe en la base de datos. Tablas disponibles: ${validTables}.`,
        rawSql: cleanSql
      };
    }

    // Clonar filas originales
    const initialRows = tableDef.rows.map((r, idx) => ({ ...r, __originalIndex: idx }));
    pipelineTrace.push({
      step: 'FROM',
      stepName: '1. Carga de Datos (FROM)',
      description: `Se accede a la tabla física "${tableName}" y se cargan sus ${initialRows.length} tuplas completas en memoria.`,
      table: tableName,
      inputRowsCount: initialRows.length,
      outputRows: [...initialRows],
      columns: tableDef.columns.map(c => c.name)
    });

    // FASE 2: WHERE (Filtro relacional: selección σ)
    let filteredRows = [];
    const rowDecisions = [];

    if (parsed.whereClause) {
      for (const row of initialRows) {
        const evaluation = this.evaluateCondition(parsed.whereClause, row);
        rowDecisions.push({
          rowId: row[tableDef.primaryKey] || row.id || row.id_curso || row.__originalIndex,
          passed: evaluation.passed,
          reason: evaluation.reason
        });
        if (evaluation.passed) {
          filteredRows.push(row);
        }
      }

      pipelineTrace.push({
        step: 'WHERE',
        stepName: '2. Filtrado de Tuplas (WHERE)',
        description: `Se evalúa el predicado condicional fila por fila. Sobreviven ${filteredRows.length} de ${initialRows.length} tuplas.`,
        clause: parsed.whereRaw,
        inputRowsCount: initialRows.length,
        outputRowsCount: filteredRows.length,
        outputRows: [...filteredRows],
        decisions: rowDecisions,
        discardedCount: initialRows.length - filteredRows.length
      });
    } else {
      filteredRows = [...initialRows];
      pipelineTrace.push({
        step: 'WHERE',
        stepName: '2. Filtrado de Tuplas (WHERE)',
        description: 'Sin cláusula WHERE especificada. Pasan el 100% de las tuplas al siguiente paso.',
        clause: null,
        inputRowsCount: initialRows.length,
        outputRowsCount: filteredRows.length,
        outputRows: [...filteredRows],
        decisions: initialRows.map(r => ({
          rowId: r[tableDef.primaryKey] || r.id,
          passed: true,
          reason: 'Sin restricción WHERE'
        }))
      });
    }

    // FASE 3: DISTINCT (Deduplicación preliminar a nivel lógico)
    let distinctRows = [...filteredRows];
    let duplicatesRemoved = 0;

    if (parsed.isDistinct) {
      const seen = new Set();
      const tempDistinct = [];

      for (const row of distinctRows) {
        // En Oracle, DISTINCT aplica sobre la proyección final de columnas solicitadas
        const projectionKey = parsed.columns.map(colSpec => {
          const colName = colSpec.name === '*' ? Object.values(row).join('|') : row[colSpec.name];
          return String(colName);
        }).join(':::');

        if (!seen.has(projectionKey)) {
          seen.add(projectionKey);
          tempDistinct.push(row);
        } else {
          duplicatesRemoved++;
        }
      }
      distinctRows = tempDistinct;

      pipelineTrace.push({
        step: 'DISTINCT',
        stepName: '3. Deduplicación (DISTINCT)',
        description: `Se identificaron y eliminaron ${duplicatesRemoved} tupla(s) duplicada(s) con valores idénticos.`,
        inputRowsCount: filteredRows.length,
        outputRowsCount: distinctRows.length,
        outputRows: [...distinctRows],
        duplicatesRemoved
      });
    } else {
      pipelineTrace.push({
        step: 'DISTINCT',
        stepName: '3. Deduplicación (DISTINCT)',
        description: 'No se solicitó DISTINCT; se conservan todas las tuplas resultantes.',
        inputRowsCount: filteredRows.length,
        outputRowsCount: distinctRows.length,
        outputRows: [...distinctRows],
        duplicatesRemoved: 0
      });
    }

    // FASE 4: SELECT (Proyección relacional: π y asignación de alias)
    let projectedColumns = [];
    if (parsed.isStar) {
      projectedColumns = tableDef.columns.map(c => ({
        original: c.name,
        alias: c.name,
        type: c.type
      }));
    } else {
      for (const colSpec of parsed.columns) {
        const found = tableDef.columns.find(c => c.name.toLowerCase() === colSpec.name.toLowerCase());
        if (!found) {
          const validCols = tableDef.columns.map(c => c.name).join(', ');
          return {
            success: false,
            error: `La columna "${colSpec.name}" no existe en la tabla ${tableName}. Columnas disponibles: ${validCols}.`,
            rawSql: cleanSql
          };
        }
        projectedColumns.push({
          original: found.name,
          alias: colSpec.alias || found.name,
          type: found.type
        });
      }
    }

    const projectedRows = distinctRows.map(row => {
      const newRow = {};
      for (const col of projectedColumns) {
        newRow[col.alias] = row[col.original];
      }
      return newRow;
    });

    pipelineTrace.push({
      step: 'SELECT',
      stepName: '4. Proyección de Columnas (SELECT)',
      description: `Se proyectan ${projectedColumns.length} columna(s) requerida(s): [${projectedColumns.map(c => c.alias).join(', ')}].`,
      columns: projectedColumns,
      inputRowsCount: distinctRows.length,
      outputRows: [...projectedRows]
    });

    // FASE 5: ORDER BY (Ordenamiento)
    let finalRows = [...projectedRows];
    if (parsed.orderBy) {
      const orderCol = parsed.orderBy.column;
      const orderDirection = parsed.orderBy.direction; // 'ASC' o 'DESC'

      // Verificar que la columna exista en la proyección o en la tabla
      const colExistsInResult = projectedColumns.some(c => c.alias.toLowerCase() === orderCol.toLowerCase() || c.original.toLowerCase() === orderCol.toLowerCase());
      const colExistsInTable = tableDef.columns.some(c => c.name.toLowerCase() === orderCol.toLowerCase());

      if (!colExistsInResult && !colExistsInTable) {
        return {
          success: false,
          error: `La columna ORDER BY "${orderCol}" no existe en la tabla ni en la proyección.`,
          rawSql: cleanSql
        };
      }

      finalRows.sort((a, b) => {
        let valA = a[orderCol] !== undefined ? a[orderCol] : distinctRows.find((_, i) => projectedRows[i] === a)?.[orderCol];
        let valB = b[orderCol] !== undefined ? b[orderCol] : distinctRows.find((_, i) => projectedRows[i] === b)?.[orderCol];

        if (valA === undefined || valB === undefined) {
          // fallback a match por nombre exacto insensible
          const keyA = Object.keys(a).find(k => k.toLowerCase() === orderCol.toLowerCase());
          const keyB = Object.keys(b).find(k => k.toLowerCase() === orderCol.toLowerCase());
          valA = a[keyA];
          valB = b[keyB];
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return orderDirection === 'DESC' ? valB - valA : valA - valB;
        } else {
          const comp = String(valA || '').localeCompare(String(valB || ''));
          return orderDirection === 'DESC' ? -comp : comp;
        }
      });

      pipelineTrace.push({
        step: 'ORDER BY',
        stepName: '5. Ordenamiento (ORDER BY)',
        description: `Se ordenan las ${finalRows.length} tuplas por "${orderCol}" en sentido ${orderDirection === 'DESC' ? 'DESCENDENTE (Z-A / mayor a menor)' : 'ASCENDENTE (A-Z / menor a mayor)'}.`,
        orderBy: parsed.orderBy,
        outputRows: [...finalRows]
      });
    } else {
      pipelineTrace.push({
        step: 'ORDER BY',
        stepName: '5. Ordenamiento (ORDER BY)',
        description: 'Sin ordenamiento explícito; se entrega el orden natural de recuperación.',
        orderBy: null,
        outputRows: [...finalRows]
      });
    }

    const executionTimeMs = (performance.now() - startTime).toFixed(2);

    return {
      success: true,
      rawSql: cleanSql,
      parsedQuery: parsed,
      columns: projectedColumns,
      rows: finalRows,
      rowCount: finalRows.length,
      executionTimeMs,
      pipelineTrace,
      fromTable: tableName
    };
  }

  /**
   * Analizador sintáctico para sentencias SELECT simples
   */
  parseQuery(sql) {
    // Normalizar espacios y eliminar punto y coma final
    const normalized = sql.trim().replace(/;+\s*$/, '');

    if (!/^SELECT\b/i.test(normalized)) {
      throw new Error('La consulta debe comenzar con la sentencia SELECT.');
    }

    // Extraer clausulas principales
    // Expresión regular para separar SELECT ... FROM ... [WHERE ...] [ORDER BY ...]
    const fromMatch = normalized.match(/\bFROM\b/i);
    if (!fromMatch) {
      throw new Error('Falta la cláusula obligatoria FROM indicando la tabla de origen.');
    }

    const selectPart = normalized.substring(6, fromMatch.index).trim();
    const afterFrom = normalized.substring(fromMatch.index + 4).trim();

    // Comprobar DISTINCT
    let isDistinct = false;
    let columnsPart = selectPart;
    if (/^DISTINCT\b/i.test(columnsPart)) {
      isDistinct = true;
      columnsPart = columnsPart.substring(8).trim();
    }

    if (!columnsPart) {
      throw new Error('Debes indicar al menos una columna o * después de SELECT.');
    }

    // Parsear columnas y alias
    let isStar = false;
    let columns = [];
    if (columnsPart === '*') {
      isStar = true;
    } else {
      // Separar por comas respetando comillas
      const rawCols = this.splitByCommas(columnsPart);
      columns = rawCols.map(colStr => {
        // Buscar patrón: nombre_columna [AS] alias
        const aliasMatch = colStr.match(/^(.+?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
        if (aliasMatch) {
          return {
            name: aliasMatch[1].trim(),
            alias: aliasMatch[2].trim()
          };
        }
        return {
          name: colStr.trim(),
          alias: null
        };
      });
    }

    // Analizar lo que está después de FROM
    let fromTable = '';
    let whereClause = null;
    let whereRaw = null;
    let orderBy = null;

    // Buscar WHERE y ORDER BY
    const whereMatch = afterFrom.match(/\bWHERE\b/i);
    const orderMatch = afterFrom.match(/\bORDER\s+BY\b/i);

    if (whereMatch && orderMatch) {
      if (whereMatch.index < orderMatch.index) {
        fromTable = afterFrom.substring(0, whereMatch.index).trim();
        whereRaw = afterFrom.substring(whereMatch.index + 5, orderMatch.index).trim();
        const orderRaw = afterFrom.substring(orderMatch.index + 8).trim();
        orderBy = this.parseOrderBy(orderRaw);
      } else {
        throw new Error('En Oracle SQL, la cláusula WHERE debe preceder a la cláusula ORDER BY.');
      }
    } else if (whereMatch) {
      fromTable = afterFrom.substring(0, whereMatch.index).trim();
      whereRaw = afterFrom.substring(whereMatch.index + 5).trim();
    } else if (orderMatch) {
      fromTable = afterFrom.substring(0, orderMatch.index).trim();
      const orderRaw = afterFrom.substring(orderMatch.index + 8).trim();
      orderBy = this.parseOrderBy(orderRaw);
    } else {
      fromTable = afterFrom.trim();
    }

    // Limpiar nombre de tabla (por si quedó alias de tabla simple)
    fromTable = fromTable.split(/\s+/)[0];

    if (!fromTable) {
      throw new Error('Debes especificar un nombre de tabla válido tras FROM.');
    }

    if (whereRaw) {
      whereClause = this.parseWhereConditions(whereRaw);
    }

    return {
      isDistinct,
      isStar,
      columns,
      fromTable,
      whereRaw,
      whereClause,
      orderBy
    };
  }

  parseOrderBy(orderRaw) {
    const parts = orderRaw.trim().split(/\s+/);
    const column = parts[0];
    let direction = 'ASC';
    if (parts[1]) {
      const dirUpper = parts[1].toUpperCase();
      if (dirUpper === 'DESC') {
        direction = 'DESC';
      } else if (dirUpper === 'ASC') {
        direction = 'ASC';
      } else {
        throw new Error(`Dirección de ORDER BY no válida: "${parts[1]}". Usa ASC o DESC.`);
      }
    }
    return { column, direction };
  }

  splitByCommas(str) {
    const results = [];
    let current = '';
    let inQuote = false;
    let parenDepth = 0;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === "'") {
        inQuote = !inQuote;
        current += ch;
      } else if (ch === '(' && !inQuote) {
        parenDepth++;
        current += ch;
      } else if (ch === ')' && !inQuote) {
        parenDepth--;
        current += ch;
      } else if (ch === ',' && !inQuote && parenDepth === 0) {
        results.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) {
      results.push(current.trim());
    }
    return results;
  }

  /**
   * Parsea la cláusula WHERE estructurando operadores lógicos AND / OR respetando precedencia y paréntesis.
   */
  parseWhereConditions(whereStr) {
    const tokens = this.tokenizeWhere(whereStr);
    return this.parseExpression(tokens);
  }

  tokenizeWhere(str) {
    const tokens = [];
    let i = 0;
    while (i < str.length) {
      const ch = str[i];

      // Espacios y separadores
      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Coma separadora
      if (ch === ',') {
        tokens.push({ type: 'COMMA', value: ',' });
        i++;
        continue;
      }

      // Paréntesis
      if (ch === '(' || ch === ')') {
        tokens.push({ type: 'PAREN', value: ch });
        i++;
        continue;
      }

      // Strings entre comillas simples
      if (ch === "'") {
        let val = '';
        i++;
        while (i < str.length && str[i] !== "'") {
          val += str[i];
          i++;
        }
        i++; // saltar cierre de comilla
        tokens.push({ type: 'STRING', value: val });
        continue;
      }

      // Operadores de comparación compuestos: <=, >=, <>, !=
      const twoChars = str.substring(i, i + 2);
      if (['<=', '>=', '<>', '!='].includes(twoChars)) {
        tokens.push({ type: 'OPERATOR', value: twoChars });
        i += 2;
        continue;
      }

      // Operadores de comparación simples: =, <, >
      if (['=', '<', '>'].includes(ch)) {
        tokens.push({ type: 'OPERATOR', value: ch });
        i++;
        continue;
      }

      // Palabras clave o identificadores
      let word = '';
      while (i < str.length && !/[\s(),=<>!']/.test(str[i])) {
        word += str[i];
        i++;
      }

      const upperWord = word.toUpperCase();
      if (['AND', 'OR', 'NOT', 'BETWEEN', 'IN', 'LIKE'].includes(upperWord)) {
        tokens.push({ type: upperWord, value: upperWord });
      } else if (!isNaN(Number(word))) {
        tokens.push({ type: 'NUMBER', value: Number(word) });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: word });
      }
    }
    return tokens;
  }

  parseExpression(tokens) {
    let index = 0;

    const parseOr = () => {
      let left = parseAnd();
      while (index < tokens.length && tokens[index].type === 'OR') {
        index++;
        const right = parseAnd();
        left = { type: 'LOGICAL', operator: 'OR', left, right };
      }
      return left;
    };

    const parseAnd = () => {
      let left = parsePrimary();
      while (index < tokens.length && tokens[index].type === 'AND') {
        index++;
        const right = parsePrimary();
        left = { type: 'LOGICAL', operator: 'AND', left, right };
      }
      return left;
    };

    const parsePrimary = () => {
      if (index >= tokens.length) {
        throw new Error('Expresión incompleta en cláusula WHERE.');
      }

      const token = tokens[index];

      // Paréntesis agrupador
      if (token.type === 'PAREN' && token.value === '(') {
        index++;
        const expr = parseOr();
        if (index >= tokens.length || tokens[index].value !== ')') {
          throw new Error('Falta paréntesis de cierre ")" en condición WHERE.');
        }
        index++;
        return { type: 'GROUP', expr };
      }

      // NOT operador
      if (token.type === 'NOT') {
        index++;
        const expr = parsePrimary();
        return { type: 'NOT', expr };
      }

      // Debe ser un identificador (columna)
      if (token.type !== 'IDENTIFIER') {
        throw new Error(`Se esperaba nombre de columna pero se encontró: "${token.value}".`);
      }

      const column = token.value;
      index++;

      if (index >= tokens.length) {
        throw new Error(`Falta operador después de columna "${column}".`);
      }

      const nextToken = tokens[index];

      // Caso BETWEEN
      if (nextToken.type === 'BETWEEN') {
        index++;
        const val1Token = tokens[index++];
        if (!val1Token || !['NUMBER', 'STRING'].includes(val1Token.type)) {
          throw new Error(`Se esperaba valor inicial para BETWEEN en columna "${column}".`);
        }
        const andToken = tokens[index++];
        if (!andToken || andToken.type !== 'AND') {
          throw new Error(`Sintaxis BETWEEN requiere "AND": ${column} BETWEEN val1 AND val2.`);
        }
        const val2Token = tokens[index++];
        if (!val2Token || !['NUMBER', 'STRING'].includes(val2Token.type)) {
          throw new Error(`Se esperaba valor final para BETWEEN en columna "${column}".`);
        }
        return {
          type: 'PREDICATE',
          operator: 'BETWEEN',
          column,
          val1: val1Token.value,
          val2: val2Token.value
        };
      }

      // Caso IN (...)
      if (nextToken.type === 'IN') {
        index++;
        if (index >= tokens.length || tokens[index].value !== '(') {
          throw new Error(`Sintaxis IN requiere lista entre paréntesis: ${column} IN (val1, val2).`);
        }
        index++;
        const values = [];
        while (index < tokens.length && tokens[index].value !== ')') {
          const item = tokens[index];
          if (['STRING', 'NUMBER', 'IDENTIFIER'].includes(item.type)) {
            values.push(item.value);
          }
          index++;
        }
        if (index >= tokens.length || tokens[index].value !== ')') {
          throw new Error('Falta paréntesis de cierre ")" en lista IN.');
        }
        index++;
        return {
          type: 'PREDICATE',
          operator: 'IN',
          column,
          values
        };
      }

      // Caso LIKE
      if (nextToken.type === 'LIKE') {
        index++;
        const patternToken = tokens[index++];
        if (!patternToken || patternToken.type !== 'STRING') {
          throw new Error(`El operador LIKE requiere una cadena de texto entre comillas simples.`);
        }
        return {
          type: 'PREDICATE',
          operator: 'LIKE',
          column,
          pattern: patternToken.value
        };
      }

      // Operador de comparación estándar (=, <>, !=, <, >, <=, >=)
      if (nextToken.type === 'OPERATOR') {
        const op = nextToken.value;
        index++;
        const valToken = tokens[index++];
        if (!valToken || !['STRING', 'NUMBER', 'IDENTIFIER'].includes(valToken.type)) {
          throw new Error(`Se esperaba un valor después de "${column} ${op}".`);
        }
        return {
          type: 'PREDICATE',
          operator: op,
          column,
          value: valToken.value
        };
      }

      throw new Error(`Operador no reconocido o no soportado: "${nextToken.value}".`);
    };

    const root = parseOr();
    return root;
  }

  /**
   * Evalúa la condición sobre una tupla específica.
   */
  evaluateCondition(node, row) {
    if (!node) return { passed: true, reason: 'Sin filtro' };

    if (node.type === 'GROUP') {
      return this.evaluateCondition(node.expr, row);
    }

    if (node.type === 'NOT') {
      const res = this.evaluateCondition(node.expr, row);
      return {
        passed: !res.passed,
        reason: `NOT (${res.reason}) -> ${!res.passed}`
      };
    }

    if (node.type === 'LOGICAL') {
      const leftRes = this.evaluateCondition(node.left, row);
      const rightRes = this.evaluateCondition(node.right, row);

      if (node.operator === 'AND') {
        const passed = leftRes.passed && rightRes.passed;
        return {
          passed,
          reason: `(${leftRes.reason}) AND (${rightRes.reason}) => ${passed ? 'CUMPLE' : 'DESCARTADO'}`
        };
      } else if (node.operator === 'OR') {
        const passed = leftRes.passed || rightRes.passed;
        return {
          passed,
          reason: `(${leftRes.reason}) OR (${rightRes.reason}) => ${passed ? 'CUMPLE' : 'DESCARTADO'}`
        };
      }
    }

    if (node.type === 'PREDICATE') {
      const colName = node.column;
      // Buscar clave en la fila insensible a mayúsculas
      const rowKey = Object.keys(row).find(k => k.toLowerCase() === colName.toLowerCase());
      const rawVal = rowKey ? row[rowKey] : undefined;

      if (rawVal === undefined) {
        return {
          passed: false,
          reason: `Columna "${colName}" no existe en la tupla`
        };
      }

      switch (node.operator) {
        case '=': {
          const target = node.value;
          const passed = typeof rawVal === 'number' ? Number(rawVal) === Number(target) : String(rawVal).toLowerCase() === String(target).toLowerCase();
          return {
            passed,
            reason: `${colName} (${rawVal}) = '${target}' => ${passed}`
          };
        }
        case '<>':
        case '!=': {
          const target = node.value;
          const passed = typeof rawVal === 'number' ? Number(rawVal) !== Number(target) : String(rawVal).toLowerCase() !== String(target).toLowerCase();
          return {
            passed,
            reason: `${colName} (${rawVal}) ${node.operator} '${target}' => ${passed}`
          };
        }
        case '<': {
          const target = Number(node.value);
          const passed = Number(rawVal) < target;
          return { passed, reason: `${colName} (${rawVal}) < ${target} => ${passed}` };
        }
        case '>': {
          const target = Number(node.value);
          const passed = Number(rawVal) > target;
          return { passed, reason: `${colName} (${rawVal}) > ${target} => ${passed}` };
        }
        case '<=': {
          const target = Number(node.value);
          const passed = Number(rawVal) <= target;
          return { passed, reason: `${colName} (${rawVal}) <= ${target} => ${passed}` };
        }
        case '>=': {
          const target = Number(node.value);
          const passed = Number(rawVal) >= target;
          return { passed, reason: `${colName} (${rawVal}) >= ${target} => ${passed}` };
        }
        case 'BETWEEN': {
          const val1 = Number(node.val1);
          const val2 = Number(node.val2);
          const cur = Number(rawVal);
          const passed = cur >= Math.min(val1, val2) && cur <= Math.max(val1, val2);
          return {
            passed,
            reason: `${colName} (${rawVal}) BETWEEN ${val1} AND ${val2} => ${passed}`
          };
        }
        case 'IN': {
          const list = node.values.map(v => String(v).toLowerCase());
          const curStr = String(rawVal).toLowerCase();
          const passed = list.includes(curStr);
          return {
            passed,
            reason: `${colName} ('${rawVal}') IN (${node.values.join(', ')}) => ${passed}`
          };
        }
        case 'LIKE': {
          const pattern = node.pattern;
          const regex = this.likePatternToRegex(pattern);
          const passed = regex.test(String(rawVal));
          return {
            passed,
            reason: `${colName} ('${rawVal}') LIKE '${pattern}' => ${passed}`
          };
        }
        default:
          return { passed: false, reason: `Operador desconocido: ${node.operator}` };
      }
    }

    return { passed: true, reason: 'OK' };
  }

  /**
   * Convierte comodines SQL LIKE (% y _) a expresión regular JS.
   */
  likePatternToRegex(pattern) {
    let regexStr = '^';
    for (let i = 0; i < pattern.length; i++) {
      const ch = pattern[i];
      if (ch === '%') {
        regexStr += '.*';
      } else if (ch === '_') {
        regexStr += '.';
      } else if (['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'].includes(ch)) {
        regexStr += '\\' + ch;
      } else {
        regexStr += ch;
      }
    }
    regexStr += '$';
    return new RegExp(regexStr, 'i');
  }
}
