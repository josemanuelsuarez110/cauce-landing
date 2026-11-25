import { LiveMetrics } from "./LiveMetrics";

const BADGES = ["Pesos dominicanos (RD$)", "Cifras ilustrativas", "Sin promesas de rendimiento"] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
        <div>
          <h1 id="hero-titulo" className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Tus finanzas en pesos dominicanos, con cada costo a la vista.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Explora una propuesta para ahorrar y hacer transferencias con más claridad. Consulta tus proyecciones en RD$ y revisa cada supuesto, sin promesas de rendimiento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#calculadora" className="rounded-md bg-teal px-6 py-3 text-base font-semibold text-white hover:bg-teal-deep">
              Probar calculadora en RD$
            </a>
            <a href="#lista-de-espera" className="rounded-md border border-ink px-6 py-3 text-base font-semibold hover:bg-ink hover:text-white">
              Recibir novedades
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Características de esta demostración">
            {BADGES.map((label) => (
              <li key={label} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium">
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
