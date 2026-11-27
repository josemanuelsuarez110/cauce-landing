export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Cauce</p>
            <nav aria-label="Legal" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#aviso-riesgo" className="text-slate-400 underline hover:text-white">Aviso de riesgo</a>
              <a href="#privacidad" className="text-slate-400 underline hover:text-white">Privacidad</a>
              <a href="#seguridad" className="text-slate-400 underline hover:text-white">Seguridad</a>
            </nav>
          </div>

          <section aria-labelledby="estado-titulo">
            <h2 id="estado-titulo" className="text-sm font-semibold text-white">
              Experiencia de demostración
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Los indicadores y flujos de esta página son ejemplos; no reflejan operaciones ni servicios en tiempo real.
            </p>
          </section>
        </div>

        <div className="mt-10 space-y-4 border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-500">
          <p id="aviso-riesgo">
            <strong className="text-slate-300">Aviso de riesgo.</strong> Esta demostración está dirigida al público de República Dominicana. No confirma la disponibilidad de productos, alianzas ni autorización financiera local. Ahorrar e invertir implica riesgos, incluida la pérdida parcial o total del capital. Las cifras son ilustrativas y no garantizan resultados futuros.
          </p>
          <p id="privacidad">
            <strong className="text-slate-300">Privacidad.</strong> El formulario no confirma una inscripción, no está conectado a una lista de espera o CRM y no usa cookies propias ni analítica. La solicitud puede procesar temporalmente una IP enmascarada y los datos ficticios enviados; no uses información personal real.
          </p>
          <p>© {new Date().getFullYear()} Cauce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
