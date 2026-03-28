# Plataforma Educativa KKK

## Descripción

Plataforma educativa desarrollada para el **Prof. Karell Rafael Vazquez Argote** de la institución **KKK**, diseñada para gestionar cursos especializados en investigación y estadística en salud.

### Autoría

- **Autor Principal:** Karell Rafael Vazquez Argote
- **Email:** karell0079@gmail.com
- **ORCID:** [0000-0003-3860-5702](https://orcid.org/my-orcid?orcid=0000-0003-3860-5702)
- **Colaboradores:** SSSS
- **Institución:** KKK

---

## Estructura de la Plataforma

### Cursos Disponibles (anteriormente módulos)

Cada curso funciona de manera independiente con sus propios módulos/temas:

| Código | Curso | Módulos |
|--------|-------|---------|
| APS-101 | Estadística Descriptiva | 8 |
| EPS-201 | Estadística en Salud | 10 |
| MET-301 | Metodología de la Investigación | 12 |
| EPI-401 | Epidemiología | 9 |
| SIS-501 | Sistemas de Salud | 7 |
| CUAL-601 | Investigación Cualitativa | 8 |
| ETI-701 | Ética en Investigación | 6 |
| ART-801 | Redacción de Artículos Científicos | 10 |

---

## Flujo de Acceso

```
1. LANDING PAGE (index.html)
   └── Login simple (Email + Código de estudiante)
   
2. VALIDACIÓN (via Google Apps Script)
   └── Consulta: "¿Qué cursos tiene activos este estudiante?"
   
3. DASHBOARD PERSONALIZADO (dashboard.html)
   └── Muestra SOLO los cursos matriculados (activos)
   └── Cursos bloqueados aparecen grisados
   
4. CURSO ESPECÍFICO (curso.html?curso=APS-101)
   └── Lista módulos sin numeración visible (solo títulos)
   └── Progreso guardado en Google Sheets
   
5. ADMIN PANEL (admin.html - solo para el profesor)
   └── Activar/desactivar cursos por estudiante
   └── Ver progreso de todos los estudiantes
```

---

## Configuración de Google Sheets y Google Apps Script

### Paso 1: Configurar tu Google Sheet

Tu hoja de cálculo ya está creada en:
**https://docs.google.com/spreadsheets/d/15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU/edit**

1. Abre el enlace anterior
2. Renombra la hoja de cálculo como "KKK_Plataforma_Educativa"
3. Crea las siguientes pestañas (hojas) con estos nombres exactos:

#### Hoja 1: `estudiantes`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| codigo | Texto | Código único del estudiante (Ej: EST-001) |
| nombre | Texto | Nombre completo |
| email | Texto | Correo electrónico |
| estado | Texto | active/inactive |
| fecha_registro | Fecha | Fecha de creación |

#### Hoja 2: `matriculas`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | Texto | ID único de matrícula |
| estudiante_codigo | Texto | Código del estudiante |
| curso_id | Texto | ID del curso (Ej: APS-101) |
| activo | Booleano | true/false |
| fecha_matricula | Fecha | Fecha de matrícula |

#### Hoja 3: `progreso`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | Texto | ID único |
| estudiante_codigo | Texto | Código del estudiante |
| curso_id | Texto | ID del curso |
| modulo_id | Texto | ID del módulo completado |
| fecha_completado | Fecha | Fecha de completion |

#### Hoja 4: `cursos`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| curso_id | Texto | ID del curso |
| titulo | Texto | Nombre del curso |
| descripcion | Texto | Descripción |
| total_modulos | Número | Cantidad de módulos |
| activo | Booleano | Estado del curso |

### Paso 2: Crear Google Apps Script

1. En tu Google Sheet, ve a **Extensiones** > **Apps Script**
2. Borra el código predeterminado y pega el siguiente código:

```javascript
// Google Apps Script para KKK Plataforma Educativa
// ID del Sheet: 15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU

const SHEET_ID = '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU';

function doGet(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'validateStudent':
      return validateStudent(e.parameter.email, e.parameter.code);
    case 'getStudentCourses':
      return getStudentCourses(e.parameter.email, e.parameter.code);
    case 'getProgress':
      return getProgress(e.parameter.email, e.parameter.code, e.parameter.curso);
    case 'saveProgress':
      return saveProgress(e.parameter.email, e.parameter.code, e.parameter.curso, e.parameter.modulo);
    case 'getAllStudents':
      return getAllStudents();
    case 'getEnrollments':
      return getEnrollments();
    case 'enrollStudent':
      return enrollStudent(e.parameter.code, e.parameter.curso);
    default:
      return createResponse(false, 'Acción no válida');
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  switch(action) {
    case 'addStudent':
      return addStudent(data.nombre, data.email, data.codigo);
    case 'deactivateStudent':
      return deactivateStudent(data.codigo);
    case 'updateEnrollment':
      return updateEnrollment(data.codigo, data.curso, data.activo);
    default:
      return createResponse(false, 'Acción no válida');
  }
}

function validateStudent(email, code) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('estudiantes');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email && data[i][0] === code && data[i][3] === 'active') {
        return createResponse(true, 'Validación exitosa', {
          name: data[i][1],
          email: data[i][2],
          code: data[i][0]
        });
      }
    }
    
    return createResponse(false, 'Credenciales inválidas o estudiante inactivo');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function getStudentCourses(email, code) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const matriculasSheet = ss.getSheetByName('matriculas');
    const cursosSheet = ss.getSheetByName('cursos');
    
    const matriculasData = matriculasSheet.getDataRange().getValues();
    const cursosData = cursosSheet.getDataRange().getValues();
    
    const enrolledCourses = [];
    
    for (let i = 1; i < matriculasData.length; i++) {
      if (matriculasData[i][1] === code && matriculasData[i][3] === true) {
        const courseId = matriculasData[i][2];
        
        // Buscar información del curso
        for (let j = 1; j < cursosData.length; j++) {
          if (cursosData[j][0] === courseId) {
            enrolledCourses.push({
              id: cursosData[j][0],
              title: cursosData[j][1],
              description: cursosData[j][2],
              modules: cursosData[j][3]
            });
            break;
          }
        }
      }
    }
    
    return createResponse(true, 'Cursos obtenidos', { courses: enrolledCourses });
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function getProgress(email, code, curso) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('progreso');
    const data = sheet.getDataRange().getValues();
    
    const completedModules = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === code && data[i][2] === curso) {
        completedModules.push(data[i][3]);
      }
    }
    
    return createResponse(true, 'Progreso obtenido', {
      completed: completedModules.length,
      completedModules: completedModules
    });
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function saveProgress(email, code, curso, modulo) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('progreso');
    
    // Verificar si ya existe
    const data = sheet.getDataRange().getValues();
    let exists = false;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === code && data[i][2] === curso && data[i][3] === modulo) {
        exists = true;
        break;
      }
    }
    
    if (!exists) {
      sheet.appendRow([
        Utilities.getUuid(),
        code,
        curso,
        modulo,
        new Date()
      ]);
    }
    
    return createResponse(true, 'Progreso guardado');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function addStudent(nombre, email, codigo) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('estudiantes');
    
    sheet.appendRow([
      codigo,
      nombre,
      email,
      'active',
      new Date()
    ]);
    
    return createResponse(true, 'Estudiante agregado exitosamente');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function enrollStudent(code, curso) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('matriculas');
    
    sheet.appendRow([
      Utilities.getUuid(),
      code,
      curso,
      true,
      new Date()
    ]);
    
    return createResponse(true, 'Matrícula realizada exitosamente');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function updateEnrollment(code, curso, activo) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('matriculas');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === code && data[i][2] === curso) {
        sheet.getRange(i + 1, 4).setValue(activo);
        return createResponse(true, 'Matrícula actualizada');
      }
    }
    
    return createResponse(false, 'Matrícula no encontrada');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function getAllStudents() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('estudiantes');
    const data = sheet.getDataRange().getValues();
    
    const students = [];
    
    for (let i = 1; i < data.length; i++) {
      students.push({
        code: data[i][0],
        name: data[i][1],
        email: data[i][2],
        status: data[i][3],
        registrationDate: data[i][4]
      });
    }
    
    return createResponse(true, 'Estudiantes obtenidos', { students: students });
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function getEnrollments() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('matriculas');
    const data = sheet.getDataRange().getValues();
    
    const enrollments = [];
    
    for (let i = 1; i < data.length; i++) {
      enrollments.push({
        id: data[i][0],
        studentCode: data[i][1],
        courseId: data[i][2],
        active: data[i][3],
        date: data[i][4]
      });
    }
    
    return createResponse(true, 'Matrículas obtenidas', { enrollments: enrollments });
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function deactivateStudent(code) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('estudiantes');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === code) {
        sheet.getRange(i + 1, 4).setValue('inactive');
        return createResponse(true, 'Estudiante desactivado');
      }
    }
    
    return createResponse(false, 'Estudiante no encontrado');
  } catch (error) {
    return createResponse(false, 'Error: ' + error.toString());
  }
}

function createResponse(success, message, data = {}) {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    message: message,
    ...data
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### Paso 3: Publicar el Web App

1. En el editor de Apps Script, haz clic en **Implementar** > **Nueva implementación**
2. Selecciona el tipo: **Aplicación web**
3. Configura:
   - **Descripción:** KKK Plataforma API
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** Cualquier persona
4. Haz clic en **Implementar**
5. Copia la URL de la aplicación web (se verá como: `https://script.google.com/macros/s/XXXXX/exec`)

### Paso 4: Actualizar SCRIPT_URL en los Archivos HTML

En cada archivo HTML (`index.html`, `dashboard.html`, `curso.html`, `admin.html`), reemplaza:

```javascript
const GAS_CONFIG = {
    SCRIPT_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
    SHEET_ID: '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU'
};
```

Con la URL que copiaste al implementar el Web App:

```javascript
const GAS_CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/TU_CODIGO_AQUI/exec',
    SHEET_ID: '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU'
};
```

**Archivos a actualizar:**
- `/workspace/index.html` (línea ~100)
- `/workspace/dashboard.html` (línea ~83)
- `/workspace/curso.html` (línea ~62)
- `/workspace/admin.html` (línea ~179)

---

## Generación de Códigos de Estudiante

Para generar códigos aleatorios seguros para tus 30 estudiantes:

### Opción 1: Usando Google Sheets (Recomendado)

En la hoja `estudiantes` de tu Google Sheet, usa estas fórmulas:

**Columna A (Código):**
```excel
="EST-" & TEXT(ROW(A1), "000")
```

**Columna B (Nombre):** Ingresa manualmente los nombres
**Columna C (Email):** Ingresa manualmente los emails
**Columna D (Estado):** 
```excel
="active"
```

**Columna E (Fecha Registro):**
```excel
=TODAY()
```

Arrastra las fórmulas hacia abajo para generar EST-001, EST-002, hasta EST-030.

### Opción 2: Códigos Aleatorios Más Seguros (JavaScript)

Ejecuta esto en la consola del navegador (F12):

```javascript
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EST-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generar 30 códigos únicos
const codes = new Set();
while(codes.size < 30) {
  codes.add(generateRandomCode());
}
codes.forEach(code => console.log(code));
```

### Ejemplo de Datos Iniciales para la Hoja `estudiantes`:

| codigo | nombre | email | estado | fecha_registro |
|--------|--------|-------|--------|----------------|
| EST-001 | Estudiante Uno | estudiante1@email.com | active | 2026-01-15 |
| EST-002 | Estudiante Dos | estudiante2@email.com | active | 2026-01-15 |
| ... | ... | ... | ... | ... |
| EST-030 | Estudiante Treinta | estudiante30@email.com | active | 2026-01-15 |

### Ejemplo de Datos Iniciales para la Hoja `cursos`:

| curso_id | titulo | descripcion | total_modulos | activo |
|----------|--------|-------------|---------------|--------|
| APS-101 | Estadística Descriptiva | Fundamentos de estadística descriptiva | 8 | TRUE |
| EPS-201 | Estadística en Salud | Métodos estadísticos avanzados | 10 | TRUE |
| MET-301 | Metodología de la Investigación | Diseño de proyectos científicos | 12 | TRUE |
| EPI-401 | Epidemiología | Principios de epidemiología moderna | 9 | TRUE |
| SIS-501 | Sistemas de Salud | Análisis de sistemas de salud | 7 | TRUE |
| CUAL-601 | Investigación Cualitativa | Métodos cualitativos en salud | 8 | TRUE |
| ETI-701 | Ética en Investigación | Principios éticos en investigación | 6 | TRUE |
| ART-801 | Redacción de Artículos | Técnicas de escritura científica | 10 | TRUE |

---

## Uso de la Plataforma

### Para Estudiantes

1. **Acceso:** Ingresa a `index.html`
2. **Login:** Usa tu email y código de estudiante
3. **Dashboard:** Verás todos los cursos (activos en color, bloqueados en gris)
4. **Cursos Bloqueados:** Al hacer clic, muestra mensaje "No tienes acceso, contacta al profesor"
5. **Cursos Activos:** Accede directamente al contenido

### Para el Profesor (Admin)

1. **Acceso:** Ingresa a `admin.html`
2. **Login:** Usa la contraseña de administrador
3. **Gestión:**
   - Agregar nuevos estudiantes
   - Activar/desactivar matrículas por curso
   - Ver progreso individual y grupal
   - Generar informes en cualquier momento
   - Exportar datos

---

## Servicios Incluidos

La plataforma incluye secciones para:

### Servicios de Asesoramiento (servicios.html)
- Asesoramiento de Tesis
- Consultoría Estadística
- Revisión de Artículos Científicos
- Talleres Especializados
- Diseño de Instrumentos
- Mentoría Académica

### Modalidades:
- 🔵 **Remuneradas:** Servicios profesionales con tarifa
- 🟢 **No Remuneradas:** Asesorías básicas incluidas en matrícula
- 🟡 **Por Convenio:** Mediante acuerdos institucionales

### Colaboraciones (sistema/colaboraciones.html)
- Proyectos de Investigación Conjunta
- Grupos de Lectura Crítica
- Co-autorías y Publicaciones
- Red de Egresados
- Eventos Académicos
- Incubadora de Ideas

---

## Estructura de Archivos

```
/workspace/
├── index.html                 # Landing page con login
├── dashboard.html             # Dashboard del estudiante
├── curso.html                 # Vista de curso específico
├── servicios.html             # Página de servicios
├── admin.html                 # Panel de administración
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos principales
│   └── js/
│       └── app.js            # JavaScript común (opcional)
├── sistema/
│   ├── colaboraciones.html   # Página de colaboraciones
│   ├── dashboard-estudiante.html
│   └── seguimiento-tesis.html
└── modulos/                   # Archivos de módulos antiguos
    ├── m1-estadistica-descriptiva.html
    ├── m2-estadistica-salud.html
    └── ...
```

---

## Próximos Pasos

1. **Configurar Google Sheet** con las hojas necesarias
2. **Implementar Google Apps Script** con el código proporcionado
3. **Actualizar las URLs** en todos los archivos HTML
4. **Generar códigos** para los 30 estudiantes
5. **Cargar datos iniciales** de estudiantes en el Sheet
6. **Probar el flujo completo** de login → dashboard → curso
7. **Personalizar contenidos** de cada módulo en cada curso

---

## Contacto

**Prof. Karell Rafael Vazquez Argote**
- Email: karell0079@gmail.com
- ORCID: [0000-0003-3860-5702](https://orcid.org/my-orcid?orcid=0000-0003-3860-5702)
- Institución: KKK

---

## Licencia

© 2026 KKK - Todos los derechos reservados
