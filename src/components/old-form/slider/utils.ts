export function round(value: number, step: number) {
  return Math.round(value / step) * step;
}