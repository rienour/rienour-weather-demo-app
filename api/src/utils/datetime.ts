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
