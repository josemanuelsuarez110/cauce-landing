export type MetricFormat = "integer" | "currency" | "seconds";

export interface Metric {
  readonly id: "transfers" | "volume" | "settlement" | "blocked";
  readonly label: string;
  readonly value: number;
  readonly format: MetricFormat;
  /** Cuánto puede subir el valor en cada actualización simulada. */
  readonly step: { readonly min: number; readonly max: number };
}

// Datos ILUSTRATIVOS. Reemplazar por una fuente real antes de producción.
export const INITIAL_METRICS: readonly Metric[] = [
  { id: "transfers", label: "Transferencias hoy", value: 18_426, format: "integer", step: { min: 1, max: 4 } },
  { id: "volume", label: "Volumen movido hoy", value: 2_914_380, format: "currency", step: { min: 120, max: 2_400 } },
  { id: "settlement", label: "Liquidación promedio", value: 4.2, format: "seconds", step: { min: 0, max: 0 } },
  { id: "blocked", label: "Intentos de fraude detenidos", value: 137, format: "integer", step: { min: 0, max: 1 } },
] as const;

const integer = new Intl.NumberFormat("es", { maximumFractionDigits: 0 });
const currency = new Intl.NumberFormat("es", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatMetric(value: number, format: MetricFormat): string {
  switch (format) {
    case "integer":
      return integer.format(value);
    case "currency":
      return currency.format(value);
    case "seconds":
      return `${value.toFixed(1).replace(".", ",")} s`;
  }
}

export interface SystemStatus {
  readonly id: string;
  readonly label: string;
  readonly state: "operational" | "degraded" | "outage";
}

export const SYSTEM_STATUS: readonly SystemStatus[] = [
  { id: "transfers", label: "Transferencias", state: "operational" },
  { id: "auth", label: "Autenticación", state: "operational" },
  { id: "api", label: "API", state: "operational" },
] as const;
