import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IDateProvider } from "../../domain/use-cases/_ports/date-provider/date-provider";

dayjs.extend(utc);
export class DateProvider implements IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number {
    const startDate = this.ConvertToUTC(start_date);
    const endDate = this.ConvertToUTC(end_date);
    return dayjs(endDate).diff(startDate, "hours");
  }
  DateNow(): Date {
    return dayjs().toDate();
  }
  ConvertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
  compareInDays(startDate: Date, endDate: Date): number {
    const start = this.ConvertToUTC(startDate);
    const end = this.ConvertToUTC(endDate);
    return dayjs(end).diff(start, "days");
  }
  addDays(day: number): Date {
    return dayjs().add(day, "days").toDate();
  }
  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }
  compareIsBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }
}
