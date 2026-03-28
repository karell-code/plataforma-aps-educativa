# Instrucciones de Configuración - Plataforma KKK

## Tu Google Sheet ya está listo

**Enlace:** https://docs.google.com/spreadsheets/d/15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU/edit

---

## PASO 1: Configurar las Hojas del Spreadsheet (5 minutos)

### 1.1 Abre tu Google Sheet
- Haz clic en el enlace anterior
- Renombra el archivo como "KKK_Plataforma_Educativa"

### 1.2 Crea 4 hojas con estos nombres exactos (en minúsculas):

#### Hoja 1: `estudiantes`
Encabezados en la fila 1:
```
codigo | nombre | email | estado | fecha_registro
```

#### Hoja 2: `matriculas`
Encabezados en la fila 1:
```
id | estudiante_codigo | curso_id | activo | fecha_matricula
```

#### Hoja 3: `progreso`
Encabezados en la fila 1:
```
id | estudiante_codigo | curso_id | modulo_id | fecha_completado
```

#### Hoja 4: `cursos`
Encabezados en la fila 1:
```
curso_id | titulo | descripcion | total_modulos | activo
```

### 1.3 Copia los datos de cursos

En la hoja `cursos`, pega esta información desde la fila 2:

| curso_id | titulo | descripcion | total_modulos | activo |
|----------|--------|-------------|---------------|--------|
| APS-101 | Estadística Descriptiva | Fundamentos de estadística descriptiva aplicados a la investigación en salud | 8 | TRUE |
| EPS-201 | Estadística en Salud | Métodos estadísticos avanzados para ciencias de la salud | 10 | TRUE |
| MET-301 | Metodología de la Investigación | Diseño y desarrollo de proyectos de investigación científica | 12 | TRUE |
| EPI-401 | Epidemiología | Principios y aplicaciones de la epidemiología moderna | 9 | TRUE |
| SIS-501 | Sistemas de Salud | Análisis y evaluación de sistemas de salud | 7 | TRUE |
| CUAL-601 | Investigación Cualitativa | Métodos cualitativos en investigación en salud | 8 | TRUE |
| ETI-701 | Ética en Investigación | Principios éticos en investigación con seres humanos | 6 | TRUE |
| ART-801 | Redacción de Artículos Científicos | Técnicas para escribir y publicar artículos científicos | 10 | TRUE |

### 1.4 Agrega estudiantes de ejemplo

En la hoja `estudiantes`, agrega desde la fila 2:

| codigo | nombre | email | estado | fecha_registro |
|--------|--------|-------|--------|----------------|
| EST-001 | Juan Pérez | juan.perez@email.com | active | =TODAY() |
| EST-002 | María García | maria.garcia@email.com | active | =TODAY() |
| EST-003 | Carlos López | carlos.lopez@email.com | active | =TODAY() |

*(Puedes usar los 30 códigos generados por setup_codes.js)*

---

## PASO 2: Crear Google Apps Script (10 minutos)

### 2.1 Abrir el Editor de Apps Script
1. En tu Google Sheet, ve al menú: **Extensiones** → **Apps Script**

### 2.2 Copiar el Código
1. Borra TODO el código predeterminado que aparece
2. Ve al README.md de este repositorio
3. Copia TODO el código JavaScript que está entre las líneas ~112-401
4. Pégalo en el editor de Apps Script

### 2.3 Verificar el SHEET_ID
El código debe tener esta línea al inicio:
```javascript
const SHEET_ID = '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU';
```

### 2.4 Guardar el Proyecto
1. Haz clic en el ícono de guardar (💾)
2. Nombra el proyecto: "KKK Plataforma API"

### 2.5 Implementar como Web App
1. Haz clic en **Implementar** → **Nueva implementación**
2. En "Selecciona el tipo", elige: **Aplicación web**
3. Configura:
   - **Descripción:** KKK Plataforma v1
   - **Ejecutar como:** Yo (tu correo de Google)
   - **Quién tiene acceso:** **Cualquier persona** ⚠️ (importante!)
4. Haz clic en **Implementar**
5. Autoriza los permisos cuando te lo solicite
6. **COPIA LA URL QUE APARECE** (se verá así):
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
   ```

---

## PASO 3: Actualizar los Archivos HTML (5 minutos)

Debes actualizar 4 archivos con tu URL de Apps Script:

### Archivos a modificar:
1. `/workspace/index.html` (línea ~100)
2. `/workspace/dashboard.html` (línea ~83)
3. `/workspace/curso.html` (línea ~62)
4. `/workspace/admin.html` (línea ~179)

### Qué cambiar:

Busca esto en cada archivo:
```javascript
const GAS_CONFIG = {
    SCRIPT_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
    SHEET_ID: '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU'
};
```

Reemplaza `TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI` con tu URL real:
```javascript
const GAS_CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/TU_CODIGO_REAL_AQUI/exec',
    SHEET_ID: '15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU'
};
```

---

## PASO 4: Probar la Plataforma (2 minutos)

### 4.1 Prueba de Login
1. Abre `index.html` en tu navegador
2. Usa las credenciales de un estudiante de ejemplo:
   - Email: `juan.perez@email.com`
   - Código: `EST-001`
3. Deberías ser redirigido al dashboard

### 4.2 Prueba del Dashboard
1. Deberías ver 8 cursos
2. Los cursos matriculados aparecen en color
3. Los no matriculados aparecen grisados con candado 🔒

### 4.3 Prueba de Curso Bloqueado
1. Haz clic en un curso grisado
2. Debe aparecer mensaje: "No tienes acceso, contacta al profesor"

### 4.4 Prueba del Panel Admin
1. Abre `admin.html`
2. Contraseña por defecto: `admin123`
3. Deberías ver la lista de estudiantes y cursos

---

## PASO 5: Matricular Estudiantes en Cursos

### Opción A: Manualmente en Google Sheets
1. Abre la hoja `matriculas`
2. Agrega filas con:
   - id: `=UNIQUEID()` o cualquier texto único
   - estudiante_codigo: `EST-001`
   - curso_id: `APS-101`
   - activo: `TRUE`
   - fecha_matricula: `=TODAY()`

### Opción B: Desde el Panel Admin
1. Ve a `admin.html`
2. Selecciona un estudiante
3. Haz clic en "Gestionar Cursos"
4. Activa los cursos deseados

---

## Solución de Problemas

### Error: "Credenciales inválidas"
✅ Verifica que el email y código coincidan exactamente en la hoja `estudiantes`
✅ Verifica que el estado sea `active` (no `inactive`)

### Error: "Error de conexión"
✅ Verifica que la URL de SCRIPT_URL esté correctamente copiada
✅ Verifica que el Web App esté publicado como "Cualquier persona"
✅ Revisa la consola del navegador (F12) para ver errores detallados

### El login funciona pero no carga cursos
✅ Verifica que existan registros en la hoja `matriculas` para ese estudiante
✅ Verifica que `activo` sea `TRUE` en las matrículas

### Los cambios no se reflejan
✅ Limpia el caché del navegador (Ctrl+Shift+Supr)
✅ Cierra sesión y vuelve a ingresar
✅ Espera 1-2 minutos (Google Apps Script puede tardar en propagar cambios)

---

## Resumen de URLs Importantes

| Recurso | URL |
|---------|-----|
| Google Sheet | https://docs.google.com/spreadsheets/d/15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU/edit |
| Landing Page | `index.html` |
| Dashboard | `dashboard.html` |
| Curso | `curso.html?curso=APS-101` |
| Admin | `admin.html` |
| Servicios | `servicios.html` |
| Colaboraciones | `sistema/colaboraciones.html` |

---

## Contacto

**Prof. Karell Rafael Vazquez Argote**
- Email: karell0079@gmail.com
- ORCID: 0000-0003-3860-5702
- Institución: KKK

---

¡Listo! Tu plataforma educativa está configurada. 🎉
