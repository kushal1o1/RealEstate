import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom"; 

const types = ["sale", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "rent",
    city: "pokhara",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };
const handleChange = (e) => {
   setQuery((prev)=>({...prev, [e.target.name]: e.target.value}));
  }

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type=== "sale" ? "For Buy" : "For Rent"}
          </button>
        ))}
      </div>
      <form>
        <input type="text" name="city" placeholder="City" onChange={handleChange}/>
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link to={`/list?city=${query.city}&type=${query.type}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}>
        <button>
          <img src="/search.png" alt="" />
        </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;