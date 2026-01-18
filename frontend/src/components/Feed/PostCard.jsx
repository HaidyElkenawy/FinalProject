import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // <--- 1. Import Link
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
  const { user } = useSelector((state) => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc);

  const isLiked = post.likes.includes(user?.id);
  const isOwner = post.userId?._id === user?.id;
  
  const postOwnerId = post.userId?._id || post.userId;

  const handleLike = async () => {
    try {
      const { data } = await API.patch(`/posts/${post._id}/like`);
      dispatch(updatePostLikes(data));
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, { text: commentText });
      dispatch(updatePostComments({ postId: post._id, comments: data }));
      setCommentText('');
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const { data } = await API.delete(`/posts/${post._id}/comment/${commentId}`);
      dispatch(updatePostComments({ postId: post._id, comments: data }));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${post._id}`);
      dispatch(removePost(post._id));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleUpdate = async () => {
    if (editDesc.trim() === post.desc) {
      setIsEditing(false);
      return;
    }

    try {
      const { data } = await API.patch(`/posts/${post._id}`, { desc: editDesc });
      dispatch(updatePostInState(data));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const getProfileUrl = (user) => {
    if (!user || !user.profilePicture) {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Default
    }
    const cleanPath = user.profilePicture.replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          {/* 2. Wrap Avatar in Link */}
          <Link to={`/profile/${postOwnerId}`}>
            <img 
              src={getProfileUrl(post.userId)} 
              alt="User" 
              className="post-avatar"
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
            />
          </Link>
          
          <div>
            {/* 3. Wrap Username in Link */}
            <Link to={`/profile/${postOwnerId}`} className="username-link">
               <span className="username">{post.userId?.username || "Unknown User"}</span>
            </Link>
            {/* Display Date on a new line or block */}
            <span className="date" style={{display: 'block', fontSize: '12px', color: '#888'}}>
                {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {isOwner && (
          <div className="owner-actions">
            <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "✖" : "✏️"}
            </button>
            <button className="delete-btn" onClick={handleDelete}>🗑️</button>
          </div>
        )}
      </div>

      <div className="post-content">
        {isEditing ? (
          <div className="edit-mode">
            <textarea 
              value={editDesc} 
              onChange={(e) => setEditDesc(e.target.value)}
              className="edit-input"
              rows="3"
            />
            <button onClick={handleUpdate} className="save-btn">Save</button>
          </div>
        ) : (
          <p>{post.desc}</p>
        )}

        {/* Added the replace logic here too for safer Windows path handling */}
        {post.img && (
            <img 
                src={`http://localhost:5000/${post.img.replace(/\\/g, "/")}`} 
                alt="Post content" 
                className="post-image" 
            />
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
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Write a comment..." 
            />
            <button type="submit">Send</button>
          </form>
          
          <div className="comments-list">
            {post.comments.map((c, index) => (
              <div key={index} className="comment">
                <div className="comment-content">
                  {/* Optional: You could also Link the commenter's name here */}
                  <strong>{c.username}: </strong> {c.text}
                </div>
                
                {(user?.id === c.userId || user?.id === post.userId._id) && (
                  <button 
                    className="delete-comment-btn" 
                    onClick={() => handleDeleteComment(c._id)}
                    title="Delete Comment"
                  >
                    ✕
                  </button>
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