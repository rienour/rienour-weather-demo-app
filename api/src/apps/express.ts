import express from 'express';
import locationRouter from '../routes/location';

const expressApp = express();

expressApp.use(express.json());

expressApp.use('/location', locationRouter);

export default expressApp;
