import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../store/slices/postSlice';
import API from '../../api/axios';
import './CreatePost.css'; 

const CreatePost = () => {
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]); 
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc && files.length === 0) return;

    const newPostData = new FormData();
    newPostData.append("desc", desc);
    
    if (files.length > 0) {
        files.forEach((file) => {
            newPostData.append("files", file); 
        });
    }

    try {
      const { data } = await API.post("/posts", newPostData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(addPost(data)); 
      setDesc("");
      setFiles([]); 
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const getProfileUrl = (path) => {
    if (!path) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div className="create-post-card">
      <div className="cp-top">
        <img
          className="cp-profile-img"
          src={getProfileUrl(user?.profilePicture)}
          alt="Profile"
        />
        <input
          placeholder={`What's on your mind, ${user?.username}?`}
          className="cp-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      
      <hr className="cp-hr" />

      {files.length > 0 && (
         <div className="cp-preview-container">
            {files.map((file, index) => (
                <div key={index} className="cp-preview-wrapper">
                    <img 
                        className="cp-img-preview" 
                        src={URL.createObjectURL(file)} 
                        alt="preview" 
                    />
                </div>
            ))}
         </div>
      )}

      <form className="cp-bottom" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="cp-option">
          <span className="cp-icon">📷</span>
          <span className="cp-text">Photo/Video</span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file-upload"
            multiple
            accept=".png,.jpeg,.jpg"
            onChange={handleFileChange}
          />
        </label>
        <button className="cp-button" type="submit">Share</button>
      </form>
    </div>
  );
};

export default CreatePost;