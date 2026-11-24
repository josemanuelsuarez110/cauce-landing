import { SYSTEM_STATUS, type SystemStatus } from "@/lib/metrics";

const STATE_LABEL: Record<SystemStatus["state"], string> = {
  operational: "Operativo",
  degraded: "Degradado",
  outage: "Caído",
};

const STATE_COLOR: Record<SystemStatus["state"], string> = {
  operational: "bg-teal text-teal",
  degraded: "bg-signal text-signal",
  outage: "bg-danger text-danger",
};

export function Footer() {
  const allOk = SYSTEM_STATUS.every((s) => s.state === "operational");
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Cauce</p>
            <nav aria-label="Legal" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#aviso-riesgo" className="text-muted underline hover:text-ink">Aviso de riesgo</a>
              <a href="#privacidad" className="text-muted underline hover:text-ink">Privacidad</a>
              <a href="#seguridad" className="text-muted underline hover:text-ink">Seguridad</a>
            </nav>
          </div>

          <section aria-labelledby="estado-titulo" role="status">
            <h2 id="estado-titulo" className="text-sm font-semibold">
              Estado del sistema: {allOk ? "todo funciona con normalidad" : "hay servicios afectados"}
            </h2>
            <ul className="mt-3 space-y-2">
              {SYSTEM_STATUS.map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden="true" className={`pulse-dot relative inline-block h-2.5 w-2.5 rounded-full ${STATE_COLOR[s.state]}`} />
                  {s.label}: <span className="font-medium text-ink">{STATE_LABEL[s.state]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 space-y-4 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          <p id="aviso-riesgo">
            <strong className="text-ink">Aviso de riesgo.</strong> Ahorrar e invertir implica riesgos, incluida la pérdida de parte o todo el capital. Los rendimientos pasados o simulados no garantizan resultados futuros. Las cifras de esta página son ilustrativas.
          </p>
          <p id="privacidad">
            <strong className="text-ink">Privacidad.</strong> Usamos los datos de la lista de espera solo para avisarte del acceso anticipado. No los vendemos ni los compartimos con terceros para publicidad.
          </p>
          <p>© {new Date().getFullYear()} Cauce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
