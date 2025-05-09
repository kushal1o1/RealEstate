import "./login.scss";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [error,setError] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();

    const {updateUser} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    setIsLoading(true);
    try {
      const res = await apiRequest.post('/auth/login', 
      {
         username,
         password }
      );
      updateUser(res.data);
        navigate('/');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}> 
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" required
          minLength={3} maxLength={20} />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span className="error">{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;