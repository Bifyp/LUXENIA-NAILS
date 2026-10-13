export const SLOTS_BY_DAY: Record<number, string[]> = {
  0: ["11:00","11:30","12:00","12:30","13:00","13:30"],                                          // Вс 11-14
  1: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Пн 9:30-19
  2: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Вт
  3: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Ср
  4: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Чт
  5: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Пт
  6: ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30"],           // Сб 10-15
};

export const BOOKING_TIME_ZONE = 'Europe/Warsaw';
export function validBookingDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function availableBookingSlot(day: string, time: string, now = new Date()) {
  if (!validBookingDay(day)) return false;
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  if (!SLOTS_BY_DAY[weekday]?.includes(time)) return false;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  const today = `${get('year')}-${get('month')}-${get('day')}`;
  return day > today || (day === today && time > `${get('hour')}:${get('minute')}`);
}
