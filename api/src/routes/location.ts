import { Router } from "express";
import WeatherAPIConnector from "../sources/weatherAPI";
import { LocationForecast } from "../model/locationForecast";

const locationRouter = Router();

/**
 * This route is responsible for providing results to the user for selection
 * based on what is available from the third party API
 */
locationRouter.post('/getLocations', async (req, res) => {
  const { searchLocation } = req.body ?? {};
  if (!searchLocation) {
    return res.status(400).send('Invalid Search location.');
  }

  const weatherAPI = new WeatherAPIConnector();
  const locations = await weatherAPI.findLocation(searchLocation);

  return res.status(200).send({ results: locations.map(({ lat, lon, ...rest }) => ({ id: `${lat},${lon}`, ...rest })) });
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
  if (locationForecast.exists) {
    const updatedAt = new Date(locationForecast.data()?.updatedAt);
    const { date } = await weatherAPI.getLocationCurrentForecast(id);

    if (updatedAt.toISOString() === date.toISOString()) {
      return res.status(200).send(locationForecast.data());
    }
    // If it's not the same day
    else if (
      updatedAt.getFullYear() !== date.getFullYear()
      || updatedAt.getMonth() !== date.getMonth()
      || updatedAt.getDate() !== date.getDate()
    ) {
      const now = Date.now();
      const [historic, currentForecast] = await Promise.all([
        weatherAPI.getLocationHistoricForecast(id, new Date(now - (4 * 24 * 60 * 60 * 1000)), new Date(now - 1 * 24 * 60 * 60 * 1000)),
        weatherAPI.getLocationForecast(id, 6),
      ]);

      const newForecastData = [...currentForecast.forecastData, ...historic];

      await LocationForecast.updateForecastDays(id, newForecastData);
      const updatedResult = await LocationForecast.select(id);

      return res.status(200).send(updatedResult.data());
    }
    // It's the same day, but different time
    else {
      const newForecastDatum = await weatherAPI.getLocationCurrentForecast(id);
      const newForecastData = [
        newForecastDatum,
        ...locationForecast.data()?.weatherDays.filter(({ date }: { date: string }) => {
          const itemDate = new Date(date);
          return itemDate.getDate() !== updatedAt.getDate() &&
            itemDate.getMonth() !== updatedAt.getMonth() &&
            itemDate.getFullYear() !== updatedAt.getFullYear();
        })];

      await LocationForecast.updateForecastDays(id, newForecastData);
      const updatedResult = await LocationForecast.select(id);

      return res.status(200).send(updatedResult.data());
    }
  } else {
    const now = Date.now();
    const [historic, currentForecast] = await Promise.all([
      weatherAPI.getLocationHistoricForecast(id, new Date(now - (4 * 24 * 60 * 60 * 1000)), new Date(now - 1 * 24 * 60 * 60 * 1000)),
      weatherAPI.getLocationForecast(id, 6),
    ]);

    const forecastData = [...currentForecast.forecastData, ...historic];
    const locationForecast = new LocationForecast(currentForecast.location, forecastData, currentForecast.updatedAt);

    await locationForecast.create();

    return res.status(201).send(locationForecast)
  }
});

export default locationRouter;
