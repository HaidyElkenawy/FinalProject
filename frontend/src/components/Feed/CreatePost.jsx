import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../api/axios'; 
import { addPost } from '../../store/slices/postSlice'; 
import './CreatePost.css';

const CreatePost = () => {
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc && !image) return;

    const formData = new FormData();
    formData.append('desc', desc);
    if (image) {
      formData.append('picture', image);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await API.post('/posts', formData, config);
      dispatch(addPost(data));
      setDesc('');
      setImage(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };


  const getProfileUrl = (user) => {
  if (!user || !user.profilePicture) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const cleanPath = user.profilePicture.replace(/\\/g, "/");
  return `http://localhost:5000/${cleanPath}`;
};
  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <img 
          src={getProfileUrl(user)} 
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