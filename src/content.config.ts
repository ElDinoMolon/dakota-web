import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS guarda los campos vacíos como "", así que los tratamos como "no puesto".
const vacioEsNada = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

const color = vacioEsNada(
  z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Usa un color en formato #RRGGBB, por ejemplo #E8541F'),
);

// Fuentes y tamaños permitidos (si cambias esta lista, cámbiala también en src/lib/fuentes.ts y .pages.yml)
export const FUENTES = ['sistema', 'inter', 'lora', 'playfair', 'space-grotesk', 'jetbrains-mono'] as const;
export const TAMANOS = ['pequeno', 'normal', 'grande'] as const;

// Posts: src/content/<persona>/<post>.md
const posts = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().default(''),
    cover: vacioEsNada(z.string()),
  }),
});

// Ajustes de cada persona: src/content/<persona>/ajustes.json
const personas = defineCollection({
  loader: glob({ pattern: '*/ajustes.json', base: './src/content' }),
  schema: z.object({
    nombre: z.string(),
    nicho: z.string().default(''),
    bio: z.string().default(''),
    color_principal: color,
    color_fondo: color,
    color_texto: color,
    fuente: z.preprocess((v) => (v === '' || v == null ? 'sistema' : v), z.enum(FUENTES)),
    tamano_texto: z.preprocess((v) => (v === '' || v == null ? 'normal' : v), z.enum(TAMANOS)),
    imagen_cabecera: vacioEsNada(z.string()),
  }),
});

export const collections = { posts, personas };
