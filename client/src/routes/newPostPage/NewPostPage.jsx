import "./newPostPage.scss";
import React, { useEffect, useRef ,useState} from 'react';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import default theme
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";
import LocationPicker from "../../components/map/LocationPicker"; // Update import


function NewPostPage() {
  const [error, setError] = useState(''); 
  const[images, setImages] = useState([]);
  const [value, setValue] = useState(''); 
  const editorRef = useRef(null);     // Reference to the container div
  const [activeTab, setActiveTab] = useState('basic');
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
 
   const  navigate = useNavigate();
  const quillInstance = useRef(null); // Store Quill instance
  const [propertyType, setPropertyType] = useState('apartment');
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    // ... other form fields
  });

useEffect(() => {
  if (editorRef.current && !quillInstance.current) {
    quillInstance.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Start typing...',
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ script: 'sub' }, { script: 'super' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          ['link'],
          ['clean'],
        ],
      },
    });
      quillInstance.current.on('text-change', () => {
        setValue(quillInstance.current.root.innerHTML);
      });
  }
}, []);

  // Validation functions - now return error message or null
  const validatePrice = (price) => {
    const numPrice = parseInt(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return "Price must be greater than 0";
    }
    return null;
  };

  const validateNumericField = (value, fieldName, min = 0) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < min) {
      return `${fieldName} must be ${min === 0 ? 'greater than or equal to 0' : `at least ${min}`}`;
    }
    return null;
  };

  const validateCoordinates = (lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      return "Please select a location on the map";
    }
    if (latNum < -90 || latNum > 90) {
      return "Invalid latitude value (-90 to 90)";
    }
    if (lngNum < -180 || lngNum > 180) {
      return "Invalid longitude value (-180 to 180)";
    }
    return null;
  };

  const validateDistance = (value, fieldName) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return `${fieldName} distance must be greater than or equal to 0`;
    }
    return null;
  };

  const handleMapClick = (lat, lng) => {
    console.log('Setting coordinates:', lat, lng);
    setCoordinates({
      lat: lat.toString(),
      lng: lng.toString()
    });
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous internal error
    
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    
    let validationError = null;
    let errorTab = 'basic'; // Default tab for basic info errors

    // Basic Info validations
    validationError = validatePrice(inputs.price);
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('basic'); return; }

    if (propertyType !== 'land') {
      validationError = validateNumericField(inputs.bedroom, 'Bedrooms', 1);
      if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('basic'); return; }
      validationError = validateNumericField(inputs.bathroom, 'Bathrooms', 1);
      if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('basic'); return; }
    }

    // Details validations
    if (propertyType !== 'land') {
      validationError = validateNumericField(inputs.floor, 'Floor', 1);
      if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('details'); return; }
    }
    validationError = validateNumericField(inputs.size, 'Total Size');
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('details'); return; }
    validationError = validateNumericField(inputs.facing, 'Facing');
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('details'); return; }
    if (propertyType !== 'land') {
      validationError = validateNumericField(inputs.builduparea, 'Build Up Area');
      if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('details'); return; }
    }

    // Map & Location validations
    validationError = validateCoordinates(coordinates.lat, coordinates.lng);
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('map'); return; }

    validationError = validateDistance(inputs.school, 'School');
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('location'); return; }
    validationError = validateDistance(inputs.bus, 'Bus');
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('location'); return; }
    validationError = validateDistance(inputs.restaurant, 'Restaurant');
    if (validationError) { showToast(validationError, 'error'); setIsLoading(false); setActiveTab('location'); return; }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: coordinates.lat, // Use string coordinates
          longitude: coordinates.lng, // Use string coordinates
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          builduparea: parseInt(inputs.builduparea),
          roadacess: inputs.roadacess,
          Facing: parseFloat(inputs.facing),
          floor: parseInt(inputs.floor),
          builtyear: parseInt(inputs.builtyear),
          parking: inputs.parking,
          amenities: inputs.amenities,
          school: parseFloat(inputs.school),
          bus: parseFloat(inputs.bus),
          restaurant: parseFloat(inputs.restaurant),
        }
      });
      showToast("Post Created Successfully", 'success');
      navigate('/' + res.data.id);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create post. Please try again.", 'error');
      console.error("Error adding post:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleRemoveImage = (imageToRemove) => {
    if (!images) return; // Guard against undefined images
    setImages((prev) => prev.filter((img) => img !== imageToRemove));
    showToast("Image Removed", 'success');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  return (
    <div className="updatePostPage">
      <div className="container">
        <h1>Create Post</h1>
        
        {/* Removed inline error display, using toast instead */}
        {/* {error && <div className="error-message">{error.message}</div>} */}
        {isLoading && <Loader message="Creating Post..." />}
        
        <div className="tabs">
          <button 
            className={activeTab === 'basic' ? 'active' : ''} 
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={activeTab === 'details' ? 'active' : ''} 
            onClick={() => setActiveTab('details')}
          >
            Property Details
          </button>
          <button 
            className={activeTab === 'map' ? 'active' : ''} 
            onClick={() => setActiveTab('map')}
          >
            Map Location
          </button>
          <button 
            className={activeTab === 'location' ? 'active' : ''} 
            onClick={() => setActiveTab('location')}
          >
            Location Details
          </button>
          <button 
            className={activeTab === 'images' ? 'active' : ''} 
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
        </div>
        
        <form onSubmit={handleSumbit}>
          <div className={`tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price (NPR)</label>
              <input 
                id="price" 
                name="price" 
                type="number" 
                min="1" 
                required 
                placeholder="Enter price in NPR"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select name="type" required>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="property">Property Type</label>
              <select 
                name="property" 
                onChange={handlePropertyTypeChange}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>
            
            {propertyType !== 'land' && (
              <>
                <div className="form-group">
                  <label htmlFor="bedroom">Bedrooms</label>
                  <input min={1} id="bedroom" name="bedroom" type="number" required={propertyType !== 'land'} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bathroom">Bathrooms</label>
                  <input min={1} id="bathroom" name="bathroom" type="number" required={propertyType !== 'land'} />
                </div>
              </>
            )}
            
            <div className="form-group full-width">
              <label htmlFor="desc">Description</label>
              <div className="editor-container">
                <div ref={editorRef} />
              </div>
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" required />
            </div>
            
            {propertyType !== 'land' && (
              <div className="form-group">
                <label htmlFor="builduparea">Build Up Area (sqft)</label>
                <input min={0} id="builduparea" name="builduparea" type="number" required={propertyType !== 'land'} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="roadacess">Road Access</label>
              <select name="roadacess" required>
                <option value="WEST">West</option>
                <option value="SOUTH">South</option>
                <option value="EAST">East</option>
                <option value="NORTH">North</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="facing">Facing (ft)</label>
              <input
                min={0}
                id="facing"
                name="facing"
                type="number"
                placeholder="e.g., 2.3"
                required
              />
            </div>

            {propertyType !== 'land' && (
              <>
                <div className="form-group">
                  <label htmlFor="floor">Floor</label>
                  <input min={1} id="floor" name="floor" type="number" required={propertyType !== 'land'} />
                </div>

                <div className="form-group">
                  <label htmlFor="builtyear">Built Year (B.S.)</label>
                  <input 
                    min={2000} 
                    max={2080} 
                    id="builtyear" 
                    name="builtyear" 
                    type="number" 
                    required={propertyType !== 'land'}
                    placeholder="Enter year in B.S. (e.g., 2075)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="parking">Parking</label>
                  <input 
                    id="parking" 
                    name="parking" 
                    type="text" 
                    placeholder="e.g., 2 car, bike" 
                    required={propertyType !== 'land'} 
                  />
                </div>
              </>
            )}

            <div className="form-group full-width">
              <label htmlFor="amenities">
                {propertyType === 'land' ? 'Features' : 'Amenities'} (comma separated)
              </label>
              <input 
                id="amenities" 
                name="amenities" 
                type="text" 
                placeholder={propertyType === 'land' 
                  ? "e.g., Electricity, Water Supply, Road Access, Drainage" 
                  : "e.g., Earthquake Resistant, Marbel, Parquet, Parking, Drinking Water, Terrace"
                }
                required 
              />
            </div>
            
            {propertyType !== 'land' && (
              <>
                <div className="form-group">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select name="utilities" required={propertyType !== 'land'}>
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="pet">Pet Policy</label>
                  <select name="pet" required={propertyType !== 'land'}>
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="income">Income Policy</label>
                  <input
                    id="income"
                    name="income"
                    type="text"
                    placeholder="Income Policy"
                    required={propertyType !== 'land'}
                  />
                </div>
              </>
            )}
          </div>
          
          {activeTab === 'map' && (
            <div className={`tab-content map-tab active`}>
              <div className="map-container">
                <h3>Select Property Location</h3>
                <p className="map-instruction">Click on the map to set the property location. The coordinates will be automatically saved.</p>
                <div className="map-wrapper">
                  <LocationPicker 
                    key={activeTab}
                    onLocationSelect={handleMapClick} 
                  />
                </div>
                {coordinates.lat && coordinates.lng && (
                  <div className="coordinates-display">
                    <p>Selected Location Coordinates:</p>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lng}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className={`tab-content ${activeTab === 'location' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                required 
                placeholder="Enter detailed address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                id="city" 
                name="city" 
                type="text" 
                required 
                placeholder="Enter city name"
              />
            </div>
            
            <input type="hidden" name="latitude" value={coordinates.lat} />
            <input type="hidden" name="longitude" value={coordinates.lng} />
            
            <div className="form-group">
              <label htmlFor="school">Distance to School (km)</label>
              <input 
                min="0" 
                step="0.1"
                id="school" 
                name="school" 
                type="number" 
                required 
                placeholder="Enter distance in kilometers"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bus">Distance to Bus (km)</label>
              <input 
                min="0" 
                step="0.1"
                id="bus" 
                name="bus" 
                type="number" 
                required 
                placeholder="Enter distance in kilometers"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="restaurant">Distance to Restaurant (km)</label>
              <input 
                min="0" 
                step="0.1"
                id="restaurant" 
                name="restaurant" 
                type="number" 
                required 
                placeholder="Enter distance in kilometers"
              />
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'images' ? 'active' : ''}`}>
            <div className="images-container">
              {images.length > 0 ? (
                <div className="image-grid">
                  {images.map((image, index) => (
                    <div className="image-item" key={index}>
                      <img src={image} alt={`Property ${index + 1}`} />
                      <button 
                        type="button"
                        className="delete-button" 
                        onClick={() => handleRemoveImage(image)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-images">No images uploaded yet</div>
              )}
              
              <div className="upload-container">
                <UploadWidget 
                  uwConfig={{
                    multiple: true,
                    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                    folder: "posts",
                  }}
                  setState={setImages}
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            {activeTab !== 'basic' && (
              <button 
                type="button" 
                className="prev-button"
                onClick={() => {
                  const tabs = ['basic', 'details', 'map', 'location', 'images'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex - 1]);
                }}
              >
                Previous
              </button>
            )}
            
            {activeTab !== 'images' && (
              <button 
                type="button"
                className="next-button"
                onClick={() => {
                  const tabs = ['basic', 'details', 'map', 'location', 'images'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex + 1]);
                }}
              >
                Next
              </button>
            )}
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={!coordinates.lat || !coordinates.lng}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPostPage;