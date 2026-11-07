import { getCollection } from 'astro:content';

export const NOMBRE_BLOG = 'Blog colectivo';
export const LEMA = 'Varias personas, varios nichos, una sola web.';

/** Añade el prefijo de `base` a una ruta interna ("/pepe/" → "/repo/pepe/"). */
export function url(ruta: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${ruta.startsWith('/') ? ruta : '/' + ruta}`;
}

export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export type Persona = Awaited<ReturnType<typeof getPersonas>>[number];

/** Todas las personas, ordenadas por nombre de carpeta. */
export async function getPersonas() {
  const entradas = await getCollection('personas');
  return entradas
    .map((e) => ({ slug: e.id.split('/')[0], ...e.data }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Posts (más recientes primero). Si pasas un slug, solo los de esa persona. */
export async function getPosts(slug?: string) {
  const entradas = await getCollection('posts');
  return entradas
    .map((entrada) => {
      const [persona, ...resto] = entrada.id.split('/');
      return { entrada, persona, slug: resto.join('/') };
    })
    .filter((p) => !slug || p.persona === slug)
    .sort((a, b) => b.entrada.data.date.getTime() - a.entrada.data.date.getTime());
}
