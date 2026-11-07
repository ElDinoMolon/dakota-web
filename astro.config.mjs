import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

// ─── Dirección de la web ────────────────────────────────────────────────
// Sin dominio propio no hace falta tocar nada: en GitHub Actions se calcula
// sola a partir del repo (https://USUARIO.github.io/NOMBRE-REPO/).
// Con dominio propio, escríbelo aquí. Ejemplo: 'https://miblog.com'
const DOMINIO_PROPIO = '';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
let site;
let base = '/';
if (DOMINIO_PROPIO) {
  site = DOMINIO_PROPIO;
} else if (owner) {
  site = `https://${owner.toLowerCase()}.github.io`;
  // Un repo llamado USUARIO.github.io se sirve en la raíz, el resto en /NOMBRE-REPO
  if (!repo.toLowerCase().endsWith('.github.io')) base = `/${repo}`;
}

// Las imágenes de los posts se escriben como /images/persona/foto.jpg.
// Este plugin les añade el prefijo de `base` para que funcionen también
// cuando la web vive en usuario.github.io/nombre-repo/.
const prefijo = base === '/' ? '' : base;
const conPrefijo = (ruta) => (prefijo && ruta.startsWith('/') && !ruta.startsWith('//') ? prefijo + ruta : ruta);
const prefijoBase = {
  name: 'prefijo-base',
  image(nodo, ctx) {
    ctx.replaceNode(nodo, { ...nodo, url: conPrefijo(nodo.url) });
  },
  link(nodo, ctx) {
    ctx.replaceNode(nodo, { ...nodo, url: conPrefijo(nodo.url) });
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: { processor: satteri({ mdastPlugins: [prefijoBase] }) },
});
