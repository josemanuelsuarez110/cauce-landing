const LINKS = [
  { href: "#calculadora", label: "Calculadora" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#lista-de-espera", label: "Recibir novedades" },
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#contenido" className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 8c3 0 3 4 6 4s3-4 6-4 3 4 6 4" />
            <path d="M3 15c3 0 3 4 6 4s3-4 6-4 3 4 6 4" opacity="0.5" />
          </svg>
          Cauce
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#calculadora"
            className="hidden rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 sm:inline-block"
          >
            Probar calculadora
          </a>
          <a
            href="#lista-de-espera"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition-colors hover:bg-indigo-500"
          >
            Recibir novedades
          </a>

          {/* Menú móvil sin JavaScript */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200">
              Menú
            </summary>
            <nav aria-label="Móvil" className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
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
