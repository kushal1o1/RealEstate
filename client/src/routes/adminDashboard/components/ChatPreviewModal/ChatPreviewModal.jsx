import React from 'react';
import { X, User, MessageSquare, Clock } from 'lucide-react';
import './chatPreviewModal.scss';

const ChatPreviewModal = ({ chat, onClose }) => {
  if (!chat) return null;

  return (
    <div className="modal-overlay">
      <div className="chat-preview-modal">
        <div className="chat-preview-modal__header">
          <h2 className="chat-preview-modal__title">Chat Details</h2>
          <button className="chat-preview-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-preview-modal__content">
          <div className="chat-preview-modal__participants">
            <h3 className="chat-preview-modal__subtitle">
              <User size={16} />
              Participants
            </h3>
            <div className="participants-list">
              {chat.users.map(user => (
                <div key={user.id} className="participant-item">
                  <img 
                    src={user.avatar || '/noavatar.jpg'} 
                    alt={user.username} 
                    className="participant-item__avatar"
                  />
                  <div className="participant-item__info">
                    <div className="participant-item__name">{user.username}</div>
                    <div className="participant-item__email">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-preview-modal__messages">
            <h3 className="chat-preview-modal__subtitle">
              <MessageSquare size={16} />
              Messages ({chat._count?.messages || 0})
            </h3>
            <div className="messages-list">
              {chat.messages.map(message => (
                <div key={message.id} className="message-item">
                  <div className="message-item__header">
                    <span className="message-item__sender">
                      {message.user?.username || 'Unknown User'}
                    </span>
                    <span className="message-item__time">
                      <Clock size={12} />
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-item__content">{message.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreviewModal; 