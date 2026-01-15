import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/slices/postSlice';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import Navbar from '../components/Navbar'; 

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="feed-container">
        <Navbar /> 
        
        <div className="feed-content" style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '20px' }}>
            <CreatePost />
            
            {loading && <p style={{textAlign: 'center'}}>Loading posts...</p>}
            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            
            <div className="posts-list">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default Feed;