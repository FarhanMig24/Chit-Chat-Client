import React, { useState, useEffect } from 'react';
import Login from './Login';
import Chat from './Chat';
import './des.css';
import Register from './Register';

const Parent = () => {
  // Load state from local storage on component mount
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem('loggedIn');
    const storedReg = sessionStorage.getItem('reg');
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');

    if (storedLoggedIn && storedReg && storedUsername && storedPassword) {
      setLoggedIn(JSON.parse(storedLoggedIn));
      setReg(JSON.parse(storedReg));
      setUsername(storedUsername);
      setPassword(storedPassword);
    }
  }, []);

  const [loggedIn, setLoggedIn] = useState(false);
  const [reg, setReg] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (user, pass) => {
    // Update state
    setUsername(user);
    setPassword(pass);
    setLoggedIn(true);

    // Store state in local storage
    sessionStorage.setItem('loggedIn', true);
    sessionStorage.setItem('reg', reg);
    sessionStorage.setItem('username', user);
    sessionStorage.setItem('password', pass);
  };

  return (
    <div>
      {loggedIn ? (
        <Chat
          username={username}
          password={password}
          setSocket={setSocket}
          setIsConnected={setIsConnected}
          socket={socket}
          isConnected={isConnected}
          setUsername = {setUsername}
          setPassword={setPassword}
        />
      ) : (
        <>
          {reg ? (
            <Register
              onConnect={handleConnect}
              setSocket={setSocket}
              setIsConnected={setIsConnected}
              setReg={setReg}
            />
          ) : (
            <Login
              onConnect={handleConnect}
              setSocket={setSocket}
              setIsConnected={setIsConnected}
              setReg={setReg}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Parent;
