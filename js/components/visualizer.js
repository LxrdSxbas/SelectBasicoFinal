// visualizer.js - Componente de Visualización del Pipeline Lógico de Oracle
// Conforme a la Constitución del Proyecto (Art. III.2 y Art. IV)

export class VisualizerComponent {
  /**
   * Crea un visualizador interactivo asociado a un contenedor DOM.
   * @param {HTMLElement|string} containerElement Elemento o selector donde se renderiza el visualizador.
   * @param {Object} executionResult Resultado devuelto por OracleSqlEngine.execute()
   */
  constructor(containerElement, executionResult = null) {
    this.container = typeof containerElement === 'string'
      ? document.querySelector(containerElement)
      : containerElement;
    this.trace = executionResult ? executionResult.pipelineTrace : [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.playInterval = null;

    if (this.container && this.trace.length > 0) {
      this.render();
    }
  }

  /**
   * Actualiza los datos del visualizador con una nueva ejecución SQL.
   */
  update(executionResult) {
    if (!executionResult || !executionResult.pipelineTrace) return;
    this.trace = executionResult.pipelineTrace;
    this.currentStepIndex = 0;
    this.stopPlayback();
    this.render();
  }

  render() {
    if (!this.container || !this.trace || this.trace.length === 0) return;

    const currentTraceItem = this.trace[this.currentStepIndex];

    this.container.innerHTML = `
      <div class="pipeline-visualizer-card">
        <div class="visualizer-header">
          <div class="visualizer-title-group">
            <div class="visualizer-icon">⚡</div>
            <div>
              <div class="visualizer-title">Pipeline de Ejecución Lógica de Oracle</div>
              <div class="visualizer-badge-order">Orden real: FROM → WHERE → DISTINCT → SELECT → ORDER BY</div>
            </div>
          </div>
          <div class="visualizer-controls-top">
            <span class="badge badge-cyan">Fase ${this.currentStepIndex + 1} de ${this.trace.length}</span>
          </div>
        </div>

        <!-- 5 Nodos de la barra de navegación del pipeline -->
        <div class="pipeline-stepper" role="tablist">
          ${this.trace.map((stepData, idx) => `
            <div class="pipeline-step-node ${idx === this.currentStepIndex ? 'active' : ''} ${idx < this.currentStepIndex ? 'completed' : ''}" 
                 data-step-idx="${idx}" 
                 title="Ver fase: ${stepData.stepName}">
              <span class="step-node-num">0${idx + 1}</span>
              <span class="step-node-name">${stepData.step}</span>
              <div class="step-node-indicator"></div>
            </div>
          `).join('')}
        </div>

        <!-- Panel de explicación detallada de la fase actual -->
        <div class="step-details-panel">
          <div class="step-details-header">
            <div class="step-details-title">
              <span>▶</span> ${currentTraceItem.stepName}
            </div>
            <div class="step-stats-pills">
              <span class="stat-pill">Tuplas procesadas: <strong>${currentTraceItem.inputRowsCount ?? currentTraceItem.outputRows?.length ?? 0}</strong></span>
              <span class="stat-pill">Tuplas resultantes: <strong>${currentTraceItem.outputRows?.length ?? 0}</strong></span>
            </div>
          </div>
          <p class="step-details-desc">${currentTraceItem.description}</p>
        </div>

        <!-- Visualización tabular del estado de los datos en este paso -->
        <div class="pipeline-table-stage">
          ${this.renderStageTable(currentTraceItem)}
        </div>

        <!-- Barra de reproducción y controles paso a paso -->
        <div class="visualizer-controls">
          <div class="playback-btn-group">
            <button class="btn-viz-control btn-viz-prev" ${this.currentStepIndex === 0 ? 'disabled' : ''} title="Paso anterior">
              ◀ Anterior
            </button>
            <button class="btn-viz-control btn-viz-play" title="${this.isPlaying ? 'Pausar animación' : 'Reproducir pipeline paso a paso'}">
              ${this.isPlaying ? '⏸ Pausar' : '▶ Animar'}
            </button>
            <button class="btn-viz-control btn-viz-next" ${this.currentStepIndex === this.trace.length - 1 ? 'disabled' : ''} title="Paso siguiente">
              Siguiente ▶
            </button>
          </div>
          <div>
            <button class="btn-viz-control btn-viz-reset" title="Reiniciar al paso 1 (FROM)">
              ↺ Reiniciar
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderStageTable(stepData) {
    const rows = stepData.outputRows || [];
    if (rows.length === 0) {
      return '<div style="padding: 24px; text-align: center; color: var(--text-muted);">Sin tuplas resultantes en esta fase.</div>';
    }

    // Determinar columnas a mostrar en este paso
    const firstRow = rows[0];
    const columns = Object.keys(firstRow).filter(k => !k.startsWith('__'));

    return `
      <table class="pipeline-table">
        <thead>
          <tr>
            <th class="row-num-col">#</th>
            ${columns.map(col => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, idx) => `
            <tr class="state-passed">
              <td class="row-num-col">${idx + 1}</td>
              ${columns.map(col => `<td>${row[col] ?? ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  attachEventListeners() {
    // Click en los pasos de la barra
    this.container.querySelectorAll('.pipeline-step-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-step-idx'), 10);
        this.goToStep(idx);
      });
    });

    // Botones de navegación
    const prevBtn = this.container.querySelector('.btn-viz-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    const nextBtn = this.container.querySelector('.btn-viz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    const playBtn = this.container.querySelector('.btn-viz-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    const resetBtn = this.container.querySelector('.btn-viz-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.goToStep(0));
    }
  }

  goToStep(index) {
    if (index >= 0 && index < this.trace.length) {
      this.currentStepIndex = index;
      this.render();
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.trace.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this.stopPlayback();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stopPlayback();
      this.render();
    } else {
      if (this.currentStepIndex >= this.trace.length - 1) {
        this.currentStepIndex = 0;
      }
      this.isPlaying = true;
      this.render();
      this.playInterval = setInterval(() => {
        if (this.currentStepIndex < this.trace.length - 1) {
          this.nextStep();
        } else {
          this.stopPlayback();
          this.render();
        }
      }, 1800);
    }
  }

  stopPlayback() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }
}
