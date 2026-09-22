// playground.js - Consola Interactiva tipo SQL Developer
// Conforme a la Constitución del Proyecto (Art. III.2 y Art. IV)

import { OracleSqlEngine } from '../engine/oracleSqlEngine.js';
import { AlgebraConverter } from '../engine/algebraConverter.js';
import { universityDb } from '../data/universityDb.js';

export class PlaygroundComponent {
  constructor(containerElement) {
    this.container = typeof containerElement === 'string'
      ? document.querySelector(containerElement)
      : containerElement;
    this.engine = new OracleSqlEngine(universityDb);
    this.history = [];
    this.currentQuery = "SELECT nombre, carrera, promedio \nFROM ESTUDIANTES \nWHERE carrera = 'Sistemas' AND promedio >= 4.0 \nORDER BY promedio DESC;";

    if (this.container) {
      this.render();
      this.executeCurrent();
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="playground-workspace">
        <!-- Sidebar con Tablas y Ejemplos Rápidos -->
        <div class="playground-sidebar">
          <div>
            <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
              📁 Esquema Disponible
            </h4>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${Object.keys(universityDb.tables).map(tName => `
                <button class="query-chip btn-schema-table" data-table="${tName}" title="Insertar SELECT * FROM ${tName}">
                  📊 ${tName} (${universityDb.tables[tName].rows.length} tuplas)
                </button>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
              💡 Consultas Ejemplo
            </h4>
            <div class="query-chip-list">
              <button class="query-chip btn-preset" data-query="SELECT DISTINCT carrera FROM ESTUDIANTES;">
                DISTINCT carrera
              </button>
              <button class="query-chip btn-preset" data-query="SELECT nombre, promedio FROM ESTUDIANTES WHERE promedio >= 4.5 ORDER BY promedio DESC;">
                WHERE promedio >= 4.5
              </button>
              <button class="query-chip btn-preset" data-query="SELECT nombre, carrera, semestre FROM ESTUDIANTES WHERE semestre BETWEEN 3 AND 6;">
                BETWEEN 3 AND 6
              </button>
              <button class="query-chip btn-preset" data-query="SELECT nombre, ciudad FROM ESTUDIANTES WHERE ciudad IN ('Bogotá', 'Medellín');">
                IN ('Bogotá', 'Medellín')
              </button>
              <button class="query-chip btn-preset" data-query="SELECT nombre_curso, departamento FROM CURSOS WHERE nombre_curso LIKE 'Bases%';">
                LIKE 'Bases%'
              </button>
              <button class="query-chip btn-preset" data-query="SELECT nombre, carrera, promedio FROM ESTUDIANTES WHERE (carrera = 'Sistemas' OR carrera = 'Medicina') AND promedio >= 4.0;">
                AND + OR agrupado
              </button>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
              🛡️ Prueba Constitucional
            </h4>
            <div class="query-chip-list">
              <button class="query-chip btn-preset" data-query="SELECT * FROM ESTUDIANTES JOIN CURSOS ON 1=1;" style="border-color: rgba(234,28,4,0.3); color: #fca5a5;" title="Prueba restricción Art. II.2">
                Test: JOIN (Restringido)
              </button>
              <button class="query-chip btn-preset" data-query="SELECT COUNT(*) FROM ESTUDIANTES GROUP BY carrera;" style="border-color: rgba(234,28,4,0.3); color: #fca5a5;" title="Prueba restricción Art. II.2">
                Test: GROUP BY (Restringido)
              </button>
            </div>
          </div>
        </div>

        <!-- Área de Trabajo Principal del Editor y Resultados -->
        <div class="playground-editor-area">
          <div class="sql-box-header" style="border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: #080b12;">
            <div class="sql-box-title">
              <span>⚡</span> Oracle SQL Worksheet — Consola Interactiva
            </div>
            <div class="sql-box-actions">
              <button class="btn-sql-action btn-clear-editor" title="Limpiar editor">🗑️ Limpiar</button>
              <button class="btn-sql-action btn-sql-run btn-exec-playground" title="Ejecutar consulta (Ctrl+Enter)">
                ▶ Ejecutar F9
              </button>
            </div>
          </div>

          <div class="sql-editor-wrapper">
            <textarea class="sql-editor-textarea playground-textarea" spellcheck="false" placeholder="Escribe tu sentencia SQL aquí...">${this.currentQuery}</textarea>
          </div>

          <!-- Banner de Resultados o Errores -->
          <div class="playground-status-bar" style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; padding: 4px 8px;">
            <span class="playground-metrics">Listo para ejecutar</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem;">Atajo: <kbd style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #e2e8f0;">Ctrl + Enter</kbd></span>
          </div>

          <div class="feedback-box playground-feedback"></div>

          <!-- Caja de Traducción a Álgebra Relacional -->
          <div class="relational-algebra-box playground-algebra-container" style="display: none;">
            <div class="algebra-title">
              <span>Traducción a Álgebra Relacional Estándar</span>
              <span class="badge badge-oracle">π &amp; σ puras</span>
            </div>
            <div class="algebra-display playground-algebra-display"></div>
          </div>

          <!-- Vista Tabular de Resultados -->
          <div class="results-table-container playground-table-container">
            <div style="padding: 24px; text-align: center; color: var(--text-muted);">
              Presiona "Ejecutar F9" para ver los resultados tabulares.
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const textarea = this.container.querySelector('.playground-textarea');
    const execBtn = this.container.querySelector('.btn-exec-playground');
    const clearBtn = this.container.querySelector('.btn-clear-editor');

    // Ejecutar con botón
    if (execBtn) {
      execBtn.addEventListener('click', () => this.executeCurrent());
    }

    // Limpiar editor
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (textarea) {
          textarea.value = '';
          textarea.focus();
        }
      });
    }

    // Atajo de teclado Ctrl+Enter
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.executeCurrent();
        }
      });
    }

    // Presets rápidos
    this.container.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const query = e.currentTarget.getAttribute('data-query');
        if (textarea && query) {
          textarea.value = query;
          this.executeCurrent();
        }
      });
    });

    // Inserción de tabla
    this.container.querySelectorAll('.btn-schema-table').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const table = e.currentTarget.getAttribute('data-table');
        if (textarea && table) {
          textarea.value = `SELECT * \nFROM ${table};`;
          this.executeCurrent();
        }
      });
    });
  }

  executeCurrent() {
    const textarea = this.container.querySelector('.playground-textarea');
    const feedbackBox = this.container.querySelector('.playground-feedback');
    const metricsSpan = this.container.querySelector('.playground-metrics');
    const tableContainer = this.container.querySelector('.playground-table-container');
    const algebraBox = this.container.querySelector('.playground-algebra-container');
    const algebraDisplay = this.container.querySelector('.playground-algebra-display');

    if (!textarea) return;
    const sql = textarea.value;

    const result = this.engine.execute(sql);

    // Ocultar feedback previo
    feedbackBox.className = 'feedback-box';
    feedbackBox.innerHTML = '';
    feedbackBox.style.display = 'none';

    if (!result.success) {
      feedbackBox.style.display = 'flex';
      if (result.isConstitutionalViolation) {
        feedbackBox.className = 'feedback-box feedback-restricted show';
        feedbackBox.innerHTML = `<span>⚠️</span><div><strong>Restricción Constitucional:</strong> ${result.error}</div>`;
      } else {
        feedbackBox.className = 'feedback-box feedback-error show';
        feedbackBox.innerHTML = `<span>❌</span><div><strong>Error:</strong> ${result.error}</div>`;
      }

      metricsSpan.textContent = 'Ejecución fallida';
      tableContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted);">
          No se pudieron recuperar tuplas debido a un error de sintaxis o restricción constitucional.
        </div>
      `;
      algebraBox.style.display = 'none';
      return;
    }

    // Éxito
    metricsSpan.innerHTML = `✅ Consulta completada en <strong>${result.executionTimeMs} ms</strong> — <strong>${result.rowCount}</strong> tupla(s) recuperada(s)`;

    // Convertir a álgebra relacional
    if (result.parsedQuery) {
      const algebra = AlgebraConverter.convert(result.parsedQuery);
      algebraDisplay.innerHTML = algebra.html;
      algebraBox.style.display = 'flex';
    }

    // Renderizar tabla de resultados
    if (result.rows.length === 0) {
      tableContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted);">
          La consulta se ejecutó exitosamente, pero ninguna tupla cumplió el predicado especificado (0 tuplas).
        </div>
      `;
    } else {
      const columns = Object.keys(result.rows[0]);
      tableContainer.innerHTML = `
        <table class="db-table">
          <thead>
            <tr>
              <th class="row-num-col">#</th>
              ${columns.map(c => `<th>${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${result.rows.map((row, idx) => `
              <tr>
                <td class="row-num-col">${idx + 1}</td>
                ${columns.map(c => `<td>${row[c] !== null && row[c] !== undefined ? row[c] : 'NULL'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }
}
