import { Router } from "express";
import WeatherAPIConnector from "../sources/weatherAPI";

const locationRouter = Router();

locationRouter.post('/getLocations', (req, res) => {
  const { searchLocation } = req.body ?? {};
  if (!searchLocation) {
    return res.status(400).send('Invalid Search location.');
  }

  const weatherAPI = new WeatherAPIConnector();
  console.log(searchLocation);
  const locations = weatherAPI.findLocation(searchLocation);

  return res.status(200).send({ results: locations.map(({ lat, long, ...rest }) => ({ id: `${lat},${long}`, ...rest })) });
});

export default locationRouter;
