import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './map.scss';

// Fix for default marker icon
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map center updates
function MapCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

function LocationPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || null);
  const mapRef = useRef(null);

  // Update position when initialPosition changes
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  function MapEvents() {
    const map = useMap();
    useEffect(() => {
      // Invalidate map size after a short delay to ensure container is fully rendered
      const timer = setTimeout(() => {
        map.invalidateSize();
        console.log("Map size invalidated after delay!");
      }, 100); // Small delay, e.g., 100ms

      return () => clearTimeout(timer);
    }, [map]);

    useMapEvents({
      click: (e) => {
        // Prevent default zoom behavior
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
        
        const { lat, lng } = e.latlng;
        console.log('Map clicked at:', lat, lng);
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
      // Disable double click zoom
      dblclick: (e) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
      }
    });
    return null;
  }

  return (
    <div className="location-picker">
      <MapContainer 
        center={initialPosition || [27.7172, 85.3240]} // Kathmandu coordinates
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
        zoomControl={true}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <MapCenter position={initialPosition} />
        {position && (
          <Marker 
            position={position}
            icon={icon}
          />
        )}
      </MapContainer>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        zIndex: 1000
      }}>
        {position ? (
          <div style={{ color: '#27ae60', fontWeight: 'bold' }}>
            Location Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </div>
        ) : (
          <div>Click on the map to select location</div>
        )}
      </div>
    </div>
  );
}

export default LocationPicker; 