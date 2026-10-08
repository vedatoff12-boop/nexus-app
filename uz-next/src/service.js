import { LEVELS, demoResult } from './domain.js';

export class DemoServiceError extends Error {
  constructor(code, message, session) {
    super(message);
    this.name = 'DemoServiceError';
    this.code = code;
    this.session = session;
  }
}

/** In-memory UI simulator only. No network, storage, payments or entitlements. */
export function createDemoService({ delayMs = 400, now = () => new Date() } = {}) {
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new TypeError('delayMs must be nonnegative');
  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const today = () => dateFormatter.format(now());
  let day = today();
  let levelId = 'level1';
  let used = 0;
  let sequence = 0;
  let scenario = 'normal';
  let generation = 0;
  const completed = new Map();
  const pending = new Map();
  const wait = () => new Promise(resolve => setTimeout(resolve, delayMs));
  const rollover = () => {
    const current = today();
    if (day !== current) {
      day = current;
      used = 0;
      completed.clear();
    }
  };
  const session = () => {
    rollover();
    const level = LEVELS.find(item => item.id === levelId);
    return {
      demo: true, levelId, level: { ...level }, used, dailyLimit: level.dailyLimit,
      remaining: level.dailyLimit === null ? null : Math.max(0, level.dailyLimit - used),
      day, scenario,
    };
  };
  const failure = (code, message) => new DemoServiceError(code, message, session());
  function requestSignal(gameId, { idempotencyKey } = {}) {
    demoResult(gameId, 0); // Validate arguments before scheduling.
    if (idempotencyKey !== undefined && (typeof idempotencyKey !== 'string' || !idempotencyKey.trim())) {
      throw new TypeError('idempotencyKey must be a nonempty string');
    }
    rollover();
    const key = idempotencyKey === undefined ? null : `${day}:${idempotencyKey}`;
    const existing = key && (completed.get(key) || pending.get(key));
    if (existing) {
      if (existing.gameId !== gameId) return Promise.reject(failure('UNAVAILABLE', 'So‘rov kaliti boshqa o‘yin uchun ishlatilgan.'));
      return existing.promise.then(value => structuredClone(value));
    }
    const requestGeneration = generation;
    const promise = (async () => {
      await wait();
      if (generation !== requestGeneration) throw failure('UNAVAILABLE', 'Demo qayta boshlandi. Qayta urinib ko‘ring.');
      const state = session();
      if (scenario === 'offline') throw failure('OFFLINE', 'Internet aloqasi yo‘q. Bu demo holati.');
      if (scenario === 'error') throw failure('UNAVAILABLE', 'Demo xizmati vaqtincha mavjud emas.');
      if (scenario === 'limit' || state.remaining === 0) throw failure('LIMIT', 'Bugungi demo limitingiz tugadi.');
      // No await between checking and consuming: atomic within this JS instance.
      const result = demoResult(gameId, sequence++);
      used += 1;
      return { ...result, session: session() };
    })();
    if (key) {
      const entry = { gameId, promise };
      pending.set(key, entry);
      promise.then(() => {
        if (generation === requestGeneration && key.startsWith(`${day}:`)) completed.set(key, entry);
        if (pending.get(key) === entry) pending.delete(key);
      }, () => { if (pending.get(key) === entry) pending.delete(key); });
    }
    return promise.then(value => structuredClone(value));
  }
  return {
    async getSession() { await wait(); return session(); },
    async setLevel(id) {
      if (!LEVELS.some(level => level.id === id)) throw new TypeError('Unknown demo level');
      const requestGeneration = generation;
      await wait();
      if (generation !== requestGeneration) return session();
      levelId = id; // Changing demo level does not refill the daily allowance.
      return session();
    },
    requestSignal,
    async reset() {
      generation += 1;
      levelId = 'level1'; used = 0; sequence = 0; scenario = 'normal'; day = today();
      completed.clear(); pending.clear();
      await wait();
      return session();
    },
    setScenario(value) {
      if (!['normal', 'offline', 'error', 'limit'].includes(value)) throw new TypeError('Unknown demo scenario');
      scenario = value;
      return session();
    },
  };
}
