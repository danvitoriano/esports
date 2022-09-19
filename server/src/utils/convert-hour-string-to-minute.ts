export function convertHourStringToMinute(hourString: string) {
  const [hours, minutes] = hourString.split(':').map(Number);
  const timeInMinutes = (hours * 60) + minutes;
  return timeInMinutes;
}