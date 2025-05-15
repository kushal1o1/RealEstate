import "./newPostPage.scss";
import React, { useEffect, useRef ,useState} from 'react';
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import default theme
import apiRequesst from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [error, setError] = useState(''); 
  const[images, setImages] = useState([]);
  const [value, setValue] = useState(''); 
 const editorRef = useRef(null);     // Reference to the container div
 
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
  }
}, []);

  const handleSumbit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    // console.log(inputs);
    try {
      const res =await apiRequesst.post("/posts", {
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
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),

       }
      });
      navigate('/'+ res.data.id);
      
    } catch (error) {
      console.error("Error adding post:", error);
      setError(error)
      
    }
    
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSumbit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number"  required/>
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required/>
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
            <div ref={editorRef} onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required/>
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required/>
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required/>
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required/>
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment" defaultChecked >Apartment</option>
                <option value="house">House</option>
                {/* <option value="condo">Condo</option> */}
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner" defaultChecked >Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed" defaultChecked>Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" required/>
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" required/>
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number"  required/>
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" required />
            </div>
            <button className="sendButton">Add</button>
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image,index) => (
          <img
            key={index}
            src={image}
            alt="Uploaded"

          />
          
        ))}
        <UploadWidget uwConfig={{
          multiple:true,
          cloudName:  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            uploadPreset:  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
            // maxImageFileSize: 2000000,
            folder:"posts",
          
        }}
        setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;