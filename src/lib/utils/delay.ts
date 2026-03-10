/**
 * Delay utility for simulating processing time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Random delay within a range for more realistic mock behavior
 */
export const randomDelay = (minMs: number, maxMs: number): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(ms);
};
