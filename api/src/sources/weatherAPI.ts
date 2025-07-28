import config from "../config/config";
import { Forecast } from "../model/forecast";
import { Location } from "../model/location";

type QueriedLocation = {
  lat: number,
  lon: number,
  name: string;
  country: string;
}

type QueriedCurrentForecast = {
  last_updated: string;
  temp_f: number;
}

type QueriedForecast = {
  current: QueriedCurrentForecast,
  forecast: {
    forecastday: {
      date: string;
      day: {
        avgtemp_f: number;
      }
    }[];
  }
}

type CurrentForecastData = {
  location: Location,
  forecastData: Forecast[];
  updatedAt: Date;
}

class WeatherAPIConnector {
  // Private Members
  #apiKey = config.weatherAPI.apiKey;

  /**
   * This function handles building a request to a Url for the Weather API
   *
   * @param endpoint string for the endpoint to reach out to
   */
  private buildRequestUrl(endpoint: string, queryParams: [string, string][] = []) {
    const queryString = [['key', this.#apiKey], ...queryParams].map(([key, value]) => `${key}=${value}`).join('&')

    return `${config.weatherAPI.baseUrl}/${endpoint}?${queryString}`
  }

  /**
   * This function handles searching for a location given a partial or whole
   * string
   *
   * @param location string to query the weather API for
   */
  public async findLocation(location: string): Promise<Location[]> {
    const response = await fetch(this.buildRequestUrl('search.json', [['q', location]]));
    const data = await response.json();

    return data.map(({ lat, lon, name, country }: QueriedLocation) => new Location(`${lat},${lon}`, name, country));
  }

  /**
   * This function handles pulling the specified locations current data given
   * their id
   *
   * @param locationId string id of the location to query
   */
  public async getLocationCurrentForecast(locationId: string): Promise<Forecast> {
    const response = await fetch(this.buildRequestUrl('current.json', [['q', locationId]]));
    const data = await response.json();

    return { date: new Date(data.current.last_updated), tempFahrenheit: data.current.temp_f };
  }

  /**
   * This function handles pulling the specified locations forecast data given
   * the number of days ahead to look for
   *
   * @param locationId string id of the location to query
   * @param days number of days to pull the forecast information for
   */
  public async getLocationForecast(locationId: string, days: number): Promise<CurrentForecastData> {
    const response = await fetch(this.buildRequestUrl('forecast.json', [['q', locationId], ['days', String(days)]]));
    const data = await response.json();
    const loc = data.location;

    return {
      location: new Location(`${loc.lat},${loc.lon}`, loc.name, loc.country),
      forecastData: data.forecast.forecastday.map(({ date, day }: QueriedForecast['forecast']['forecastday'][0]) => new Forecast(new Date(date), day.avgtemp_f)),
      updatedAt: new Date(data.current.last_updated),
    };
  }

  /**
   * This function handles pulling the specified locations historic forecast
   * data given the number of days ahead to look for
   *
   * @param locationId string id of the location to query
   * @param startDate date for the beginning of the historic range
   * @param endDate date for the end of the historic range
   */
  public async getLocationHistoricForecast(locationId: string, startDate: Date, endDate: Date): Promise<Forecast[]> {
    const formatDate = (inputDate: Date): string => {
      const year = String(inputDate.getFullYear());
      const month = String(inputDate.getMonth() + 1);
      const day = String(inputDate.getDate());
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    const response = await fetch(this.buildRequestUrl('history.json', [['q', locationId], ['dt', formatDate(startDate)], ['end_dt', formatDate(endDate)]]));
    const data = await response.json();

    return data.forecast.forecastday.map(({ date, day }: QueriedForecast['forecast']['forecastday'][0]) => new Forecast(new Date(date), day.avgtemp_f));
  }
}

export default WeatherAPIConnector;
