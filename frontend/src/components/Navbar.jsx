import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; 
import './Navbar.css';

const getImageUrl = (path) => {
  if (!path) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const { data } = await API.get(`/users/search?searchtext=${query}`);
          setResults(data); 
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setResults({ users: [], posts: [] });
        setShowDropdown(false);
      }
    }, 100); 

    return () => clearTimeout(timer);
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const handleLinkClick = () => {
    setShowDropdown(false);
    setQuery(""); 
  };

  return (
    <nav className="navbar">
      <Link to="/feed" style={{ textDecoration: 'none' }}>
        <h2 className="navbar-logo">SocialApp</h2>
      </Link>

      {user && (
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search friends or posts..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            onFocus={() => query && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
          />
          
        
          {showDropdown && (results.users.length > 0 || results.posts.length > 0) && (
            <div className="search-dropdown">
              
            
              {results.users.length > 0 && (
                <div className="search-section">
                  <h4 className="search-header">People</h4>
                  {results.users.map((u) => (
                    <Link 
                      to={`/profile/${u._id}`} 
                      key={u._id} 
                      className="search-result-item"
                      onClick={handleLinkClick}
                    >
                      <img 
                        src={getImageUrl(u.profilePicture)} 
                        alt="user" 
                      />
                      <span>{u.username}</span>
                    </Link>
                  ))}
                </div>
              )}

           
              {results.posts.length > 0 && (
                <div className="search-section">
                  <h4 className="search-header">Posts</h4>
                  {results.posts.map((p) => (
                    <Link 
                      to={`/profile/${p.userId._id}`} 
                      key={p._id} 
                      className="search-result-item post-result"
                      onClick={handleLinkClick}
                    >
                      <img 
                        src={getImageUrl(p.userId.profilePicture)} 
                        alt="author" 
                      />
                      <div className="search-post-info">
                        <span className="search-post-author">{p.userId.username}</span>
                        <span className="search-post-text">
                          {p.desc.length > 30 ? p.desc.substring(0, 30) + "..." : p.desc}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

   
      <div className="navbar-user">
        {user ? (
          <>
            {userId ? (
              <Link 
                to={`/profile/${userId}`} 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {user.profilePicture && (
                   <img 
                     src={getImageUrl(user.profilePicture)}
                     alt="avatar"
                     style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                   />
                )}
                
              </Link>
            ) : (
              <span style={{ fontWeight: 'bold' }}>{user.username}</span>
            )}

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;