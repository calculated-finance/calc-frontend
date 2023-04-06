export function combineDateAndTime(startDate: Date, purchaseTime: string | undefined) {
  const startTime = new Date(startDate);
  if (purchaseTime) {
    const [hours, minutes] = purchaseTime.split(':');
    startTime.setHours(parseInt(hours, 10));
    startTime.setMinutes(parseInt(minutes, 10));
  }
  return startTime;
}
