/**
 * This class provides an in-memory mapping for the location information for
 * the application.
 */
export class Location {
  id: string;
  name: string;
  country: string;

  constructor(lat: number, long: number, name: string, country: string) {
    this.id = `${lat},${long}`;
    this.name = name;
    this.country = country;
  }

}
