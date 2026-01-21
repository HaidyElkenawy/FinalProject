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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

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
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data);
        const unread = data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleReadNotifications = async () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown && unreadCount > 0) {
      try {
        await API.patch('/notifications/mark-all');
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Failed to mark read", err);
      }
    }
  };

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
      {/* LOGO */}
      <Link to="/feed" style={{ textDecoration: 'none' }}>
        <h2 className="navbar-logo">SocialApp</h2>
      </Link>

      {/* SEARCH BAR */}
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
                      <img src={getImageUrl(u.profilePicture)} alt="user" />
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
                      <img src={getImageUrl(p.userId.profilePicture)} alt="author" />
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

      {/* RIGHT SIDE: NOTIFICATIONS & PROFILE*/}
      <div className="navbar-user">
        {user ? (
          <>
             {/* NOTIFICATIONS */}
             <div className="notif-container" style={{ position: 'relative', marginRight: '15px' }}>
               <button 
                 onClick={handleReadNotifications} 
                 className="notif-btn" 
                 style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
               >
                 🔔
                 {unreadCount > 0 && (
                   <span className="notif-badge">{unreadCount}</span>
                 )}
               </button>

               {showNotifDropdown && (
                 <div className="notif-dropdown">
                    <h4>Notifications</h4>
                    {notifications.length === 0 ? (
                        <p style={{padding: '10px', color: '#777', textAlign: 'center'}}>No notifications.</p>
                    ) : (
                        <div className="notif-list">
                             {notifications.map((n) => (
                              <div 
                                key={n._id} 
                                className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={async () => {
                                  try {
                                      if (!n.isRead) {
                                          await API.patch(`/notifications/${n._id}`);
                                          setUnreadCount(prev => Math.max(0, prev - 1));
                                          setNotifications(prev => prev.map(notif => 
                                             notif._id === n._id ? { ...notif, isRead: true } : notif
                                          ));
                                      }
                                      setShowNotifDropdown(false);
                                      
                                      if (n.postId) {
                                         const targetId = n.postId._id ;
                                         navigate(`/post/${targetId}`);
                                      }
                                  } catch (err) {
                                      console.error("Failed to process notification", err);
                                  }
                                }}
                              >
                                  <strong>{n.senderId.username}</strong> 
                                  {n.type === 'like' ? ' liked your post.' : ' commented on your post.'}
                                  <br/>
                                  <span style={{fontSize: '0.75rem', color: '#888'}}>
                                    {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                              </div>
                             ))}
                        </div>
                    )}
                 </div>
               )}
            </div>

            {userId ? (
              <Link 
                to={`/profile/${userId}`} 
                className="nav-profile-link"
                title="Go to Profile"
              >
                 <img 
                   src={getImageUrl(user.profilePicture)}
                   alt="Profile"
                   className="nav-avatar"
                 />
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