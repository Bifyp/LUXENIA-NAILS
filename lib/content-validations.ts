import { z } from 'zod';
const text = (max: number) => z.string().trim().max(max);
export const editableServiceSchema = z.object({ icon: text(30).default('✨'), title: text(200).min(1), desc: text(5000).default(''), price: text(100).default('') }).strict();
export const editablePackageSchema = z.object({
  title: text(200).min(1), badge: text(100).nullish(), sessions: text(100).default(''),
  price: z.coerce.number().int().nonnegative().max(1000000), oldPrice: z.coerce.number().int().nonnegative().max(1000000),
  savings: text(100).default(''), popular: z.boolean().default(false), benefits: z.array(text(500)).max(30).default([]),
}).strict();
export const editableProductSchema = z.object({
  name: text(200).min(1), description: text(10000), price: z.coerce.number().nonnegative().max(1000000),
  oldPrice: z.preprocess((v) => v === '' ? null : v, z.coerce.number().nonnegative().max(1000000).nullable()).optional(),
  image: z.preprocess((v) => v === '' ? null : v, z.string().url().startsWith('https://').nullable()).optional(),
  category: text(100).nullish(), inStock: z.boolean().default(true), featured: z.boolean().default(false), order: z.number().int().nonnegative().default(0),
}).strict();
export const editableEmailTemplateSchema = z.object({ type: z.enum(['welcome', 'booking-confirmation', 'password-reset', 'booking-reminder']), lang: z.enum(['uk', 'ru', 'pl', 'en']), subject: text(200).min(1), body: z.string().max(100000), enabled: z.boolean().default(true) }).strict();
