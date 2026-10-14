export function mergeMessages(base: Record<string, unknown>, overlay: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Unsafe message key');
    result[key] = value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])
      ? mergeMessages(result[key] as Record<string, unknown>, value as Record<string, unknown>) : value;
  }
  return result;
}
