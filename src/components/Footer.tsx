export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#06111d] text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#contenido" className="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">C</span>
              CAUCE<span className="text-emerald-300">.</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Una propuesta de experiencia financiera diseñada alrededor de la claridad, la transparencia y el contexto dominicano.
            </p>
            <nav aria-label="Información" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href="#aviso-riesgo" className="underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white">Aviso de riesgo</a>
              <a href="#privacidad" className="underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white">Privacidad</a>
              <a href="#seguridad" className="underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white">Seguridad</a>
            </nav>
          </div>

          <section aria-labelledby="estado-titulo" className="max-w-sm rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Estado del producto</p>
            <h2 id="estado-titulo" className="mt-2 text-base font-semibold text-white">Experiencia conceptual</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              CAUCE es actualmente una demostración. No ofrece cuentas, custodia, inversiones ni transferencias financieras reales.
            </p>
          </section>
        </div>

        <div className="mt-12 space-y-4 border-t border-slate-800 pt-7 text-xs leading-relaxed text-slate-500">
          <p id="aviso-riesgo">
            <strong className="text-slate-300">Aviso de riesgo.</strong> Esta experiencia no confirma productos, alianzas ni autorización para prestar servicios financieros en República Dominicana. Las proyecciones son hipotéticas, no constituyen asesoría financiera ni garantizan resultados. Cualquier inversión o ahorro sujeto a riesgo puede implicar pérdida de capital.
          </p>
          <p id="privacidad">
            <strong className="text-slate-300">Privacidad.</strong> El formulario de esta demostración no crea una inscripción ni una cuenta. No introduzcas información personal real. Antes de habilitar la captación de datos se publicará una política de privacidad y se configurará un mecanismo de almacenamiento seguro.
          </p>
          <p>© {new Date().getFullYear()} CAUCE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
