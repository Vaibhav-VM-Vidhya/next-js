export const CLINIC_TIME_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
];

/**
 * Returns today's date formatted as YYYY-MM-DD in the user's LOCAL timezone.
 * Avoids the UTC-offset bug where toISOString() returns yesterday's date.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses time string like "10:30 AM" or "04:00 PM" into minutes since midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Checks whether a time slot has already passed for today.
 */
export function isTimeSlotPassedForToday(timeSlot: string, selectedDate: string): boolean {
  const todayStr = getLocalDateString();
  if (selectedDate !== todayStr) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = parseTimeToMinutes(timeSlot);

  // If slot is in the past, or less than 10 mins from now, mark as passed
  return slotMinutes <= currentMinutes + 10;
}

/**
 * Checks whether a given operatory time slot is already booked on a date.
 */
export function isSlotBooked(
  slot: string,
  selectedDate: string,
  appointments: Array<{ id?: string; date: string; time: string; status: string }>,
  excludeAppointmentId?: string
): boolean {
  return appointments.some((apt) => {
    if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
    if (apt.status === 'cancelled') return false;
    return apt.date === selectedDate && apt.time.trim().toLowerCase() === slot.trim().toLowerCase();
  });
}
