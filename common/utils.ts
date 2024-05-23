export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function sanitizeBPM(bpm: number) {
  return clamp(bpm, 30, 300);
}
