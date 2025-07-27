import { initializeApp } from "firebase-admin";
import config from '../config';

const firebaseApp = initializeApp(config.firebase)

export default firebaseApp;
