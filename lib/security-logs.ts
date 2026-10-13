export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SECURITY";
  ip: string;
  method: string;
  path: string;
  userAgent?: string;
  userId?: string;
  reason?: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

export const logBuffer: SecurityLogEntry[] = [];
const MAX_BUFFER = 1000;

export function appendSecurityLog(entry: Omit<SecurityLogEntry, "id">): void {
  const log: SecurityLogEntry = { id: crypto.randomUUID(), ...entry };

  logBuffer.unshift(log);
  if (logBuffer.length > MAX_BUFFER) logBuffer.pop();

  const line = `[${log.level}] ${log.timestamp} ${log.method} ${log.path} | IP: ${log.ip}${log.reason ? ` | ${log.reason}` : ""}`;
  log.level === "SECURITY" || log.level === "ERROR"
    ? console.error(line)
    : console.log(line);
}

// ── Утилиты ───────────────────────────────────────────────────
export function getTopIps(n: number): Array<{ ip: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const log of logBuffer) {
    counts[log.ip] = (counts[log.ip] || 0) + 1;
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([ip, count]) => ({ ip, count }));
}