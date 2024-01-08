import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css"

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/register', { username, password });
      alert("User registered successfully");
      navigate("/login")
    } catch (error) {
      setError('Error during registration. Please try again.');
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div className='auth_container'>
      <div className="login_form">
        <div className="card">
          <h2 >Register</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} className='input_form' />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} className='input_form' />
            <br />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='input_form' />
            <br />
            {<div style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center" }}>
              <button type="submit">Register</button>
              <div className='divider' style={{ borderRight: "1px solid gray", width: 1, alignSelf: "stretch" }}></div>
              <div style={{ marginLeft: 10 }}>Already a user?</div> <button type="button" style={{ background: "#195de6" }} onClick={() => { navigate("/login") }}>Sign In</button></div>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
