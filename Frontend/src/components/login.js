import React, { useState } from 'react';
import axios from 'axios';
import logo from './image/Logo.svg';
import Card from '@mui/material/Card';
//import CardContent from '@mui/material/CardContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/style.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Assuming backend returns a token upon successful login
      const { token } = response.data;
      localStorage.setItem('token', token);


      // Redirect or update state to indicate successful login
      setError('');
      console.log('Login successful');
      navigate('/projectcounter');
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        setError(err.response.data.message);
        console.error('Invalid credentials:', err.response.data.message);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server');
        console.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error in request setup');
        console.error('Error in request setup:', err.message);
      }
    }
  };

  return (
    <div className='container bglogin'>
      <div className='logoimg'>
        <img src={logo} alt="logo" className='mt-4' />
      </div>
      <h6 className='text-center my-4 text-white'>Online Project Management</h6>
      <div className="logcol">
        <form onSubmit={handleLogin}>
          <Card sx={{ minWidth: 275 }} className='logincard'>
            <p className='text-center mb-4'>Login to get started</p>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mt-4'>
              <label>Password</label>
              <input
                type="password"
                className='form-control'
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='btn btn-primary mt-5'>Login</button>
          </Card>
        </form>
      </div>
      <div className="error-message">
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
