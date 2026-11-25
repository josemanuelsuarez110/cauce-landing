"use client";

import { useId, useState, type FormEvent } from "react";
import { LoaderCircle, CircleCheck } from "lucide-react";
import { LEAD_INTERESTS, leadSchema } from "@/lib/validations";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "interest" | "message" | "consent", string>>;

const INTEREST_LABELS: Record<(typeof LEAD_INTERESTS)[number], string> = {
  ahorro: "Ahorro que crece",
  transferencias: "Transferencias sin comisiones ocultas",
  inversion: "Inversión",
};

const FIELD_NAMES = ["name", "email", "interest", "message", "consent"] as const;

export function LeadForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };

    // Validación en cliente con el mismo esquema que usa el servidor
    const check = leadSchema.safeParse(payload);
    if (!check.success) {
      const next: FieldErrors = {};
      for (const issue of check.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && (FIELD_NAMES as readonly string[]).includes(key)) {
          const k = key as keyof FieldErrors;
          if (!next[k]) next[k] = issue.message;
        }
      }
      setErrors(next);
      setFormError("");
      setStatus("idle");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
        return;
      }
      if (res.status === 429) setFormError("Hiciste varios intentos seguidos. Espera unos minutos y vuelve a probar.");
      else if (res.status === 422) setFormError("Revisa los datos e inténtalo de nuevo.");
      else setFormError("No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.");
      setStatus("error");
    } catch {
      setFormError("No hay conexión. Revisa tu internet e inténtalo de nuevo.");
      setStatus("error");
    }
  }

  const err = (k: keyof FieldErrors) => errors[k];
  const describe = (k: keyof FieldErrors) => (err(k) ? `${uid}-${k}-err` : undefined);
  const inputClass = (k: keyof FieldErrors) =>
    `mt-1 w-full rounded-md border bg-white px-3 py-2.5 text-base ${err(k) ? "border-danger" : "border-line"}`;

  return (
    <section id="lista-de-espera" aria-labelledby="lead-titulo" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        <div>
          <h2 id="lead-titulo" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Sé de los primeros en usar Cauce.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/80">
            Déjanos tu correo y te avisamos cuando abramos tu cupo. Solo te escribimos sobre el acceso, sin spam.
          </p>
        </div>

        <div className="bg-paper p-6 text-ink sm:p-8">
          {status === "success" ? (
            <div role="status" className="flex items-start gap-3">
              <CircleCheck aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-teal" />
              <div>
                <p className="text-lg font-semibold">Listo, ya estás en la lista.</p>
                <p className="mt-1 text-muted">Te escribiremos cuando tu cupo esté disponible.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={formError ? `${uid}-form-err` : undefined}>
              <div>
                <label htmlFor={`${uid}-name`} className="block text-sm font-semibold">Nombre</label>
                <input id={`${uid}-name`} name="name" type="text" autoComplete="name" maxLength={160} required
                  aria-invalid={err("name") ? true : undefined} aria-describedby={describe("name")} className={inputClass("name")} />
                {err("name") ? <p id={`${uid}-name-err`} role="alert" className="mt-1 text-sm font-medium text-danger">{err("name")}</p> : null}
              </div>

              <div>
                <label htmlFor={`${uid}-email`} className="block text-sm font-semibold">Correo electrónico</label>
                <input id={`${uid}-email`} name="email" type="email" autoComplete="email" maxLength={254} required
                  aria-invalid={err("email") ? true : undefined} aria-describedby={describe("email")} className={inputClass("email")} />
                {err("email") ? <p id={`${uid}-email-err`} role="alert" className="mt-1 text-sm font-medium text-danger">{err("email")}</p> : null}
              </div>

              <div>
                <label htmlFor={`${uid}-interest`} className="block text-sm font-semibold">Qué te interesa</label>
                <select id={`${uid}-interest`} name="interest" defaultValue="" required
                  aria-invalid={err("interest") ? true : undefined} aria-describedby={describe("interest")} className={inputClass("interest")}>
                  <option value="" disabled>Elige una opción</option>
                  {LEAD_INTERESTS.map((v) => (
                    <option key={v} value={v}>{INTEREST_LABELS[v]}</option>
                  ))}
                </select>
                {err("interest") ? <p id={`${uid}-interest-err`} role="alert" className="mt-1 text-sm font-medium text-danger">{err("interest")}</p> : null}
              </div>

              <div>
                <label htmlFor={`${uid}-message`} className="block text-sm font-semibold">
                  Mensaje <span className="font-normal text-muted">(opcional)</span>
                </label>
                <textarea id={`${uid}-message`} name="message" rows={3} maxLength={1000}
                  aria-invalid={err("message") ? true : undefined} aria-describedby={describe("message")} className={inputClass("message")} />
                {err("message") ? <p id={`${uid}-message-err`} role="alert" className="mt-1 text-sm font-medium text-danger">{err("message")}</p> : null}
              </div>

              {/* Honeypot: invisible para personas y lectores de pantalla */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor={`${uid}-website`}>No completar este campo</label>
                <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input id={`${uid}-consent`} name="consent" type="checkbox" className="mt-1 h-5 w-5 accent-teal"
                    aria-invalid={err("consent") ? true : undefined} aria-describedby={describe("consent")} />
                  <label htmlFor={`${uid}-consent`} className="text-sm leading-relaxed">
                    Acepto que Cauce use mis datos para contactarme sobre el acceso anticipado. Puedo pedir que los borren cuando quiera.
                  </label>
                </div>
                {err("consent") ? <p id={`${uid}-consent-err`} role="alert" className="mt-1 text-sm font-medium text-danger">{err("consent")}</p> : null}
              </div>

              <div aria-live="polite">
                {formError ? <p id={`${uid}-form-err`} role="alert" className="text-sm font-medium text-danger">{formError}</p> : null}
              </div>

              <button type="submit" disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-6 py-3 text-base font-semibold text-white hover:bg-teal-deep disabled:opacity-70 sm:w-auto">
                {status === "sending" ? (<><LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />Enviando…</>) : "Unirme a la lista de espera"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
