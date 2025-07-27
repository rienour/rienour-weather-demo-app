import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import * as serviceSecret from "../config/secret_serviceAccountKey.json";

// FIXME: Remove casting
const firebaseApp = initializeApp({ credential: cert(serviceSecret as ServiceAccount) });

export default firebaseApp;
