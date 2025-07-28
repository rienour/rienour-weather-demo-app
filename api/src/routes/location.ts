import { Router } from "express";
import WeatherAPIConnector from "../sources/weatherAPI";
import { LocationForecast } from "../model/locationForecast";
import { generateDayOffsetTimestamp, isSameDay } from "../utils/datetime";
import { Forecast } from "../model/forecast";

const locationRouter = Router();

/**
 * This route is responsible for providing results to the user for selection
 * based on what is available from the third party API
 */
locationRouter.post('/', async (req, res) => {
  const { searchLocation } = req.body ?? {};
  if (!searchLocation) {
    return res.status(400).send('Invalid Search location.');
  }

  const weatherAPI = new WeatherAPIConnector();
  const locations = await weatherAPI.findLocation(searchLocation);

  return res.status(200).send({ results: locations });
});

/**
 * This route is responsible for providing results to the user with the
 * information for the relevent location. An id is expected in the request
 * parameter.
 */
locationRouter.get('/:id', async (req, res) => {
  const id = req.params?.id;
  if (!id) {
    return res.status(400).send('Invalid location ID.');
  }

  const locationForecast = await LocationForecast.select(id);
  const weatherAPI = new WeatherAPIConnector();

  // Forecast exists in the database
  if (locationForecast) {
    const updatedAt = new Date(locationForecast.updatedAt);
    const { date } = await weatherAPI.getLocationCurrentForecast(id);

    // Current forecast and database forecast match
    if (updatedAt.toISOString() === date.toISOString()) {
      return res.status(200).send(locationForecast);
    }
    // If it's not the same day
    else if (!isSameDay(updatedAt, date)) {
      const [historic, currentForecast] = await Promise.all([
        weatherAPI.getLocationHistoricForecast(id, generateDayOffsetTimestamp(-4), generateDayOffsetTimestamp(-1)),
        weatherAPI.getLocationForecast(id, 6),
      ]);

      // Update the database stored forecast information
      await LocationForecast.updateForecastDays(
        id,
        [...currentForecast.forecastData, ...historic],
        currentForecast.updatedAt
      );

      return res.status(200).send(await LocationForecast.select(id));
    }
    // It's the same day, but different time
    else {
      const newForecastDatum = await weatherAPI.getLocationCurrentForecast(id);
      const newForecastData = [
        newForecastDatum,
        ...locationForecast
          .weatherDays
          .filter(({ date }: Forecast) => !isSameDay(new Date(date), updatedAt))
      ];

      // Update the database stored forecase information
      await LocationForecast.updateForecastDays(id, newForecastData, newForecastDatum.date);

      // Return the updated database information
      return res.status(200).send(await LocationForecast.select(id));
    }
  }
  // Forecast does not yet exist in the database
  else {
    const [historic, currentForecast] = await Promise.all([
      weatherAPI.getLocationHistoricForecast(id, generateDayOffsetTimestamp(-4), generateDayOffsetTimestamp(-1)),
      weatherAPI.getLocationForecast(id, 6),
    ]);

    const locationForecast = new LocationForecast(
      currentForecast.location,
      [...currentForecast.forecastData, ...historic],
      currentForecast.updatedAt
    );

    // Write the new record to the database
    await locationForecast.write();

    // Send the pulled information
    return res.status(201).send(locationForecast)
  }
});

export default locationRouter;
