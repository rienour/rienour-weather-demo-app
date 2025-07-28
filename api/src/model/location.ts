/**
 * This class provides an in-memory mapping for the location information for
 * the application.
 */
export class Location {
  id: string;
  name: string;
  country: string;

  constructor(id: string, name: string, country: string) {
    this.id = id;
    this.name = name;
    this.country = country;
  }

}
