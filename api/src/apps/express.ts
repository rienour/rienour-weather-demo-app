import express from 'express';
import cors from 'cors';
import locationRouter from '../routes/location';

const expressApp = express();

expressApp.use(express.json());

expressApp.use(cors());
expressApp.use('/location', locationRouter);

export default expressApp;
