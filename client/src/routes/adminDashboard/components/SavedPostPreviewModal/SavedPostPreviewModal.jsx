import React from 'react';
import { X, User, Home, Calendar, MapPin, DollarSign } from 'lucide-react';
import './savedPostPreviewModal.scss';

const SavedPostPreviewModal = ({ savedPost, onClose }) => {
  if (!savedPost) return null;

  const { post, user } = savedPost;

  return (
    <div className="modal-overlay">
      <div className="saved-post-preview-modal">
        <div className="saved-post-preview-modal__header">
          <h2 className="saved-post-preview-modal__title">Saved Post Details</h2>
          <button className="saved-post-preview-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="saved-post-preview-modal__content">
          <div className="saved-post-preview-modal__property">
            <div className="property-images">
              {post.images?.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Property ${index + 1}`}
                  className="property-images__image"
                />
              ))}
            </div>

            <div className="property-details">
              <h3 className="property-details__title">{post.title}</h3>
              
              <div className="property-details__info">
                <div className="property-info-item">
                  <Home size={16} />
                  <span>{post.property}</span>
                </div>
                <div className="property-info-item">
                  <DollarSign size={16} />
                  <span>${post.price?.toLocaleString()}</span>
                </div>
                <div className="property-info-item">
                  <MapPin size={16} />
                  <span>{post.city}</span>
                </div>
                <div className="property-info-item">
                  <Calendar size={16} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="property-details__description">
                <h4>Description</h4>
                <p>{post.postDetail?.description || 'No description available'}</p>
              </div>

              <div className="property-details__features">
                <h4>Features</h4>
                <div className="features-grid">
                  {post.postDetail?.features?.map((feature, index) => (
                    <div key={index} className="feature-item">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="saved-post-preview-modal__user">
            <h3 className="saved-post-preview-modal__subtitle">
              <User size={16} />
              Saved By
            </h3>
            <div className="user-info">
              <img 
                src={user.avatar || '/placeholder.png'} 
                alt={user.username}
                className="user-info__avatar"
              />
              <div className="user-info__details">
                <div className="user-info__name">{user.username}</div>
                <div className="user-info__email">{user.email}</div>
                <div className="user-info__date">
                  Saved on {new Date(savedPost.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPostPreviewModal; 