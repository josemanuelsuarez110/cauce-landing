"use client";

import { useId, useMemo, useState } from "react";
import { CALC_LIMITS, calculatorSchema, parseDecimalInput } from "@/lib/validations";
import { TRADITIONAL_FEE_PCT, formatUsd, project, type Projection } from "@/lib/calc";

type FieldKey = "initial" | "monthly" | "annualRate" | "years";
type Errors = Partial<Record<FieldKey, string>>;
type Outcome = { ok: true; projection: Projection } | { ok: false; errors: Errors };

const NUMBER_ERROR = "Escribe un número válido, por ejemplo 1500 o 1500,50.";

function compute(initial: string, monthly: string, rate: string, years: number): Outcome {
  const raw = {
    initial: parseDecimalInput(initial),
    monthly: parseDecimalInput(monthly),
    annualRate: parseDecimalInput(rate),
    years,
  };

  const errors: Errors = {};
  if (raw.initial === null) errors.initial = NUMBER_ERROR;
  if (raw.monthly === null) errors.monthly = NUMBER_ERROR;
  if (raw.annualRate === null) errors.annualRate = NUMBER_ERROR;
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const parsed = calculatorSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const projection = project(parsed.data);
  if (!projection) return { ok: false, errors: { monthly: "El resultado es demasiado grande. Reduce los montos." } };
  return { ok: true, projection };
}

function Field(props: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {props.label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          maxLength={12}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? `${hintId} ${errId}` : hintId}
          className={`tabular w-full rounded-md border bg-white px-3 py-2.5 text-base ${
            props.error ? "border-danger" : "border-line"
          }`}
        />
        {props.suffix ? (
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
            {props.suffix}
          </span>
        ) : null}
      </div>
      <p id={hintId} className="mt-1 text-xs text-muted">
        {props.hint}
      </p>
      {props.error ? (
        <p id={errId} role="alert" className="mt-1 text-sm font-medium text-danger">
          {props.error}
        </p>
      ) : null}
    </div>
  );
}

function GrowthChart({ projection }: { projection: Projection }) {
  const W = 480;
  const H = 200;
  const PAD = { l: 8, r: 8, t: 12, b: 24 };
  const { points } = projection;
  const maxY = Math.max(...points.map((p) => p.cauce), 1);
  const maxX = Math.max(points.length - 1, 1);
  const x = (i: number) => PAD.l + (i / maxX) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);
  const line = (pick: (p: (typeof points)[number]) => number) =>
    points.map((p, i) => `${x(i).toFixed(1)},${y(pick(p)).toFixed(1)}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg
      role="img"
      aria-label={`Crecimiento año a año. Con Cauce llegas a ${formatUsd(projection.finalCauce)} y con un proveedor tradicional a ${formatUsd(projection.finalTraditional)}.`}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--color-line)" />
      <polyline points={line((p) => p.contributed)} fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeDasharray="5 4" />
      <polyline points={line((p) => p.traditional)} fill="none" stroke="var(--color-signal)" strokeWidth="2.5" />
      <polyline points={line((p) => p.cauce)} fill="none" stroke="var(--color-teal)" strokeWidth="3.5" strokeLinejoin="round" />
      {last ? <circle cx={x(points.length - 1)} cy={y(last.cauce)} r="4.5" fill="var(--color-teal)" /> : null}
      <text x={PAD.l} y={H - 6} fontSize="11" fill="var(--color-muted)">Hoy</text>
      <text x={W - PAD.r} y={H - 6} fontSize="11" textAnchor="end" fill="var(--color-muted)">
        {last ? `Año ${last.year}` : ""}
      </text>
    </svg>
  );
}

export function Calculator() {
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState(10);
  const yearsId = useId();

  const outcome = useMemo(() => compute(initial, monthly, rate, years), [initial, monthly, rate, years]);
  const errors: Errors = outcome.ok ? {} : outcome.errors;

  return (
    <section id="calculadora" aria-labelledby="calc-titulo" className="border-b border-line bg-mint/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 id="calc-titulo" className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Mira cuánto crece tu dinero cuando no pagas comisiones escondidas.
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Cambia los valores y compara con un proveedor tradicional que cobra {TRADITIONAL_FEE_PCT.toString().replace(".", ",")} % anual en comisiones.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="space-y-5">
            <Field label="Monto inicial (USD)" hint="Hasta 10.000.000. Puede ser 0." value={initial} onChange={setInitial} error={errors.initial} />
            <Field label="Aporte mensual (USD)" hint="Hasta 1.000.000. Puede ser 0." value={monthly} onChange={setMonthly} error={errors.monthly} />
            <Field label="Rendimiento anual estimado" hint="Entre 0 y 25. Es una hipótesis, no una promesa." value={rate} onChange={setRate} error={errors.annualRate} suffix="%" />
            <div>
              <label htmlFor={yearsId} className="flex justify-between text-sm font-semibold">
                <span>Plazo</span>
                <span className="tabular">{years} {years === 1 ? "año" : "años"}</span>
              </label>
              <input
                id={yearsId}
                type="range"
                min={CALC_LIMITS.yearsMin}
                max={CALC_LIMITS.yearsMax}
                step={1}
                value={years}
                onChange={(e) => setYears(Number.parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-teal"
              />
            </div>
          </div>

          <div aria-live="polite" className="border border-ink bg-white p-6">
            {outcome.ok ? (
              <>
                <p className="text-sm text-muted">Con Cauce, en {years} {years === 1 ? "año" : "años"} tendrías</p>
                <p className="tabular mt-1 font-display text-5xl font-semibold text-teal-deep">{formatUsd(outcome.projection.finalCauce)}</p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted">Aportado por ti</dt>
                    <dd className="tabular text-lg font-semibold">{formatUsd(outcome.projection.contributed)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Rendimiento generado</dt>
                    <dd className="tabular text-lg font-semibold">{formatUsd(outcome.projection.earnings)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Comisiones que no pagas</dt>
                    <dd className="tabular text-lg font-semibold text-teal-deep">{formatUsd(outcome.projection.feesAvoided)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <GrowthChart projection={outcome.projection} />
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    <li><span aria-hidden="true" className="mr-1 inline-block h-0.5 w-5 bg-teal align-middle" />Cauce</li>
                    <li><span aria-hidden="true" className="mr-1 inline-block h-0.5 w-5 bg-signal align-middle" />Proveedor tradicional ({formatUsd(outcome.projection.finalTraditional)})</li>
                    <li><span aria-hidden="true" className="mr-1 inline-block h-0.5 w-5 border-t-2 border-dashed border-muted align-middle" />Solo lo que aportas</li>
                  </ul>
                </div>
              </>
            ) : (
              <p className="py-10 text-muted">Corrige los campos marcados para ver tu proyección.</p>
            )}
            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              Simulación ilustrativa con interés compuesto mensual. No garantiza resultados futuros. El rendimiento real puede ser menor y tu capital puede perder valor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
