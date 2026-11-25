import { LiveMetrics } from "./LiveMetrics";

const BADGES = ["Pesos dominicanos (RD$)", "Cifras ilustrativas", "Sin promesas de rendimiento"] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="border-b border-slate-800">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
        <div>
          <h1 id="hero-titulo" className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Tus finanzas en pesos dominicanos, con cada costo a la vista.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Explora una propuesta para ahorrar y hacer transferencias con más claridad. Consulta tus proyecciones en RD$ y revisa cada supuesto, sin promesas de rendimiento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#calculadora" className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-indigo-950/40 transition-colors hover:bg-indigo-500">
              Probar calculadora en RD$
            </a>
            <a href="#lista-de-espera" className="rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-slate-800">
              Recibir novedades
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Características de esta demostración">
            {BADGES.map((label) => (
              <li key={label} className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-sm font-medium text-slate-300">
                {label}
              </li>
            ))}
          </ul>
        </div>
        <LiveMetrics />
      </div>
    </section>
  );
}
