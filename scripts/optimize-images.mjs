// Se ejecuta después de `astro build`: reduce las fotos de dist/images/
// (máximo 1600 px de ancho, recompresión). Solo toca la web publicada, no los
// originales del repo. Si falla con alguna imagen, la deja como estaba.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const CARPETA = 'dist/images';
const ANCHO_MAX = 1600;

async function* archivos(dir) {
  let entradas;
  try {
    entradas = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // no hay carpeta de imágenes todavía
  }
  for (const e of entradas) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) yield* archivos(ruta);
    else yield ruta;
  }
}

let antes = 0;
let despues = 0;
let n = 0;

for await (const ruta of archivos(CARPETA)) {
  const ext = extname(ruta).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
  try {
    const original = await readFile(ruta);
    let img = sharp(original).rotate().resize({ width: ANCHO_MAX, withoutEnlargement: true });
    if (ext === '.png') img = img.png({ compressionLevel: 9, palette: false });
    else if (ext === '.webp') img = img.webp({ quality: 80 });
    else img = img.jpeg({ quality: 80, mozjpeg: true });
    const salida = await img.toBuffer();
    antes += original.length;
    if (salida.length < original.length) {
      await writeFile(ruta, salida);
      despues += salida.length;
    } else {
      despues += original.length;
    }
    n++;
  } catch (err) {
    console.warn(`  ⚠ No se pudo optimizar ${ruta}: ${err.message}`);
  }
}

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
console.log(n ? `Imágenes optimizadas: ${n} (${kb(antes)} → ${kb(despues)})` : 'Sin imágenes que optimizar.');
