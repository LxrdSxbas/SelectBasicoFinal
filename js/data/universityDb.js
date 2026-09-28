// universityDb.js / hrDb.js - Dataset Oficial de Oracle Human Resources (HR)
// Esquema relacional estándar de Oracle para sentencias SELECT básicas

export const hrDb = {
  name: 'Oracle HR (Human Resources)',
  description: 'Esquema relacional clásico de Oracle Database para la gestión de recursos humanos',
  tables: {
    REGIONS: {
      name: 'REGIONS',
      description: 'Regiones geográficas mundiales donde opera la organización',
      primaryKey: 'region_id',
      columns: [
        { name: 'region_id', type: 'NUMBER', description: 'Identificador único de la región (PK)' },
        { name: 'region_name', type: 'VARCHAR2', description: 'Nombre descriptivo de la región' }
      ],
      rows: [
        { region_id: 1, region_name: 'Europe' },
        { region_id: 2, region_name: 'Americas' },
        { region_id: 3, region_name: 'Asia' },
        { region_id: 4, region_name: 'Middle East and Africa' }
      ]
    },

    COUNTRIES: {
      name: 'COUNTRIES',
      description: 'Países agrupados por región geográfica',
      primaryKey: 'country_id',
      columns: [
        { name: 'country_id', type: 'VARCHAR2', description: 'Código ISO de dos letras del país (PK)' },
        { name: 'country_name', type: 'VARCHAR2', description: 'Nombre del país' },
        { name: 'region_id', type: 'NUMBER', description: 'Identificador de la región (FK)' }
      ],
      rows: [
        { country_id: 'US', country_name: 'United States of America', region_id: 2 },
        { country_id: 'CA', country_name: 'Canada', region_id: 2 },
        { country_id: 'UK', country_name: 'United Kingdom', region_id: 1 },
        { country_id: 'DE', country_name: 'Germany', region_id: 1 },
        { country_id: 'JP', country_name: 'Japan', region_id: 3 },
        { country_id: 'BR', country_name: 'Brazil', region_id: 2 }
      ]
    },

    LOCATIONS: {
      name: 'LOCATIONS',
      description: 'Sedes e instalaciones físicas de la compañía',
      primaryKey: 'location_id',
      columns: [
        { name: 'location_id', type: 'NUMBER', description: 'Código identificador de la sede (PK)' },
        { name: 'street_address', type: 'VARCHAR2', description: 'Dirección física de la oficina' },
        { name: 'postal_code', type: 'VARCHAR2', description: 'Código postal' },
        { name: 'city', type: 'VARCHAR2', description: 'Ciudad donde se ubica la instalación' },
        { name: 'state_province', type: 'VARCHAR2', description: 'Estado o provincia' },
        { name: 'country_id', type: 'VARCHAR2', description: 'País de localización (FK)' }
      ],
      rows: [
        { location_id: 1400, street_address: '2014 Jabberwocky Rd', postal_code: '26192', city: 'Southlake', state_province: 'Texas', country_id: 'US' },
        { location_id: 1500, street_address: '2011 Interiors Blvd', postal_code: '99236', city: 'South San Francisco', state_province: 'California', country_id: 'US' },
        { location_id: 1700, street_address: '2004 Charade Rd', postal_code: '98199', city: 'Seattle', state_province: 'Washington', country_id: 'US' },
        { location_id: 1800, street_address: '460 Bloor St. W.', postal_code: 'ON M5S 1X8', city: 'Toronto', state_province: 'Ontario', country_id: 'CA' },
        { location_id: 2500, street_address: 'Magdalen Centre, The Oxford Science Park', postal_code: 'OX9 9ZB', city: 'Oxford', state_province: 'Oxford', country_id: 'UK' }
      ]
    },

    DEPARTMENTS: {
      name: 'DEPARTMENTS',
      description: 'Departamentos operativos y administrativos de la empresa',
      primaryKey: 'department_id',
      columns: [
        { name: 'department_id', type: 'NUMBER', description: 'Identificador único del departamento (PK)' },
        { name: 'department_name', type: 'VARCHAR2', description: 'Nombre oficial del departamento' },
        { name: 'manager_id', type: 'NUMBER', description: 'Identificador del gerente del área (FK)' },
        { name: 'location_id', type: 'NUMBER', description: 'Identificador de la sede física (FK)' }
      ],
      rows: [
        { department_id: 10, department_name: 'Administration', manager_id: 200, location_id: 1700 },
        { department_id: 20, department_name: 'Marketing', manager_id: 201, location_id: 1800 },
        { department_id: 50, department_name: 'Shipping', manager_id: 120, location_id: 1500 },
        { department_id: 60, department_name: 'IT', manager_id: 103, location_id: 1400 },
        { department_id: 80, department_name: 'Sales', manager_id: 145, location_id: 2500 },
        { department_id: 90, department_name: 'Executive', manager_id: 100, location_id: 1700 }
      ]
    },

    JOBS: {
      name: 'JOBS',
      description: 'Catálogo de cargos, roles profesionales y rangos salariales',
      primaryKey: 'job_id',
      columns: [
        { name: 'job_id', type: 'VARCHAR2', description: 'Código único del cargo (PK)' },
        { name: 'job_title', type: 'VARCHAR2', description: 'Título oficial del puesto de trabajo' },
        { name: 'min_salary', type: 'NUMBER', description: 'Salario mínimo establecido para el puesto' },
        { name: 'max_salary', type: 'NUMBER', description: 'Salario tope máximo para el puesto' }
      ],
      rows: [
        { job_id: 'AD_PRES', job_title: 'President', min_salary: 20080, max_salary: 40000 },
        { job_id: 'AD_VP', job_title: 'Administration Vice President', min_salary: 15000, max_salary: 30000 },
        { job_id: 'AD_ASST', job_title: 'Administration Assistant', min_salary: 3000, max_salary: 6000 },
        { job_id: 'IT_PROG', job_title: 'Programmer', min_salary: 4000, max_salary: 10000 },
        { job_id: 'MK_MAN', job_title: 'Marketing Manager', min_salary: 9000, max_salary: 15000 },
        { job_id: 'MK_REP', job_title: 'Marketing Representative', min_salary: 4000, max_salary: 9000 },
        { job_id: 'SA_MAN', job_title: 'Sales Manager', min_salary: 10000, max_salary: 20080 },
        { job_id: 'SA_REP', job_title: 'Sales Representative', min_salary: 6000, max_salary: 12008 },
        { job_id: 'ST_MAN', job_title: 'Stock Manager', min_salary: 5500, max_salary: 8500 },
        { job_id: 'ST_CLERK', job_title: 'Stock Clerk', min_salary: 2008, max_salary: 5000 }
      ]
    },

    EMPLOYEES: {
      name: 'EMPLOYEES',
      description: 'Registro maestro de todos los empleados contratados por la organización',
      primaryKey: 'employee_id',
      columns: [
        { name: 'employee_id', type: 'NUMBER', description: 'Número único de identificación del empleado (PK)' },
        { name: 'first_name', type: 'VARCHAR2', description: 'Primer nombre del empleado' },
        { name: 'last_name', type: 'VARCHAR2', description: 'Primer o segundo apellido' },
        { name: 'email', type: 'VARCHAR2', description: 'Identificador único de correo corporativo' },
        { name: 'phone_number', type: 'VARCHAR2', description: 'Número telefónico de contacto' },
        { name: 'hire_date', type: 'VARCHAR2', description: 'Fecha de ingreso a la compañía (YYYY-MM-DD)' },
        { name: 'job_id', type: 'VARCHAR2', description: 'Código del cargo actual del empleado (FK)' },
        { name: 'salary', type: 'NUMBER', description: 'Salario mensual en dólares' },
        { name: 'commission_pct', type: 'NUMBER', description: 'Porcentaje de comisión sobre ventas (0.0 a 1.0)' },
        { name: 'manager_id', type: 'NUMBER', description: 'Identificador del jefe inmediato del empleado (FK)' },
        { name: 'department_id', type: 'NUMBER', description: 'Identificador del departamento al que pertenece (FK)' }
      ],
      rows: [
        { employee_id: 100, first_name: 'Steven', last_name: 'King', email: 'SKING', phone_number: '515.123.4567', hire_date: '2003-06-17', job_id: 'AD_PRES', salary: 24000, commission_pct: null, manager_id: null, department_id: 90 },
        { employee_id: 101, first_name: 'Neena', last_name: 'Kochhar', email: 'NKOCHHAR', phone_number: '515.123.4568', hire_date: '2005-09-21', job_id: 'AD_VP', salary: 17000, commission_pct: null, manager_id: 100, department_id: 90 },
        { employee_id: 102, first_name: 'Lex', last_name: 'De Haan', email: 'LDEHAAN', phone_number: '515.123.4569', hire_date: '2001-01-13', job_id: 'AD_VP', salary: 17000, commission_pct: null, manager_id: 100, department_id: 90 },
        { employee_id: 103, first_name: 'Alexander', last_name: 'Hunold', email: 'AHUNOLD', phone_number: '590.423.4567', hire_date: '2006-01-03', job_id: 'IT_PROG', salary: 9000, commission_pct: null, manager_id: 102, department_id: 60 },
        { employee_id: 104, first_name: 'Bruce', last_name: 'Ernst', email: 'BERNST', phone_number: '590.423.4568', hire_date: '2007-05-21', job_id: 'IT_PROG', salary: 6000, commission_pct: null, manager_id: 103, department_id: 60 },
        { employee_id: 105, first_name: 'David', last_name: 'Austin', email: 'DAUSTIN', phone_number: '590.423.4569', hire_date: '2005-06-25', job_id: 'IT_PROG', salary: 4800, commission_pct: null, manager_id: 103, department_id: 60 },
        { employee_id: 106, first_name: 'Valli', last_name: 'Pataballa', email: 'VPATABAL', phone_number: '590.423.4560', hire_date: '2006-02-05', job_id: 'IT_PROG', salary: 4800, commission_pct: null, manager_id: 103, department_id: 60 },
        { employee_id: 107, first_name: 'Diana', last_name: 'Lorentz', email: 'DLORENTZ', phone_number: '590.423.5567', hire_date: '2007-02-07', job_id: 'IT_PROG', salary: 4200, commission_pct: null, manager_id: 103, department_id: 60 },
        { employee_id: 120, first_name: 'Matthew', last_name: 'Weiss', email: 'MWEISS', phone_number: '650.123.1234', hire_date: '2004-07-18', job_id: 'ST_MAN', salary: 8000, commission_pct: null, manager_id: 100, department_id: 50 },
        { employee_id: 141, first_name: 'Trenna', last_name: 'Rajs', email: 'TRAJS', phone_number: '650.121.8009', hire_date: '2003-10-17', job_id: 'ST_CLERK', salary: 3500, commission_pct: null, manager_id: 120, department_id: 50 },
        { employee_id: 142, first_name: 'Curtis', last_name: 'Davies', email: 'CDAVIES', phone_number: '650.121.2994', hire_date: '2005-01-29', job_id: 'ST_CLERK', salary: 3100, commission_pct: null, manager_id: 120, department_id: 50 },
        { employee_id: 143, first_name: 'Randall', last_name: 'Matos', email: 'RMATOS', phone_number: '650.121.2874', hire_date: '2006-03-15', job_id: 'ST_CLERK', salary: 2600, commission_pct: null, manager_id: 120, department_id: 50 },
        { employee_id: 144, first_name: 'Peter', last_name: 'Vargas', email: 'PVARGAS', phone_number: '650.121.2004', hire_date: '2006-07-09', job_id: 'ST_CLERK', salary: 2500, commission_pct: null, manager_id: 120, department_id: 50 },
        { employee_id: 145, first_name: 'John', last_name: 'Russell', email: 'JRUSSELL', phone_number: '011.44.1344.429268', hire_date: '2004-10-01', job_id: 'SA_MAN', salary: 14000, commission_pct: 0.40, manager_id: 100, department_id: 80 },
        { employee_id: 176, first_name: 'Jonathon', last_name: 'Taylor', email: 'JTAYLOR', phone_number: '011.44.1644.429265', hire_date: '2006-03-24', job_id: 'SA_REP', salary: 8600, commission_pct: 0.20, manager_id: 145, department_id: 80 },
        { employee_id: 178, first_name: 'Kimberely', last_name: 'Grant', email: 'KGRANT', phone_number: '011.44.1644.429266', hire_date: '2007-05-24', job_id: 'SA_REP', salary: 7000, commission_pct: 0.15, manager_id: 145, department_id: 80 },
        { employee_id: 200, first_name: 'Jennifer', last_name: 'Whalen', email: 'JWHALEN', phone_number: '515.123.4444', hire_date: '2003-09-17', job_id: 'AD_ASST', salary: 4400, commission_pct: null, manager_id: 101, department_id: 10 },
        { employee_id: 201, first_name: 'Michael', last_name: 'Hartstein', email: 'MHARTSTE', phone_number: '515.123.5555', hire_date: '2004-02-17', job_id: 'MK_MAN', salary: 13000, commission_pct: null, manager_id: 100, department_id: 20 },
        { employee_id: 202, first_name: 'Pat', last_name: 'Fay', email: 'PFAY', phone_number: '603.123.6666', hire_date: '2005-08-17', job_id: 'MK_REP', salary: 6000, commission_pct: null, manager_id: 201, department_id: 20 }
      ]
    },

    JOB_HISTORY: {
      name: 'JOB_HISTORY',
      description: 'Historial laboral cronológico de ascensos o cambios de departamento de empleados',
      primaryKey: 'employee_id',
      columns: [
        { name: 'employee_id', type: 'NUMBER', description: 'Identificador del empleado (PK, FK)' },
        { name: 'start_date', type: 'VARCHAR2', description: 'Fecha de inicio del cargo histórico (PK)' },
        { name: 'end_date', type: 'VARCHAR2', description: 'Fecha de finalización del cargo histórico' },
        { name: 'job_id', type: 'VARCHAR2', description: 'Código del puesto desempeñado (FK)' },
        { name: 'department_id', type: 'NUMBER', description: 'Departamento donde laboró (FK)' }
      ],
      rows: [
        { employee_id: 102, start_date: '2001-01-13', end_date: '2006-07-24', job_id: 'IT_PROG', department_id: 60 },
        { employee_id: 101, start_date: '2001-10-28', end_date: '2005-03-15', job_id: 'AD_ASST', department_id: 10 },
        { employee_id: 200, start_date: '2002-07-01', end_date: '2006-12-31', job_id: 'AD_ASST', department_id: 90 },
        { employee_id: 102, start_date: '2006-07-25', end_date: '2007-12-31', job_id: 'IT_PROG', department_id: 60 }
      ]
    }
  }
};

// Alias exportado para máxima compatibilidad con el resto de la aplicación
export const universityDb = hrDb;
