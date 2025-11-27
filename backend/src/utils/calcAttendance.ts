/**
 * Calculate how many more classes a student needs to attend
 * to reach a target attendance percentage.
 * 
 * @param attended - Number of classes already attended
 * @param total - Total number of classes so far
 * @param target - Target percentage (default: 75)
 * @returns Number of additional classes needed (rounded up)
 */
export function classesNeeded(
  attended: number,
  total: number,
  target: number = 75
): number {
  if (total === 0) return 0;
  
  const p = target / 100;
  const x = (p * total - attended) / (1 - p);
  
  return Math.max(0, Math.ceil(x));
}

