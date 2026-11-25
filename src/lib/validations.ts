import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Sanitización                                                        */
/* ------------------------------------------------------------------ */

// Controles C0/C1, zero-width y marcas bidireccionales (evitan spoofing visual y evasión de filtros)
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

/**
 * Normaliza y limpia texto libre antes de almacenarlo:
 * 1) NFKC  2) quita caracteres de control  3) elimina etiquetas HTML  4) elimina < y > sueltos
 * 5) colapsa espacios. El orden importa: los controles se quitan antes de las etiquetas
 * para que `<scr\u0000ipt>` no eluda el filtro.
 */
export function sanitizeText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARS, "")
    .replace(/<[^>]*>?/g, "")
    .replace(/[<>]/g, "")
    .replace(/[\t\n\r ]+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

const EMAIL_REGEX = /^[a-z0-9._%+-]{1,64}@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export const LEAD_INTERESTS = ["ahorro", "transferencias", "inversion"] as const;
export type LeadInterest = (typeof LEAD_INTERESTS)[number];

const sanitizedString = (max: number) =>
  z.string().max(max * 2, "Texto demasiado largo.").transform(sanitizeText);

export const leadSchema = z.strictObject({
  name: sanitizedString(80)
    .pipe(
      z
        .string()
        .min(2, "Escribe tu nombre (mínimo 2 letras).")
        .max(80, "Máximo 80 caracteres.")
        .regex(/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u, "Usa solo letras, espacios, apóstrofes o guiones."),
    ),
  email: z
    .string()
    .max(254, "El correo es demasiado largo.")
    .transform((v) => v.normalize("NFKC").replace(CONTROL_CHARS, "").trim().toLowerCase())
    .pipe(z.string().regex(EMAIL_REGEX, "Escribe un correo válido, por ejemplo nombre@dominio.com.")),
  interest: z.enum(LEAD_INTERESTS, { error: "Elige qué te interesa." }),
  message: sanitizedString(500)
    .pipe(z.string().max(500, "Máximo 500 caracteres."))
    .optional()
    .default(""),
  consent: z.literal(true, { error: "Confirma que usas datos ficticios para probar este formulario." }),
  /** Honeypot: debe llegar vacío. Si trae datos, el servidor lo trata como bot. */
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

/* ------------------------------------------------------------------ */
/* Calculadora                                                         */
/* ------------------------------------------------------------------ */

/**
 * Convierte texto del usuario en número seguro.
 * Acepta "1500", "1500.50" o "1500,50". Rechaza notación científica, signos, separadores
 * de miles, vacíos y cualquier cosa que no sea un decimal simple con hasta 9 enteros.
 * Devuelve `null` si es inválido (nunca NaN ni Infinity).
 */
export function parseDecimalInput(raw: string): number | null {
  const value = raw.trim();
  if (!/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value)) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export const CALC_LIMITS = {
  initialMax: 10_000_000,
  monthlyMax: 1_000_000,
  rateMax: 25,
  yearsMin: 1,
  yearsMax: 40,
} as const;

export const calculatorSchema = z
  .object({
    initial: z
      .number({ error: "Escribe un monto válido." })
      .finite()
      .min(0, "No puede ser negativo.")
      .max(CALC_LIMITS.initialMax, "El máximo es 10.000.000."),
    monthly: z
      .number({ error: "Escribe un monto válido." })
      .finite()
      .min(0, "No puede ser negativo.")
      .max(CALC_LIMITS.monthlyMax, "El máximo es 1.000.000."),
    annualRate: z
      .number({ error: "Escribe una tasa válida." })
      .finite()
      .min(0, "No puede ser negativa.")
      .max(CALC_LIMITS.rateMax, "El máximo es 25 %."),
    years: z
      .number({ error: "Elige un plazo válido." })
      .int("Usa años completos.")
      .min(CALC_LIMITS.yearsMin, "Mínimo 1 año.")
      .max(CALC_LIMITS.yearsMax, "Máximo 40 años."),
  })
  .refine((v) => v.initial > 0 || v.monthly > 0, {
    path: ["monthly"],
    message: "Indica un monto inicial o un aporte mensual.",
  });

export type CalculatorInput = z.output<typeof calculatorSchema>;
