import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/feed" style={{ textDecoration: 'none' }}>
        <h2 className="navbar-logo">SocialApp</h2>
      </Link>

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
                     src={`http://localhost:5000/${user.profilePicture.replace(/\\/g, "/")}`}
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