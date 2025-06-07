import "./profileUpdatePage.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";
import Alert from "../../components/alert/Alert";

function ProfileUpdatePage() {
  const [error, setError] = useState('');
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission only if event exists
    }
    
    setIsLoading(true);
    setError('');
    setShowConfirm(false);

    // Frontend validation
    if (!formData.username || !formData.email) {
      showToast("Username and email are required!", 'error');
      setError("Username and email are required!");
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address!", 'error');
      setError("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    // Validate password if provided
    if (formData.password && formData.password.length < 6) {
      showToast("Password must be at least 6 characters long!", 'error');
      setError("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
        avatar: avatar[0],
      });
      updateUser(res.data);
      showToast("Profile Updated Successfully", 'success');
      navigate("/profile");
    } catch (error) {
      console.error("Error updating user:", error);
      if (!error.response) {
        showToast("Network error! Please check your connection.", 'error');
        setError("Network error! Please check your connection.");
      } else {
        const errorMessage = error.response.data.message || "Failed to update profile!";
        showToast(errorMessage, 'error');
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (formData.password) {
      // Show confirmation only if password is being changed
      setShowConfirm(true);
    } else {
      // If no password change, submit directly
      handleSubmit();
    }
  };

  return (
    <div className="profileUpdatePage">
      {showConfirm && (
        <Alert
          handleAction={handleSubmit}
          setShowConfirm={setShowConfirm}
          showConfirm={showConfirm}
          message="Are you sure you want to change your password? This action cannot be undone."
          btnText="Yes, Update Password"
        />
      )}

      <div className="formContainer">
        <form onSubmit={handleFormSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              minLength={3}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password (leave blank to keep current)</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              minLength={6}
            />
          </div>

          {isLoading && <Loader message="Updating Profile..." />}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || '/noavatar.jpg'} alt="" className="avatar" />
        <UploadWidget
          uwConfig={{
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;