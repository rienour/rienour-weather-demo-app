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

  // Private Members
  #collection = db.collection(Collections.LocationWeathers);

  constructor(location: Location, forecastDays: Forecast[], updatedAt?: Date) {
    this.location = location;
    this.weatherDays = forecastDays;
    this.updatedAt = updatedAt;
  }

  /**
   * This function handles writing the object to the
   * database
   */
  public create() {
    const { name, country } = this.location;
    const updatedAt = this.updatedAt ? this.updatedAt : new Date();

    return this.#collection.doc(this.location.id).set({
      name,
      country,
      weatherDays: this.weatherDays.map(({ date, tempFahrenheit }) => ({ date, tempFahrenheit })),
      updatedAt: updatedAt.toISOString(),
    });
  }

  /**
   * This function handles updating the object in the database
   */
  public updateForecastDays(newWeatherDays: Forecast[]) {
    const newUpdatedAt = new Date();
    return this
      .#collection
      .doc(this.location.id)
      .set({
        weatherDays: newWeatherDays.map(({ date, tempFahrenheit }) => ({ date, tempFahrenheit })),
        updatedAt: newUpdatedAt.toISOString(),
      });
  }
}
