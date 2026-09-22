// presentationComponent.js - Modo Exposición Dual (Concepto Teórico + Ejemplo Interactivo)
// Conforme a la Constitución del Proyecto (Art. IV y Art. VI.4)

import { OracleSqlEngine } from '../engine/oracleSqlEngine.js';
import { AlgebraConverter } from '../engine/algebraConverter.js';
import { universityDb } from '../data/universityDb.js';
import { VisualizerComponent } from './visualizer.js';

export const PRESENTATION_TOPICS = [
  {
    id: 1,
    title: 'SELECT y FROM',
    badge: 'Tema 01 • Fundamentos',
    concept: {
      subtitle: 'La Anatomía Atómica de una Consulta SQL',
      description: 'En Oracle SQL, toda extracción de información requiere definir qué atributos queremos visualizar y de qué relación física provienen.',
      cards: [
        {
          icon: '📐',
          title: 'Proyección Vertical (SELECT)',
          text: 'Determina las columnas del reporte. El comodín asterisco (*) proyecta todas las columnas; especificar nombres separados por coma optimiza memoria y tráfico de red.'
        },
        {
          icon: '🗄️',
          title: 'Origen Relacional (FROM)',
          text: 'Indica la tabla de donde se extraen las tuplas. Aunque se escribe después de SELECT, el motor Oracle la evalúa primero para cargar la relación en memoria.'
        },
        {
          icon: '🏷️',
          title: 'Alias de Columna (AS)',
          text: 'Permite renombrar columnas en la salida: "promedio AS calificacion_actual". Facilita la lectura y genera encabezados profesionales en reportes.'
        },
        {
          icon: '⚛️',
          title: 'Álgebra Relacional: π (Pi)',
          text: 'La proyección vertical se representa formalmente con la letra griega π_{columnas}(TABLA). Extrae subconjuntos de atributos sin filtrar filas.'
        }
      ],
      syntax: `SELECT nombre, carrera, promedio AS nota_final\nFROM ESTUDIANTES;`,
      rule: 'Regla del Orden Lógico: Aunque el código empieza por SELECT, Oracle internamente empieza ejecutando FROM.'
    },
    example: {
      query: `SELECT nombre, carrera, promedio AS nota_final\nFROM ESTUDIANTES;`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Observa cómo Oracle primero carga los 12 registros de ESTUDIANTES y luego proyecta solo las 3 columnas solicitadas aplicando el alias.'
    }
  },
  {
    id: 2,
    title: 'DISTINCT',
    badge: 'Tema 02 • Deduplicación',
    concept: {
      subtitle: 'Eliminación de Tuplas Duplicadas en la Proyección',
      description: 'Las bases de datos contienen múltiples registros con valores repetidos en atributos comunes. DISTINCT filtra las réplicas dejando variantes únicas.',
      cards: [
        {
          icon: '🎯',
          title: 'Propósito de DISTINCT',
          text: 'Se coloca inmediatamente después de SELECT. Le ordena a Oracle inspeccionar las tuplas resultantes y descartar repeticiones exactas.'
        },
        {
          icon: '🧩',
          title: 'Evaluación de Fila Completa',
          text: 'DISTINCT no evalúa una sola columna en abstracto: evalúa la tupla proyectada en su conjunto. Si proyectas 2 columnas, ambas deben coincidir para considerarse duplicadas.'
        },
        {
          icon: '⚡',
          title: 'Ubicación en el Pipeline',
          text: 'La deduplicación ocurre después de evaluar el filtro WHERE y antes de realizar el ordenamiento final con ORDER BY.'
        },
        {
          icon: '💡',
          title: 'Catálogos y Listas Maestras',
          text: 'Es la técnica predilecta para obtener catálogos en tiempo real (ej. lista de carreras activas, ciudades de clientes o categorías de productos).'
        }
      ],
      syntax: `SELECT DISTINCT carrera\nFROM ESTUDIANTES;`,
      rule: 'Regla Crítica: De 12 estudiantes registrados, solo existen 4 carreras únicas. DISTINCT reduce las 12 tuplas a 4.'
    },
    example: {
      query: `SELECT DISTINCT carrera\nFROM ESTUDIANTES;`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Compara la salida con y sin DISTINCT. Nota cómo se eliminan 8 registros repetidos de Sistemas, Industrial y Medicina.'
    }
  },
  {
    id: 3,
    title: 'WHERE y Comparación',
    badge: 'Tema 03 • Filtro Relacional',
    concept: {
      subtitle: 'Selección Horizontal (σ) mediante Predicados Booleanos',
      description: 'La cláusula WHERE permite discriminar qué filas de una tabla deben conservarse según una condición booleana que evalúa a VERDADERO o FALSO.',
      cards: [
        {
          icon: '⚖️',
          title: 'Operadores de Comparación',
          text: 'Igualdad (=), Desigualdad estándar (<> o !=), y comparaciones de orden: menor (<), mayor (>), menor o igual (<=), mayor o igual (>=).'
        },
        {
          icon: '📝',
          title: 'Literales de Texto vs Números',
          text: 'Los valores numéricos se escriben directamente (promedio >= 4.5). Los textos van obligatoriamente entre comillas simples (\'Sistemas\').'
        },
        {
          icon: '⚛️',
          title: 'Álgebra Relacional: σ (Sigma)',
          text: 'El filtrado horizontal corresponde al operador σ_{condicion}(TABLA). Solo pasan aquellas tuplas donde la condición booleana es verdadera.'
        },
        {
          icon: '🛡️',
          title: 'Evaluación Temprana',
          text: 'WHERE se evalúa inmediatamente después de FROM. Oracle descarta filas antes de procesar cálculos o proyecciones, ahorrando recursos computacionales.'
        }
      ],
      syntax: `SELECT nombre, carrera, promedio\nFROM ESTUDIANTES\nWHERE promedio >= 4.5;`,
      rule: 'Regla Pedagógica: En SQL las comillas dobles " " son para identificadores; los valores de texto siempre usan comillas simples \' \'.'
    },
    example: {
      query: `SELECT nombre, carrera, promedio\nFROM ESTUDIANTES\nWHERE promedio >= 4.5;`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Observa en el pipeline cómo de las 12 tuplas, 7 son descartadas en rojo por no alcanzar 4.5 y solo 5 pasan en verde.'
    }
  },
  {
    id: 4,
    title: 'Operadores AND / OR',
    badge: 'Tema 04 • Lógica Booleana',
    concept: {
      subtitle: 'Composición de Condiciones y Precedencia de Operadores',
      description: 'Permite formular consultas con múltiples condiciones simultáneas o alternativas, controlando la precedencia mediante paréntesis.',
      cards: [
        {
          icon: '🔗',
          title: 'Conector AND (Y)',
          text: 'Exige que AMBAS condiciones sean verdaderas simultáneamente para que la tupla pase. Si una falla, la tupla se descarta.'
        },
        {
          icon: '🔀',
          title: 'Conector OR (O)',
          text: 'Aprueba la tupla si AL MENOS UNA de las condiciones es verdadera. Es más permisivo y expande el conjunto de resultados.'
        },
        {
          icon: '⚠️',
          title: 'Jerarquía de Precedencia',
          text: 'AND se evalúa antes que OR (análogo a multiplicación vs suma). Sin paréntesis, "A OR B AND C" se evalúa como "A OR (B AND C)".'
        },
        {
          icon: '🎯',
          title: 'El Poder de los Paréntesis ( )',
          text: 'Usa paréntesis para forzar el orden de evaluación deseado: "(carrera = \'Sistemas\' OR carrera = \'Industrial\') AND promedio >= 4.0".'
        }
      ],
      syntax: `SELECT nombre, carrera, promedio\nFROM ESTUDIANTES\nWHERE (carrera = 'Sistemas' OR carrera = 'Medicina')\n  AND promedio >= 4.5;`,
      rule: 'Regla de Oro en Aula: Siempre coloca paréntesis al mezclar AND y OR para evitar resultados lógicos engañosos.'
    },
    example: {
      query: `SELECT nombre, carrera, promedio\nFROM ESTUDIANTES\nWHERE (carrera = 'Sistemas' OR carrera = 'Medicina')\n  AND promedio >= 4.5;`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Muestra a la clase la diferencia de ejecutar con paréntesis frente a quitar los paréntesis en la consulta.'
    }
  },
  {
    id: 5,
    title: 'Operador BETWEEN',
    badge: 'Tema 05 • Intervalos Continuos',
    concept: {
      subtitle: 'Evaluación de Rangos Cerrados e Inclusivos',
      description: 'Una sintaxis concisa y matemática para verificar si un valor numérico, fecha o texto se encuentra dentro de dos límites conocidos.',
      cards: [
        {
          icon: '📏',
          title: 'Inclusivo en Extremos',
          text: 'En Oracle SQL, "x BETWEEN a AND b" equivale estrictamente a "x >= a AND x <= b". Ambos extremos "a" y "b" forman parte del resultado.'
        },
        {
          icon: '🧭',
          title: 'Requisito de Orden',
          text: 'El límite menor debe escribirse obligatoriamente primero: "BETWEEN 4 AND 7". Si se invierte ("BETWEEN 7 AND 4"), el resultado siempre será 0 tuplas.'
        },
        {
          icon: '🚫',
          title: 'Negación con NOT BETWEEN',
          text: 'Permite buscar registros que queden por fuera del intervalo: "promedio NOT BETWEEN 3.0 AND 4.0" (notas muy bajas o muy altas).'
        },
        {
          icon: '✨',
          title: 'Legibilidad del Código',
          text: 'Reemplaza dos comparaciones redundantes por una expresión limpia, mejorando el mantenimiento del código SQL empresarial.'
        }
      ],
      syntax: `SELECT nombre, carrera, semestre, promedio\nFROM ESTUDIANTES\nWHERE semestre BETWEEN 4 AND 6;`,
      rule: 'Regla de Oro: Siempre menor primero y mayor después. BETWEEN 4 AND 6 incluye tanto el semestre 4 como el 6.'
    },
    example: {
      query: `SELECT nombre, carrera, semestre, promedio\nFROM ESTUDIANTES\nWHERE semestre BETWEEN 4 AND 6;`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Comprueba cómo entran exactamente los semestres 4, 5 y 6, descartando los semestres 2, 3, 7 y 8.'
    }
  },
  {
    id: 6,
    title: 'Operador IN',
    badge: 'Tema 06 • Conjuntos Discretos',
    concept: {
      subtitle: 'Pertenencia a Conjuntos Finitos de Elementos',
      description: 'Comprueba si el valor de una columna coincide con cualquiera de los elementos enumerados dentro de una lista explícita entre paréntesis.',
      cards: [
        {
          icon: '📦',
          title: 'Sintaxis Limpia y Compacta',
          text: 'Escribir "ciudad IN (\'Bogotá\', \'Medellín\', \'Cali\')" sustituye tres cláusulas OR repetitivas sobre la misma columna.'
        },
        {
          icon: '🔁',
          title: 'Equivalencia Semántica',
          text: 'Equivale de manera idéntica a: (ciudad = \'Bogotá\' OR ciudad = \'Medellín\' OR ciudad = \'Cali\').'
        },
        {
          icon: '⚛️',
          title: 'Álgebra Relacional: ∈ (Pertenencia)',
          text: 'Se expresa formalmente como: ciudad ∈ {\'Bogotá\', \'Medellín\', \'Cali\'}.'
        },
        {
          icon: '🚫',
          title: 'Negación con NOT IN',
          text: 'Filtra tuplas cuyo valor no pertenezca al conjunto especificado (ej. estudiantes de ciudades foráneas).'
        }
      ],
      syntax: `SELECT nombre, carrera, ciudad\nFROM ESTUDIANTES\nWHERE ciudad IN ('Bogotá', 'Medellín', 'Cali');`,
      rule: 'Regla de Oro: Ideal para filtros discretos no contiguos donde BETWEEN no aplica (ej. ciudades, estados o carreras).'
    },
    example: {
      query: `SELECT nombre, carrera, ciudad\nFROM ESTUDIANTES\nWHERE ciudad IN ('Bogotá', 'Medellín', 'Cali');`,
      table: 'ESTUDIANTES',
      prompt: 'Demostración en vivo: Muestra cómo se filtran los estudiantes de Bogotá, Medellín y Cali, excluyendo Barranquilla, Bucaramanga y Cartagena.'
    }
  },
  {
    id: 7,
    title: 'Operador LIKE y Comodines',
    badge: 'Tema 07 • Patrones de Texto',
    concept: {
      subtitle: 'Búsqueda Flexible con Comodines Porcentaje (%) y Guión (_)',
      description: 'Permite encontrar cadenas de texto cuando no se conoce el valor exacto, o cuando se desea filtrar por prefijos, sufijos o subcadenas.',
      cards: [
        {
          icon: '🌐',
          title: 'Comodín Porcentaje (%)',
          text: 'Representa cero, uno o múltiples caracteres arbitrarios de cualquier longitud. \'SIS%\' busca cualquier texto que inicie con "SIS".'
        },
        {
          icon: '🎯',
          title: 'Comodín Guión Bajo (_)',
          text: 'Representa exactamente un único carácter individual. \'SIS___\' busca exactamente la palabra SIS seguida de 3 caracteres (longitud fija 6).'
        },
        {
          icon: '🔍',
          title: 'Contiene Subcadena (%texto%)',
          text: 'Para buscar una palabra en cualquier posición interna de la cadena: "nombre_curso LIKE \'%Datos%\'".'
        },
        {
          icon: '🔤',
          title: 'Sensibilidad a Mayúsculas',
          text: 'En Oracle SQL estándar, LIKE es sensible a mayúsculas y minúsculas (\'SIS%\' no coincide con \'sis101\').'
        }
      ],
      syntax: `SELECT id_curso, nombre_curso, departamento\nFROM CURSOS\nWHERE id_curso LIKE 'SIS%';`,
      rule: 'Regla Mnemotécnica en Clase: % = cualquier longitud (0 a infinito); _ = exactamente 1 carácter (longitud estricta).'
    },
    example: {
      query: `SELECT id_curso, nombre_curso, departamento\nFROM CURSOS\nWHERE id_curso LIKE 'SIS%';`,
      table: 'CURSOS',
      prompt: 'Demostración en vivo: Observa cómo \'SIS%\' recupera tanto SIS101 como SIS102. Prueba a cambiar el patrón a \'%Bases%\' en vivo.'
    }
  }
];

export class PresentationComponent {
  constructor(overlayContainerElement) {
    this.overlay = typeof overlayContainerElement === 'string'
      ? document.querySelector(overlayContainerElement)
      : overlayContainerElement;
    this.engine = new OracleSqlEngine(universityDb);
    this.currentTopicIndex = 0;
    this.currentPhase = 'CONCEPTO'; // 'CONCEPTO' | 'EJEMPLO'
    this.visualizerInstance = null;
    this.isOpen = false;

    if (this.overlay) {
      this.attachGlobalKeyboard();
    }
  }

  open(topicIndex = 0) {
    this.isOpen = true;
    this.currentTopicIndex = Math.max(0, Math.min(topicIndex, PRESENTATION_TOPICS.length - 1));
    this.currentPhase = 'CONCEPTO';
    this.overlay.classList.add('presentation-open');
    document.body.classList.add('expo-presentation-active');
    this.render();
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('presentation-open');
    document.body.classList.remove('expo-presentation-active');
    if (this.visualizerInstance) {
      this.visualizerInstance.stopPlayback();
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(0);
    }
  }

  next() {
    if (!this.isOpen) return;
    if (this.currentPhase === 'CONCEPTO') {
      // Pasar a la fase de ejemplo del mismo tema
      this.setPhase('EJEMPLO');
    } else {
      // Pasar al siguiente tema en fase de concepto
      if (this.currentTopicIndex < PRESENTATION_TOPICS.length - 1) {
        this.currentTopicIndex++;
        this.setPhase('CONCEPTO');
      }
    }
  }

  prev() {
    if (!this.isOpen) return;
    if (this.currentPhase === 'EJEMPLO') {
      // Volver a la fase de concepto del mismo tema
      this.setPhase('CONCEPTO');
    } else {
      // Volver al ejemplo del tema anterior
      if (this.currentTopicIndex > 0) {
        this.currentTopicIndex--;
        this.setPhase('EJEMPLO');
      }
    }
  }

  togglePhase() {
    if (!this.isOpen) return;
    this.setPhase(this.currentPhase === 'CONCEPTO' ? 'EJEMPLO' : 'CONCEPTO');
  }

  setPhase(phase) {
    this.currentPhase = phase;
    this.render();
  }

  setTopic(index) {
    if (index >= 0 && index < PRESENTATION_TOPICS.length) {
      this.currentTopicIndex = index;
      this.currentPhase = 'CONCEPTO';
      this.render();
    }
  }

  render() {
    if (!this.overlay) return;

    const topic = PRESENTATION_TOPICS[this.currentTopicIndex];
    const isConcept = this.currentPhase === 'CONCEPTO';

    this.overlay.innerHTML = `
      <div class="expo-presentation-viewport">
        <!-- TOPBAR DE LA EXPOSICIÓN -->
        <header class="expo-pres-topbar">
          <div class="expo-pres-brand" style="display: flex; align-items: center; gap: 14px;">
            <img src="img/logosistemas2024.png" alt="Logo Sistemas UPC" style="height: 40px; width: auto; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,200,83,0.35));">
            <div style="border-left: 1px solid rgba(255,255,255,0.12); padding-left: 12px;">
              <div style="font-weight: 800; font-size: 1.05rem; color: #fff; line-height: 1.2;">ExpoDB Básico</div>
              <div style="color: #69f0ae; font-size: 0.78rem; font-weight: 600;">Presentador: Juan Sebastián Patiño &bull; UPC</div>
            </div>
          </div>

          <!-- Selector de Fase Dual (Concepto vs Ejemplo) -->
          <div class="expo-phase-switch">
            <button class="btn-phase ${isConcept ? 'active' : ''}" id="btnSwitchConcept">
              <span>📖</span> 1. Explicar Concepto
            </button>
            <button class="btn-phase ${!isConcept ? 'active' : ''}" id="btnSwitchExample">
              <span>⚡</span> 2. Demostración en Vivo
            </button>
          </div>

          <!-- Acciones de control -->
          <div class="expo-pres-actions">
            <span class="badge badge-oracle">Tema ${this.currentTopicIndex + 1} de ${PRESENTATION_TOPICS.length}</span>
            <button class="btn-topbar" id="btnToggleFullscreen" title="Alternar Pantalla Completa (F11)">
              ⛶ Pantalla Completa
            </button>
            <button class="btn-topbar" id="btnClosePresentation" title="Salir del Modo Exposición (Esc)">
              ✕ Salir (Esc)
            </button>
          </div>
        </header>

        <!-- CONTENIDO DE LA DIAPOSITIVA ACTIVA -->
        <main class="expo-pres-slide-container">
          ${isConcept ? this.renderConceptSlide(topic) : this.renderExampleSlide(topic)}
        </main>

        <!-- DOCK FLOTANTE INFERIOR DEL PROFESOR / PONENTE -->
        <footer class="expo-pres-dock">
          <div class="expo-dock-nav">
            <button class="btn-dock" id="btnDockPrev" title="Anterior (Flecha Izquierda ◀)">
              ◀ Anterior
            </button>
            <div class="expo-dock-status">
              <strong>${topic.title}</strong>
              <span class="badge ${isConcept ? 'badge-cyan' : 'badge-emerald'}">
                ${isConcept ? 'Fase 1/2: Concepto Teórico' : 'Fase 2/2: Ejemplo en Vivo'}
              </span>
            </div>
            <button class="btn-dock btn-dock-primary" id="btnDockNext" title="Avanzar (Espacio o Flecha Derecha ▶)">
              ${isConcept ? 'Ver Ejemplo en Vivo ▶' : (this.currentTopicIndex < PRESENTATION_TOPICS.length - 1 ? 'Siguiente Tema ▶' : 'Finalizar Exposición ✓')}
            </button>
          </div>

          <div class="expo-dock-shortcuts" style="display: flex; align-items: center; gap: 16px;">
            <span style="color: #cbd5e1; font-size: 0.8rem;">👤 <strong>Juan Sebastián Patiño</strong> &bull; 🎓 <strong>Amílkar Sierra</strong></span>
            <span style="color: #334155;">|</span>
            <span>Atajos: <kbd>Espacio</kbd> avanzar &bull; <kbd>Tab</kbd> alternar &bull; <kbd>Esc</kbd> salir</span>
          </div>
        </footer>
      </div>
    `;

    this.attachEventListeners(topic);
  }

  renderConceptSlide(topic) {
    const c = topic.concept;
    return `
      <div class="slide-concept-layout animate-slide-fade">
        <div class="slide-concept-header">
          <div class="badge badge-cyan" style="font-size: 0.85rem; padding: 4px 12px;">${topic.badge}</div>
          <h1 class="slide-big-title">${topic.title}</h1>
          <p class="slide-subtitle">${c.subtitle}</p>
        </div>

        <!-- 4 Tarjetas visuales de ideas clave -->
        <div class="slide-cards-grid">
          ${c.cards.map(card => `
            <div class="slide-concept-card">
              <div class="slide-card-icon">${card.icon}</div>
              <h3 class="slide-card-title">${card.title}</h3>
              <p class="slide-card-text">${card.text}</p>
            </div>
          `).join('')}
        </div>

        <!-- Bloque de Sintaxis y Regla de Oro -->
        <div class="slide-syntax-panel">
          <div class="slide-syntax-box">
            <div class="slide-syntax-label">📜 Sintaxis Canónica en Oracle SQL:</div>
            <pre class="slide-syntax-code"><code>${this.escapeHtml(c.syntax)}</code></pre>
          </div>
          <div class="slide-rule-box">
            <div class="slide-rule-title">💡 Clave para la Clase:</div>
            <div class="slide-rule-text">${c.rule}</div>
            <button class="btn-execute btn-jump-to-example" style="margin-top: 14px; width: 100%; justify-content: center; font-size: 1rem; padding: 10px;">
              ▶ Ir a la Demostración Interactiva con la Base de Datos
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderExampleSlide(topic) {
    const ex = topic.example;
    return `
      <div class="slide-example-layout animate-slide-fade">
        <div class="slide-example-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="badge badge-emerald">Demostración en Vivo</span>
            <span class="badge badge-cyan">Tabla: ${ex.table}</span>
          </div>
          <h2 style="font-size: 1.5rem; color: #fff; margin-top: 4px;">${topic.title} — Consulta Interactiva</h2>
          <p style="color: #94a3b8; font-size: 0.95rem;">${ex.prompt}</p>
        </div>

        <!-- Editor en vivo de la exposición -->
        <div class="slide-demo-editor-card">
          <div class="sql-box-header" style="background: #0d121c; padding: 8px 14px; border-radius: var(--radius-sm) var(--radius-sm) 0 0;">
            <div class="sql-box-title">
              <span>⚡</span> Oracle SQL Worksheet (Editable en Vivo)
            </div>
            <div class="sql-box-actions">
              <button class="btn-sql-action btn-pres-reset-sql">↺ SQL Original</button>
              <button class="btn-sql-action btn-sql-run btn-pres-run-sql" style="font-size: 0.85rem; padding: 6px 14px;">
                ▶ Ejecutar en la Base de Datos (F9)
              </button>
            </div>
          </div>
          <div class="sql-editor-wrapper" style="border-radius: 0 0 var(--radius-sm) var(--radius-sm);">
            <textarea class="sql-editor-textarea pres-sql-input" style="font-size: 1.15rem; line-height: 1.6; min-height: 85px;">${ex.query}</textarea>
          </div>
        </div>

        <!-- Álgebra relacional en vivo -->
        <div class="relational-algebra-box pres-algebra-box" style="margin: 8px 0 16px;">
          <div class="algebra-title">
            <span>Álgebra Relacional Canónica (π y σ)</span>
            <span class="badge badge-oracle">Oracle Relational Model</span>
          </div>
          <div class="algebra-display pres-algebra-display" style="font-size: 1.1rem; padding: 8px 14px;"></div>
        </div>

        <!-- Visualizador interactivo del pipeline lógico -->
        <div id="presVisualizerContainer" style="margin-top: 8px;"></div>
      </div>
    `;
  }

  attachEventListeners(topic) {
    // Botones de cambio de fase en topbar
    const btnConcept = this.overlay.querySelector('#btnSwitchConcept');
    if (btnConcept) {
      btnConcept.addEventListener('click', () => this.setPhase('CONCEPTO'));
    }

    const btnExample = this.overlay.querySelector('#btnSwitchExample');
    if (btnExample) {
      btnExample.addEventListener('click', () => this.setPhase('EJEMPLO'));
    }

    // Salir
    const btnClose = this.overlay.querySelector('#btnClosePresentation');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    // Pantalla completa
    const btnFullscreen = this.overlay.querySelector('#btnToggleFullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Botones del Dock
    const btnNext = this.overlay.querySelector('#btnDockNext');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.next());
    }

    const btnPrev = this.overlay.querySelector('#btnDockPrev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => this.prev());
    }

    // Botón de salto de concepto a ejemplo
    const btnJump = this.overlay.querySelector('.btn-jump-to-example');
    if (btnJump) {
      btnJump.addEventListener('click', () => this.setPhase('EJEMPLO'));
    }

    // Si estamos en fase de ejemplo, inicializar el visualizador y editor en vivo
    if (this.currentPhase === 'EJEMPLO') {
      this.initExampleRunner(topic);
    }
  }

  initExampleRunner(topic) {
    const textarea = this.overlay.querySelector('.pres-sql-input');
    const runBtn = this.overlay.querySelector('.btn-pres-run-sql');
    const resetBtn = this.overlay.querySelector('.btn-pres-reset-sql');
    const vizContainer = this.overlay.querySelector('#presVisualizerContainer');
    const algebraDisplay = this.overlay.querySelector('.pres-algebra-display');

    if (!textarea || !vizContainer) return;

    const runQuery = () => {
      const sql = textarea.value.trim();
      const result = this.engine.execute(sql);

      // Álgebra relacional
      if (result.parsedQuery && algebraDisplay) {
        const algebra = AlgebraConverter.convert(result.parsedQuery);
        algebraDisplay.innerHTML = algebra.html;
      }

      // Visualizador
      if (!this.visualizerInstance) {
        this.visualizerInstance = new VisualizerComponent(vizContainer, result);
      } else {
        this.visualizerInstance.container = vizContainer;
        this.visualizerInstance.update(result);
      }
    };

    if (runBtn) {
      runBtn.addEventListener('click', runQuery);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        textarea.value = topic.example.query;
        runQuery();
      });
    }

    // Ejecución inicial automática al entrar a la diapositiva de ejemplo
    runQuery();
  }

  attachGlobalKeyboard() {
    window.addEventListener('keydown', (e) => {
      // F5 o Alt+E para activar/desactivar Modo Exposición
      if (e.key === 'F5' || (e.altKey && (e.key === 'e' || e.key === 'E'))) {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (!this.isOpen) return;

      // Escape para salir
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        return;
      }

      // Tab para alternar entre Concepto y Ejemplo
      if (e.key === 'Tab') {
        // Solo si el foco no está en el textarea
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.togglePhase();
          return;
        }
      }

      // Flechas o Espacio para avanzar/retroceder (si no está escribiendo en textarea)
      if (document.activeElement?.tagName !== 'TEXTAREA') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          this.next();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prev();
        }
      }
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
