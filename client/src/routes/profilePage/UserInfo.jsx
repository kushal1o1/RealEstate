// UserInfo.js
import React from 'react';
import './userInfo.scss'; // Import the SCSS file
import { useState } from 'react';
import Alert from '../../components/alert/Alert'; // Import the Alert component

const UserInfo = ({ currentUser, handleLogout }) => {
    const [showConfirm, setShowConfirm] = useState(false);
  
  return (
    <div className="user-info">
       <Alert handleAction={handleLogout} setShowConfirm={setShowConfirm} showConfirm={showConfirm} message='You Wanna Logout ?' btnText="Yes,Logout"/>
      <div className="user-info__avatar">
        <img
          src={currentUser.avatar || '/noavatar.jpg'}
          alt="User Avatar"
        />
      </div>
      <div className="user-info__details">
        <span className="user-info__username">
          Username: <b>{currentUser.username}</b>
        </span>
        <span className="user-info__email">
          E-mail: <b>{currentUser.email}</b>
        </span>
      </div>
      <button className="user-info__logout-btn" onClick={() => setShowConfirm(true)}>
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
