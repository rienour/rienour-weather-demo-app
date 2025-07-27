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
