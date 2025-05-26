import React from 'react';
import { X, User, MessageSquare, Calendar } from 'lucide-react';
import './messagePreviewModal.scss';

const MessagePreviewModal = ({ message, onClose }) => {
  if (!message) return null;

  const { user, chat } = message;

  return (
    <div className="modal-overlay">
      <div className="message-preview-modal">
        <div className="message-preview-modal__header">
          <h2 className="message-preview-modal__title">Message Details</h2>
          <button className="message-preview-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="message-preview-modal__content">
          <div className="message-preview-modal__message">
            <div className="message-content">
              <h3 className="message-content__title">Message Content</h3>
              <div className="message-content__text">
                {message.text}
              </div>
              <div className="message-content__meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Sent on {new Date(message.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="message-preview-modal__sender">
            <h3 className="message-preview-modal__subtitle">
              <User size={16} />
              Sender Information
            </h3>
            <div className="user-info">
              <img 
                src={user?.avatar || '/placeholder.png'} 
                alt={user?.username}
                className="user-info__avatar"
              />
              <div className="user-info__details">
                <div className="user-info__name">{user?.username}</div>
                <div className="user-info__email">{user?.email}</div>
              </div>
            </div>
          </div>

          <div className="message-preview-modal__chat">
            <h3 className="message-preview-modal__subtitle">
              <MessageSquare size={16} />
              Chat Information
            </h3>
            <div className="chat-info">
              <div className="chat-info__id">Chat #{chat?.id}</div>
              <div className="chat-info__participants">
                {chat?.userIDs?.length || 0} participants
              </div>
              <div className="chat-info__status">
                {chat?.seenBy?.includes(user?.id) ? 'Seen' : 'Not seen'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreviewModal; 