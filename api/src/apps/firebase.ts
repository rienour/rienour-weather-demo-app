import { initializeApp } from "firebase/app";
import config from '../config';

const firebaseApp = initializeApp(config.firebase)

export default firebaseApp;
