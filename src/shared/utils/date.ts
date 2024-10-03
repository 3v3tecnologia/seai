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

export function isDateInThePast(date: Date): Boolean {
  return date.getTime() < new Date().getTime();
}

export function parseBrazilianDateTime(
  dateTimeString: string,
  separator?: string
) {
  const [datePart, timePart] = dateTimeString.split(" ");
  const div = separator || "/";
  const [day, month, year] = datePart.split(div).map(Number);

  // Create a Date object with the parsed components
  const brazilianDate = new Date(Date.UTC(year, month - 1, day));

  return brazilianDate;
}

export function formatDateStringToTime(time: string, delimiter?: string) {
  const date = new Date(time);

  const limiter = delimiter || "/";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().padStart(2, "0");

  return `${day}${limiter}${month}${limiter}${year}`;
}

export function formatDateToYYYYMMDD(date: string) {
  const [day, month, year] = date.split("/");

  return `${year}/${month}/${day}`;
}



export function decimalToHoursAndMinutes(decimalTime: number) {
  const date = new Date(0, 0);
  date.setSeconds(decimalTime * 60 * 60);

  // Extract hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the result
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}Hrs ${formattedMinutes}Min`;
}
