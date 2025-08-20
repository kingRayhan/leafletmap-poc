# Leaflet Custom Shapes and Vector Layers

## Overview
Leaflet supports various vector shapes that can be drawn on maps:
- **Circles** - Round shapes with radius
- **Polygons** - Multi-sided shapes
- **Polylines** - Connected line segments
- **Rectangles** - 4-sided rectangles
- **CircleMarkers** - Small circles that don't scale with zoom

## Basic Shapes

### 1. Circle
```javascript
// Basic circle
const circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500  // radius in meters
}).addTo(map)

// With popup
circle.bindPopup("I am a circle")
```

### 2. Polygon
```javascript
// Triangle polygon
const polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06], 
  [51.51, -0.047]
], {
  color: 'blue',
  fillColor: 'lightblue',
  fillOpacity: 0.7
}).addTo(map)

// Complex polygon (with hole)
const polygonWithHole = L.polygon([
  // Outer ring
  [[51.515, -0.09], [51.52, -0.1], [51.52, -0.12], [51.515, -0.11]],
  // Inner ring (hole)
  [[51.517, -0.1], [51.518, -0.102], [51.518, -0.108], [51.517, -0.106]]
]).addTo(map)
```

### 3. Rectangle
```javascript
// Rectangle using bounds
const rectangle = L.rectangle([
  [51.49, -0.08],  // southwest corner
  [51.5, -0.06]    // northeast corner  
], {
  color: 'green',
  weight: 2,
  fillOpacity: 0.3
}).addTo(map)
```

### 4. Polyline
```javascript
// Simple line
const polyline = L.polyline([
  [51.5, -0.09],
  [51.505, -0.08],
  [51.51, -0.085]
], {
  color: 'purple',
  weight: 5,
  opacity: 0.8
}).addTo(map)

// Multi-segment line
const multiPolyline = L.polyline([
  [[51.5, -0.09], [51.505, -0.08]],
  [[51.51, -0.085], [51.515, -0.075]]
], {
  color: 'orange',
  weight: 3
}).addTo(map)
```

### 5. Circle Marker
```javascript
// Small circle that doesn't scale with zoom
const circleMarker = L.circleMarker([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.8,
  radius: 10  // radius in pixels
}).addTo(map)
```

## Styling Options

### Common Style Properties
```javascript
const styleOptions = {
  // Stroke (outline)
  color: '#3388ff',      // stroke color
  weight: 3,             // stroke width in pixels
  opacity: 1,            // stroke opacity (0-1)
  
  // Fill
  fillColor: '#3388ff',  // fill color
  fillOpacity: 0.2,      // fill opacity (0-1)
  
  // Interaction
  interactive: true,     // can receive mouse/touch events
  
  // Line styling
  lineCap: 'round',      // 'butt' | 'round' | 'square'
  lineJoin: 'round',     // 'miter' | 'round' | 'bevel'
  dashArray: '5, 5',     // dashed line pattern
  dashOffset: '0',       // dash offset
  
  // CSS class
  className: 'my-shape'
}
```

### Dynamic Styling
```javascript
// Create shape
const polygon = L.polygon(coordinates).addTo(map)

// Change style after creation
polygon.setStyle({
  color: 'red',
  fillColor: 'pink'
})

// Get current style
const currentStyle = polygon.options
```

## Advanced Shapes

### Custom SVG Markers
```javascript
// Create custom SVG icon
const customIcon = L.divIcon({
  html: `
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="red" stroke="black" stroke-width="2"/>
      <text x="10" y="15" text-anchor="middle" fill="white" font-size="12">!</text>
    </svg>
  `,
  className: 'custom-svg-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

L.marker([51.5, -0.09], { icon: customIcon }).addTo(map)
```

### GeoJSON Shapes
```javascript
// GeoJSON polygon
const geojsonFeature = {
  "type": "Feature",
  "properties": {
    "name": "Custom Area",
    "popupContent": "This is a GeoJSON polygon"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-0.08, 51.509],
      [-0.06, 51.503], 
      [-0.047, 51.51],
      [-0.08, 51.509]
    ]]
  }
}

L.geoJSON(geojsonFeature, {
  style: {
    color: 'purple',
    fillColor: 'lavender',
    fillOpacity: 0.5
  },
  onEachFeature: function(feature, layer) {
    if (feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent)
    }
  }
}).addTo(map)
```

## Interactive Shapes

### Click Events
```javascript
const polygon = L.polygon(coordinates).addTo(map)

polygon.on('click', function(e) {
  console.log('Polygon clicked!', e.latlng)
  this.setStyle({color: 'red'})  // Change color on click
})
```

### Hover Effects
```javascript
const polygon = L.polygon(coordinates).addTo(map)

polygon.on('mouseover', function(e) {
  this.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  })
})

polygon.on('mouseout', function(e) {
  this.setStyle({
    weight: 2,
    color: '#3388ff',
    fillOpacity: 0.2
  })
})
```

### Draggable Shapes
```javascript
// Note: Basic Leaflet shapes aren't draggable by default
// You need plugins like Leaflet.Editable or Leaflet.draw for this

// But you can make markers draggable
const draggableMarker = L.marker([51.5, -0.09], {
  draggable: true
}).addTo(map)

draggableMarker.on('dragend', function(e) {
  console.log('New position:', e.target.getLatLng())
})
```

## Shape Management

### Layer Groups
```javascript
// Create layer group
const shapeGroup = L.layerGroup()

// Add shapes to group
const circle = L.circle([51.508, -0.11], 500).addTo(shapeGroup)
const polygon = L.polygon(coordinates).addTo(shapeGroup)
const polyline = L.polyline(lineCoords).addTo(shapeGroup)

// Add entire group to map
shapeGroup.addTo(map)

// Remove entire group
map.removeLayer(shapeGroup)

// Toggle visibility
if (map.hasLayer(shapeGroup)) {
  map.removeLayer(shapeGroup)
} else {
  shapeGroup.addTo(map)
}
```

### Feature Groups (with popups)
```javascript
const featureGroup = L.featureGroup([
  L.circle([51.508, -0.11], 500),
  L.polygon(coordinates),
  L.marker([51.5, -0.09])
])

featureGroup.addTo(map)

// Bind popup to entire group
featureGroup.bindPopup('Group of shapes')

// Fit map to show all shapes in group
map.fitBounds(featureGroup.getBounds())
```

## Practical Examples

### Drawing Zone/Area
```javascript
const drawZone = (center, radiusKm, sides = 6) => {
  const points = []
  const radiusMeters = radiusKm * 1000
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 360 / sides) * Math.PI / 180
    const lat = center[0] + (radiusMeters / 111320) * Math.cos(angle)
    const lng = center[1] + (radiusMeters / (111320 * Math.cos(center[0] * Math.PI / 180))) * Math.sin(angle)
    points.push([lat, lng])
  }
  
  return L.polygon(points, {
    color: 'blue',
    fillColor: 'lightblue',
    fillOpacity: 0.3
  }).addTo(map)
}

// Create hexagonal zone
const zone = drawZone([51.505, -0.09], 2) // 2km radius
```

### Heat Map Circles
```javascript
const heatData = [
  {lat: 51.505, lng: -0.09, intensity: 0.8},
  {lat: 51.51, lng: -0.1, intensity: 0.6},
  {lat: 51.49, lng: -0.08, intensity: 0.9}
]

heatData.forEach(point => {
  const opacity = point.intensity
  L.circle([point.lat, point.lng], {
    radius: 200,
    fillColor: 'red',
    fillOpacity: opacity,
    color: 'darkred',
    weight: 1
  }).addTo(map)
})
```

## Animation

### Animating Shapes
```javascript
const animatedCircle = L.circle([51.5, -0.09], 100).addTo(map)

let radius = 100
const animate = () => {
  radius = radius > 1000 ? 100 : radius + 50
  animatedCircle.setRadius(radius)
  setTimeout(animate, 200)
}
animate()
```

This gives you a comprehensive overview of creating and managing custom shapes in Leaflet!