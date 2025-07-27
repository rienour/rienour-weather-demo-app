import expressApp from './apps/express';
import config from './config';

expressApp.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
