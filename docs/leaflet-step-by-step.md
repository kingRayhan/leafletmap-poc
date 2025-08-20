# Leaflet.js Step-by-Step Tutorial

## Step 1: Install Dependencies

```bash
npm install leaflet @types/leaflet
```

## Step 2: Import Required Modules

```javascript
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'  // Important: Include CSS
```

## Step 3: Fix Default Marker Icons

Leaflet's default markers don't work with bundlers like Webpack/Vite. Fix this:

```javascript
// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})
```

## Step 4: Create Map Container Element

```javascript
const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  
  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px' }}
    />
  )
}
```

## Step 5: Initialize Map Instance

```javascript
const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current)
        .setView([51.505, -0.09], 13) // [lat, lng], zoom
    }
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}
```

**Explanation:**
- `L.map(element)` - Creates map instance attached to DOM element
- `.setView([lat, lng], zoom)` - Sets initial center and zoom level
- `useRef` prevents recreation on re-renders

## Step 6: Add Tile Layer (Background Map)

```javascript
useEffect(() => {
  if (mapRef.current && !mapInstanceRef.current) {
    mapInstanceRef.current = L.map(mapRef.current)
      .setView([51.505, -0.09], 13)

    // Add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current)
  }
}, [])
```

**Explanation:**
- `L.tileLayer(url, options)` - Creates tile layer from URL template
- `{z}/{x}/{y}` - Placeholders for zoom/x-coordinate/y-coordinate
- `.addTo(map)` - Adds layer to map instance
- `attribution` - Required credit text

## Step 7: Add Cleanup

```javascript
useEffect(() => {
  if (mapRef.current && !mapInstanceRef.current) {
    mapInstanceRef.current = L.map(mapRef.current)
      .setView([51.505, -0.09], 13)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)
  }

  // Cleanup function
  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove() // Removes map and cleans up
      mapInstanceRef.current = null
    }
  }
}, [])
```

## Complete Basic Map Component

```javascript
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Step 1: Create map instance
      mapInstanceRef.current = L.map(mapRef.current)
        .setView([51.505, -0.09], 13)

      // Step 2: Add tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    // Step 3: Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px' }} 
    />
  )
}

export default Map
```

## Step 8: Adding a Marker

```javascript
useEffect(() => {
  if (mapRef.current && !mapInstanceRef.current) {
    mapInstanceRef.current = L.map(mapRef.current)
      .setView([51.505, -0.09], 13)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    // Add marker
    L.marker([51.505, -0.09])
      .addTo(mapInstanceRef.current)
      .bindPopup('Hello World!')
      .openPopup()
  }
}, [])
```

## Step 9: Handling Map Events

```javascript
useEffect(() => {
  if (mapRef.current && !mapInstanceRef.current) {
    mapInstanceRef.current = L.map(mapRef.current)
      .setView([51.505, -0.09], 13)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    // Handle click events
    mapInstanceRef.current.on('click', (e) => {
      console.log('Clicked at:', e.latlng)
      
      // Add marker at clicked location
      L.marker([e.latlng.lat, e.latlng.lng])
        .addTo(mapInstanceRef.current!)
        .bindPopup(`Clicked at ${e.latlng.lat}, ${e.latlng.lng}`)
        .openPopup()
    })
  }
}, [])
```

## Common Tile Layer Providers

```javascript
// OpenStreetMap (Free)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png')

// CartoDB Positron (Free)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png')

// Stamen Terrain (Free)
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png')

// Google Maps (Requires API key)
L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}')
```

## Key Points to Remember

1. **Always include CSS**: `import 'leaflet/dist/leaflet.css'`
2. **Fix marker icons**: Use the icon fix for bundlers
3. **Use refs**: Prevent recreation on re-renders
4. **Clean up**: Always call `map.remove()` in cleanup
5. **Check existence**: Verify refs exist before using
6. **Attribution**: Always include proper attribution for tile providers

This step-by-step approach ensures you understand each part of the map initialization process!