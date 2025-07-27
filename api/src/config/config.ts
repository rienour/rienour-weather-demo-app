import dotenv from 'dotenv';

dotenv.config();

/**
 * This interface provides type safety for mapping the .env values loaded by
 * dotenv related to the Firebase configuration.
 *
 * See {@link https://firebase.google.com/docs/web/learn-more?authuser=0#config-object}
 * for more informaiton.
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface WeatherAPIConfiguration {
  /**
   * Key for accessing information via the Weather API
   *
   * See {@link https://www.weatherapi.com/docs} for more information
   */
  apiKey: string;
  /**
   * Base URL for making requqests against the Weather API
   *
   * See {@link } for more information
   */
  baseUrl: string;
}
/**
 * This interface provides type safety for mapping the .env values loaded by
 * dotenv into a config option
 */
interface ApplicationConfig {
  /**
   * Port number the application will listen on.
   */
  port: number;
  /**
   * Configuraton for Weather API connector
   */
  weatherAPI: WeatherAPIConfiguration;
  /**
   * Configuraton for Firebase connector
   */
  firebase: FirebaseConfig;
}

/**
 * This object provides the mapping from the process.env object to the expected
 * configuration object shape
 */
const config: ApplicationConfig = {
  port: Number(process.env.PORT),
  weatherAPI: {
    apiKey: String(process.env.WEATHER_API_KEY),
    baseUrl: String(process.env.WEATHER_API_BASE_URL)
  },
  firebase: {
    apiKey: "AIzaSyCKCS38Rdba4_5_9jywtEZ52hJJoBef9b4",
    authDomain: "rienour-weather-api-demo.firebaseapp.com",
    projectId: "rienour-weather-api-demo",
    storageBucket: "rienour-weather-api-demo.firebasestorage.app",
    messagingSenderId: "352611853214",
    appId: "1:352611853214:web:e1d2c09b550bafec1e6c8f"
  }
};

export default config;
