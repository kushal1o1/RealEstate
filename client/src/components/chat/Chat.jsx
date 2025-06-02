import { useState,useEffect,useRef } from "react";
import "./chat.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useToast } from "../../context/ToastContext";
import apiRequest from "../../lib/apiRequest";
import {format} from "timeago.js";
import { useNotificationStore } from "../../lib/notificationStore";
import {formatNepaliPrice} from "../../utils/formatUtils"

function Chat({chats}) {
  const [chat, setChat] = useState(null);
  const {currentUser} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);
  const { showToast } = useToast();

  const messageEndRef = useRef();
    useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const decrease = useNotificationStore((state) => state.decrease);
  // console.log(chats)
  const handleOpenChat = async (id,receiver) => {
    try {
     const res = await apiRequest.get('chats/' + id);
     if (!res.data) {
       throw new Error('No chat data received');
     }
      if(!res.data.seenBy.includes(currentUser.id)){
       decrease();
      }
      setChat({...res.data,receiver});
     
    } catch (err) {
      console.error('Error opening chat:', err);
      showToast(err.response?.data?.message || "Failed to open chat", 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      // For system messages (initial property reference), we need to set isSystemMessage
      const isSystemMessage = chat.messages.length === 0 && chat.propertyDetails;
      
      const res = await apiRequest.post("/messages/" + chat.id, { 
        text,
        isSystemMessage 
      });

      if (!res.data) {
        throw new Error('No response data received');
      }

      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      
      // Only emit socket event for non-system messages
      if (!isSystemMessage) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      showToast(err.response?.data?.message || "Failed to send message", 'error');
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  const isSystemMessage = (text) => text.startsWith('🏠 Property Reference');
  const extractPropertyInfo = (text) => {
    const lines = text.split('\n');
    const propertyLink = lines.find(line => line.startsWith('Property Link:'))?.replace('Property Link:', '').trim();
    const propertyImage = lines.find(line => line.startsWith('Property Image:'))?.replace('Property Image:', '').trim();
    return { propertyLink, propertyImage };
  };

  return (
    <div className="chat">
      <div className="admin-notice">
        <div className="admin-notice__icon">!</div>
        <p>All messages are visible to administrators for moderation purposes.</p>
      </div>

      <div className="messages">
        <h1>Messages</h1>
        {Array.isArray(chats) && console.log('Chats array:', chats)}
        {Array.isArray(chats) && chats?.map((c) => {
          const receiver = c.users?.find(user => user.id !== currentUser.id);
          const hasPropertyDetails = c.propertyDetails?.id && c.propertyDetails?.title;
          
          return (
            <div 
              className="message" 
              key={c.id}
              style={{
                backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
              }}
              onClick={() => handleOpenChat(c.id, receiver)}
            >
              <img
                src={receiver?.avatar || './noavatar.jpg'}
                alt=""
              />
              <div className="chat-message-content">
                <div className="message-header">
                  <span className="username">{receiver?.username}</span>
                </div>
                <p className="last-message">{c.lastMessage}</p>
                {hasPropertyDetails && (
                  <div className="property-reference-preview">
                    <div className="property-image">
                      <img 
                        src={c.propertyDetails.image} 
                        alt={c.propertyDetails.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/post/${c.propertyDetails.id}`, '_blank');
                        }}
                      />
                    </div>
                    <div className="property-info">
                      <span className="property-title">{c.propertyDetails.title}</span>
                      <span className="property-price">{formatNepaliPrice(c.propertyDetails.price)}</span>
                      <span className="property-address">{c.propertyDetails.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {chat && console.log('Current chat:', chat)}
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver?.avatar || './noavatar.jpg'}
                alt=""
              />
              <div className="chat-user-info">
                <span className="username">{chat.receiver?.username}</span>
                {chat.propertyDetails?.id && (
                  <div className="property-reference-header">
                    <div className="property-image">
                      <img 
                        src={chat.propertyDetails.image} 
                        alt={chat.propertyDetails.title}
                        onClick={() => window.open(`/post/${chat.propertyDetails.id}`, '_blank')}
                      />
                    </div>
                    <div className="property-info">
                      <span className="property-title">{chat.propertyDetails.title}</span>
                      <span className="property-price">{formatNepaliPrice(chat.propertyDetails.price)}</span>
                      <span className="property-address">{chat.propertyDetails.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="close" onClick={() => setChat(null)}>×</span>
          </div>
          
          <div className="center">
            {chat.messages.map((message) => {
              const isSystem = isSystemMessage(message.text);
              const { propertyLink, propertyImage } = isSystem ? extractPropertyInfo(message.text) : {};
              const displayText = isSystem ? message.text.split('\nProperty Link:')[0] : message.text;
              const isOwnMessage = message.userId === currentUser.id;

              return (
                <div 
                  className={`chatMessage ${isOwnMessage ? "own" : ""} ${isSystem ? "system" : ""}`}
                  key={message.id}
                >
                  {isSystem ? (
                    <div className="system-message">
                      <div className="property-preview">
                        {propertyImage && (
                          <div className="property-image-container">
                            <img 
                              src={propertyImage} 
                              alt="Property" 
                              className="property-image"
                              onClick={() => window.open(propertyLink, '_blank')}
                            />
                            <div className="property-image-overlay">
                              <span>Click to view property</span>
                            </div>
                          </div>
                        )}
                        <div className="property-details">
                          {displayText.split('\n').map((line, index) => (
                            <p key={index} className={index === 0 ? 'property-title' : 'property-detail'}>
                              {line}
                            </p>
                          ))}
                          {propertyLink && (
                            <a 
                              href={propertyLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="view-property-link"
                            >
                              <img src="/link.png" alt="link" className="link-icon" />
                              View Full Property Details
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="message-time">{format(message.createdAt)}</span>
                    </div>
                  ) : (
                    <>
                      <p>{displayText}</p>
                      <span className="message-time">{format(message.createdAt)}</span>
                    </>
                  )}
                </div>
              );
            })}
            <div ref={messageEndRef}></div>
          </div>
          
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..."></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;