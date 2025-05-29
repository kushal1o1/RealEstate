import "./newPostPage.scss";
import React, { useEffect, useRef ,useState} from 'react';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import default theme
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";


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

  const handleSumbit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    
    // Remove amenities array processing
    try {
      const res = await apiRequest.post("/posts", {
       postData:{
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
       },
       postDetail:{
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
          amenities: inputs.amenities, // Send as string directly
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
       }
      });
      showToast("Post Created Successfully", 'success');
      navigate('/'+ res.data.id);
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      showToast("Error creating post", 'error');
      console.error("Error adding post:", error);
      setError(error)
      
    }
    
  };

    const handleRemoveImage = (imageToRemove) => {
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

  return (
    <div className="updatePostPage">
      <div className="container">
        <h1>Create Post</h1>
        
        {error && <div className="error-message">{error.message}</div>}
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
            className={activeTab === 'location' ? 'active' : ''} 
            onClick={() => setActiveTab('location')}
          >
            Location & Policies
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
              <input id="title" name="title" type="text"required />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number"  required />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select 
                name="type" 
              
              
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="property">Property Type</label>
              <select 
                name="property" 
            
                
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="bedroom">Bedrooms</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="bathroom">Bathrooms</label>
              <input min={1} id="bathroom" name="bathroom" type="number"  required />
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="builduparea">Build Up Area (sqft)</label>
              <input min={0} id="builduparea" name="builduparea" type="number" required />
            </div>

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

            <div className="form-group">
              <label htmlFor="floor">Floor</label>
              <input min={1} id="floor" name="floor" type="number" required />
            </div>

            <div className="form-group">
              <label htmlFor="builtyear">Built Year</label>
              <input min={1900} max={new Date().getFullYear()} id="builtyear" name="builtyear" type="number" required />
            </div>

            <div className="form-group">
              <label htmlFor="parking">Parking</label>
              <input 
                id="parking" 
                name="parking" 
                type="text" 
                placeholder="e.g., 2 car, bike" 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="amenities">Amenities (comma separated)</label>
              <input 
                id="amenities" 
                name="amenities" 
                type="text" 
                placeholder="e.g., Earthquake Resistant, Marbel, Parquet, Parking, Drinking Water, Terrace" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" required>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" required>
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
                required
              />
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'location' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text"  required />
            </div>
            
            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="school">Distance to School (miles)</label>
              <input min={0} id="school" name="school" type="number" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="bus">Distance to Bus (miles)</label>
              <input min={0} id="bus" name="bus" type="number"  required />
            </div>
            
            <div className="form-group">
              <label htmlFor="restaurant">Distance to Restaurant (miles)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" required />
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
                  const tabs = ['basic', 'details', 'location', 'images'];
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
                  const tabs = ['basic', 'details', 'location', 'images'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex + 1]);
                }}
              >
                Next
              </button>
            )}
            
            <button type="submit" className="submit-button">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPostPage;