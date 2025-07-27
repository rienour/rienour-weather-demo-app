import https from "https";
import config from "../config/config";

type QueriedLocation = {
  lat: number,
  long: number,
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

type ForecastDay = {
  date: string;
  tempFahrenheit: number;
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
  public findLocation(location: string): QueriedLocation[] {
    let response: QueriedLocation[] = [];

    https.get(this.buildRequestUrl('search.json', [['q', location]]), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        // Pull out the applicable fields from the response object(s)
        response = JSON.parse(data).map(({ lat, long, name, country }: QueriedLocation) => ({ lat, long, name, country }));
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });

    return response;
  }

  /**
   * This function handles pulling the specified locations current data given
   * their id
   *
   * @param locationId string id of the location to query
   */
  public getLocationCurrentForecast(locationId: string): ForecastDay | null {

    let response = null;

    https.get(this.buildRequestUrl('current.json', [['q', locationId]]), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const receivedResponse: { current: QueriedCurrentForecast } = JSON.parse(data);

        response = { date: receivedResponse.current.last_updated, tempFahrenheit: receivedResponse.current.temp_f };
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });

    return response;
  }

  /**
   * This function handles pulling the specified locations forecast data given
   * the number of days ahead to look for
   *
   * @param locationId string id of the location to query
   * @param daysAhead number of days to pull the forecast information for
   */
  public getLocationForecast(locationId: string, daysAhead: number): ForecastDay[] {
    let response: ForecastDay[] = [];

    https.get(this.buildRequestUrl('forecast.json', [['q', locationId], ['days', String(daysAhead)]]), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const receivedResponse: QueriedForecast = JSON.parse(data);
        response = [
          { date: receivedResponse.current.last_updated, tempFahrenheit: receivedResponse.current.temp_f },
          ...(receivedResponse.forecast.forecastday.map(({ date, day }: QueriedForecast['forecast']['forecastday'][0]) => ({ date, tempFahrenheit: day.avgtemp_f }))),
        ];
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });

    return response;
  }

  /**
   * This function handles pulling the specified locations historic forecast
   * data given the number of days ahead to look for
   *
   * @param locationId string id of the location to query
   * @param startDate date for the beginning of the historic range
   * @param endDate date for the end of the historic range
   */
  public getLocationHistoricForecast(locationId: string, startDate: Date, endDate: Date): ForecastDay[] {

    let response: ForecastDay[] = [];

    const formatDate = (inputDate: Date): string => {
      const year = String(inputDate.getFullYear());
      const month = String(inputDate.getMonth() + 1);
      const day = String(inputDate.getDate());
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    https.get(this.buildRequestUrl('history.json', [['q', locationId], ['dt', formatDate(startDate)], ['end_dt', formatDate(endDate)]]), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const receivedResponse: QueriedForecast = JSON.parse(data);

        response = receivedResponse.forecast.forecastday.map(({ date, day }: QueriedForecast['forecast']['forecastday'][0]) => ({ date, tempFahrenheit: day.avgtemp_f }));
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });

    return response;
  }
}

export default WeatherAPIConnector;
