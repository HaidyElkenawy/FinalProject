import { useState } from 'react';
import { useDispatch } from 'react-redux';
import API from '../api/axios';
import { updateUserSuccess } from '../store/slices/authSlice';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [password, setPassword] = useState(''); // <--- 1. New State for Password
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    
    if (password) {
      formData.append('password', password);
    }
    
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const { data } = await API.put(`/users/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateUserSuccess(data));
      onUpdate(data);
      onClose();
      alert("Profile updated successfully!"); 
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group center-img">
            {preview ? (
               <img src={preview} alt="Preview" className="img-preview" />
            ) : (
               user.profilePicture && (
                 <img src={`http://localhost:5000/${user.profilePicture.replace(/\\/g, "/")}`} alt="Current" className="img-preview" />
               )
            )}
            <input type="file" id="file-upload" style={{display: 'none'}} onChange={handleImageChange} />
            <label htmlFor="file-upload" className="upload-label">Change Photo</label>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;