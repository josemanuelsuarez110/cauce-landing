import { Lock, ShieldCheck } from "lucide-react";

const LINKS = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#lista-de-espera", label: "Lista de espera" },
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#contenido" className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-teal" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 8c3 0 3 4 6 4s3-4 6-4 3 4 6 4" />
            <path d="M3 15c3 0 3 4 6 4s3-4 6-4 3 4 6 4" opacity="0.5" />
          </svg>
          Cauce
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-3 text-xs text-muted lg:flex" aria-label="Indicadores de seguridad">
            <li className="flex items-center gap-1">
              <Lock aria-hidden="true" className="h-3.5 w-3.5 text-teal" /> Cifrado AES-256
            </li>
            <li className="flex items-center gap-1">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-teal" /> MFA obligatoria
            </li>
          </ul>
          <a
            href="#calculadora"
            className="hidden rounded-md border border-ink px-3 py-2 text-sm font-medium hover:bg-ink hover:text-white sm:inline-block"
          >
            Calcular rendimiento
          </a>
          <a
            href="#lista-de-espera"
            className="rounded-md bg-teal px-3 py-2 text-sm font-semibold text-white hover:bg-teal-deep"
          >
            Unirme a la lista
          </a>

          {/* Menú móvil sin JavaScript */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-2 text-sm font-medium">
              Menú
            </summary>
            <nav aria-label="Móvil" className="absolute right-0 mt-2 w-48 rounded-md border border-line bg-white p-2 shadow-lg">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="block rounded px-3 py-2 text-sm hover:bg-mint">
                  {l.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
