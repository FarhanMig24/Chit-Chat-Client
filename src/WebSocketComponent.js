import React, { useState, useEffect } from 'react';
import './des.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
const WebSocketComponent = ({ username, password, profilePic, socket, isConnected, setSocket, setUsername, setPassword }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const getColorForUsername = (username) => {
    const hash = username
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = `hsl(${hash % 360}, 70%, 80%)`;
    return color;
  };

  useEffect(() => {
    // Load state from sessionStorage on component mount
    const storedMessages = sessionStorage.getItem('messages');
    const storedMessageInput = sessionStorage.getItem('messageInput');
    const storedUsername = sessionStorage.getItem('chatUsername');
    const storedPassword = sessionStorage.getItem('chatPassword');
    const storedSocket = sessionStorage.getItem('chatSocket');

    if (storedMessages && storedMessageInput && storedUsername && storedPassword && storedSocket) {
      setMessages(JSON.parse(storedMessages));
      setMessageInput(JSON.parse(storedMessageInput));
      setUsername(storedUsername);
      setPassword(storedPassword);

      // Reconnect WebSocket if needed
      if (!socket && storedSocket) {
        const newSocket = new WebSocket(storedSocket);
        setSocket(newSocket);
      }
    }

    if (socket) {
      const handleIncomingMessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      };

      socket.addEventListener('message', handleIncomingMessage);

      return () => {
        socket.removeEventListener('message', handleIncomingMessage);
      };
    }
  }, [socket, setUsername, setPassword, setSocket]);

  useEffect(() => {
    // Save state to sessionStorage on state change
    sessionStorage.setItem('messages', JSON.stringify(messages));
    sessionStorage.setItem('messageInput', JSON.stringify(messageInput));
    sessionStorage.setItem('chatUsername', username);
    sessionStorage.setItem('chatPassword', password);
    sessionStorage.setItem('chatSocket', socket ? socket.url : null);
  }, [messages, messageInput, username, password, socket]);

  useEffect(() => {
    const messagesList = document.querySelector('.messagesList');
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (socket && messageInput.trim() !== '') {
      socket.send(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="pageContainer2">
      <div className="chatContainer2">
        {isConnected && (
          <div className="chatBox">
            <ul className="messagesList">
              {messages.map((message, index) => (
                <li key={index} className={getMessageStyle(message.type)}>
                  {
                    message.type === 'message' || message.type === 'directMessage' ? (
                      <>
                        <div className={`${message.type === 'directMessage' ? 'my' : ''}profileContainer`}>
                          {profilePic ? (
                            <img src={profilePic} alt="Profile" className="profilePic" />
                          ) : (
                            <div
                              className={`defaultProfilePic ${message.type === 'directMessage' ? 'my' : ''}`}
                              style={{ backgroundColor: getColorForUsername(message.username) }}
                            >
                              {message.username[0]}
                            </div>
                          )}
                          <div className={`username${message.type === 'directMessage' ? 'my' : ''}`}>
                            {username === message.username ? 'Me' : message.username}
                          </div>
                        </div>
                        {message.type === 'directMessage' ? (
                          <div className={`myMessageContent`}>
                            <div className={`myContent`}>{message.content}</div>
                            <div className={`myTimestamp`}>{formatTimestamp(new Date())}</div>
                          </div>
                        ) : (
                          <div className={`messageContent`}>
                            <div className={`content`}>{message.content}</div>
                            <div className={`timestamp`}>{formatTimestamp(new Date())}</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={getMessageStyle(message.type)}>{message.content}</div>
                    )
                  }
                </li>
              ))}
            </ul>
          </div>
        )}
        {isConnected && (
          <div className="inputContainer">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="input"
            />
            <button onClick={sendMessage} className="button">
            <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const getMessageStyle = (messageType) => {
  switch (messageType) {
    case 'welcome':
    case 'add':
      return 'welcomeAddMessage';
    case 'left':
      return 'leftMessage';
    case 'message':
      return 'messageItem';
    case 'directMessage':
      return 'messageItem';
    default:
      return 'defaultMessage';
  }
};

const formatTimestamp = (timestamp) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  return new Date(timestamp).toLocaleTimeString([], options);
};

export default WebSocketComponent;
