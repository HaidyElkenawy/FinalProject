import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Default route / Placeholder for the Feed */}
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Social Media Platform</h1>
            <p>Please <a href="/login">Login</a> or <a href="/register">Register</a></p>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;