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
                src={user?.avatar || '/noavatar.jpg'} 
                alt={user?.username}
                className="message-preview-user-avatar"
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
              <div className="chat-info__content">
                <div className="chat-info__meta">
                  <div className="chat-info__detail">
                    <MessageSquare size={16} />
                    <span>Chat #{chat?.id}</span>
                  </div>
                  <div className="chat-info__detail">
                    <User size={16} />
                    <span>{chat?.users?.length || 0} participants</span>
                  </div>
                  <div className="chat-info__detail">
                    <Calendar size={16} />
                    <span>Created {new Date(chat?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="chat-info__messages">
                  <div className="chat-info__message-count">
                    <MessageSquare size={16} />
                    <span>{chat?._count?.messages || 0} messages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreviewModal; 