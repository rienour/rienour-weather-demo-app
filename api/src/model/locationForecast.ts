import { Forecast } from './forecast.ts';
import { Location } from './location';
import { db, Collections } from '../apps/firebase';

/**
 * This class provides an in-memory mapping for the aggregate structure of a
 * location and the set of forecast days for the location. This structure has a
 * representation in the Firestore database.
 */
export class LocationForecast {
  // Public Members
  location: Location;
  weatherDays: Forecast[];
  updatedAt?: Date;

  constructor(location: Location, forecastDays: Forecast[], updatedAt?: Date) {
    this.location = location;
    this.weatherDays = forecastDays;
    this.updatedAt = updatedAt;
  }

  /**
   * This function handles writing the object to the
   * database.
   */
  public write() {
    const { name, country } = this.location;
    const updatedAt = this.updatedAt ? this.updatedAt : new Date();

    return db
      .collection(Collections.LocationWeathers)
      .doc(this.location.id)
      .set({
        name,
        country,
        weatherDays: this.weatherDays.map(({ date, tempFahrenheit }) => ({ date: date.toISOString(), tempFahrenheit })),
        updatedAt: updatedAt.toISOString(),
      });
  }

  /**
   * This function handles updating the object in the database
   */
  public static updateForecastDays(id: string, newWeatherDays: Forecast[], forecastUpdatedAt: Date) {
    return db
      .collection(Collections.LocationWeathers)
      .doc(id)
      .update({
        weatherDays: newWeatherDays.map(({ date, tempFahrenheit }) => ({ date: new Date(date).toISOString(), tempFahrenheit })),
        updatedAt: forecastUpdatedAt.toISOString(),
      });
  }

  /**
   * This function handles retrieving the record from the database
   *
   * @return object containing the data if it exists, or null otherwise
   */
  public static async select(id: string) {
    const databaseDocument = await db
      .collection(Collections.LocationWeathers)
      .doc(id)
      .get();

    return databaseDocument.exists ? databaseDocument.data() : null;
  }
}
