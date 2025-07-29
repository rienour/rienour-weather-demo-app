import express from 'express';
import cors from 'cors';
import locationRouter from '../routes/location';
import bodyParser from 'body-parser';

const expressApp = express();

expressApp.use(express.json());
expressApp.use(bodyParser.json());
expressApp.use(cors());
expressApp.use('/location', locationRouter);

export default expressApp;
