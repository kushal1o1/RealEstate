import { useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useNotificationStore } from "../../lib/notificationStore";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

      const {currentUser} = useContext(AuthContext);
      const fetch = useNotificationStore((state) => state.fetch);
      const number = useNotificationStore((state) => state.number);
      fetch();
  

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>RealEstate</span>
        </a>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        {currentUser?.isAdmin && (
          <a href="/admin-dashboard">Dashboard</a>
        )}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || '/noavatar.jpg'}
              alt=""
            />
            <span>{ currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && (
                <div className="notification">
                  {number}
                </div>
              )}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">Sign up</a>
          </>
        )}
        <div className="menuIcon">
          {open ? (
            <X 
              size={36} 
              onClick={() => setOpen(false)}
              style={{ cursor: 'pointer', color: 'white' }}
            />
          ) : (
            <Menu 
              size={36} 
              onClick={() => setOpen(true)}
              style={{ cursor: 'pointer', color: 'black' }}
            />
          )}
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          {currentUser?.isAdmin && (
            <a href="/admin-dashboard">Dashboard</a>
          )}
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
           
            </>
          ) : (
            <>
              <a href="/login">Sign in</a>
              <a href="/register">Sign up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;