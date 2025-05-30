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

    try{
      setIsLoading(true);
      const res = await apiRequest.post('/auth/register', {
        username,
        email,
        password,
      });
      // console.log(res.data);
      showToast("Registration Successful", 'success');
      showToast("Please Login", 'success');
      navigate('/login');
      setIsLoading(false);
      // setError(res.data);
    }
    catch(err){
      setIsLoading(false);
      console.log(err);
      showToast("Username or Email Already Exist", 'error');
      // setError(err.response.data.message);
    }
    finally{

      setIsLoading(false);
    }
  }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
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