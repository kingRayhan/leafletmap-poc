# Leaflet.js Concepts and Terminology

## Layers
**Layer** - Any visual element that can be displayed on a map. Think of layers as transparent sheets stacked on top of each other.

### Types of Layers
- **Tile layers** - Background map tiles (like OpenStreetMap, Google Maps)
- **Marker layers** - Point locations with icons
- **Vector layers** - Shapes like polygons, polylines, circles
- **Overlay layers** - Additional data displayed over base maps

## Layer Management

### Key Methods
- **`addTo(map)`** - Adds a layer to the map, making it visible
- **`removeLayer(layer)`** - Removes a specific layer from the map
- **`hasLayer(layer)`** - Checks if a layer exists on the map

### Usage Example
```javascript
// Create and add a marker
const marker = L.marker([51.5, -0.09]).addTo(map);

// Remove the marker later
map.removeLayer(marker);

// Check if marker exists
if (map.hasLayer(marker)) {
  console.log('Marker is on the map');
}
```

## Core Map Concepts

### Map Instance
- **Map instance** - The main map object created with `L.map()`
- **View** - Current map center and zoom level
- **Bounds** - Geographic rectangle defining map area

### Interactive Elements
- **Popup** - Info window that appears when clicking markers
- **Event handlers** - Functions triggered by map interactions (click, zoom, etc.)

## Common Methods

### View Control
- **`setView([lat, lng], zoom)`** - Centers map at coordinates with zoom level
- **`fitBounds(bounds)`** - Adjusts view to show specific area
- **`getCenter()`** - Returns current map center
- **`getZoom()`** - Returns current zoom level

### Popup and Event Handling
- **`bindPopup(content)`** - Attaches popup to markers/layers
- **`openPopup()`** - Opens the bound popup
- **`on('event', handler)`** - Adds event listeners
- **`off('event', handler)`** - Removes event listeners

### Examples
```javascript
// Set map view
map.setView([51.505, -0.09], 13);

// Add popup to marker
marker.bindPopup("Hello World!").openPopup();

// Handle map clicks
map.on('click', function(e) {
  console.log('Map clicked at:', e.latlng);
});
```

## Layer Groups

### Types
- **LayerGroup** - Container for multiple layers managed as one unit
- **FeatureGroup** - LayerGroup with additional event handling capabilities
- **Control.Layers** - UI widget for toggling layer visibility

### Usage
```javascript
// Create layer group
const markerGroup = L.layerGroup([marker1, marker2, marker3]);

// Add entire group to map
markerGroup.addTo(map);

// Remove entire group
map.removeLayer(markerGroup);
```

## Coordinate System

### LatLng
- **Latitude** - North-South position (-90 to 90)
- **Longitude** - East-West position (-180 to 180)
- **Format** - `[lat, lng]` array or `L.latLng(lat, lng)` object

### Zoom Levels
- **0** - World view
- **1-5** - Country/continent level
- **6-10** - City/region level
- **11-15** - Neighborhood/street level
- **16-20** - Building/detailed level

## Event System

### Common Events
- **`click`** - User clicks on map/marker
- **`dblclick`** - Double click
- **`mouseover/mouseout`** - Mouse hover
- **`zoomend`** - Zoom level changes
- **`moveend`** - Map center changes

### Event Object Properties
- **`latlng`** - Geographic coordinates where event occurred
- **`layerPoint`** - Pixel coordinates relative to map
- **`containerPoint`** - Pixel coordinates relative to container

## Performance Tips

### Layer Management
- Use `removeLayer()` to clean up unused markers/layers
- Group related layers using LayerGroup
- Only add layers that are currently needed

### Memory Management
- Remove event listeners when components unmount
- Clear layer references to prevent memory leaks
- Use layer groups for bulk operations

These concepts form the foundation for building complex interactive maps with Leaflet.js. Understanding layers and their management is crucial for creating efficient, responsive mapping applications.