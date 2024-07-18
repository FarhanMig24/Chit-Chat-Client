import React, { useState } from 'react';
import './Login.css';
import SmokeAnimation from './SmokeAnimation';
const ip = 'localhost';

const Register = ({ onConnect, setSocket, setIsConnected , setReg}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleRegisterClick = () =>{
    setReg(false);
};
  const handleConnect = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter both username and password before connecting.');
      return;
    }
  
    const newSocket = new WebSocket(`ws://${ip}:8080?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=${encodeURIComponent("1")}`);
  
    newSocket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      
  
      // Handling error messages
      if (parsedMessage === "1") {
        setError('No username passed.');
        setIsConnected(false);
      } else if (parsedMessage === "0" || parsedMessage === "2" ) {
        setError('User already exists');
        setIsConnected(false);
      } else if (parsedMessage === "3") {
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
          Register
        </button>
      </form>

      {/* Display error message */}
      {error && <div className="error">{error}</div>}
      <p className="reg">
        Don't have an account?{' '}
        <button className="registerButton" onClick={handleRegisterClick}>
          Login here
        </button>
      </p>
    </div>
    </>
  );
};
export default Register;
