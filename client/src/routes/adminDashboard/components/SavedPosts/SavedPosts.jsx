import React, { useState, useCallback } from 'react';
import { Eye, Trash2, Home, User, Calendar } from 'lucide-react';
import SavedPostPreviewModal from '../SavedPostPreviewModal/SavedPostPreviewModal';
import Alert from '../../../../components/alert/Alert';
import './savedPosts.scss';

const SavedPosts = ({ 
  savedPosts, 
  loading, 
  pagination, 
  onPageChange, 
  onDelete,
  onViewSavedPost 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null });
  const [selectedSavedPost, setSelectedSavedPost] = useState(null);

  const handleDelete = useCallback((id) => {
    setDeleteItem({ id });
    setShowConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteItem.id) {
      await onDelete(deleteItem.id);
      setShowConfirm(false);
      setDeleteItem({ id: null });
    }
  }, [deleteItem.id, onDelete]);

  const handleViewSavedPost = useCallback(async (savedPostId) => {
    const savedPost = await onViewSavedPost(savedPostId);
    setSelectedSavedPost(savedPost);
  }, [onViewSavedPost]);

  const handleCloseSavedPostPreview = useCallback(() => {
    setSelectedSavedPost(null);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="content-section">
      <Alert
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        message="Are you sure you want to delete this saved post?"
        btnText="Yes, Delete"
        handleAction={handleConfirmDelete}
      />

      {selectedSavedPost && (
        <SavedPostPreviewModal
          savedPost={selectedSavedPost}
          onClose={handleCloseSavedPostPreview}
        />
      )}

      <div className="saved-posts-table">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              <th>Property</th>
              <th>Saved By</th>
              <th>Type</th>
              <th>Price</th>
              <th>Saved Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill().map((_, i) => (
                <tr key={i} className="data-table__row">
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                  <td className="data-table__cell">
                    <div className="skeleton-text" />
                  </td>
                </tr>
              ))
            ) : (
              savedPosts.map(savedPost => (
                <tr key={savedPost.id} className="data-table__row">
                  <td className="data-table__cell">
                    <div className="table-property-info">
                      <img 
                        src={savedPost.post.images?.[0] || '/noavatar.jpg'} 
                        alt={savedPost.post.title}
                        className="table-property-info__image"
                      />
                      <div className="table-property-info__details">
                        <div className="table-property-info__title">
                          {savedPost.post.title}
                        </div>
                        <div className="table-property-info__location">
                          {savedPost.post.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="data-table__cell">
                    <div className="table-user-info">
                      <img 
                        src={savedPost.user.avatar || '/noavatar.jpg'} 
                        alt={savedPost.user.username}
                        className="table-user-info__avatar"
                      />
                      <div className="table-user-info__name">
                        {savedPost.user.username}
                      </div>
                    </div>
                  </td>
                  <td className="data-table__cell">
                    <span className="badge">
                      <Home size={14} />
                      {savedPost.post.type}
                    </span>
                  </td>
                  <td className="data-table__cell">
                    ${savedPost.post.price?.toLocaleString()}
                  </td>
                  <td className="data-table__cell">
                    {formatDate(savedPost.createdAt)}
                  </td>
                  <td className="data-table__cell">
                    <div className="content-actions">
                      <button
                        className="btn"
                        onClick={() => handleViewSavedPost(savedPost.id)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(savedPost.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.current - 1)}
            disabled={pagination.current <= 1}
            className="pagination__btn"
          >
            Previous
          </button>
          <div className="pagination__info">
            <span className="pagination__current">
              Page {pagination.current}
            </span>
            <span className="pagination__total">
              of {pagination.total}
            </span>
          </div>
          <button
            onClick={() => onPageChange(pagination.current + 1)}
            disabled={pagination.current >= pagination.total}
            className="pagination__btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedPosts; 