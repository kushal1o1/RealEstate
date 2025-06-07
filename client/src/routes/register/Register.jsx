import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/loader/Loader";


function Register() {
   const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
  

   const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    if (!username || !email || !password) {
      showToast("All fields are required!", 'error');
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiRequest.post('/auth/register', {
        username,
        email,
        password,
      });
      showToast("Registration Successful", 'success');
      showToast("Please Login", 'success');
      navigate('/login');
    } catch (err) {
      console.log(err);
      if (!err.response) {
        // Network error or server not responding
        showToast("Network error! Please check your connection.", 'error');
        setError("Network error! Please check your connection.");
      } else {
        // Backend error with specific message
        const errorMessage = err.response.data.message || "Registration failed!";
        showToast(errorMessage, 'error');
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required/>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required/>
          <button disabled={isLoading}>Register</button>
          {error && <span className="error">{error}</span>}
          {isLoading && <Loader message="Registering..." />}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;