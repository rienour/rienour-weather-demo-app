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
  if (locationForecast.exists) {
    return res.status(200).send({ response: locationForecast.data() });
  } else {
    const weatherAPI = new WeatherAPIConnector();
    const now = Date.now();
    const [historic, currentForecast] = await Promise.all([
      weatherAPI.getLocationHistoricForecast(id, new Date(now - (4 * 24 * 60 * 60 * 1000)), new Date(now - 1 * 24 * 60 * 60 * 1000)),
      weatherAPI.getLocationForecast(id, 6),
    ]);

    const forecastData = [...currentForecast.forecastData, ...historic];
    const locationForecast = new LocationForecast(currentForecast.location, forecastData, currentForecast.lastUpdatedAt);

    await locationForecast.create();

    return res.status(201).send(locationForecast)
  }
});

export default locationRouter;
