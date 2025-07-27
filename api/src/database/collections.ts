/**
 * This object provides the names of the collections available to Firestore to
 * provide type safety when working with firestore.
 */
const Collections = {
  LocationWeathers: 'locationWeathers'
} as const;
type CollectionName = typeof Collections[keyof typeof Collections];

export { Collections, CollectionName };
