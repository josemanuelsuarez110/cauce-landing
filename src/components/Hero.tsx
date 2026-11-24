import { Lock, ShieldCheck, BadgeCheck } from "lucide-react";
import { LiveMetrics } from "./LiveMetrics";

// TODO(compliance): estos badges son marcadores de diseño. Mostrarlos como certificaciones
// solo cuando PCI-DSS e ISO 27001 estén realmente obtenidas y vigentes.
const BADGES = [
  { label: "PCI-DSS", Icon: BadgeCheck },
  { label: "ISO 27001", Icon: ShieldCheck },
  { label: "Cifrado AES-256", Icon: Lock },
] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
        <div>
          <h1 id="hero-titulo" className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Mueve y haz crecer tu dinero, con cada costo a la vista.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Transferencias y ahorro sin comisiones escondidas. Antes de confirmar, ves exactamente cuánto recibe la otra persona y cuánto crece tu dinero.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#calculadora" className="rounded-md bg-teal px-6 py-3 text-base font-semibold text-white hover:bg-teal-deep">
              Calcular mi rendimiento
            </a>
            <a href="#lista-de-espera" className="rounded-md border border-ink px-6 py-3 text-base font-semibold hover:bg-ink hover:text-white">
              Entrar a la lista de espera
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" aria-label="Estándares de seguridad">
            {BADGES.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium">
                <Icon aria-hidden="true" className="h-4 w-4 text-teal" />
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
