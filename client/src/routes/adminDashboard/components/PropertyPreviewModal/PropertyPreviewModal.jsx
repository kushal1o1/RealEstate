import React, { useState } from 'react';
import { X, Home, MapPin, Calendar, User, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import './PropertyPreviewModal.scss';
import {formatNepaliPrice} from '../../../../utils/formatUtils';

const PropertyPreviewModal = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="property-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="property-preview-modal__header">
          <h2>Property Details</h2>
          <button className="property-preview-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="property-preview-modal__content">
          {/* Left Column - Gallery and Basic Info */}
          <div className="property-preview-modal__left">
            {/* Image Gallery */}
            <div className="property-gallery">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="property-gallery__main">
                    <img 
                      src={property.images[currentImageIndex]} 
                      alt={property.title}
                      className="property-gallery__main-image"
                    />
                    {property.images.length > 1 && (
                      <>
                        <button 
                          className="gallery-nav gallery-nav--prev"
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          className="gallery-nav gallery-nav--next"
                          onClick={handleNextImage}
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                  {property.images.length > 1 && (
                    <div className="gallery-thumbnails">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img src={image} alt={`${property.title} - ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="property-gallery__placeholder">
                  <Home size={48} />
                  <span>No images available</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="property-info">
              <div className="property-info__header">
                <h3 className="property-info__title">{property.title}</h3>
                <div className="property-info__meta">
                  <span className="badge badge--type">{property.type}</span>
                  <span className="badge badge--property">{property.property}</span>
                </div>
                <div className="property-info__price">
                  <span>{formatNepaliPrice(property.price)}</span>
                </div>
                <div className="property-info__location">
                  <MapPin size={16} />
                  <span>{property.city}, {property.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="property-preview-modal__right">
            {property.postDetail && (
              <div className="property-details">
                <h4>Property Details</h4>
                <div className="property-details__grid">
                  {property.bedroom && (
                    <div className="detail-item">
                      <span className="detail-item__label">Bedrooms</span>
                      <span className="detail-item__value">{property.bedroom}</span>
                    </div>
                  )}
                  {property.bathroom && (
                    <div className="detail-item">
                      <span className="detail-item__label">Bathrooms</span>
                      <span className="detail-item__value">{property.bathroom}</span>
                    </div>
                  )}
                  {property.postDetail.size && (
                    <div className="detail-item">
                      <span className="detail-item__label">Total Size</span>
                      <span className="detail-item__value">{property.postDetail.size} sq ft</span>
                    </div>
                  )}
                  {property.postDetail.builduparea && (
                    <div className="detail-item">
                      <span className="detail-item__label">Build Up Area</span>
                      <span className="detail-item__value">{property.postDetail.builduparea} sq ft</span>
                    </div>
                  )}
                  {property.postDetail.roadacess && (
                    <div className="detail-item">
                      <span className="detail-item__label">Road Access</span>
                      <span className="detail-item__value">{property.postDetail.roadacess}</span>
                    </div>
                  )}
                  {property.postDetail.Facing && (
                    <div className="detail-item">
                      <span className="detail-item__label">Facing</span>
                      <span className="detail-item__value">{property.postDetail.Facing} ft</span>
                    </div>
                  )}
                  {property.postDetail.floor && (
                    <div className="detail-item">
                      <span className="detail-item__label">Floor</span>
                      <span className="detail-item__value">{property.postDetail.floor}</span>
                    </div>
                  )}
                  {property.postDetail.builtyear && (
                    <div className="detail-item">
                      <span className="detail-item__label">Built Year</span>
                      <span className="detail-item__value">{property.postDetail.builtyear}</span>
                    </div>
                  )}
                  {property.postDetail.parking && (
                    <div className="detail-item">
                      <span className="detail-item__label">Parking</span>
                      <span className="detail-item__value">{property.postDetail.parking}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {property.postDetail?.amenities && (
              <div className="property-details">
                <h4>Amenities</h4>
                <div className="property-details__grid">
                  {property.postDetail.amenities.split(',').map((amenity, index) => (
                    <div key={index} className="detail-item">
                      <span className="detail-item__value">{amenity.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.postDetail?.description && (
              <div className="property-description">
                <h4>Description</h4>
                <p>{property.postDetail.description}</p>
              </div>
            )}

            <div className="property-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Listed {formatDate(property.createdAt)}</span>
              </div>
              <div className="meta-item">
                <User size={16} />
                <img 
                  src={property.user?.avatar || '/noavatar.jpg'} 
                  alt={property.user?.username}
                  className="property-poster-avatar"
                />
                <span>Posted by {property.user?.username}</span>
              </div>
              <div className="meta-item">
                <Bookmark size={16} />
                <span>{property._count?.savedPosts || 0} saves</span>
              </div>
            </div>

            {property.savedPosts && property.savedPosts.length > 0 && (
              <div className="property-saves">
                <h4>Saved By</h4>
                <div className="saved-users">
                  {property.savedPosts.map(savedPost => (
                    <div key={savedPost.id} className="saved-user">
                      <img 
                        src={savedPost.user.avatar || '/noavatar.jpg'} 
                        alt={savedPost.user.username}
                        className="saved-user-avatar"
                      />
                      <span className="saved-user__name">{savedPost.user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreviewModal; 