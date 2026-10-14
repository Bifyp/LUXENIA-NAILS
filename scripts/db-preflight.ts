import { prisma } from '../lib/prisma';
async function main() {
  const rows = await prisma.booking.findMany({ where: { status: { not: 'cancelled' } }, select: { date: true, time: true } });
  const seen = new Set<string>();
  let duplicateSlots = 0, nonCanonicalDates = 0;
  for (const row of rows) {
    const day = row.date.toISOString().slice(0, 10);
    if (row.date.toISOString() !== `${day}T00:00:00.000Z`) nonCanonicalDates++;
    const key = `${day}:${row.time}`;
    if (seen.has(key)) duplicateSlots++;
    seen.add(key);
  }
  if (duplicateSlots || nonCanonicalDates) {
    console.error(`Migration blocked: ${duplicateSlots} overlapping active slots; ${nonCanonicalDates} non-midnight dates. Back up and reconcile manually. No data was modified.`);
    process.exitCode = 1;
  } else console.log('Booking preflight passed. No data was modified.');
}
main().catch(() => { console.error('Preflight failed. Verify database access and existing migrations.'); process.exitCode = 1; }).finally(() => prisma.$disconnect());
