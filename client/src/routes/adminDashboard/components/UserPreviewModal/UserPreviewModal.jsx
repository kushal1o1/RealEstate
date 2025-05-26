import React from 'react';
import { X, Mail, Calendar, Home, Bookmark, MessageSquare } from 'lucide-react';
import './UserPreviewModal.scss';

const UserPreviewModal = ({ user, onClose }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="user-preview-modal__header">
          <h2>User Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="user-preview-modal__content">
          <div className="user-info">
            <div className="user-info__header">
              <img 
                src={user.avatar || '/placeholder.png'} 
                alt={user.username} 
                className="user-info__avatar"
              />
              <div className="user-info__details">
                <h3 className="user-info__name">{user.username}</h3>
                <div className="user-info__email">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="user-info__joined">
                  <Calendar size={16} />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <Home size={20} />
                <span className="stat-item__value">{user._count?.posts || 0}</span>
                <span className="stat-item__label">Properties</span>
              </div>
              <div className="stat-item">
                <Bookmark size={20} />
                <span className="stat-item__value">{user._count?.savedPosts || 0}</span>
                <span className="stat-item__label">Saved</span>
              </div>
              <div className="stat-item">
                <MessageSquare size={20} />
                <span className="stat-item__value">{user._count?.chats || 0}</span>
                <span className="stat-item__label">Chats</span>
              </div>
            </div>
          </div>

          {user.posts && user.posts.length > 0 && (
            <div className="user-preview-modal__section">
              <h3>Recent Properties</h3>
              <div className="properties-list">
                {user.posts.slice(0, 3).map(post => (
                  <div key={post.id} className="property-card">
                    <img 
                      src={post.images?.[0] || '/placeholder.png'} 
                      alt={post.title}
                      className="property-card__image"
                    />
                    <div className="property-card__content">
                      <h4 className="property-card__title">{post.title}</h4>
                      <div className="property-card__details">
                        <span className="badge">{post.type}</span>
                        <span className="property-card__price">
                          ${post.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="property-card__location">
                        {post.city}, {post.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user.savedPosts && user.savedPosts.length > 0 && (
            <div className="user-preview-modal__section">
              <h3>Saved Properties</h3>
              <div className="properties-list">
                {user.savedPosts.slice(0, 3).map(savedPost => (
                  <div key={savedPost.id} className="property-card">
                    <img 
                      src={savedPost.post.images?.[0] || '/placeholder.png'} 
                      alt={savedPost.post.title}
                      className="property-card__image"
                    />
                    <div className="property-card__content">
                      <h4 className="property-card__title">{savedPost.post.title}</h4>
                      <div className="property-card__details">
                        <span className="badge">{savedPost.post.type}</span>
                        <span className="property-card__price">
                          ${savedPost.post.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="property-card__location">
                        {savedPost.post.city}, {savedPost.post.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPreviewModal; 