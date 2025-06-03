import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import Map from '../../../../components/map/Map';
import Pin from '../../../../components/pin/Pin';
import apiRequest from '../../../../lib/apiRequest';
import './propertyMap.scss';

const PropertyMap = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    property: '',
    city: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/admin/posts', {
        params: {
          ...filters,
          limit: 1000 // Get all properties for the map
        }
      });
      setProperties(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="property-map-dashboard">
      <div className="property-map-header">
        <h2>Property Map</h2>
        <div className="filters">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select
            name="property"
            value={filters.property}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Properties</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="Filter by city..."
            className="filter-input"
          />
        </div>
      </div>

      <div className="map-stats">
        <div className="stat-item">
          <MapPin size={20} />
          <span>{properties.length} Properties</span>
        </div>
        <div className="stat-item">
          <span>Sale: {properties.filter(p => p.type === 'sale').length}</span>
        </div>
        <div className="stat-item">
          <span>Rent: {properties.filter(p => p.type === 'rent').length}</span>
        </div>
      </div>

      <div className="map-container">
        {loading ? (
          <div className="loading-skeleton" />
        ) : (
          <Map data={properties} />
        )}
      </div>
    </div>
  );
};

export default PropertyMap; 