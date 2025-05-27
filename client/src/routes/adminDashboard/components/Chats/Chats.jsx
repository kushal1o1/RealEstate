import React, { useState, useCallback } from 'react';
import { Eye, Trash2, MessageSquare, Users, Clock } from 'lucide-react';
import ChatPreviewModal from '../ChatPreviewModal/ChatPreviewModal';
import Alert from '../../../../components/alert/Alert';
import './chats.scss';

const Chats = ({ 
  chats, 
  loading, 
  pagination, 
  onPageChange, 
  onDelete,
  onViewChat 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null });
  const [selectedChat, setSelectedChat] = useState(null);

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

  const handleViewChat = useCallback(async (chatId) => {
    const chat = await onViewChat(chatId);
    setSelectedChat(chat);
  }, [onViewChat]);

  const handleCloseChatPreview = useCallback(() => {
    setSelectedChat(null);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="content-section">
      <Alert
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        message="Are you sure you want to delete this chat?"
        btnText="Yes, Delete"
        handleAction={handleConfirmDelete}
      />

      {selectedChat && (
        <ChatPreviewModal
          chat={selectedChat}
          onClose={handleCloseChatPreview}
        />
      )}

      <div className="chats-table">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              <th>Participants</th>
              <th>Last Message</th>
              <th>Messages</th>
              <th>Created</th>
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
              chats.map(chat => (
                <tr key={chat.id} className="data-table__row">
                  <td className="data-table__cell">
                    <div className="chat-participants">
                      {chat.users.map(user => (
                        <div key={user.id} className="chat-participant">
                          <img 
                            src={user.avatar || '/noavatar.jpg.png'} 
                            alt={user.username}
                            className="chat-participant__avatar"
                          />
                          <span className="chat-participant__name">
                            {user.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="data-table__cell">
                    {chat.messages[0] ? (
                      <div className="last-message">
                        <div className="last-message__text">
                          {chat.messages[0].text}
                        </div>
                        <div className="last-message__time">
                          <Clock size={12} />
                          {formatTime(chat.messages[0].createdAt)}
                        </div>
                      </div>
                    ) : (
                      <span className="no-messages">No messages yet</span>
                    )}
                  </td>
                  <td className="data-table__cell">
                    <span className="badge">
                      <MessageSquare size={14} />
                      {chat._count?.messages || 0}
                    </span>
                  </td>
                  <td className="data-table__cell">
                    {formatDate(chat.createdAt)}
                  </td>
                  <td className="data-table__cell">
                    <div className="content-actions">
                      <button
                        className="btn"
                        onClick={() => handleViewChat(chat.id)}
                        title="View Chat"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(chat.id)}
                        title="Delete Chat"
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

export default Chats; 