import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  likePost, 
  addComment, 
  deletePost, 
  updatePost, 
  deleteComment 
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

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ postId: post._id, text: commentText }));
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment({ postId: post._id, commentId }));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post._id));
    }
  };

  const handleUpdate = () => {
    if (editDesc.trim() !== post.desc) {
      dispatch(updatePost({ postId: post._id, desc: editDesc }));
    }
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <img 
            src={post.userId?.profilePicture ? `http://localhost:5000/${post.userId.profilePicture}` : "https://via.placeholder.com/40"} 
            alt="User" 
            className="post-avatar" 
          />
          <div>
            <span className="username">{post.userId?.username || "Unknown User"}</span>
            <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
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

        {post.img && <img src={`http://localhost:5000/${post.img}`} alt="Post content" className="post-image" />}
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