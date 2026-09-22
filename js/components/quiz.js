// quiz.js - Cuestionario Evaluativo Final ExpoDB Básico
// Conforme a la Constitución del Proyecto (Art. II.1, III.2 y IV)

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: '1. SELECT y FROM',
    question: 'En Oracle SQL, ¿cuál es la forma correcta de consultar las columnas "nombre" y "promedio" de la tabla "ESTUDIANTES" asignando el alias "nota_final" al promedio?',
    code: null,
    options: [
      { text: 'SELECT nombre, promedio AS nota_final FROM ESTUDIANTES;', isCorrect: true, explanation: '¡Correcto! En Oracle SQL, la palabra clave opcional AS o un espacio después del nombre de columna define un alias para la proyección.' },
      { text: 'SELECT nombre, nota_final = promedio FROM ESTUDIANTES;', isCorrect: false, explanation: 'Incorrecto. La sintaxis "alias = columna" corresponde a dialectos como T-SQL, no es estándar en Oracle SQL.' },
      { text: 'FROM ESTUDIANTES SELECT nombre, promedio AS nota_final;', isCorrect: false, explanation: 'Incorrecto. Aunque el orden de ejecución lógico comience por FROM, la sintaxis escrita debe comenzar obligatoriamente con SELECT.' },
      { text: 'SELECT * FROM ESTUDIANTES WHERE alias(promedio, nota_final);', isCorrect: false, explanation: 'Incorrecto. Los alias se definen en la cláusula SELECT, no en el predicado WHERE.' }
    ]
  },
  {
    id: 2,
    topic: '2. DISTINCT',
    question: 'Si ejecutamos la siguiente consulta sobre una tabla con 12 estudiantes donde 4 estudian "Sistemas", 3 "Medicina", 3 "Industrial" y 2 "Derecho":',
    code: 'SELECT DISTINCT carrera FROM ESTUDIANTES;',
    options: [
      { text: 'Retorna 4 filas, una por cada nombre de carrera única.', isCorrect: true, explanation: '¡Correcto! DISTINCT elimina las tuplas duplicadas de la proyección, dejando una sola tupla por valor único encontrado.' },
      { text: 'Retorna 12 filas porque DISTINCT solo cuenta los registros.', isCorrect: false, explanation: 'Incorrecto. DISTINCT deduplica físicamente las filas del conjunto resultante.' },
      { text: 'Genera un error de sintaxis porque falta el operador WHERE.', isCorrect: false, explanation: 'Incorrecto. DISTINCT es perfectamente válido y común sin necesidad de una cláusula WHERE.' },
      { text: 'Retorna únicamente la primera carrera encontrada en la tabla.', isCorrect: false, explanation: 'Incorrecto. No limita a un solo resultado, sino a todas las variantes únicas.' }
    ]
  },
  {
    id: 3,
    topic: '3. WHERE y Comparación',
    question: 'En Oracle SQL, ¿cuál operador se utiliza para filtrar filas donde un valor NO sea igual a otro?',
    code: null,
    options: [
      { text: '<> o != (ambos son válidos para indicar desigualdad)', isCorrect: true, explanation: '¡Correcto! Oracle SQL soporta tanto el operador estándar ANSI (<>) como la sintaxis moderna (!=).' },
      { text: 'NOT EQUAL exclusivamente', isCorrect: false, explanation: 'Incorrecto. "NOT EQUAL" no es una palabra reservada válida en SQL.' },
      { text: '== para igualdad y !== para desigualdad', isCorrect: false, explanation: 'Incorrecto. En SQL la igualdad es un solo signo igual (=) y la desigualdad es <> o !=.' },
      { text: '# o ~', isCorrect: false, explanation: 'Incorrecto. Dichos símbolos no son operadores de comparación en SQL.' }
    ]
  },
  {
    id: 4,
    topic: '4. Operadores Lógicos AND / OR',
    question: '¿Cuál es la regla de precedencia por defecto entre AND y OR cuando no se usan paréntesis?',
    code: "SELECT * FROM ESTUDIANTES \nWHERE carrera = 'Sistemas' OR carrera = 'Industrial' AND promedio >= 4.0;",
    options: [
      { text: 'AND tiene mayor precedencia y se evalúa antes que OR.', isCorrect: true, explanation: '¡Exacto! El operador AND actúa de forma análoga a la multiplicación en álgebra y se resuelve antes que el OR, salvo que se usen paréntesis ( ).' },
      { text: 'OR tiene mayor precedencia y se evalúa antes que AND.', isCorrect: false, explanation: 'Incorrecto. AND precede estrictamente a OR en el estándar SQL.' },
      { text: 'Se evalúan estrictamente de izquierda a derecha sin importar el operador.', isCorrect: false, explanation: 'Incorrecto. Existe una jerarquía de operadores bien definida en SQL.' },
      { text: 'Oracle rechaza la consulta si no se colocan paréntesis obligatorios.', isCorrect: false, explanation: 'Incorrecto. Es sintácticamente válido, aunque puede producir resultados inesperados por la precedencia.' }
    ]
  },
  {
    id: 5,
    topic: '5. BETWEEN',
    question: 'Sobre la cláusula BETWEEN en la siguiente sentencia:',
    code: 'SELECT * FROM ESTUDIANTES WHERE semestre BETWEEN 3 AND 6;',
    options: [
      { text: 'Incluye los extremos: equivale exactamente a semestre >= 3 AND semestre <= 6.', isCorrect: true, explanation: '¡Correcto! En Oracle SQL, el operador BETWEEN es inclusivo en ambos límites (cerrado en ambos lados).' },
      { text: 'Es exclusivo: solo incluye semestres 4 y 5.', isCorrect: false, explanation: 'Incorrecto. BETWEEN siempre incluye los valores límites indicados.' },
      { text: 'Solo funciona con fechas, no con números enteros.', isCorrect: false, explanation: 'Incorrecto. BETWEEN opera tanto con tipos NUMBER como DATE y VARCHAR2.' },
      { text: 'Requiere que el valor mayor se coloque antes que el menor (BETWEEN 6 AND 3).', isCorrect: false, explanation: 'Incorrecto. La sintaxis exige BETWEEN menor AND mayor; invertirlo resultaría en 0 filas.' }
    ]
  },
  {
    id: 6,
    topic: '6. Operador IN',
    question: '¿Qué ventaja pedagógica y sintáctica ofrece el operador IN frente a múltiples comparaciones?',
    code: "SELECT * FROM ESTUDIANTES \nWHERE ciudad IN ('Bogotá', 'Medellín', 'Cali');",
    options: [
      { text: 'Es una forma concisa y legible de expresar múltiples condiciones OR sobre la misma columna.', isCorrect: true, explanation: '¡Correcto! Equivale a (ciudad = \'Bogotá\' OR ciudad = \'Medellín\' OR ciudad = \'Cali\'), siendo mucho más claro.' },
      { text: 'Permite unir tablas sin necesidad de usar un JOIN.', isCorrect: false, explanation: 'Incorrecto. IN evalúa pertenencia a una lista de literales, no une tablas.' },
      { text: 'Convierte el texto a mayúsculas automáticamente antes de comparar.', isCorrect: false, explanation: 'Incorrecto. Las comparaciones de cadenas en Oracle respetan la concordancia del texto.' },
      { text: 'Elimina los duplicados de la tabla automáticamente.', isCorrect: false, explanation: 'Incorrecto. Para eliminar duplicados en la salida se utiliza DISTINCT.' }
    ]
  },
  {
    id: 7,
    topic: '7. Operador LIKE y Comodines',
    question: 'En una cláusula LIKE, ¿cuál es la diferencia entre el comodín "%" (porcentaje) y "_" (guión bajo)?',
    code: "SELECT * FROM CURSOS WHERE id_curso LIKE 'SIS___';",
    options: [
      { text: '"%" representa 0 o más caracteres arbitrarios, mientras que "_" representa exactamente un único carácter.', isCorrect: true, explanation: '¡Correcto! Por ejemplo, \'SIS___\' busca exactamente la palabra SIS seguida de 3 caracteres cualesquiera (longitud fija 6).' },
      { text: '"_" representa cualquier texto largo y "%" representa un espacio en blanco.', isCorrect: false, explanation: 'Incorrecto. Los roles están invertidos.' },
      { text: 'En Oracle SQL no existe el guión bajo, únicamente se usa el asterisco (*).', isCorrect: false, explanation: 'Incorrecto. El asterisco es para selección de columnas (*), para patrones se usa % y _.' },
      { text: 'Ambos comodines hacen exactamente lo mismo sin distinción.', isCorrect: false, explanation: 'Incorrecto. Tienen cardinalidades completamente distintas: uno es de longitud fija (1) y el otro variable (0..N).' }
    ]
  }
];

export class QuizComponent {
  constructor(containerElement) {
    this.container = typeof containerElement === 'string'
      ? document.querySelector(containerElement)
      : containerElement;
    this.userAnswers = {}; // { questionId: { selectedIndex, isCorrect } }
    this.currentQuestionIndex = 0;

    if (this.container) {
      this.render();
    }
  }

  render() {
    if (!this.container) return;

    const totalQuestions = QUIZ_QUESTIONS.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    const correctCount = Object.values(this.userAnswers).filter(a => a.isCorrect).length;
    const isCompleted = answeredCount === totalQuestions;

    const q = QUIZ_QUESTIONS[this.currentQuestionIndex];
    const userAns = this.userAnswers[q.id];

    this.container.innerHTML = `
      <div class="quiz-wrapper">
        <!-- Barra de Progreso del Cuestionario -->
        <div class="quiz-progress-bar">
          <div>
            <strong>Pregunta ${this.currentQuestionIndex + 1} de ${totalQuestions}</strong>
            <span style="color: var(--text-muted); margin-left: 8px;">(${q.topic})</span>
          </div>
          <div>
            <span class="badge ${correctCount > 0 ? 'badge-emerald' : 'badge-cyan'}">
              Puntaje: ${correctCount} / ${totalQuestions}
            </span>
          </div>
        </div>

        <!-- Tarjeta de Pregunta Activa -->
        <div class="quiz-card">
          <h3 class="quiz-question-title">${q.question}</h3>

          ${q.code ? `
            <div class="quiz-code-snippet">
              <pre><code>${this.escapeHtml(q.code)}</code></pre>
            </div>
          ` : ''}

          <div class="quiz-options-list">
            ${q.options.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              let stateClass = '';
              if (userAns) {
                if (userAns.selectedIndex === optIdx) {
                  stateClass = opt.isCorrect ? 'selected-correct' : 'selected-wrong';
                } else if (opt.isCorrect) {
                  stateClass = 'selected-correct';
                }
              }

              return `
                <button class="quiz-option-btn ${stateClass}" data-opt-idx="${optIdx}" ${userAns ? 'disabled' : ''}>
                  <span class="quiz-option-letter">${letter}</span>
                  <span style="flex: 1;">${opt.text}</span>
                  ${userAns && opt.isCorrect ? '<span>✅</span>' : ''}
                  ${userAns && userAns.selectedIndex === optIdx && !opt.isCorrect ? '<span>❌</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Retroalimentación Instantánea -->
          ${userAns ? `
            <div class="quiz-feedback-explanation" style="background: ${userAns.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(234,28,4,0.1)'}; border: 1px solid ${userAns.isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(234,28,4,0.3)'}; color: ${userAns.isCorrect ? '#6ee7b7' : '#fca5a5'};">
              <strong>${userAns.isCorrect ? '🎉 ¡Respuesta Correcta!' : '💡 Explicación:'}</strong>
              <p style="margin-top: 4px; color: #e2e8f0;">${q.options[userAns.selectedIndex].explanation}</p>
            </div>
          ` : ''}

          <!-- Controles de navegación entre preguntas -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-xl); padding-top: var(--space-md); border-top: 1px solid var(--border-subtle);">
            <button class="btn-secondary btn-quiz-prev" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              ◀ Anterior
            </button>
            <div style="display: flex; gap: 6px;">
              ${QUIZ_QUESTIONS.map((_, i) => `
                <button class="btn-secondary btn-quiz-jump" data-q-idx="${i}" style="width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; ${i === this.currentQuestionIndex ? 'border-color: var(--neon-cyan); color: var(--neon-cyan);' : ''}">
                  ${i + 1}
                </button>
              `).join('')}
            </div>
            <button class="btn-execute btn-quiz-next" ${this.currentQuestionIndex === totalQuestions - 1 ? 'disabled' : ''}>
              Siguiente ▶
            </button>
          </div>
        </div>

        <!-- Tarjeta de Certificado / Finalización -->
        ${isCompleted ? `
          <div class="quiz-cert-card">
            <div class="cert-badge-icon">🏆</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 8px;">¡Felicitaciones! Has completado el Quiz de ExpoDB Básico</h2>
            <p style="color: #cbd5e1; max-width: 600px; margin: 0 auto var(--space-lg);">
              Has respondido las 7 preguntas del temario constitucional con un puntaje final de 
              <strong style="color: var(--neon-cyan); font-size: 1.2em;">${correctCount} de ${totalQuestions} (${Math.round((correctCount / totalQuestions) * 100)}%)</strong>.
            </p>
            <div style="margin: 16px auto var(--space-lg); padding: 10px 18px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); max-width: 500px; display: flex; justify-content: space-around; align-items: center; font-size: 0.85rem;">
              <div>
                <span style="color: var(--neon-cyan); font-size: 0.7rem; text-transform: uppercase; font-weight: 700; display: block;">Presentador</span>
                <strong style="color: #fff;">Juan Sebastián Patiño</strong>
              </div>
              <div style="height: 24px; width: 1px; background: var(--border-subtle);"></div>
              <div>
                <span style="color: var(--amber-gold); font-size: 0.7rem; text-transform: uppercase; font-weight: 700; display: block;">Docente</span>
                <strong style="color: #fff;">Amílkar Sierra</strong>
              </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 12px;">
              <button class="btn-execute btn-quiz-restart">↺ Reiniciar Cuestionario</button>
              <a href="#section-8" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 6px;">
                Ir al Playground Libre 🚀
              </a>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Selección de respuesta
    this.container.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const optIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
        this.selectAnswer(optIdx);
      });
    });

    // Navegación
    const prevBtn = this.container.querySelector('.btn-quiz-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.render();
        }
      });
    }

    const nextBtn = this.container.querySelector('.btn-quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
          this.currentQuestionIndex++;
          this.render();
        }
      });
    }

    // Salto directo a pregunta
    this.container.querySelectorAll('.btn-quiz-jump').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qIdx = parseInt(e.currentTarget.getAttribute('data-q-idx'), 10);
        this.currentQuestionIndex = qIdx;
        this.render();
      });
    });

    // Reiniciar
    const restartBtn = this.container.querySelector('.btn-quiz-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.userAnswers = {};
        this.currentQuestionIndex = 0;
        this.render();
      });
    }
  }

  selectAnswer(selectedIndex) {
    const q = QUIZ_QUESTIONS[this.currentQuestionIndex];
    if (this.userAnswers[q.id]) return; // ya respondida

    const isCorrect = q.options[selectedIndex].isCorrect;
    this.userAnswers[q.id] = { selectedIndex, isCorrect };

    this.render();

    // Actualizar progreso en la app si hay callback
    if (typeof window.onQuizAnswered === 'function') {
      window.onQuizAnswered(Object.keys(this.userAnswers).length, QUIZ_QUESTIONS.length);
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
