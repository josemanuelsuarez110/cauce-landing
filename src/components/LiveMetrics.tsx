"use client";

const BARS = [28, 34, 31, 42, 39, 48, 45, 58, 54, 66, 72, 84] as const;

export function LiveMetrics() {
  return (
    <section
      aria-labelledby="vista-panel-titulo"
      className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-2xl shadow-black/30 sm:p-7"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Vista conceptual</p>
            <h2 id="vista-panel-titulo" className="mt-2 text-lg font-semibold text-white">Tu panorama financiero</h2>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            Ejemplo
          </span>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Meta de ahorro ilustrativa</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">RD$ 250,000</p>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span>Progreso de ejemplo</span>
            <span className="font-semibold tabular-nums text-emerald-300">68%</span>
          </div>
          <div
            role="img"
            aria-label="Barra ilustrativa de progreso de una meta de ahorro: 68 por ciento"
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"
          >
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-700/80 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Evolución del ahorro</p>
              <p className="mt-1 text-xs text-slate-400">Gráfico demostrativo, no datos de clientes</p>
            </div>
            <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">12 meses</span>
          </div>
          <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
            {BARS.map((height, index) => (
              <div key={index} className="flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-emerald-700 to-emerald-300/90 opacity-90"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-slate-500">
            <span>Ene</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dic</span>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Los montos y visualizaciones son ficticios y se utilizan únicamente para mostrar cómo podría verse el producto.
        </p>
      </div>
    </section>
  );
}
