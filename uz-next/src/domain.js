/** Local demonstration configuration. Never use as proof of paid access. */
export const LEVELS = Object.freeze([
  Object.freeze({ id: 'level1', name: '1-daraja', price: 80000, dailyLimit: 1 }),
  Object.freeze({ id: 'level2', name: '2-daraja', price: 130000, dailyLimit: 5 }),
  Object.freeze({ id: 'silver', name: 'Kumush', price: 200000, dailyLimit: 10 }),
  Object.freeze({ id: 'gold', name: 'Oltin', price: 265000, dailyLimit: null }),
]);

export function formatUZS(value) {
  if (!Number.isFinite(value)) throw new TypeError('UZS value must be finite');
  return `${new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(value).replace(/,|\u00a0|\u202f/g, ' ')} so‘m`;
}

/** Fixed presentation fixtures, not predictions, winnings or live game data. */
export function demoResult(gameId, sequence = 0) {
  if (typeof gameId !== 'string' || !gameId.trim()) throw new TypeError('gameId is required');
  if (!Number.isInteger(sequence) || sequence < 0) throw new TypeError('sequence must be a nonnegative integer');
  const normalized = gameId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = { demo: true, gameId, sequence };
  if (normalized === 'thimbles') {
    const position = sequence % 3;
    return { ...base, type: 'position', value: position, position, label: ['Chap', 'O‘rta', 'O‘ng'][position] };
  }
  if (normalized === 'tower' || normalized === 'towerrush') {
    return { ...base, type: 'floors', value: 8, label: '8' };
  }
  if (normalized === 'balloon') {
    return { ...base, type: 'amount', value: 4000000, label: formatUZS(4000000) };
  }
  return { ...base, type: 'multiplier', value: 2.58, multiplier: 2.58, label: '2,58X' };
}
