import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/Feed/PostCard';
import './Profile.css';
import EditProfileModal from '../components/EditProfileModal';
import { setPosts } from '../store/slices/postSlice';

const Profile = () => {
  const { userId } = useParams(); 
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts); 
  const userPosts = Array.isArray(posts) ? posts : [];
  console.log("RENDER -> UserPosts Length:", userPosts.length);

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const currentUserId = currentUser?._id || currentUser?.id;
  
  const getImageUrl = (path) => {
    if (!path) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userRes = await API.get(`/users/${userId}`);
        setUserProfile(userRes.data);
        const postsRes = await API.get(`/posts/user/${userId}`);
        
        let fetchedPosts = [];
        if (postsRes.data && Array.isArray(postsRes.data.posts)) {
            fetchedPosts = postsRes.data.posts;
        } else if (Array.isArray(postsRes.data)) {
            fetchedPosts = postsRes.data;
        }
        dispatch(setPosts(fetchedPosts));
        
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
        fetchProfileData();
    }
  }, [userId, dispatch]);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Profile...</div>;
  if (!userProfile) return <div style={{textAlign: 'center', marginTop: '50px'}}>User not found</div>;

  const isOwner = currentUserId === userProfile._id;

  return (
    <div className="profile-container">
      <Navbar />
      
      <div className="profile-content">
        <div className="profile-header">
          <div className="cover-photo">
            <img 
               src="data:image/jpeg;base64,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" 
               alt="Cover" 
            />
          </div>
          <div className="profile-info">
            <img 
              src={getImageUrl(userProfile.profilePicture)} 
              alt="Profile" 
              className="profile-avatar" 
            />
            <div className="profile-text">
              <h2>{userProfile.username}</h2>
              <div className="stats">
                <span><strong>{userPosts.length}</strong> Posts</span>
                <span><strong>{userProfile.friends?.length || 0}</strong> Friends</span>
              </div>
            </div>
            
            {isOwner && (
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setShowEditModal(true)} 
                  >
                    Edit Profile
                  </button>
            )}
          </div>
        </div>

        <div className="profile-feed">
          <h3>Posts</h3>
          {userPosts.length === 0 ? (
            <p style={{textAlign: 'center', color: '#888'}}>No posts yet.</p>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post._id || Math.random()} post={post} />
            ))
          )}
        </div>
      </div>

      {showEditModal && (
         <EditProfileModal 
           user={userProfile} 
           onClose={() => setShowEditModal(false)}
           onUpdate={(updatedUser) => setUserProfile(updatedUser)} 
         />
       )}
    </div>
  );
};

export default Profile;