import { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; 
import { 
  updatePostLikes, 
  updatePostComments, 
  removePost, 
  updatePostInState 
} from '../../store/slices/postSlice'; 
import './PostCard.css';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc);
  const [keptImages, setKeptImages] = useState(post.img || []);
  const [newFiles, setNewFiles] = useState([]);

  const isLiked = post.likes.includes(user?.id);
  const isOwner = post.userId?._id === user?.id;
  const postOwnerId = post.userId?._id || post.userId;


  const toggleEdit = () => {
    if (!isEditing) {
        setEditDesc(post.desc);
        setKeptImages(post.img || []);
        setNewFiles([]);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("desc", editDesc);

    keptImages.forEach(path => {
        formData.append("existingImages", path);
    });

    newFiles.forEach(file => {
        formData.append("files", file);
    });

    try {
      const { data } = await API.patch(`/posts/${post._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      dispatch(updatePostInState(data)); 
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleRemoveKeptImage = (indexToRemove) => {
    setKeptImages(keptImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setNewFiles(newFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (e) => {
     if (e.target.files) {
         setNewFiles([...newFiles, ...Array.from(e.target.files)]);
     }
  };

  const handleLike = async () => {
    try {
      const { data } = await API.patch(`/posts/${post._id}/like`);
      dispatch(updatePostLikes(data));
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, { text: commentText });
      dispatch(updatePostComments({ postId: post._id, comments: data }));
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete?")) return;
    try {
      const { data } = await API.delete(`/posts/${post._id}/comment/${commentId}`);
      dispatch(updatePostComments({ postId: post._id, comments: data }));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete post?")) return;
    try {
      await API.delete(`/posts/${post._id}`);
      dispatch(removePost(post._id));
    } catch (err) { console.error(err); }
  };

  const handlePostClick = () => {
    if (!isEditing) navigate(`/post/${post._id}`);
  };

  const getProfileUrl = (user) => {
    if (!user || !user.profilePicture) return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
    return `http://localhost:5000/${user.profilePicture.replace(/\\/g, "/")}`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <Link to={`/profile/${postOwnerId}`}>
            <img src={getProfileUrl(post.userId)} alt="User" className="post-avatar"/>
          </Link>
          <div>
            <Link to={`/profile/${postOwnerId}`} className="username-link">
               <span className="username">{post.userId?.username || "Unknown"}</span>
            </Link>
            <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="owner-actions">
            <button className="edit-btn" onClick={toggleEdit}>
              {isEditing ? "✖" : "✏️"}
            </button>
            <button className="delete-btn" onClick={handleDelete}>🗑️</button>
          </div>
        )}
      </div>

      <div className={`post-content ${!isEditing ? 'clickable' : ''}`} onClick={handlePostClick}>
        {isEditing ? (

          <div className="edit-mode" onClick={(e) => e.stopPropagation()}>
            <textarea 
              value={editDesc} 
              onChange={(e) => setEditDesc(e.target.value)}
              className="edit-input"
              rows="3"
            />
            
         
            <div className="edit-images-container">
                {keptImages.map((imgStr, idx) => (
                    <div key={`kept-${idx}`} className="edit-img-wrapper">
                        <img src={`http://localhost:5000/${imgStr.replace(/\\/g, "/")}`} alt="" />
                        <button className="remove-img-btn" onClick={() => handleRemoveKeptImage(idx)}>✖</button>
                    </div>
                ))}
                
                {newFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="edit-img-wrapper new">
                        <img src={URL.createObjectURL(file)} alt="" />
                        <button className="remove-img-btn" onClick={() => handleRemoveNewFile(idx)}>✖</button>
                    </div>
                ))}
            </div>

            <div className="edit-actions">
                <label className="add-photo-btn">
                    📷 Add Photos
                    <input type="file" multiple onChange={handleFileChange} style={{display:'none'}} />
                </label>
                <button onClick={handleUpdate} className="save-btn">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <p>{post.desc}</p>
            {post.img && post.img.length > 0 && (
                <div className={`post-gallery ${Array.isArray(post.img) && post.img.length > 1 ? 'multiple' : 'single'}`}>
                    {(Array.isArray(post.img) ? post.img : [post.img]).map((imgStr, index) => (
                        <img 
                            key={index}
                            src={`http://localhost:5000/${imgStr.replace(/\\/g, "/")}`} 
                            alt="" 
                            className="post-image" 
                        />
                    ))}
                </div>
            )}
          </>
        )}
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? "liked" : ""}>
          {isLiked ? "❤️" : "🤍"} {post.likes.length} Likes
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." />
            <button type="submit">Send</button>
          </form>
          <div className="comments-list">
            {post.comments.map((c, idx) => (
              <div key={idx} className="comment">
                <div className="comment-content"><strong>{c.username}: </strong> {c.text}</div>
                {(user?.id === c.userId || user?.id === post.userId._id) && (
                  <button className="delete-comment-btn" onClick={() => handleDeleteComment(c._id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;