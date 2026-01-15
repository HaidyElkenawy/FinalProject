import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../store/slices/postSlice';
import './CreatePost.css';

const CreatePost = () => {
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc && !image) return;

    const formData = new FormData();
    formData.append('desc', desc);
    if (image) {
      formData.append('picture', image);
    }

    dispatch(createPost(formData));
    setDesc('');
    setImage(null);
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <img 
          src={user?.profilePicture ? `http://localhost:5000/${user.profilePicture}` : "https://via.placeholder.com/50"} 
          alt="Profile" 
          className="avatar" 
        />
        <input 
          type="text" 
          placeholder={`What's on your mind, ${user?.username}?`}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div className="create-post-actions">
        <input 
          type="file" 
          id="fileInput" 
          style={{ display: 'none' }}
          onChange={(e) => setImage(e.target.files[0])} 
        />
        <label htmlFor="fileInput" className="image-btn">
          📷 {image ? "Image Selected" : "Add Image"}
        </label>
        <button onClick={handleSubmit} className="post-btn">Post</button>
      </div>
    </div>
  );
};

export default CreatePost;