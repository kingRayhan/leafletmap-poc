# Leaflet Drawing Plugins Guide

## Overview
Drawing plugins allow users to interactively draw shapes on Leaflet maps. The most popular options are:

1. **Leaflet.draw** - Most popular, feature-rich drawing plugin
2. **Leaflet.Editable** - Lightweight, focused on editing
3. **Leaflet.PM** - Modern alternative with better UX
4. **Custom drawing** - Build your own drawing tools

## 1. Leaflet.draw Plugin

### Installation
```bash
npm install leaflet-draw
npm install @types/leaflet-draw  # TypeScript types
```

### Import
```javascript
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
```

### Basic Setup
```javascript
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

const map = L.map('map').setView([51.505, -0.09], 13)

// Create feature group to store drawn items
const drawnItems = new L.FeatureGroup()
map.addLayer(drawnItems)

// Initialize draw control
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
})
map.addControl(drawControl)
```

### Full Configuration
```javascript
const drawControl = new L.Control.Draw({
  position: 'topright',
  draw: {
    polygon: {
      allowIntersection: false,
      drawError: {
        color: '#e1e100',
        message: '<strong>Error:</strong> Shape edges cannot cross!'
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    polyline: {
      shapeOptions: {
        color: '#f357a1',
        weight: 10
      }
    },
    rectangle: {
      shapeOptions: {
        color: '#ff7800',
        weight: 4,
        opacity: 0.5
      }
    },
    circle: {
      shapeOptions: {
        color: '#662d91'
      }
    },
    marker: true,
    circlemarker: {
      color: '#ffff00',
      radius: 10
    }
  },
  edit: {
    featureGroup: drawnItems,
    remove: true,
    edit: true
  }
})
```

### Event Handling
```javascript
// When a shape is drawn
map.on('draw:created', function(e) {
  const type = e.layerType
  const layer = e.layer

  console.log('Shape drawn:', type, layer)
  
  // Add to the drawn items layer
  drawnItems.addLayer(layer)
  
  // Optional: Add popup
  if (type === 'marker') {
    layer.bindPopup('Marker').openPopup()
  } else {
    layer.bindPopup(`${type} shape`)
  }
})

// When a shape is edited
map.on('draw:edited', function(e) {
  const layers = e.layers
  layers.eachLayer(function(layer) {
    console.log('Shape edited:', layer)
  })
})

// When a shape is deleted
map.on('draw:deleted', function(e) {
  const layers = e.layers
  layers.eachLayer(function(layer) {
    console.log('Shape deleted:', layer)
  })
})

// Drawing started
map.on('draw:drawstart', function(e) {
  console.log('Drawing started:', e.layerType)
})

// Drawing stopped
map.on('draw:drawstop', function(e) {
  console.log('Drawing stopped')
})
```

### Complete React Implementation
```javascript
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

const DrawableMap = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const drawnItemsRef = useRef(null)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([51.505, -0.09], 13)
      
      // Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current)
      
      // Create feature group for drawn items
      drawnItemsRef.current = new L.FeatureGroup()
      mapInstanceRef.current.addLayer(drawnItemsRef.current)
      
      // Add draw control
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current
        },
        draw: {
          polygon: true,
          polyline: true,
          rectangle: true,
          circle: true,
          marker: true,
          circlemarker: true
        }
      })
      mapInstanceRef.current.addControl(drawControl)
      
      // Event handlers
      mapInstanceRef.current.on('draw:created', (e) => {
        drawnItemsRef.current.addLayer(e.layer)
        console.log('Shape created:', e.layerType)
      })
      
      mapInstanceRef.current.on('draw:edited', (e) => {
        console.log('Shapes edited:', e.layers)
      })
      
      mapInstanceRef.current.on('draw:deleted', (e) => {
        console.log('Shapes deleted:', e.layers)
      })
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [])

  return <div ref={mapRef} style={{ height: '500px' }} />
}
```

## 2. Leaflet.PM Plugin

### Installation
```bash
npm install @geoman-io/leaflet-geoman-free
```

### Basic Setup
```javascript
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

// Add PM controls to map
map.pm.addControls({
  position: 'topleft',
  drawMarker: true,
  drawCircleMarker: true,
  drawPolyline: true,
  drawRectangle: true,
  drawPolygon: true,
  drawCircle: true,
  editMode: true,
  dragMode: true,
  cutPolygon: true,
  removalMode: true
})
```

### Event Handling
```javascript
// Global drawing events
map.on('pm:create', (e) => {
  console.log('Shape created:', e.shape, e.layer)
})

map.on('pm:remove', (e) => {
  console.log('Shape removed:', e.layer)
})

map.on('pm:edit', (e) => {
  console.log('Shape edited:', e.layer)
})
```

## 3. Custom Drawing Implementation

### Simple Click-to-Draw Polygon
```javascript
const CustomDrawing = () => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPolygon, setCurrentPolygon] = useState([])
  
  useEffect(() => {
    if (!mapInstanceRef.current) return
    
    const handleMapClick = (e) => {
      if (isDrawing) {
        const newPoint = [e.latlng.lat, e.latlng.lng]
        setCurrentPolygon(prev => [...prev, newPoint])
        
        // Add temporary marker
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(mapInstanceRef.current)
      }
    }
    
    mapInstanceRef.current.on('click', handleMapClick)
    
    return () => {
      mapInstanceRef.current?.off('click', handleMapClick)
    }
  }, [isDrawing])
  
  const startDrawing = () => {
    setIsDrawing(true)
    setCurrentPolygon([])
  }
  
  const finishDrawing = () => {
    if (currentPolygon.length >= 3) {
      L.polygon(currentPolygon).addTo(mapInstanceRef.current)
    }
    setIsDrawing(false)
    setCurrentPolygon([])
  }
  
  return (
    <div>
      <button onClick={startDrawing}>Start Drawing</button>
      <button onClick={finishDrawing}>Finish Drawing</button>
    </div>
  )
}
```

## 4. Advanced Features

### Saving Drawn Shapes as GeoJSON
```javascript
const saveShapes = () => {
  const geojson = drawnItems.toGeoJSON()
  console.log('Saved shapes:', geojson)
  
  // Save to localStorage
  localStorage.setItem('drawnShapes', JSON.stringify(geojson))
  
  // Or send to server
  fetch('/api/shapes', {
    method: 'POST',
    body: JSON.stringify(geojson),
    headers: {'Content-Type': 'application/json'}
  })
}

const loadShapes = () => {
  const saved = localStorage.getItem('drawnShapes')
  if (saved) {
    const geojson = JSON.parse(saved)
    L.geoJSON(geojson).addTo(drawnItems)
  }
}
```

### Custom Shape Validation
```javascript
map.on('draw:created', (e) => {
  const layer = e.layer
  
  // Validate polygon area
  if (e.layerType === 'polygon') {
    const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
    if (area > 1000000) { // 1 sq km limit
      alert('Polygon too large!')
      return
    }
  }
  
  // Validate line length
  if (e.layerType === 'polyline') {
    const length = 0 // Calculate total length
    if (length > 10000) { // 10km limit
      alert('Line too long!')
      return
    }
  }
  
  drawnItems.addLayer(layer)
})
```

### Styling During Drawing
```javascript
const drawControl = new L.Control.Draw({
  draw: {
    polygon: {
      shapeOptions: {
        color: '#ff7800',
        weight: 4,
        opacity: 0.8,
        fillOpacity: 0.4
      },
      allowIntersection: false,
      showArea: true
    },
    polyline: {
      shapeOptions: {
        color: '#ff0000',
        weight: 5,
        opacity: 0.8
      },
      showLength: true
    }
  }
})
```

## Plugin Comparison

| Feature | Leaflet.draw | Leaflet.PM | Custom |
|---------|-------------|------------|---------|
| **Ease of use** | Medium | Easy | Hard |
| **Customization** | Medium | High | Complete |
| **File size** | Large | Medium | Minimal |
| **TypeScript** | Good | Good | Perfect |
| **Maintenance** | Stable | Active | Self |
| **Features** | Complete | Modern | Custom |

## Best Practices

1. **Always use FeatureGroup** for managing drawn shapes
2. **Validate shapes** before adding to map
3. **Save state** to localStorage or server
4. **Handle edge cases** like invalid polygons
5. **Provide visual feedback** during drawing
6. **Clean up event listeners** on component unmount
7. **Test on mobile devices** for touch interactions

This comprehensive guide covers everything you need to implement interactive drawing in Leaflet!