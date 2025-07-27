/**
 * This class provides an in-memory mapping for the individual forecast
 * information for the application
 */
export class Forecast {
  date: Date;
  tempFahrenheit: number;

  constructor(date: Date, tempFahrenheit: number) {
    this.date = date;
    this.tempFahrenheit = tempFahrenheit;
  }
}
