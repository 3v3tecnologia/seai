export function getYesterDayDate(separator: string) {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}${separator}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${separator}${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

export function dateDiffInDays(start: Date, end: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utcStart = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.floor((utcStart - utcEnd) / _MS_PER_DAY);
}

export function parseBrazilianDateTime(dateTimeString: string) {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);

  // Create a Date object with the parsed components
  const brazilianDate = new Date(Date.UTC(year, month - 1, day));

  return brazilianDate;
}
