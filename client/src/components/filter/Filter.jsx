import "./filter.scss";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Filter({ onSearch }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 10000000000,
    bedroom: searchParams.get("bedroom") || 0,
    bathroom: searchParams.get("bathroom") || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => {
      const newQuery = {
        ...prev,
        [name]: value,
      };

      // Reset bedroom and bathroom when property type is land
      if (name === 'property' && value === 'land') {
        newQuery.bedroom = 0;
        newQuery.bathroom = 0;
      }

      return newQuery;
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setSearchParams(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter(e);
    }
  };

  const isLandProperty = query.property === 'land';

  return (
    <div className="filter">
      <h1>
        Search results {searchParams.get('city') === "undefined" || !searchParams.get('city') ? '' : <>for <b>{searchParams.get('city')}</b></>}
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            defaultValue={query.city === "undefined" ? '' : query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select 
            name="type" 
            id="type" 
            onChange={handleChange} 
            onKeyPress={handleKeyPress} 
            defaultValue={query.type}
          >
            <option value="">any</option>
            <option value="sale">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select 
            name="property" 
            id="property" 
            onChange={handleChange} 
            onKeyPress={handleKeyPress} 
            defaultValue={query.property}
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
        </div>
        {!isLandProperty && (
          <>
            <div className="item">
              <label htmlFor="bedroom">Bedrooms</label>
              <select 
                name="bedroom" 
                id="bedroom" 
                onChange={handleChange} 
                onKeyPress={handleKeyPress} 
                defaultValue={query.bedroom}
                disabled={isLandProperty}
              >
                <option value="">any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathrooms</label>
              <select 
                name="bathroom" 
                id="bathroom" 
                onChange={handleChange} 
                onKeyPress={handleKeyPress} 
                defaultValue={query.bathroom}
                disabled={isLandProperty}
              >
                <option value="">any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </>
        )}
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            defaultValue={query.maxPrice}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;