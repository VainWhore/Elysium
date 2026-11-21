# ELYSIUM — sitio web

## Publicar en GitHub Pages
1. Descomprimí este ZIP.
2. Creá un repositorio nuevo en GitHub.
3. Subí `index.html`, `style.css`, `app.js` y `content.json` a la raíz del repositorio.
4. Entrá en **Settings → Pages**.
5. En **Build and deployment**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
6. Guardá y esperá a que GitHub Pages publique el sitio.

## Importante
- El archivo `content.json` contiene el texto extraído de las 29 páginas del PDF y organizado en ocho bloques de navegación. No se añadieron subtítulos dentro del relato; los nombres de los bloques aparecen únicamente en el índice lateral y funcionan como referencias de navegación para conservar la continuidad del texto.
- El mapa utiliza Three.js desde un CDN, por lo que requiere conexión a internet para cargar el motor 3D. Los controles táctiles y de mouse los proporciona OrbitControls.
- El modelo del bosque y del búnker es una primera representación 3D conceptual, no un plano a escala. No asigna instalaciones a niveles definitivos ni fija cantidad o posición real de accesos.
- El contenido y los nombres de instalaciones se pueden editar en `content.json`.
