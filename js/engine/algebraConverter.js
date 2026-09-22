// algebraConverter.js - Traductor de SELECT a Álgebra Relacional (π y σ)
// Conforme a la Constitución del Proyecto (Art. II.2 y Art. III.2)
// NOTA CONSTITUCIONAL: Estrictamente NUNCA genera operador de join (⨝)

export class AlgebraConverter {
  /**
   * Convierte un objeto de consulta parseada a representación de álgebra relacional
   * @param {Object} parsedQuery Objeto retornado por parseQuery de OracleSqlEngine
   * @returns {Object} { textRepresentation, htmlRepresentation, breakdown }
   */
  static convert(parsedQuery) {
    if (!parsedQuery) {
      return {
        text: 'N/A',
        html: '<span class="algebra-na">Consulta no analizada</span>',
        breakdown: []
      };
    }

    const { isStar, columns, fromTable, whereClause } = parsedQuery;

    // 1. Componente de Proyección (π)
    let projectionCols = '*';
    if (!isStar && columns && columns.length > 0) {
      projectionCols = columns.map(c => c.alias ? `${c.name} AS ${c.alias}` : c.name).join(', ');
    }

    // 2. Componente de Selección (σ)
    let selectionCondition = null;
    let selectionConditionHtml = null;

    if (whereClause) {
      selectionCondition = this.conditionToText(whereClause);
      selectionConditionHtml = this.conditionToHtml(whereClause);
    }

    // 3. Ensamblado en texto plano estándar
    // π_{columnas} ( σ_{condicion} ( TABLA ) )
    let textResult = '';
    if (selectionCondition) {
      if (isStar) {
        textResult = `σ_{${selectionCondition}}(${fromTable})`;
      } else {
        textResult = `π_{${projectionCols}} ( σ_{${selectionCondition}}(${fromTable}) )`;
      }
    } else {
      if (isStar) {
        textResult = fromTable;
      } else {
        textResult = `π_{${projectionCols}} (${fromTable})`;
      }
    }

    // 4. Ensamblado en HTML con estilos Cyber-Académicos, Tooltips y Badges
    const tableBadge = `<span class="algebra-token algebra-table" title="Relación / Tabla base">${fromTable}</span>`;
    let htmlResult = '';

    if (selectionConditionHtml) {
      const sigmaBlock = `<span class="algebra-op algebra-sigma" title="Operador de Selección (σ): filtra tuplas que cumplen el predicado">σ</span><sub class="algebra-sub algebra-sub-sigma">${selectionConditionHtml}</sub> ( ${tableBadge} )`;

      if (isStar) {
        htmlResult = `<div class="algebra-expr">${sigmaBlock}</div>`;
      } else {
        const piBlock = `<span class="algebra-op algebra-pi" title="Operador de Proyección (π): extrae un subconjunto vertical de columnas">π</span><sub class="algebra-sub algebra-sub-pi">${this.escapeHtml(projectionCols)}</sub>`;
        htmlResult = `<div class="algebra-expr">${piBlock} ( ${sigmaBlock} )</div>`;
      }
    } else {
      if (isStar) {
        htmlResult = `<div class="algebra-expr">${tableBadge} <span class="algebra-note">(Todas las columnas y todas las tuplas de la relación)</span></div>`;
      } else {
        const piBlock = `<span class="algebra-op algebra-pi" title="Operador de Proyección (π): extrae un subconjunto vertical de columnas">π</span><sub class="algebra-sub algebra-sub-pi">${this.escapeHtml(projectionCols)}</sub>`;
        htmlResult = `<div class="algebra-expr">${piBlock} ( ${tableBadge} )</div>`;
      }
    }

    // 5. Desglose didáctico pedagógico
    const breakdown = [
      {
        operator: 'Relación Base',
        symbol: fromTable,
        role: `Define el conjunto de partida de todas las tuplas almacenadas en la tabla ${fromTable}.`
      }
    ];

    if (selectionCondition) {
      breakdown.unshift({
        operator: 'Selección (Filtro Horizontal)',
        symbol: 'σ (Sigma)',
        role: `Aplica el predicado "${selectionCondition}". Solo sobreviven las tuplas donde la condición evalúa a VERDADERO.`
      });
    }

    if (!isStar) {
      breakdown.unshift({
        operator: 'Proyección (Recorte Vertical)',
        symbol: 'π (Pi)',
        role: `Extrae únicamente los atributos especificados: [${projectionCols}], descartando el resto de columnas de la relación.`
      });
    }

    return {
      text: textResult,
      html: htmlResult,
      breakdown
    };
  }

  static conditionToText(node) {
    if (!node) return '';

    if (node.type === 'GROUP') {
      return `(${this.conditionToText(node.expr)})`;
    }

    if (node.type === 'NOT') {
      return `¬(${this.conditionToText(node.expr)})`;
    }

    if (node.type === 'LOGICAL') {
      const sym = node.operator === 'AND' ? ' ∧ ' : ' ∨ ';
      return `${this.conditionToText(node.left)}${sym}${this.conditionToText(node.right)}`;
    }

    if (node.type === 'PREDICATE') {
      const col = node.column;
      switch (node.operator) {
        case '=':
          return `${col} = '${node.value}'`;
        case '<>':
        case '!=':
          return `${col} ≠ '${node.value}'`;
        case '<=':
          return `${col} ≤ ${node.value}`;
        case '>=':
          return `${col} ≥ ${node.value}`;
        case '<':
          return `${col} < ${node.value}`;
        case '>':
          return `${col} > ${node.value}`;
        case 'BETWEEN':
          return `${node.val1} ≤ ${col} ≤ ${node.val2}`;
        case 'IN':
          return `${col} ∈ {${node.values.map(v => `'${v}'`).join(', ')}}`;
        case 'LIKE':
          return `${col} ≈ '${node.pattern}'`;
        default:
          return `${col} ${node.operator} ${node.value}`;
      }
    }

    return '';
  }

  static conditionToHtml(node) {
    if (!node) return '';

    if (node.type === 'GROUP') {
      return `<span class="algebra-paren">(</span> ${this.conditionToHtml(node.expr)} <span class="algebra-paren">)</span>`;
    }

    if (node.type === 'NOT') {
      return `<span class="algebra-logic-not">¬</span> ( ${this.conditionToHtml(node.expr)} )`;
    }

    if (node.type === 'LOGICAL') {
      const sym = node.operator === 'AND'
        ? '<span class="algebra-logic-and" title="Conjunción lógica (AND / Y)"> ∧ </span>'
        : '<span class="algebra-logic-or" title="Disyunción lógica (OR / O)"> ∨ </span>';
      return `${this.conditionToHtml(node.left)}${sym}${this.conditionToHtml(node.right)}`;
    }

    if (node.type === 'PREDICATE') {
      const col = `<span class="algebra-pred-col">${this.escapeHtml(node.column)}</span>`;
      switch (node.operator) {
        case '=':
          return `${col} <span class="algebra-rel-op">=</span> <span class="algebra-pred-val">'${this.escapeHtml(node.value)}'</span>`;
        case '<>':
        case '!=':
          return `${col} <span class="algebra-rel-op">≠</span> <span class="algebra-pred-val">'${this.escapeHtml(node.value)}'</span>`;
        case '<=':
          return `${col} <span class="algebra-rel-op">≤</span> <span class="algebra-pred-val">${this.escapeHtml(node.value)}</span>`;
        case '>=':
          return `${col} <span class="algebra-rel-op">≥</span> <span class="algebra-pred-val">${this.escapeHtml(node.value)}</span>`;
        case '<':
          return `${col} <span class="algebra-rel-op">&lt;</span> <span class="algebra-pred-val">${this.escapeHtml(node.value)}</span>`;
        case '>':
          return `${col} <span class="algebra-rel-op">&gt;</span> <span class="algebra-pred-val">${this.escapeHtml(node.value)}</span>`;
        case 'BETWEEN':
          return `<span class="algebra-pred-val">${this.escapeHtml(node.val1)}</span> <span class="algebra-rel-op">≤</span> ${col} <span class="algebra-rel-op">≤</span> <span class="algebra-pred-val">${this.escapeHtml(node.val2)}</span>`;
        case 'IN':
          return `${col} <span class="algebra-rel-op">∈</span> <span class="algebra-pred-val">{${node.values.map(v => `'${this.escapeHtml(v)}'`).join(', ')}}</span>`;
        case 'LIKE':
          return `${col} <span class="algebra-rel-op">≈</span> <span class="algebra-pred-val">'${this.escapeHtml(node.pattern)}'</span>`;
        default:
          return `${col} ${this.escapeHtml(node.operator)} ${this.escapeHtml(node.value)}`;
      }
    }

    return '';
  }

  static escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
