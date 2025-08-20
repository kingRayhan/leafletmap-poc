# Leaflet Geolocation (locate) - How It Works

## Overview
The `map.locate()` method uses the browser's **Geolocation API** to find the user's current position using:
- **GPS** (most accurate)
- **WiFi networks** (medium accuracy)
- **Cell towers** (least accurate)
- **IP address** (fallback, very rough)

## Basic Usage

### Simple Locate
```javascript
map.locate()
```

### With Options
```javascript
map.locate({
  setView: true,        // Automatically center map on user location
  maxZoom: 16,          // Max zoom level when centering
  timeout: 10000,       // Timeout in milliseconds (10 seconds)
  maximumAge: 60000,    // Cache location for 60 seconds
  enableHighAccuracy: true  // Use GPS for higher accuracy
})
```

## Event Handling

Leaflet fires events when location is found or fails:

### Success Event: `locationfound`
```javascript
map.on('locationfound', function(e) {
  console.log('Location found:', e.latlng)
  console.log('Accuracy:', e.accuracy + ' meters')
  
  // Add marker at user location
  L.marker(e.latlng)
    .addTo(map)
    .bindPopup(`You are here! (±${e.accuracy}m accuracy)`)
    .openPopup()
    
  // Add accuracy circle
  L.circle(e.latlng, e.accuracy)
    .addTo(map)
})
```

### Error Event: `locationerror`
```javascript
map.on('locationerror', function(e) {
  console.error('Location error:', e.message)
  alert('Could not find your location: ' + e.message)
})
```

## Complete Implementation

```javascript
const handleLocateMe = () => {
  if (!mapRef.current) return
  
  // Add event listeners before calling locate
  mapRef.current.on('locationfound', (e) => {
    const { latlng, accuracy } = e
    
    // Center map on user location
    mapRef.current.setView(latlng, 16)
    
    // Remove previous user marker if exists
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current)
    }
    
    // Add user location marker
    userMarkerRef.current = L.marker(latlng)
      .addTo(mapRef.current)
      .bindPopup(`You are here!<br>Accuracy: ±${Math.round(accuracy)}m`)
      .openPopup()
    
    // Add accuracy circle
    L.circle(latlng, accuracy, {
      color: 'blue',
      fillColor: 'lightblue',
      fillOpacity: 0.2
    }).addTo(mapRef.current)
  })
  
  mapRef.current.on('locationerror', (e) => {
    alert('Could not find your location: ' + e.message)
  })
  
  // Start locating
  mapRef.current.locate({
    setView: true,
    maxZoom: 16,
    enableHighAccuracy: true,
    timeout: 10000
  })
}
```

## Location Options Explained

### `setView: boolean`
- `true`: Automatically centers map on found location
- `false`: Just triggers events, doesn't move map

### `maxZoom: number`
- Maximum zoom level when auto-centering
- Only works when `setView: true`

### `enableHighAccuracy: boolean`
- `true`: Uses GPS for higher accuracy (slower, more battery)
- `false`: Uses network-based location (faster, less accurate)

### `timeout: number`
- Milliseconds to wait before giving up
- Default: `Infinity` (waits forever)

### `maximumAge: number`
- Accept cached location if younger than this (milliseconds)
- `0`: Always get fresh location
- `Infinity`: Use cached location if available

## Event Object Properties

### `locationfound` event (`e`)
```javascript
{
  latlng: L.LatLng,     // User's coordinates
  bounds: L.LatLngBounds, // Bounds of accuracy area
  accuracy: number,      // Accuracy in meters
  altitude: number,      // Altitude in meters (if available)
  altitudeAccuracy: number, // Altitude accuracy (if available)
  heading: number,       // Direction of movement (if available)
  speed: number,         // Speed in meters/second (if available)
  timestamp: number      // Timestamp of location
}
```

### `locationerror` event (`e`)
```javascript
{
  code: number,    // Error code (1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT)
  message: string  // Human-readable error message
}
```

## Common Error Codes

1. **PERMISSION_DENIED (1)**: User denied location access
2. **POSITION_UNAVAILABLE (2)**: Location cannot be determined
3. **TIMEOUT (3)**: Location request timed out

## Security Requirements

- **HTTPS required**: Geolocation only works on secure origins
- **User permission**: Browser asks user to allow location access
- **User gesture**: Some browsers require user interaction to trigger

## Best Practices

### 1. Handle Both Success and Error
```javascript
map.on('locationfound', handleLocationFound)
map.on('locationerror', handleLocationError)
```

### 2. Show Loading State
```javascript
const handleLocateMe = () => {
  setIsLocating(true) // Show loading spinner
  
  map.locate({
    enableHighAccuracy: true,
    timeout: 10000
  })
}

map.on('locationfound locationerror', () => {
  setIsLocating(false) // Hide loading spinner
})
```

### 3. Clean Up Event Listeners
```javascript
useEffect(() => {
  return () => {
    if (mapRef.current) {
      mapRef.current.off('locationfound')
      mapRef.current.off('locationerror')
    }
  }
}, [])
```

### 4. Provide Fallback
```javascript
map.on('locationerror', () => {
  // Fallback to IP-based location or default location
  map.setView([defaultLat, defaultLng], 10)
})
```

## Watching Location (Continuous Tracking)

```javascript
// Start watching user location
map.locate({
  watch: true,           // Keep watching for location changes
  enableHighAccuracy: true,
  maximumAge: 30000     // Update every 30 seconds max
})

// Stop watching
map.stopLocate()
```

The key point: `locate()` is **asynchronous** and uses **events** to communicate results back to your application!