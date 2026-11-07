import type { Persona } from './sitio';

// Lista cerrada de fuentes. Clave = valor que guarda el panel.
// `google` es el parámetro `family=` de Google Fonts (null = no descarga nada).
const FUENTES: Record<string, { pila: string | null; google: string | null }> = {
  sistema: { pila: null, google: null },
  inter: { pila: "'Inter', system-ui, sans-serif", google: 'Inter:wght@400;500;600;700' },
  lora: { pila: "'Lora', Georgia, serif", google: 'Lora:ital,wght@0,400..700;1,400..700' },
  playfair: {
    pila: "'Playfair Display', Georgia, serif",
    google: 'Playfair+Display:ital,wght@0,400..800;1,400..800',
  },
  'space-grotesk': { pila: "'Space Grotesk', system-ui, sans-serif", google: 'Space+Grotesk:wght@400..700' },
  'jetbrains-mono': { pila: "'JetBrains Mono', ui-monospace, Consolas, monospace", google: 'JetBrains+Mono:wght@400..700' },
};

// Tamaño base del texto (porcentaje del tamaño del navegador). "normal" = el de la web común.
const TAMANOS: Record<string, string> = { pequeno: '93.75%', normal: '106.25%', grande: '120%' };

/** CSS inline (variables) que se aplica solo a la sección de una persona. */
export function estiloPersona(p?: Persona): string {
  if (!p) return '';
  const v: string[] = [];
  if (p.color_principal) v.push(`--accent:${p.color_principal}`);
  if (p.color_fondo) v.push(`--bg:${p.color_fondo}`);
  if (p.color_texto) v.push(`--text:${p.color_texto}`);
  const pila = FUENTES[p.fuente]?.pila;
  if (pila) v.push(`--font-body:${pila}`, `--font-heading:${pila}`);
  if (p.tamano_texto !== 'normal') v.push(`--base-size:${TAMANOS[p.tamano_texto]}`);
  return v.join(';');
}

/** Solo el color principal, para pintar la tarjeta de la persona en la portada. */
export function estiloAcento(p: Persona): string {
  return p.color_principal ? `--accent:${p.color_principal}` : '';
}

/** URL de Google Fonts si la fuente de la persona la necesita. */
export function urlGoogleFonts(p?: Persona): string | null {
  const familia = p && FUENTES[p.fuente]?.google;
  return familia ? `https://fonts.googleapis.com/css2?family=${familia}&display=swap` : null;
}
