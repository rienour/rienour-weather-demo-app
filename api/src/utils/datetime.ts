/**
 * This function handles checking if the two provided dates are the same day.
 *
 * @return boolean indicating if the dates are the same day or not
 */
export const isSameDay = (firstDate: Date, secondDate: Date) => {
  return firstDate.getUTCFullYear() === secondDate.getUTCFullYear()
    && firstDate.getUTCMonth() === secondDate.getUTCMonth()
    && firstDate.getUTCDate() === secondDate.getUTCDate();
};

/**
 * This function handles creating offset timestamp given the number of days and
 * timestamp to reference. Does not mutate the original input date.
 *
 * @return timestamp with the appropriate offset days
 */
export const generateDayOffsetTimestamp = (days: number, baseDate?: Date) => {
  const offsetDate = baseDate ? new Date(baseDate) : new Date();

  const msInDay = 24 * 60 * 60 * 1000;
  offsetDate.setTime(offsetDate.getTime() + (msInDay * days));

  return offsetDate;
}
