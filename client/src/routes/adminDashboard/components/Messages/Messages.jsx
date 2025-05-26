import React, { useState, useCallback } from 'react';
import { Eye, Trash2, User, MessageSquare, Calendar } from 'lucide-react';
import MessagePreviewModal from '../MessagePreviewModal/MessagePreviewModal';
import Alert from '../../../../components/alert/Alert';
import './messages.scss';

const Messages = ({ 
  messages, 
  loading, 
  pagination, 
  onPageChange, 
  onDelete,
  onViewMessage 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null });
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const handleViewMessage = useCallback(async (messageId) => {
    const message = await onViewMessage(messageId);
    setSelectedMessage(message);
  }, [onViewMessage]);

  const handleCloseMessagePreview = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="content-section">
      <Alert
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        message="Are you sure you want to delete this message?"
        btnText="Yes, Delete"
        handleAction={handleConfirmDelete}
      />

      {selectedMessage && (
        <MessagePreviewModal
          message={selectedMessage}
          onClose={handleCloseMessagePreview}
        />
      )}

      <div className="messages-table">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              <th>Chat</th>
              <th>Sender</th>
              <th>Message</th>
              <th>Date</th>
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
                </tr>
              ))
            ) : (
              messages.map(message => (
                <tr key={message.id} className="data-table__row">
                  <td className="data-table__cell">
                    <div className="chat-info">
                      <MessageSquare size={16} className="chat-info__icon" />
                      <span className="chat-info__id">Chat #{message.chatId}</span>
                    </div>
                  </td>
                  <td className="data-table__cell">
                    <div className="user-info">
                      <img 
                        src={message.user?.avatar || '/placeholder.png'} 
                        alt={message.user?.username}
                        className="user-info__avatar"
                      />
                      <div className="user-info__name">
                        {message.user?.username}
                      </div>
                    </div>
                  </td>
                  <td className="data-table__cell">
                    <div className="message-preview">
                      {message.text.length > 50 
                        ? `${message.text.substring(0, 50)}...` 
                        : message.text}
                    </div>
                  </td>
                  <td className="data-table__cell">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="data-table__cell">
                    <div className="content-actions">
                      <button
                        className="btn"
                        onClick={() => handleViewMessage(message.id)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(message.id)}
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

export default Messages; 