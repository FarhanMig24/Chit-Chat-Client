import React, { useState } from 'react';
import './Login.css';
import SmokeAnimation from './SmokeAnimation.js';
const ip = 'localhost';

const Login = ({ onConnect, setSocket, setIsConnected , setReg}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleRegisterClick = () =>{
      setReg(true);
  };
  const handleConnect = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter both username and password before connecting.');
      return;
    }
    const newSocket = new WebSocket(`ws://${ip}:8080?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=${encodeURIComponent("0")}`);
  
    newSocket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
  
      // Handling error messages
      if (parsedMessage === "1") {
        setError('No username passed.');
        setIsConnected(false);
      } else if (parsedMessage === "2") {
        setError('Wrong password.');
        setIsConnected(false);
      } else if (parsedMessage === "3") {
        setError('Wrong credentials.');
        setIsConnected(false);
      } else if (parsedMessage === "0") {
        // Successful login
        setError('');
        setIsConnected(true);
        onConnect(username, password);
      }
      newSocket.close();
    };
  

    
  };

  return (
    <>
    <SmokeAnimation/>
    <div className="loginbody">
      <div className="loginimg">
        <img src="logo_black-removebg.png" alt="logo" width="300" height="300" />
      </div>
      <form id="loginForm" className="loginform" onSubmit={handleConnect}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          className="logincred"
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="logincred"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <button className="loginbutton" type="submit">
          Login
        </button>
      </form>

      {/* Display error message */}
      {error && <div className="error">{error}</div>}


      <p className="reg">
        Don't have an account?{' '}
        <button className="registerButton" onClick={handleRegisterClick}>
          Register here
        </button>
      </p>
    </div>
    </>
  );
};

export default Login;
