import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "@/lib/validations";
import { getClientIp, getLeadsRateLimiter } from "@/lib/rate-limit";
import { describeError, logEvent, maskEmail } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;

const BASE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

function respond(body: Record<string, unknown>, status: number, extra: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...BASE_HEADERS, ...extra } });
}

/** Acepta peticiones sin Origin (clientes no-navegador) o con Origin igual al sitio. */
function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const allowed = new Set<string>();
    const host = req.headers.get("host");
    if (host) allowed.add(host);
    if (process.env.SITE_URL) allowed.add(new URL(process.env.SITE_URL).host);
    return allowed.has(originHost);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip = getClientIp(req.headers);

  try {
    // 1) Origen (mitiga CSRF desde otros sitios)
    if (!isOriginAllowed(req)) {
      logEvent("warn", "leads.origin_rejected", { requestId, ip });
      return respond({ ok: false, error: "No se pudo procesar la solicitud." }, 403);
    }

    // 2) Tipo de contenido
    if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return respond({ ok: false, error: "Formato no admitido." }, 415);
    }

    // 3) Rate limit por IP (antes de leer el cuerpo)
    const rl = await getLeadsRateLimiter().limit(ip);
    if (!rl.success) {
      logEvent("warn", "leads.rate_limited", { requestId, ip });
      return respond(
        { ok: false, error: "Demasiados intentos. Vuelve a intentarlo más tarde." },
        429,
        { "Retry-After": String(rl.retryAfter) },
      );
    }

    // 4) Tamaño del cuerpo (Content-Length declarado y tamaño real)
    const declared = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return respond({ ok: false, error: "La solicitud es demasiado grande." }, 413);
    }
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return respond({ ok: false, error: "La solicitud es demasiado grande." }, 413);
    }

    // 5) JSON válido
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return respond({ ok: false, error: "Los datos enviados no son válidos." }, 400);
    }
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return respond({ ok: false, error: "Los datos enviados no son válidos." }, 400);
    }

    // 6) Honeypot: respuesta falsa de éxito, sin procesar nada
    const trap = (payload as Record<string, unknown>).website;
    if (typeof trap === "string" ? trap.trim() !== "" : trap !== undefined && trap !== null) {
      logEvent("info", "leads.honeypot_triggered", { requestId, ip });
      return respond({ ok: true }, 200);
    }

    // 7) Validación + sanitización estricta
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0] ?? "form")))];
      logEvent("info", "leads.validation_failed", { requestId, ip, fields });
      return respond({ ok: false, error: "Revisa los datos ingresados.", fields }, 422);
    }

    // 8) Persistencia: reemplazar por CRM/BD. Hoy solo se registra (sin PII completa).
    const lead = parsed.data;
    logEvent("info", "leads.accepted", {
      requestId,
      interest: lead.interest,
      email: maskEmail(lead.email),
      hasMessage: lead.message.length > 0,
    });

    return respond({ ok: true }, 200);
  } catch (err) {
    // Detalle solo en el log del servidor; el cliente recibe un mensaje genérico.
    logEvent("error", "leads.unhandled_error", { requestId, ip, error: describeError(err) });
    return respond({ ok: false, error: "No pudimos procesar tu solicitud. Inténtalo de nuevo." }, 500);
  }
}

// Cualquier otro método: 405 genérico
export function GET() {
  return respond({ ok: false, error: "Método no permitido." }, 405, { Allow: "POST" });
}
