export interface GeoSearchResultIten {
  address: string;
  place_id: string;
  types: string[];
}

export interface GeoCodeResult {
  address: string;
  coordinates: Coordinates;
  types: string[];
  country: string;
  city: string;
  division: string;
  district: string;
  postalCode: string;
  localArea: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
