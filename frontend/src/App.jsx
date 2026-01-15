import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Default route: Show Login page */}
        <Route path="/" element={<Login />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </div>
  );
}

export default App;