import { Fingerprint, Landmark, Radar } from "lucide-react";

const PILLARS = [
  {
    Icon: Landmark,
    title: "Separación de fondos",
    text: "El diseño contempla mantener los fondos de clientes separados de los de la empresa. Cualquier servicio real dependería de entidades y procesos confirmados.",
  },
  {
    Icon: Fingerprint,
    title: "Autenticación reforzada",
    text: "Una experiencia financiera debería proteger el acceso y la autorización de movimientos con controles adecuados. Los mecanismos concretos dependerían de la implementación.",
  },
  {
    Icon: Radar,
    title: "Prevención de fraude",
    text: "El monitoreo de operaciones puede ayudar a identificar patrones atípicos. Sus capacidades dependerían de los sistemas que se integren.",
  },
] as const;

const FLOW = [
  { title: "Confirmación de identidad", text: "El proceso podría incluir un segundo factor, según los mecanismos implementados." },
  { title: "Revisión de la operación", text: "Los controles dependerían de los sistemas y proveedores que se integren." },
  { title: "Costo antes de confirmar", text: "La propuesta prioriza presentar los costos con claridad antes de aceptar." },
  { title: "Aviso del resultado", text: "Una experiencia real debería informar el estado de la operación y ofrecer un comprobante." },
] as const;

export function Security() {
  return (
    <section id="seguridad" aria-labelledby="seg-titulo" className="border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 id="seg-titulo" className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Seguridad y claridad desde el diseño.
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <ul className="space-y-8">
            {PILLARS.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 max-w-md leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20">
            <h3 className="text-lg font-semibold">Cómo imaginamos una transferencia</h3>
            <ol className="mt-5 space-y-5">
              {FLOW.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span aria-hidden="true" className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside
          aria-labelledby="estado-seguridad-titulo"
          className="mt-10 rounded-2xl border border-amber-400/40 bg-amber-950/30 p-5 sm:p-6"
        >
          <h3 id="estado-seguridad-titulo" className="text-lg font-semibold text-amber-100">
            Certificaciones y cifrado: estado no verificado
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            Para evitar confusiones, esta demostración no afirma contar con las siguientes certificaciones o controles:
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-200">
            <li><strong className="text-white">PCI-DSS:</strong> certificación no confirmada.</li>
            <li><strong className="text-white">ISO 27001:</strong> certificación no confirmada.</li>
            <li><strong className="text-white">Cifrado AES-256:</strong> implementación no verificada; no se anuncia como característica disponible.</li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-amber-100">
            No interpretes estos nombres como certificados ni garantías de seguridad.
          </p>
        </aside>
      </div>
    </section>
  );
}
