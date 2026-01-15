import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { authStart, authSuccess, authFailure } from '../store/slices/authSlice';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const { data } = await API.post('/auth/register', {
        username,
        email,
        password,
      });

      // Save to LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(authSuccess(data));
      navigate('/login');
    } catch (err) {
      dispatch(authFailure(err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join our community today</p>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="redirect-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;