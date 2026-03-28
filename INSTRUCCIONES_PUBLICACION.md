# 🚀 INSTRUCCIONES FINALES DE PUBLICACIÓN Y CONFIGURACIÓN
**Sistema de Gestión Académica APS**  
Autor: Karell Rafael Vazquez Argote  
Institución: KKK  

---

## 📌 FASE 1: Publicar en GitHub (Paso Crítico)

Los archivos que has generado en este chat deben subirse a tu repositorio de GitHub para que la página web funcione. Tienes dos opciones:

### Opción A: Desde tu computadora (Recomendado si tienes Git instalado)
1. Abre tu terminal o consola de comandos.
2. Navega a la carpeta donde descargaste/clonaste tus archivos.
3. Ejecuta los siguientes comandos uno por uno:

```bash
# Configura tu usuario (si es la primera vez)
git config --global user.name "TuNombre"
git config --global user.email "karell0079@gmail.com"

# Inicializa el repositorio (si no lo has hecho)
git init

# Agrega todos los archivos
git add .

# Confirma los cambios
git commit -m "Versión final del sistema académico con integración Google Sheets"

# Conecta con tu repositorio remoto (CAMBIA LA URL POR LA TUYA)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Sube los archivos (Forzando para reemplazar cualquier versión anterior)
git push -u origin main --force
```

### Opción B: Subida Manual desde la Web de GitHub
1. Entra a [github.com](https://github.com) e inicia sesión.
2. Ve a tu repositorio.
3. Haz clic en **"Add file"** > **"Upload files"**.
4. Arrastra **todos** los archivos generados (`index.html`, `dashboard.html`, `curso.html`, `admin.html`, `servicios.html`, carpetas `assets`, etc.).
5. En el cuadro de texto "Commit changes", escribe: `Actualización completa del sistema`.
6. Haz clic en **"Commit changes"**.

> ⚠️ **Importante:** Al subir estos archivos, **reemplazarás** cualquier versión anterior que estuviera en el repositorio.

---

## 🌐 FASE 2: Activar GitHub Pages

Una vez subidos los archivos, debes activar el hosting gratuito:

1. En tu repositorio de GitHub, ve a la pestaña **Settings** (Configuración).
2. En el menú lateral izquierdo, busca y haz clic en **Pages**.
3. En la sección **Build and deployment**:
   - **Source:** Selecciona `Deploy from a branch`.
   - **Branch:** Selecciona `main` (o `master`) y deja la carpeta en `/ (root)`.
4. Haz clic en **Save**.
5. Espera unos 1-2 minutos. Refresca la página y verás un mensaje verde que dice:  
   *"Your site is live at..."* seguido de tu enlace (ej: `https://tu-usuario.github.io/tu-repo/`).

---

## 🛠️ FASE 3: Configuración Final en Google Sheets (Obligatorio)

El código ya tiene tu ID de hoja y URL de script, pero las hojas de cálculo deben tener la estructura correcta para no dar errores.

1. Abre tu hoja de cálculo:  
   👉 [Abrir Google Sheet](https://docs.google.com/spreadsheets/d/15OY4xZ9L8447vsUkeT3NwIdqw2_vmaGbFJQtUdIf4gU/edit)

2. Verifica que existan estas **4 hojas** (pestañas abajo a la izquierda). Si falta alguna, créala con ese nombre exacto:
   - `estudiantes`
   - `cursos`
   - `matriculas`
   - `progreso`

3. **Crea los encabezados** en la fila 1 de cada hoja (exactamente así):

   **Hoja `estudiantes`:**
   | A | B | C | D |
   |---|---|---|---|
   | email | codigo | nombre | estado |

   **Hoja `cursos`:**
   | A | B | C | D | E |
   |---|---|---|---|---|
   | id | nombre | descripcion | icono | activo |

   **Hoja `matriculas`:**
   | A | B | C | D |
   |---|---|---|---|
   | email | curso_id | fecha_matricula | estado |

   **Hoja `progreso`:**
   | A | B | C | D |
   |---|---|---|---|
   | email | curso_id | modulo_completado | fecha |

4. **Agrega datos de prueba** para poder entrar al sistema:
   
   En la hoja `estudiantes`, agrega esto en la fila 2:
   - **email:** `karell0079@gmail.com`
   - **codigo:** `EST-ADMIN` (o el código que hayas generado)
   - **nombre:** `Karell Rafael Vazquez Argote`
   - **estado:** `Activo`

   En la hoja `cursos`, agrega el primer curso en la fila 2:
   - **id:** `APS-101`
   - **nombre:** `Bioestadística Aplicada`
   - **descripcion:** `Domina el análisis de datos...`
   - **icono:** `📊`
   - **activo:** `TRUE`

   En la hoja `matriculas`, vincula al estudiante con el curso:
   - **email:** `karell0079@gmail.com`
   - **curso_id:** `APS-101`
   - **fecha_matricula:** `01/01/2024`
   - **estado:** `Activa`

---

## ✅ FASE 4: Pruebas de Funcionamiento

1. Abre tu nueva página web publicada en GitHub Pages.
2. En el login, ingresa:
   - **Email:** `karell0079@gmail.com`
   - **Código:** `EST-ADMIN`
3. Deberías ser redirigido al Dashboard.
   - Si ves el curso "Bioestadística Aplicada", ¡todo funciona!
   - Si ves un error, abre la consola del navegador (F12) y revisa el mensaje.

---

## 🔧 Solución de Problemas Comunes

| Problema | Solución |
|----------|----------|
| Error "Cannot read properties of undefined" | Asegúrate de haber creado las hojas con los nombres exactos en minúsculas/plural. |
| La página no carga o da error 404 | Espera 2 minutos tras publicar en GitHub. Verifica que los archivos estén en la raíz del repo. |
| Dice "No tienes cursos matriculados" | Revisa la hoja `matriculas`. El email y el curso_id deben coincidir exactamente con los de las otras hojas. |
| Cambios en Apps Script no se ven | Ve a Apps Script > Implementar > Gestionar implementaciones > Edita la versión activa o crea una nueva. |

---

## 🎉 ¡Listo!
Tu plataforma educativa está estructurada por cursos, con gestión de matrículas, panel de administración y servicios de asesoría integrados.

**Próximos pasos sugeridos:**
1. Generar los 30 códigos de estudiantes restantes usando el archivo `setup_codes.js` o manualmente en el Sheet.
2. Personalizar los contenidos de cada curso en la hoja `cursos` o directamente en los archivos HTML si prefieres contenido estático.
3. Compartir el enlace de tu GitHub Pages con tus estudiantes.

**Autor:** Karell Rafael Vazquez Argote  
**Contacto:** karell0079@gmail.com  
**ORCID:** https://orcid.org/my-orcid?orcid=0000-0003-3860-5702
