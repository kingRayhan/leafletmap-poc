import * as L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { SavedShapesCollection } from "./drawing-types";
import { handleError, layerToGeoJSON, MapError } from "./leaflet-draw-utils";
import type { GeoCodeResult, GeoSearchResultIten } from "./types";

// delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Map = () => {
  const mapDomRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [searchResults, setSearchResults] = useState<GeoSearchResultIten[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapDomRef.current!, {
        dragging: true,
      }).setView([23.88163474558195, 90.38529952494262], 18);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      drawnItemsRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItemsRef.current);

      // Auto-load previously saved shapes
      const savedShapes = localStorage.getItem("drawnShapes");
      if (savedShapes) {
        try {
          const geojson: SavedShapesCollection = JSON.parse(savedShapes);
          L.geoJSON(geojson).eachLayer((layer: L.Layer) => {
            drawnItemsRef.current?.addLayer(layer);
          });
          console.log("Previously saved shapes loaded:", geojson);
        } catch (error) {
          handleError(error, "load saved shapes");
        }
      }

      // Enable drawing tools
      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItemsRef.current },
      });
      mapRef.current.addControl(drawControl);

      mapRef.current.on("draw:created", (e) => {
        drawnItemsRef.current?.addLayer(e.layer);
      });

      mapRef.current.on("draw:drawstop", (e) => {
        console.log("Drawing stopped:", e);
        autoSaveShapes();
      });

      // mapRef.current.on("draw:edited", (e) => {
      //   console.log("Shapes edited:", e);
      //   autoSaveShapes();
      // });

      // mapRef.current.on("draw:deleted", (e) => {
      //   console.log("Shapes deleted:", e);
      //   autoSaveShapes();
      // });
    }
  }, []);

  const autoSaveShapes = (): void => {
    if (drawnItemsRef.current) {
      try {
        const geojson =
          drawnItemsRef.current.toGeoJSON() as GeoJSON.FeatureCollection;
        localStorage.setItem("drawnShapes", JSON.stringify(geojson));
        console.log("Shapes auto-saved:", geojson);
      } catch (error) {
        handleError(error, "auto-save shapes");
      }
    }
  };

  const handleLocateMe = () => {
    if (!mapRef.current) return;

    mapRef.current.on("locationfound", (e: L.LocationEvent) => {
      const { latlng, accuracy } = e;

      mapRef.current!.setView(latlng, 16);

      L.marker(latlng)
        .addTo(mapRef.current!)
        .bindPopup(`You are here!<br>Accuracy: ±${Math.round(accuracy)}m`)
        .openPopup();
    });

    mapRef.current.on("locationerror", (e: L.ErrorEvent) => {
      alert("Could not find your location: " + e.message);
    });

    mapRef.current.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
    });
  };

  const handleAddMarker = (): void => {
    if (!mapRef.current) return;

    const marker = L.marker([23.88163474558195, 90.38529952494262]).addTo(
      mapRef.current
    );
    marker.bindPopup("New Marker").openPopup();
    mapRef.current.setView(marker.getLatLng(), 16);
  };

  const handleZoomIn = (): void => {
    if (!mapRef.current) return;

    mapRef.current.zoomIn();
  };

  const handleAddCircle = (): void => {
    if (!mapRef.current) return;

    L.circle([23.88163474558195, 90.38529952494262], {
      radius: 200,
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
    })
      .addTo(mapRef.current)
      .bindPopup("Red Circle - 200m radius");
  };

  const handleAddRectangle = (): void => {
    if (!mapRef.current) return;

    L.rectangle(
      [
        [23.88063474558195, 90.38429952494262], // southwest
        [23.88163474558195, 90.38529952494262], // northeast
      ],
      {
        color: "green",
        weight: 2,
        fillOpacity: 0.3,
      }
    )
      .addTo(mapRef.current)
      .bindPopup("Green Rectangle");
  };

  const handleSearch = async (): Promise<void> => {
    if (!mapRef.current) return;

    try {
      const searchValue = searchInputRef.current?.value;
      if (!searchValue) return;

      const api = await fetch(
        `https://geo-api.dinebd.com/auto-complete?search=${encodeURIComponent(
          searchValue
        )}`
      );

      if (!api.ok) {
        throw new MapError("Search API request failed", "search");
      }

      const results: GeoSearchResultIten[] = await api.json();
      setSearchResults(results);
    } catch (error) {
      handleError(error, "search");
      setSearchResults([]);
    }
  };

  const handleSelectResult = async (
    item: GeoSearchResultIten
  ): Promise<void> => {
    if (!mapRef.current) return;

    try {
      const api = await fetch(
        `https://geo-api.dinebd.com/geocode?place_id=${item.place_id}`
      );

      if (!api.ok) {
        throw new MapError("Geocode API request failed", "geocode");
      }

      const result = (await api.json()) as GeoCodeResult;

      mapRef.current.setView(
        [result.coordinates.lat, result.coordinates.lng],
        16,
        {
          animate: true,
          duration: 1,
        }
      );

      L.marker([result.coordinates.lat, result.coordinates.lng])
        .addTo(mapRef.current)
        .bindPopup(result.address)
        .openPopup();

      setSearchResults([]);
    } catch (error) {
      handleError(error, "select search result");
    }
  };

  const handleSaveShapes = (): void => {
    if (!drawnItemsRef.current) return;

    try {
      const geojson = layerToGeoJSON(drawnItemsRef.current);
      console.log("Saved shapes as GeoJSON:", geojson);

      // Save to localStorage
      localStorage.setItem("drawnShapes", JSON.stringify(geojson));
      alert("Shapes saved to localStorage!");
    } catch (error) {
      handleError(error, "save shapes");
      alert("Failed to save shapes!");
    }
  };

  const handleClearShapes = (): void => {
    if (!drawnItemsRef.current) return;

    try {
      drawnItemsRef.current.clearLayers();
      localStorage.removeItem("drawnShapes");
      alert("All shapes cleared!");
    } catch (error) {
      handleError(error, "clear shapes");
      alert("Failed to clear shapes!");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div>
        <input
          type="text"
          style={{
            padding: 15,
            position: "absolute",
            top: 10,
            left: 100,
            zIndex: 1000,
          }}
          ref={searchInputRef}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: 50,
              left: 100,
              zIndex: 1000,
              background: "white",
              border: "1px solid #ccc",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {searchResults.map((result) => (
              <li
                key={result.place_id}
                style={{ padding: 10, cursor: "pointer" }}
                onClick={() => handleSelectResult(result)}
              >
                {result.address}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <button onClick={handleLocateMe}>Locate Me</button>
        <button onClick={handleAddMarker}>Add Marker</button>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleAddCircle}>Add Circle</button>
        <button onClick={handleAddRectangle}>Add Rectangle</button>
        <hr style={{ margin: "5px 0" }} />
        <button onClick={handleSaveShapes}>Save Shapes</button>
        <button onClick={handleClearShapes}>Clear All</button>
      </div>

      <div
        ref={mapDomRef}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default Map;
