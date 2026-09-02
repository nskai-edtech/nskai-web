/** Zerra's blue monochrome ramp, deep field to paper. Shared by the scroll
    stage and the item-bank bars so both read as the same scale. */
const STOPS: [number, number, number][] = [
  [11, 42, 107],
  [47, 82, 168],
  [110, 143, 216],
  [201, 214, 242],
  [246, 241, 239],
];

export function shade(v: number) {
  const x = Math.min(0.999, Math.max(0, v)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = STOPS[i];
  const b = STOPS[i + 1] || STOPS[i];
  const mix = (k: number) => Math.round(a[k] + (b[k] - a[k]) * f);
  return `rgb(${mix(0)},${mix(1)},${mix(2)})`;
}

/** A small deterministic PRNG, so the figure is the same on every load. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
