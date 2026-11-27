import type { CalculatorInput } from "./validations";

/** Comisión anual supuesta de un proveedor tradicional (ilustrativa, se muestra en la UI). */
export const TRADITIONAL_FEE_PCT = 1.8;

export interface YearPoint {
  year: number;
  cauce: number;
  traditional: number;
  contributed: number;
}

export interface Projection {
  points: YearPoint[];
  finalCauce: number;
  finalTraditional: number;
  contributed: number;
  earnings: number;
  feesAvoided: number;
}

/** Interés compuesto mensual con aportes al cierre de cada mes. Devuelve null si algo no es finito. */
export function project(input: CalculatorInput): Projection | null {
  const { initial, monthly, annualRate, years } = input;
  const rCauce = annualRate / 100 / 12;
  const rTrad = (annualRate - TRADITIONAL_FEE_PCT) / 100 / 12;

  let cauce = initial;
  let trad = initial;
  const points: YearPoint[] = [{ year: 0, cauce, traditional: trad, contributed: initial }];

  for (let month = 1; month <= years * 12; month += 1) {
    cauce = cauce * (1 + rCauce) + monthly;
    trad = trad * (1 + rTrad) + monthly;
    if (month % 12 === 0) {
      points.push({ year: month / 12, cauce, traditional: trad, contributed: initial + monthly * month });
    }
  }

  const contributed = initial + monthly * years * 12;
  const values = [cauce, trad, contributed];
  if (!values.every((v) => Number.isFinite(v))) return null;

  return {
    points,
    finalCauce: cauce,
    finalTraditional: trad,
    contributed,
    earnings: cauce - contributed,
    feesAvoided: cauce - trad,
  };
}

const dop = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  maximumFractionDigits: 0,
});

export function formatDop(value: number): string {
  return dop.format(Math.round(value));
}
