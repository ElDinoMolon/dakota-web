# Blog colectivo

Blog hecho con [Astro](https://astro.build) donde cada persona tiene su sección (`/nombre/`) con sus posts y su propio estilo. Se edita desde un panel web ([Pages CMS](https://pagescms.org)) y se publica solo en GitHub Pages.

## Cómo está organizado

```
src/content/<persona>/ajustes.json   ← nombre, bio, colores, fuente… de esa persona
src/content/<persona>/*.md           ← sus posts
public/images/<persona>/             ← sus fotos
src/styles/global.css                ← TODO el diseño común (menú, pie, tarjetas, tipografía)
src/lib/sitio.ts                     ← nombre y lema del blog
.pages.yml                           ← formularios del panel
.github/workflows/deploy.yml         ← publicación automática
astro.config.mjs                     ← dirección de la web (dominio propio)
```

## Probar en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera la carpeta dist/ y reduce las fotos
```

## Cambiar el nombre o el lema del blog

Edita las dos primeras constantes de `src/lib/sitio.ts`.

## Añadir una persona nueva

1. Copia la carpeta `src/content/persona-3` y llámala como la persona, **en minúsculas y sin tildes ni espacios** (ej. `laura`). Ese nombre será la URL: `/laura/`.
2. Copia `public/images/persona-3` con el mismo nombre nuevo (`public/images/laura`).
3. En `.pages.yml`, copia el bloque `PERSONA 3` entero y pégalo debajo. Haz buscar y reemplazar **solo dentro del bloque pegado**: `persona-3` → `laura` (aparece 8 veces).
4. Abre `src/content/laura/ajustes.json`, pon su nombre, nicho y bio, y borra los posts de ejemplo (`hola-mundo.md`).
5. Guarda y sube los cambios. En el panel aparecerá su grupo.

## Estilo por persona (sin código)

En el panel, cada persona tiene "Mi sección y estilo":

| Campo | Qué hace |
|---|---|
| Color principal | Botones, subrayados, puntos de color. Formato `#RRGGBB` |
| Color de fondo / texto | Si se rellenan, la sección **siempre** usa esos colores (también con el móvil en modo oscuro). Si se dejan vacíos, hereda el diseño común con su modo claro/oscuro automático |
| Fuente | `sistema`, `inter`, `lora`, `playfair`, `space-grotesk`, `jetbrains-mono` |
| Tamaño del texto | `pequeno`, `normal`, `grande` |
| Imagen de cabecera | Banner opcional arriba de su sección |

Estos valores se aplican como variables CSS (`--accent`, `--bg`, `--text`, `--font-body`, `--base-size`) solo en las páginas de esa persona. No afectan a las demás.

**Añadir una fuente nueva:** 1) añádela a la lista `FUENTES` de `src/content.config.ts`, 2) al objeto `FUENTES` de `src/lib/fuentes.ts` (con su parámetro de Google Fonts), 3) a `values` de `fuente` en `.pages.yml` (en cada bloque).

## Fotos

Se suben desde el panel a `public/images/<persona>/`. En cada `npm run build` se reducen a un máximo de 1600 px de ancho y se recomprimen (`scripts/optimize-images.mjs`), así la web va rápida. **Los originales siguen en el repo tal cual se subieron**, así que conviene no subir fotos de más de 2-3 MB.

## Dominio propio

Sin dominio propio no hay que tocar nada. Si algún día lo tenéis: pon `DOMINIO_PROPIO = 'https://tudominio.com'` en `astro.config.mjs`, configúralo en Settings > Pages del repo y listo.

## Cosas a tener en cuenta

- Cada guardado en el panel es un commit en `main` y lanza una publicación (tarda 1-2 minutos en verse).
- El acceso al panel es por repositorio: **cualquier persona invitada puede editar las secciones de todas**. Es cuestión de confianza, no hay permisos por carpeta.
- Las fuentes que no son `sistema` se descargan de Google Fonts.
