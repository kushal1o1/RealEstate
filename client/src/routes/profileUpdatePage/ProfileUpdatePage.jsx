import "./profileUpdatePage.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import  apiRequest  from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";



function ProfileUpdatePage() {
  const [error, setError] = useState('');
  const {currentUser ,updateUser} = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await  apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar:avatar[0],
      });
      updateUser(res.data);
      showToast("Profile Updated Successfully", 'success');
      navigate("/profile");
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating user:", error);
      showToast(error.response.data.message, 'error');
      setError(error.response.data.message || "An error occurred while updating the user.");
      
    }
  }
  return (
    <div className="profileUpdatePage">
  
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>

          {isLoading && <Loader message="Updating Profile..." />}

          <button>Update</button>
          {error && <p className="error">{error}</p>}
        
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || '/noavatar.jpg'} alt="" className="avatar" />
        <UploadWidget uwConfig={
          {
            cloudName:  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            uploadPreset:  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
            multiple: false,
            maxImageFileSize: 2000000,
            folder:"avatars",
          }
        }
        setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;