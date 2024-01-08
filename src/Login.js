import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"
import { AppContext } from './App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useContext(AppContext)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      if (!response?.data.auth) setIsLoggedIn(false);
      else {
        setIsLoggedIn(true);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
      }

      if (response)
        navigate("/feedback");

    } catch (error) {
      setError('Invalid username or password.');
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className='auth_container'>
      <div className="login_form">
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} className='input_form' />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} className='input_form' />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {<div style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center" }}>
              <button type="submit">Login</button>
              <div className='divider' style={{ borderRight: "1px solid gray", width: 1, alignSelf: "stretch" }}></div>
              <div style={{ marginLeft: 10 }}>Not a user?</div> <button type="button" style={{ background: "#195de6" }} onClick={() => { navigate("/Register") }}>Sign Up</button></div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
