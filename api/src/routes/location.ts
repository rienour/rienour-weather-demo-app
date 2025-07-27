import { Router } from "express";
import WeatherAPIConnector from "../sources/weatherAPI";

const locationRouter = Router();

locationRouter.post('/getLocations', async (req, res) => {
  const { searchLocation } = req.body ?? {};
  if (!searchLocation) {
    return res.status(400).send('Invalid Search location.');
  }

  const weatherAPI = new WeatherAPIConnector();
  const locations = await weatherAPI.findLocation(searchLocation);

  return res.status(200).send({ results: locations.map(({ lat, lon, ...rest }) => ({ id: `${lat},${lon}`, ...rest })) });
});

export default locationRouter;
