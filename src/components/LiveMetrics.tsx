"use client";

import { useEffect, useState } from "react";
import { INITIAL_METRICS, formatMetric, type Metric } from "@/lib/metrics";

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<readonly Metric[]>(INITIAL_METRICS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) =>
          m.step.max === 0
            ? m
            : { ...m, value: m.value + Math.round(randomBetween(m.step.min, m.step.max)) },
        ),
      );
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-labelledby="metricas-titulo" className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h2 id="metricas-titulo" className="text-sm font-semibold">
          Indicadores de ejemplo
        </h2>
        <span className="text-xs text-muted">Datos simulados</span>
      </div>
      <dl className="divide-y divide-slate-800">
        {metrics.map((m) => (
          <div key={m.id} className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-muted">{m.label}</dt>
            <dd className="tabular font-display text-2xl font-semibold text-white">{formatMetric(m.value, m.format)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
