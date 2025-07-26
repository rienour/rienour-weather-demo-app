import dotenv from 'dotenv';

dotenv.config();

/**
 * This interface provides type safety for mapping the .env values loaded by
 * dotenv into a config option
 */
interface ApplicationConfig {
  /**
   * Port number the application will listen on.
   */
  port: number;
}

/**
 * This object provides the mapping from the process.env object to the expected
 * configuration object shape
 */
const config: ApplicationConfig = {
  port: Number(process.env.PORT),
};

export default config;
