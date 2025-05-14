// UserInfo.js
import React from 'react';
import './userInfo.scss'; // Import the SCSS file

const UserInfo = ({ currentUser, handleLogout }) => {
  return (
    <div className="user-info">
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
      <button className="user-info__logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
