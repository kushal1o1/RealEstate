import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './createPropertyModal.scss';
import apiRequest from '../../../../lib/apiRequest';
import UploadWidget from '../../../../components/uploadWidget/UploadWidget';

const CreatePropertyModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [images, setImages] = useState([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());

    try {
      await apiRequest.post("/posts", {
        postData: {
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
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        }
      });

      onSuccess();
      onClose();
      setImages([]);
      setValue('');
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages((prev) => prev.filter((img) => img !== imageToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="create-property-modal">
        <div className="create-property-modal__header">
          <h2>Create New Property</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="create-property-modal__form">
          {error && <div className="error-message">{error}</div>}

          <div className={`tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
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
              <select name="property" required>
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
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="desc">Description</label>
              <div className="editor-container">
                <div ref={editorRef} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="utilities">Utilities</label>
              <input id="utilities" name="utilities" type="text" />
            </div>

            <div className="form-group">
              <label htmlFor="pet">Pet Policy</label>
              <input id="pet" name="pet" type="text" />
            </div>

            <div className="form-group">
              <label htmlFor="income">Income Requirement</label>
              <input id="income" name="income" type="text" />
            </div>

            <div className="form-group">
              <label htmlFor="size">Size (sq ft)</label>
              <input id="size" name="size" type="number" />
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
              <input id="latitude" name="latitude" type="number" step="any" required />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="number" step="any" required />
            </div>

            <div className="form-group">
              <label htmlFor="school">School Rating (1-10)</label>
              <input id="school" name="school" type="number" min="1" max="10" />
            </div>

            <div className="form-group">
              <label htmlFor="bus">Bus Rating (1-10)</label>
              <input id="bus" name="bus" type="number" min="1" max="10" />
            </div>

            <div className="form-group">
              <label htmlFor="restaurant">Restaurant Rating (1-10)</label>
              <input id="restaurant" name="restaurant" type="number" min="1" max="10" />
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'images' ? 'active' : ''}`}>
            <div className="form-group">
              <label>Property Images</label>
              <UploadWidget
                uwConfig={{
                  cloudName: "dpg3j1q3q",
                  uploadPreset: "realestate",
                  multiple: true,
                  maxImageFileSize: 2000000,
                  folder: "properties"
                }}
                onUpload={(result) => {
                  setImages(prev => [...prev, result.info.secure_url]);
                }}
              />
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt="" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn--secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyModal; 