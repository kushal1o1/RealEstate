import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';
import { useEffect } from 'react';

// Component to handle map view changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function Map({ data, searchQuery }) {
  // Default center (Nepal)
  const defaultCenter = [28.2082, 83.9787];
  const defaultZoom = 6;

  // Calculate center and zoom based on search results
  const getMapCenter = () => {
    if (!data || data.length === 0) return { center: defaultCenter, zoom: defaultZoom };
    
    if (data.length === 1) {
      return {
        center: [parseFloat(data[0].latitude), parseFloat(data[0].longitude)],
        zoom: 13
      };
    }

    // If multiple results, calculate bounds
    const bounds = data.reduce((acc, item) => {
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        acc.lats.push(lat);
        acc.lngs.push(lng);
      }
      return acc;
    }, { lats: [], lngs: [] });

    if (bounds.lats.length === 0) return { center: defaultCenter, zoom: defaultZoom };

    const center = [
      (Math.min(...bounds.lats) + Math.max(...bounds.lats)) / 2,
      (Math.min(...bounds.lngs) + Math.max(...bounds.lngs)) / 2
    ];

    // Calculate zoom level based on the spread of points
    const latSpread = Math.max(...bounds.lats) - Math.min(...bounds.lats);
    const lngSpread = Math.max(...bounds.lngs) - Math.min(...bounds.lngs);
    const maxSpread = Math.max(latSpread, lngSpread);
    
    // Adjust zoom level based on spread
    let zoom = 13;
    if (maxSpread > 0.1) zoom = 11;
    if (maxSpread > 0.5) zoom = 9;
    if (maxSpread > 1) zoom = 7;
    if (maxSpread > 2) zoom = 6;

    return { center, zoom };
  };

  const { center, zoom } = getMapCenter();

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      className='map'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} zoom={zoom} />
      {data.map(item => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;