import React, { useState, useEffect } from 'react';
import WebSocketComponent from './WebSocketComponent';
import './Chat.css';
const ip ='localhost';

const Chat = ({ username, password, setSocket, socket, setUsername, setPassword }) => {

  useEffect(() => {
    // Load state from sessionStorage on component mount
    const storedIsConnected = sessionStorage.getItem('isConnected');
    const storedIsPrivate = sessionStorage.getItem('isPrivate');
    const storedRoomId = sessionStorage.getItem('roomId');
    const storedCreateRoom = sessionStorage.getItem('createRoom');
    const storedRoomExists = sessionStorage.getItem('roomExists');
    const storedPvtRoom = sessionStorage.getItem('pvtRoom');

    if (storedIsConnected && storedIsPrivate && storedRoomId && storedCreateRoom && storedRoomExists && storedPvtRoom) {
      setIsConnected(JSON.parse(storedIsConnected));
      setIsPrivate(JSON.parse(storedIsPrivate));
      setRoomId(storedRoomId);
      setCreateRoom(JSON.parse(storedCreateRoom));
      setRoomExists(JSON.parse(storedRoomExists));
      setpvtRoom(JSON.parse(storedPvtRoom));
    }
  }, []);




  const [isConnected, setIsConnected] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomId, setRoomId] = useState('00000');
  const [createRoom, setCreateRoom] = useState(false);
  const [roomExists, setRoomExists] = useState(false);
  const [pvtRoom, setpvtRoom] = useState(false);
  const establishpvtConnection = () => {
    if (username.trim() === '') {
      alert('Please enter a username and room ID before connecting.');
      return;
    }
    const newSocket = new WebSocket(`ws://${ip}:8080?username=${encodeURIComponent(username)}&roomid=${encodeURIComponent(roomId)}&password=${encodeURIComponent(password)}&action=${encodeURIComponent('2')}`);
    newSocket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      console.log(parsedMessage);
     
      if (parsedMessage === '1') {
        window.alert("room exists");
        setRoomExists(true);
      } else {
        window.alert("room not exists");
        setRoomExists(false);
        setCreateRoom(true);
      }
    };
    setSocket(newSocket);
    setIsConnected(true);
  };

  const establishConnection = () => {
    if (username.trim() === '' || (isPrivate && roomId.trim() === '')) {
      alert('Please enter a username and room ID before connecting.');
      return;
    }
    const newSocket = new WebSocket(`ws://${ip}:8080?username=${encodeURIComponent(username)}&roomid=${encodeURIComponent(roomId)}&password=${encodeURIComponent(password)}`);
    console.log("public2");
    setSocket(newSocket);
    setIsConnected(true);
    setIsPrivate(false);
    sessionStorage.setItem('isConnected', true);
    sessionStorage.setItem('isPrivate', isPrivate);
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('createRoom', createRoom);
    sessionStorage.setItem('roomExists', roomExists);
    sessionStorage.setItem('pvtRoom', pvtRoom);
  };


  const checkConnection = () => {
    establishpvtConnection();
  };
  const handlePublicRoom = () => {
    console.log("public");
    setIsPrivate(false);
    setRoomId('00000');
    establishConnection();
  };

  const handlePrivateRoom = () => {
    setIsConnected(true);
    setIsPrivate(true);
    setRoomExists(false); 
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };
  const handleJoinRoom = () => {
    setCreateRoom(false);
    setpvtRoom(true);
    
    establishConnection();
    sessionStorage.setItem('isPrivate', isPrivate);
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('isConnected', true);
    sessionStorage.setItem('createRoom', createRoom);
    sessionStorage.setItem('roomExists', roomExists);
    sessionStorage.setItem('pvtRoom', pvtRoom);
  };

  return (
    <div className="pageContainer"> 
      <div className="header">
      <img src="logo_black_close.jpg" alt="logo" width="120" height="120" />
      </div>
      { !(isConnected && (!isPrivate || pvtRoom)) && (
         <>
         <div class="stars1"></div>
         <div class="stars2"></div>
         <div class="stars3"></div>
         <div class="stars4"></div>
         </>
      )}
         
        
       
        {!isConnected && (
          <div className="roomSelection">
            <button className="pubbutton" onClick={handlePublicRoom}>Public Room</button>
            <button className="pvtbutton" onClick={handlePrivateRoom}>Private Room</button>
          </div>
          
        )}

        {isConnected && isPrivate && !roomExists && !createRoom && (
          <div className="privateRoomForm">
            <label htmlFor="roomId">Enter Room ID:</label>
            <input type="text" id="roomId" value={roomId} onChange={handleRoomIdChange} />
            <button onClick={checkConnection}>Check Room</button>
            <button onClick={() => setIsConnected(false) }>Back</button>
          </div>
        )}

        {isConnected && isPrivate && roomExists && (
          <div className="privateRoomForm2">
            {/* Your logic for rendering private room component goes here */}
            <button onClick={establishConnection}>Join Room</button>
            <button onClick={() => setRoomExists(false)}>Cancel</button>
          </div>
        )}

        {isConnected && isPrivate && !roomExists && createRoom && (
          <div className="createRoomForm">
            <p>Room ID does not exist. Do you want to create a room with this ID?</p>
            <button onClick={handleJoinRoom}>Create Room</button>
            <button onClick={() => setCreateRoom(false)}>Cancel</button>
          </div>
        )}
      

      {isConnected && (!isPrivate || pvtRoom) && (
        <div className="chatContainer">
          <WebSocketComponent username={username} password={password} socket={socket} setIsConnected={setIsConnected} isConnected={isConnected} setUsername={setUsername} setPassword={setPassword} setSocket={setSocket}/>
        </div>
      )}
    </div>
  );
};

export default Chat;
