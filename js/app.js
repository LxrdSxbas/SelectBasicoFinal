// app.js - Orquestador Principal de ExpoDB Básico
// Conforme a la Constitución del Proyecto (Art. III.2, IV, V y VI)

import { OracleSqlEngine } from './engine/oracleSqlEngine.js';
import { universityDb } from './data/universityDb.js';
import { VisualizerComponent } from './components/visualizer.js';
import { PlaygroundComponent } from './components/playground.js';
import { QuizComponent } from './components/quiz.js';
import { PresentationComponent } from './components/presentationComponent.js';

class ExpoApp {
  constructor() {
    this.engine = new OracleSqlEngine(universityDb);
    this.visualizers = {};
    this.completedSections = new Set();
    this.currentSlideIndex = 0;
    this.totalSlides = 9;
    this.lecturePresentation = null;

    this.init();
  }

  init() {
    this.initVisualizers();
    this.initPlayground();
    this.initQuiz();
    this.initMiniConsoles();
    this.initSchemaDrawer();
    this.initCopyButtons();
    this.initScrollSpy();
    this.initPresentationMode();
    this.initMobileMenu();
    this.updateProgress();

    console.log('🚀 ExpoDB Básico inicializado conforme a la Constitución del Proyecto.');
  }

  /**
   * Inicializa las 7 visualizaciones del pipeline lógico para cada sección tematica.
   */
  initVisualizers() {
    const sectionExamples = [
      {
        id: 'viz-section-1',
        query: 'SELECT nombre, apellido, carrera, promedio AS calificacion_actual FROM ESTUDIANTES;'
      },
      {
        id: 'viz-section-2',
        query: 'SELECT DISTINCT carrera FROM ESTUDIANTES;'
      },
      {
        id: 'viz-section-3',
        query: 'SELECT nombre, apellido, carrera, promedio FROM ESTUDIANTES WHERE promedio >= 4.5;'
      },
      {
        id: 'viz-section-4',
        query: "SELECT nombre, carrera, promedio, ciudad FROM ESTUDIANTES WHERE (carrera = 'Sistemas' OR carrera = 'Industrial') AND promedio >= 4.0;"
      },
      {
        id: 'viz-section-5',
        query: 'SELECT nombre, apellido, semestre, promedio FROM ESTUDIANTES WHERE semestre BETWEEN 4 AND 7;'
      },
      {
        id: 'viz-section-6',
        query: "SELECT nombre, carrera, ciudad FROM ESTUDIANTES WHERE ciudad IN ('Bogotá', 'Medellín', 'Cali');"
      },
      {
        id: 'viz-section-7',
        query: "SELECT id_curso, nombre_curso, departamento FROM CURSOS WHERE id_curso LIKE 'SIS%';"
      }
    ];

    sectionExamples.forEach(item => {
      const container = document.getElementById(item.id);
      if (container) {
        const result = this.engine.execute(item.query);
        this.visualizers[item.id] = new VisualizerComponent(container, result);
      }
    });

    // Conectar botones "Cargar en Visualizador" de los bloques de sintaxis
    document.querySelectorAll('.btn-run-example').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const vizId = e.currentTarget.getAttribute('data-viz');
        const codeElement = document.getElementById(targetId);
        if (codeElement && this.visualizers[vizId]) {
          const rawSql = codeElement.textContent;
          const result = this.engine.execute(rawSql);
          this.visualizers[vizId].update(result);

          // Scroll suave hasta el visualizador
          const vizContainer = document.getElementById(vizId);
          if (vizContainer) {
            vizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  /**
   * Inicializa la consola libre (Sección 8).
   */
  initPlayground() {
    const mountPoint = document.getElementById('playground-mount-point');
    if (mountPoint) {
      this.playground = new PlaygroundComponent(mountPoint);
    }
  }

  /**
   * Inicializa el cuestionario final (Sección 9).
   */
  initQuiz() {
    const mountPoint = document.getElementById('quiz-mount-point');
    if (mountPoint) {
      this.quiz = new QuizComponent(mountPoint);
    }

    // Callback global cuando se responde una pregunta del quiz
    window.onQuizAnswered = (answeredCount, totalCount) => {
      if (answeredCount === totalCount) {
        this.markSectionCompleted(9);
      }
    };
  }

  /**
   * Inicializa y valida los ejercicios de las mini-consolas de las secciones 1 a 7.
   */
  initMiniConsoles() {
    const exerciseRules = {
      1: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          const cols = res.columns.map(c => c.original.toLowerCase());
          return cols.includes('nombre') && cols.includes('carrera') && cols.includes('semestre');
        },
        successMsg: '¡Excelente trabajo! Has proyectado correctamente nombre, carrera y semestre de ESTUDIANTES.'
      },
      2: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          return res.parsedQuery.isDistinct && res.columns.some(c => c.original.toLowerCase() === 'ciudad');
        },
        successMsg: '¡Perfecto! DISTINCT deduplicó las ciudades exitosamente retornando valores únicos.'
      },
      3: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          return res.parsedQuery.whereRaw && /carrera\s*=\s*'Medicina'/i.test(res.parsedQuery.whereRaw) && res.rows.length === 3;
        },
        successMsg: '¡Correcto! Has filtrado horizontalmente con WHERE las tuplas de la carrera Medicina.'
      },
      4: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          const whereStr = res.parsedQuery.whereRaw || '';
          return /carrera\s*=\s*'Sistemas'/i.test(whereStr) && /promedio\s*>=\s*4\.2/i.test(whereStr) && /AND/i.test(whereStr);
        },
        successMsg: '¡Gran lógica booleana! Ambas condiciones AND se evaluaron simultáneamente de forma correcta.'
      },
      5: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          const whereStr = res.parsedQuery.whereRaw || '';
          return /BETWEEN\s+3\.5\s+AND\s+4\.5/i.test(whereStr) || /promedio\s*>=\s*3\.5\s+AND\s+promedio\s*<=\s*4\.5/i.test(whereStr);
        },
        successMsg: '¡Excelente! Has dominado el operador BETWEEN para rangos inclusivos.'
      },
      6: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          const whereStr = res.parsedQuery.whereRaw || '';
          return /IN\s*\(/i.test(whereStr) && /Industrial/i.test(whereStr) && /Derecho/i.test(whereStr);
        },
        successMsg: '¡Brillante! El operador IN comprobó con éxito la pertenencia al conjunto especificado.'
      },
      7: {
        validate: (res) => {
          if (!res.success) return false;
          if (res.fromTable !== 'ESTUDIANTES') return false;
          const whereStr = res.parsedQuery.whereRaw || '';
          return /LIKE\s*'B%'/i.test(whereStr);
        },
        successMsg: '¡Dominio del comodín %! Has recuperado las tuplas con nombres iniciados por "B".'
      }
    };

    // Conectar botones de resolver mini-consola
    document.querySelectorAll('.btn-solve-mini').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const secNum = parseInt(e.currentTarget.getAttribute('data-section'), 10);
        const card = document.getElementById(`console-${secNum}`);
        if (!card) return;

        const textarea = card.querySelector('.sql-editor-textarea');
        const feedbackBox = card.querySelector('.feedback-box');
        const tableContainer = card.querySelector('.results-table-container');

        if (!textarea) return;
        const sql = textarea.value.trim();

        const result = this.engine.execute(sql);
        const rule = exerciseRules[secNum];

        feedbackBox.className = 'feedback-box';
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
          tableContainer.innerHTML = '';
          return;
        }

        // Renderizar tabla
        this.renderTableInto(tableContainer, result.rows);

        // Validar si cumple el reto pedagógico
        const passed = rule ? rule.validate(result) : true;
        feedbackBox.style.display = 'flex';

        if (passed) {
          feedbackBox.className = 'feedback-box feedback-success show';
          feedbackBox.innerHTML = `<span>🎉</span><div>${rule.successMsg}</div>`;
          this.markSectionCompleted(secNum);
        } else {
          feedbackBox.className = 'feedback-box feedback-error show';
          feedbackBox.innerHTML = `<span>⚠️</span><div>La consulta se ejecutó, pero no cumple exactamente con las columnas o la condición pedida en el ejercicio. ¡Revisa la instrucción e inténtalo de nuevo!</div>`;
        }
      });
    });

    // Botones de pista
    document.querySelectorAll('.btn-hint-mini').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hint = e.currentTarget.getAttribute('data-hint');
        const card = e.currentTarget.closest('.mini-console-card');
        const textarea = card?.querySelector('.sql-editor-textarea');
        if (textarea && hint) {
          textarea.value = hint;
          textarea.focus();
        }
      });
    });

    // Botones de reiniciar mini-consola
    document.querySelectorAll('.btn-reset-mini').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.mini-console-card');
        const textarea = card?.querySelector('.sql-editor-textarea');
        const feedbackBox = card?.querySelector('.feedback-box');
        const tableContainer = card?.querySelector('.results-table-container');

        if (textarea) textarea.value = '';
        if (feedbackBox) {
          feedbackBox.className = 'feedback-box';
          feedbackBox.style.display = 'none';
        }
        if (tableContainer) tableContainer.innerHTML = '';
      });
    });
  }

  renderTableInto(container, rows) {
    if (!container) return;
    if (!rows || rows.length === 0) {
      container.innerHTML = '<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">0 tuplas encontradas.</div>';
      return;
    }

    const columns = Object.keys(rows[0]);
    container.innerHTML = `
      <table class="db-table">
        <thead>
          <tr>
            <th class="row-num-col">#</th>
            ${columns.map(c => `<th>${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, idx) => `
            <tr>
              <td class="row-num-col">${idx + 1}</td>
              ${columns.map(c => `<td>${row[c] !== null && row[c] !== undefined ? row[c] : 'NULL'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  markSectionCompleted(secNum) {
    this.completedSections.add(secNum);
    const navLink = document.getElementById(`navLink-${secNum}`);
    if (navLink) {
      navLink.classList.add('completed');
    }
    this.updateProgress();
  }

  updateProgress() {
    const totalLessons = 7;
    const completedCount = Array.from(this.completedSections).filter(n => n >= 1 && n <= 7).length;
    const pct = Math.round((completedCount / totalLessons) * 100);

    const label = document.getElementById('progressLabel');
    const bar = document.getElementById('progressBarFill');

    if (label) {
      label.textContent = `${completedCount} / ${totalLessons} Lecciones`;
    }
    if (bar) {
      bar.style.width = `${pct}%`;
    }
  }

  /**
   * Panel lateral de exploración del esquema de tablas.
   */
  initSchemaDrawer() {
    const drawer = document.getElementById('schemaDrawer');
    const toggleBtn = document.getElementById('btnToggleSchema');
    const closeBtn = document.getElementById('btnCloseSchemaDrawer');
    const container = document.getElementById('schemaTablesContainer');

    if (container) {
      container.innerHTML = Object.values(universityDb.tables).map(table => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <strong style="color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.95rem;">${table.name}</strong>
            <span style="font-size: 0.7rem; color: var(--text-muted);">${table.rows.length} tuplas</span>
          </div>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px;">${table.description}</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${table.columns.map(col => `
              <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; padding: 2px 4px; background: rgba(0,0,0,0.2); border-radius: 2px;">
                <span style="color: #e2e8f0;">${col.name} ${col.name === table.primaryKey ? '<span style="color: var(--amber-gold);" title="Primary Key">🔑</span>' : ''}</span>
                <span style="color: #64748b;">${col.type}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }
  }

  /**
   * Botones de copiar código SQL al portapapeles.
   */
  initCopyButtons() {
    document.querySelectorAll('.btn-copy-sql').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const codeElement = document.getElementById(targetId);
        if (codeElement) {
          try {
            await navigator.clipboard.writeText(codeElement.textContent);
            const originalText = btn.textContent;
            btn.textContent = '✓ Copiado';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 1800);
          } catch (err) {
            console.error('Error al copiar:', err);
          }
        }
      });
    });
  }

  /**
   * Scrollspy para actualizar el link activo en la barra lateral mientras el usuario lee.
   */
  initScrollSpy() {
    const sections = document.querySelectorAll('.lesson-section');
    const navLinks = document.querySelectorAll('.nav-item-link');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 140;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /**
   * Modo Exposición y Presentación (Art. VI.4).
   */
  initPresentationMode() {
    // Inicializar el nuevo Modo Exposición Dual (Concepto + Demostración Interactiva en Vivo)
    this.lecturePresentation = new PresentationComponent('#expoPresentationOverlay');

    const lectureBtn = document.getElementById('btnStartLectureMode');
    if (lectureBtn) {
      lectureBtn.addEventListener('click', () => {
        // Iniciar en el tema que esté visible actualmente en pantalla
        const scrollPos = window.scrollY + 120;
        let activeIdx = 0;
        document.querySelectorAll('.lesson-section').forEach((sec, i) => {
          if (scrollPos >= sec.offsetTop) {
            activeIdx = i;
          }
        });
        this.lecturePresentation.open(activeIdx);
      });
    }

    const toggleBtn = document.getElementById('btnTogglePresentation');
    const exitBtn = document.getElementById('btnExitPresentation');
    const prevBtn = document.getElementById('btnPresPrev');
    const nextBtn = document.getElementById('btnPresNext');
    const indicator = document.getElementById('presSlideIndicator');

    const setSlide = (idx) => {
      if (idx < 0 || idx >= this.totalSlides) return;
      this.currentSlideIndex = idx;

      document.querySelectorAll('.lesson-section').forEach((sec, i) => {
        if (i === idx) {
          sec.classList.add('active-presentation-slide');
          sec.scrollIntoView({ behavior: 'smooth' });
        } else {
          sec.classList.remove('active-presentation-slide');
        }
      });

      if (indicator) {
        indicator.textContent = `${idx + 1} / ${this.totalSlides}`;
      }
    };

    const togglePresentation = () => {
      const isPresentation = document.body.classList.toggle('presentation-mode');
      if (toggleBtn) {
        toggleBtn.classList.toggle('active', isPresentation);
      }
      if (isPresentation) {
        // Encontrar sección visible más cercana
        const scrollPos = window.scrollY + 100;
        let bestIdx = 0;
        document.querySelectorAll('.lesson-section').forEach((sec, i) => {
          if (scrollPos >= sec.offsetTop) {
            bestIdx = i;
          }
        });
        setSlide(bestIdx);
      } else {
        document.querySelectorAll('.lesson-section').forEach(sec => {
          sec.classList.remove('active-presentation-slide');
        });
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', togglePresentation);
    }
    if (exitBtn) {
      exitBtn.addEventListener('click', togglePresentation);
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => setSlide(this.currentSlideIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => setSlide(this.currentSlideIndex + 1));
    }

    // Atajos de teclado: Alt+P para toggle, Flechas para navegar slides, Esc para salir
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        togglePresentation();
      } else if (document.body.classList.contains('presentation-mode')) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          setSlide(this.currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setSlide(this.currentSlideIndex - 1);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          togglePresentation();
        }
      }
    });
  }

  initMobileMenu() {
    const mobileBtn = document.getElementById('btnToggleMobileMenu');
    const sidebar = document.getElementById('sidebarNav');

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });

      // Cerrar sidebar al hacer clic en un link en mobile
      document.querySelectorAll('.nav-item-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
          }
        });
      });
    }
  }
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.expoApp = new ExpoApp();
});
