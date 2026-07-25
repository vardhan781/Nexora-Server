import { DateTime } from "luxon";

const APP_TIMEZONE = "Asia/Kolkata";

export const now = () => DateTime.now().setZone(APP_TIMEZONE);

export const nowDate = () => now().toJSDate();

export const startOfToday = () => now().startOf("day").toJSDate();

export const endOfToday = () => now().endOf("day").toJSDate();

export const getBusinessDay = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  }).day;

export const toBusinessDateKey = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  }).toISODate();

export const getBusinessWeekday = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  })
    .toFormat("ccc")
    .toUpperCase();

export const startOfGivenDay = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  })
    .startOf("day")
    .toJSDate();

export const endOfGivenDay = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  })
    .endOf("day")
    .toJSDate();

export const getMonthStart = (month, year) =>
  DateTime.fromObject(
    {
      year,
      month,
      day: 1,
    },
    {
      zone: APP_TIMEZONE,
    },
  )
    .startOf("day")
    .toJSDate();

export const getMonthEnd = (month, year) =>
  DateTime.fromObject(
    {
      year,
      month,
    },
    {
      zone: APP_TIMEZONE,
    },
  )
    .endOf("month")
    .toJSDate();

export const getWeekdayCode = (date) =>
  DateTime.fromJSDate(date, {
    zone: APP_TIMEZONE,
  })
    .toFormat("ccc")
    .toUpperCase();

export const attendanceDate = () => now().startOf("day").toJSDate();

export const shiftStart = (time) => {
  const [hour, minute] = time.split(":").map(Number);

  return now()
    .startOf("day")
    .set({
      hour,
      minute,
      second: 0,
      millisecond: 0,
    })
    .toJSDate();
};

export const graceEnd = (time, graceMinutes) => {
  return DateTime.fromJSDate(shiftStart(time), { zone: APP_TIMEZONE })
    .plus({ minutes: graceMinutes })
    .toJSDate();
};

export const differenceInMinutes = (later, earlier) => {
  return Math.floor(
    DateTime.fromJSDate(later, { zone: APP_TIMEZONE }).diff(
      DateTime.fromJSDate(earlier, { zone: APP_TIMEZONE }),
      "minutes",
    ).minutes,
  );
};

export const differenceInHours = (later, earlier) => {
  return Number(
    DateTime.fromJSDate(later, { zone: APP_TIMEZONE })
      .diff(DateTime.fromJSDate(earlier, { zone: APP_TIMEZONE }), "hours")
      .hours.toFixed(2),
  );
};

export const isSameBusinessDay = (date1, date2) => {
  return (
    DateTime.fromJSDate(date1, { zone: APP_TIMEZONE }).toISODate() ===
    DateTime.fromJSDate(date2, { zone: APP_TIMEZONE }).toISODate()
  );
};

export const toAppTime = (date) =>
  DateTime.fromJSDate(date).setZone(APP_TIMEZONE);

export const format = (date, format = "dd/MM/yyyy HH:mm:ss") =>
  toAppTime(date).toFormat(format);

export { APP_TIMEZONE };
