import moment from "moment";

export function formatDate(time) {
  return moment(time).format("YYYY-MM-DD");
}

export function formatDateWithHour(time, hour) {
  const usedHour = hour || hour === 0 ? hour : moment().hour();
  const baseDate = moment(time);

  baseDate.set({
    hour: usedHour,
  });

  const formattedDate = baseDate.format("YYYY-MM-DD HH:00");

  return formattedDate;
}

export function extractDate(time) {
  return moment(time).format("YYYY-MM-DD");
}

export function extractHour(time) {
  return moment(time).hour();
}
