import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import * as serviceSecret from "../config/secret_serviceAccountKey.json";
import { getFirestore } from 'firebase-admin/firestore';

/**
 * This object provides the names of the collections available to Firestore to
 * provide type safety when working with firestore.
 */
export const Collections = {
  LocationWeathers: 'locationWeathers'
} as const;
export type CollectionName = typeof Collections[keyof typeof Collections];

// FIXME: Remove casting
const firebaseApp = initializeApp({ credential: cert(serviceSecret as ServiceAccount) });

export const db = getFirestore();

export default firebaseApp;
