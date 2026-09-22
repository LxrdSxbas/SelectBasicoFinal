// universityDb.js - Dataset oficial de ExpoDB Básico
// Conforme a la Constitución del Proyecto (Art. III.2 y Art. V.2)

export const universityDb = {
  tables: {
    ESTUDIANTES: {
      name: 'ESTUDIANTES',
      description: 'Registro principal de estudiantes activos e inactivos de la universidad',
      primaryKey: 'id',
      columns: [
        { name: 'id', type: 'NUMBER', description: 'Identificador único del estudiante' },
        { name: 'nombre', type: 'VARCHAR2', description: 'Primer nombre del estudiante' },
        { name: 'apellido', type: 'VARCHAR2', description: 'Primer apellido' },
        { name: 'carrera', type: 'VARCHAR2', description: 'Programa académico' },
        { name: 'semestre', type: 'NUMBER', description: 'Semestre actual cursado' },
        { name: 'promedio', type: 'NUMBER', description: 'Promedio acumulado (escala 0.0 - 5.0)' },
        { name: 'ciudad', type: 'VARCHAR2', description: 'Ciudad de residencia o procedencia' },
        { name: 'estado', type: 'VARCHAR2', description: 'Estado académico: ACTIVO o INACTIVO' }
      ],
      rows: [
        { id: 101, nombre: 'Alejandro', apellido: 'Gómez', carrera: 'Sistemas', semestre: 6, promedio: 4.6, ciudad: 'Bogotá', estado: 'ACTIVO' },
        { id: 102, nombre: 'Beatriz', apellido: 'Navarro', carrera: 'Industrial', semestre: 4, promedio: 3.8, ciudad: 'Medellín', estado: 'ACTIVO' },
        { id: 103, nombre: 'Carlos', apellido: 'Mendoza', carrera: 'Sistemas', semestre: 8, promedio: 4.2, ciudad: 'Cali', estado: 'ACTIVO' },
        { id: 104, nombre: 'Diana', apellido: 'Pérez', carrera: 'Medicina', semestre: 5, promedio: 4.8, ciudad: 'Bogotá', estado: 'ACTIVO' },
        { id: 105, nombre: 'Esteban', apellido: 'Ríos', carrera: 'Derecho', semestre: 2, promedio: 3.4, ciudad: 'Barranquilla', estado: 'ACTIVO' },
        { id: 106, nombre: 'Fernanda', apellido: 'Castro', carrera: 'Sistemas', semestre: 4, promedio: 3.9, ciudad: 'Medellín', estado: 'ACTIVO' },
        { id: 107, nombre: 'Gabriel', apellido: 'Ortega', carrera: 'Industrial', semestre: 7, promedio: 4.1, ciudad: 'Bucaramanga', estado: 'INACTIVO' },
        { id: 108, nombre: 'Helena', apellido: 'Vargas', carrera: 'Medicina', semestre: 3, promedio: 4.5, ciudad: 'Bogotá', estado: 'ACTIVO' },
        { id: 109, nombre: 'Ignacio', apellido: 'Daza', carrera: 'Derecho', semestre: 6, promedio: 3.2, ciudad: 'Cali', estado: 'INACTIVO' },
        { id: 110, nombre: 'Juliana', apellido: 'Torres', carrera: 'Sistemas', semestre: 5, promedio: 4.7, ciudad: 'Cartagena', estado: 'ACTIVO' },
        { id: 111, nombre: 'Kevin', apellido: 'Suárez', carrera: 'Industrial', semestre: 3, promedio: 3.6, ciudad: 'Bogotá', estado: 'ACTIVO' },
        { id: 112, nombre: 'Laura', apellido: 'Mora', carrera: 'Medicina', semestre: 8, promedio: 4.9, ciudad: 'Medellín', estado: 'ACTIVO' }
      ]
    },
    CURSOS: {
      name: 'CURSOS',
      description: 'Catálogo de asignaturas impartidas en la universidad',
      primaryKey: 'id_curso',
      columns: [
        { name: 'id_curso', type: 'VARCHAR2', description: 'Código único de la asignatura' },
        { name: 'nombre_curso', type: 'VARCHAR2', description: 'Nombre descriptivo del curso' },
        { name: 'departamento', type: 'VARCHAR2', description: 'Facultad o departamento responsable' },
        { name: 'creditos', type: 'NUMBER', description: 'Número de créditos académicos' },
        { name: 'cupo_maximo', type: 'NUMBER', description: 'Capacidad máxima de estudiantes' }
      ],
      rows: [
        { id_curso: 'SIS101', nombre_curso: 'Bases de Datos I', departamento: 'Sistemas', creditos: 4, cupo_maximo: 35 },
        { id_curso: 'SIS102', nombre_curso: 'Algoritmos y Lógica', departamento: 'Sistemas', creditos: 3, cupo_maximo: 40 },
        { id_curso: 'IND201', nombre_curso: 'Investigación de Operaciones', departamento: 'Industrial', creditos: 4, cupo_maximo: 30 },
        { id_curso: 'IND202', nombre_curso: 'Control Estadístico', departamento: 'Industrial', creditos: 3, cupo_maximo: 25 },
        { id_curso: 'MED301', nombre_curso: 'Anatomía Humana', departamento: 'Medicina', creditos: 5, cupo_maximo: 20 },
        { id_curso: 'MED302', nombre_curso: 'Fisiología General', departamento: 'Medicina', creditos: 4, cupo_maximo: 25 },
        { id_curso: 'DER101', nombre_curso: 'Derecho Constitucional', departamento: 'Derecho', creditos: 3, cupo_maximo: 45 },
        { id_curso: 'DER102', nombre_curso: 'Derecho Civil Bienes', departamento: 'Derecho', creditos: 3, cupo_maximo: 35 }
      ]
    },
    MATRICULAS: {
      name: 'MATRICULAS',
      description: 'Registro de inscripciones académicas por periodo',
      primaryKey: 'id_matricula',
      columns: [
        { name: 'id_matricula', type: 'NUMBER', description: 'Código consecutivo de matrícula' },
        { name: 'id_estudiante', type: 'NUMBER', description: 'Identificador del estudiante' },
        { name: 'id_curso', type: 'VARCHAR2', description: 'Código de la asignatura' },
        { name: 'calificacion', type: 'NUMBER', description: 'Nota final obtenida (0.0 a 5.0)' },
        { name: 'periodo', type: 'VARCHAR2', description: 'Periodo académico (Ej. 2026-1)' }
      ],
      rows: [
        { id_matricula: 501, id_estudiante: 101, id_curso: 'SIS101', calificacion: 4.8, periodo: '2026-1' },
        { id_matricula: 502, id_estudiante: 103, id_curso: 'SIS101', calificacion: 4.0, periodo: '2026-1' },
        { id_matricula: 503, id_estudiante: 106, id_curso: 'SIS102', calificacion: 3.7, periodo: '2026-1' },
        { id_matricula: 504, id_estudiante: 102, id_curso: 'IND201', calificacion: 3.9, periodo: '2026-1' },
        { id_matricula: 505, id_estudiante: 104, id_curso: 'MED301', calificacion: 4.9, periodo: '2026-1' },
        { id_matricula: 506, id_estudiante: 108, id_curso: 'MED302', calificacion: 4.6, periodo: '2026-1' },
        { id_matricula: 507, id_estudiante: 105, id_curso: 'DER101', calificacion: 3.5, periodo: '2026-1' },
        { id_matricula: 508, id_estudiante: 110, id_curso: 'SIS101', calificacion: 4.7, periodo: '2026-1' }
      ]
    }
  }
};
