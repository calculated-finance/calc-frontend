export function formatDate(date: Date | undefined) {
  if (!date) {
    return '-';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
