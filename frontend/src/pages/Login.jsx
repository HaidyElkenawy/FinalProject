import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { authStart, authSuccess, authFailure, clearError } from '../store/slices/authSlice';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error } = useSelector((state) => state.auth);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(authSuccess(data));
      navigate('/feed');
    } catch (err) {
      dispatch(authFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="redirect-text">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;