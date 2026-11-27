type Level = "info" | "warn" | "error";

/** Log JSON estructurado. No pasar PII completa ni secretos en `fields`. */
export function logEvent(level: Level, event: string, fields: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Convierte un error desconocido en datos seguros para el log (solo servidor). */
export function describeError(err: unknown): { name: string; message: string; stack?: string } {
  if (err instanceof Error) return { name: err.name, message: err.message, stack: err.stack };
  return { name: "UnknownError", message: String(err) };
}

/** Enmascara un email: j***@dominio.com */
export function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.split("@");
  return `${user.slice(0, 1)}***@${domain}`;
}

/** Enmascara una IP antes de enviarla a registros o observabilidad. */
export function maskIp(ip: string): string {
  if (ip.includes(":")) {
    const normalized = ip.toLowerCase().split("%")[0] ?? "";
    const groups = normalized.split(":");
    if (groups.length >= 4) return `${groups.slice(0, 4).join(":")}:****`;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) {
    const groups = ip.split(".");
    return `${groups[0]}.${groups[1]}.${groups[2]}.***`;
  }
  return "***";
}
