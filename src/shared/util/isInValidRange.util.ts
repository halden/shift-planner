import { duration, unix } from 'moment';

const DATE_RANGE_IN_DAYS = 365;

export function isWithinYear(startDate: number, endDate: number) {
  const start = unix(startDate);
  const end = unix(endDate);
  const range = Math.ceil(duration(end.diff(start)).asDays());

  return range <= DATE_RANGE_IN_DAYS;
}
