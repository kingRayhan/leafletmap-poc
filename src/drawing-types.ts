import * as L from 'leaflet';

// Leaflet.draw event interfaces
export interface DrawCreatedEvent {
  layer: L.Layer;
  layerType: string;
}

export interface DrawEditedEvent {
  layers: L.LayerGroup;
}

export interface DrawDeletedEvent {
  layers: L.LayerGroup;
}

export interface DrawStartEvent {
  layerType: string;
}

export interface DrawStopEvent {
  layerType?: string;
}

// Extended layer types with drawing-specific methods
export interface DrawableMarker extends L.Marker {
  bindPopup(content: string): this;
}

export interface DrawableCircle extends L.Circle {
  getRadius(): number;
  bindPopup(content: string): this;
}

export interface DrawablePolygon extends L.Polygon {
  bindPopup(content: string): this;
}

export interface DrawablePolyline extends L.Polyline {
  bindPopup(content: string): this;
}

export interface DrawableRectangle extends L.Rectangle {
  getBounds(): L.LatLngBounds;
  bindPopup(content: string): this;
}

export interface DrawableCircleMarker extends L.CircleMarker {
  bindPopup(content: string): this;
}

// Union type for all drawable layers
export type DrawableLayer = 
  | DrawableMarker 
  | DrawableCircle 
  | DrawablePolygon 
  | DrawablePolyline 
  | DrawableRectangle 
  | DrawableCircleMarker;

// Layer type mapping
export type LayerTypeMap = {
  'marker': DrawableMarker;
  'circle': DrawableCircle;
  'polygon': DrawablePolygon;
  'polyline': DrawablePolyline;
  'rectangle': DrawableRectangle;
  'circlemarker': DrawableCircleMarker;
}

// Draw control configuration types
export interface DrawControlOptions {
  position?: L.ControlPosition;
  draw?: {
    polygon?: L.DrawOptions.PolygonOptions | false;
    polyline?: L.DrawOptions.PolylineOptions | false;
    rectangle?: L.DrawOptions.RectangleOptions | false;
    circle?: L.DrawOptions.CircleOptions | false;
    marker?: L.DrawOptions.MarkerOptions | false;
    circlemarker?: L.DrawOptions.CircleMarkerOptions | false;
  };
  edit?: {
    featureGroup: L.FeatureGroup;
    remove?: boolean;
    edit?: boolean;
  };
}

// GeoJSON types for persistence
export interface SavedShape {
  id: number;
  type: string;
  geometry: GeoJSON.Geometry;
  properties: Record<string, unknown>;
}

export interface SavedShapesCollection extends GeoJSON.FeatureCollection {
  features: GeoJSON.Feature[];
}

// Error types
export class DrawingError extends Error {
  public readonly operation: string;
  
  constructor(message: string, operation: string) {
    super(message);
    this.name = 'DrawingError';
    this.operation = operation;
  }
}

// Utility type guards
export const isMarker = (layer: L.Layer): layer is DrawableMarker => {
  return layer instanceof L.Marker;
};

export const isCircle = (layer: L.Layer): layer is DrawableCircle => {
  return layer instanceof L.Circle && !(layer instanceof L.CircleMarker);
};

export const isPolygon = (layer: L.Layer): layer is DrawablePolygon => {
  return layer instanceof L.Polygon && !(layer instanceof L.Rectangle);
};

export const isPolyline = (layer: L.Layer): layer is DrawablePolyline => {
  return layer instanceof L.Polyline && !(layer instanceof L.Polygon);
};

export const isRectangle = (layer: L.Layer): layer is DrawableRectangle => {
  return layer instanceof L.Rectangle;
};

export const isCircleMarker = (layer: L.Layer): layer is DrawableCircleMarker => {
  return layer instanceof L.CircleMarker;
};