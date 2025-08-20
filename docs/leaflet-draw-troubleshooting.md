# Leaflet.draw Troubleshooting Guide

## Common Errors and Solutions

### Error: Cannot create property 'selectedPathOptions' on boolean 'true'

**Problem:** This error occurs when you set `marker: true` in the draw control options.

**Cause:** Leaflet.draw expects marker options to be an object, not a boolean.

**❌ Wrong:**
```javascript
draw: {
  marker: true  // This causes the error
}
```

**✅ Correct:**
```javascript
draw: {
  marker: {
    icon: new L.Icon.Default()
  }
}
```

### Error: Marker icons not showing

**Problem:** Default Leaflet markers don't work with bundlers like Webpack/Vite.

**Solution:** Fix the icon paths before initializing the map:

```javascript
import L from 'leaflet'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})
```

### Error: Cannot read property 'addLayer' of undefined

**Problem:** Trying to use FeatureGroup before it's initialized.

**Solution:** Always check if refs exist:

```javascript
// ❌ Wrong
drawnItemsRef.current.addLayer(layer)

// ✅ Correct
drawnItemsRef.current?.addLayer(layer)
```

### Error: Draw control not showing

**Problem:** CSS not imported or conflicting styles.

**Solutions:**
1. Import CSS: `import 'leaflet-draw/dist/leaflet.draw.css'`
2. Check z-index conflicts
3. Ensure control position is valid: `'topleft'`, `'topright'`, `'bottomleft'`, `'bottomright'`

### TypeScript Errors

**Problem:** TypeScript complains about Leaflet.draw types.

**Solutions:**

1. **Install types:**
```bash
npm install @types/leaflet-draw
```

2. **Cast Control.Draw:**
```javascript
const drawControl = new (L.Control as any).Draw({
  // options
})
```

3. **Type event handlers:**
```javascript
map.on('draw:created', (e: L.DrawEvents.Created) => {
  const layer = e.layer
  const type = e.layerType
})
```

### Performance Issues

**Problem:** Map becomes slow with many drawn shapes.

**Solutions:**

1. **Use FeatureGroup for bulk operations:**
```javascript
const featureGroup = new L.FeatureGroup()
shapes.forEach(shape => featureGroup.addLayer(shape))
map.addLayer(featureGroup)
```

2. **Limit number of shapes:**
```javascript
const MAX_SHAPES = 100

map.on('draw:created', (e) => {
  if (drawnItems.getLayers().length >= MAX_SHAPES) {
    alert('Maximum shapes reached!')
    return
  }
  drawnItems.addLayer(e.layer)
})
```

3. **Use clustering for markers:**
```javascript
import 'leaflet.markercluster'

const markers = L.markerClusterGroup()
map.addLayer(markers)
```

### Event Handler Issues

**Problem:** Events not firing or firing multiple times.

**Solutions:**

1. **Remove old listeners:**
```javascript
map.off('draw:created')  // Remove before adding new
map.on('draw:created', handler)
```

2. **Use useEffect cleanup:**
```javascript
useEffect(() => {
  map.on('draw:created', handler)
  
  return () => {
    map.off('draw:created', handler)
  }
}, [])
```

### Mobile Touch Issues

**Problem:** Drawing not working on mobile devices.

**Solutions:**

1. **Enable touch:**
```javascript
const map = L.map('map', {
  tap: true,
  touchZoom: true
})
```

2. **Adjust touch tolerance:**
```javascript
L.Control.Draw.extend({
  options: {
    draw: {
      polygon: {
        touchIcon: new L.DivIcon({
          iconSize: new L.Point(8, 8),
          className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
        })
      }
    }
  }
})
```

### Memory Leaks

**Problem:** Memory usage keeps increasing.

**Solutions:**

1. **Clean up on unmount:**
```javascript
useEffect(() => {
  // initialization
  
  return () => {
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
  }
}, [])
```

2. **Clear layer references:**
```javascript
const clearAllShapes = () => {
  drawnItems.clearLayers()
  // Clear any state references
  setDrawnShapes([])
}
```

## Best Practices

1. **Always import CSS:** `import 'leaflet-draw/dist/leaflet.draw.css'`
2. **Fix marker icons** before creating any markers
3. **Use FeatureGroup** for managing drawn items
4. **Type cast** when necessary for TypeScript
5. **Handle edge cases** like maximum shape limits
6. **Clean up** event listeners and map instances
7. **Test on mobile** devices for touch interactions

## Debug Tips

1. **Check browser console** for detailed error messages
2. **Verify CSS loading** in Network tab
3. **Use React DevTools** to inspect component state
4. **Test step by step** - add one feature at a time
5. **Check Leaflet version compatibility** with plugins

This should resolve most common issues you'll encounter with Leaflet.draw!