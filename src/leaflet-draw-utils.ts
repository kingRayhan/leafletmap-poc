import * as L from "leaflet";

// Type-safe GeoJSON conversion
export const layerToGeoJSON = (
  featureGroup: L.FeatureGroup
): GeoJSON.FeatureCollection => {
  return featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
};

// Error handling utilities
export class MapError extends Error {
  public readonly operation: string;

  constructor(message: string, operation: string) {
    super(message);
    this.name = "MapError";
    this.operation = operation;
  }
}

export const handleError = (error: unknown, operation: string): void => {
  if (error instanceof Error) {
    console.error(`Error during ${operation}:`, error.message);
  } else {
    console.error(`Unknown error during ${operation}:`, error);
  }
};
