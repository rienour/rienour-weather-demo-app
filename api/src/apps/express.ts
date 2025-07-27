import express from 'express';

const expressApp = express();

expressApp.get('/', (_, res) => {
  res.send('Hello World!')
});

export default expressApp;
