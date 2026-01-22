import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios'; 
import { startLoading, setPosts, hasError } from '../store/slices/postSlice'; 
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import Navbar from '../components/Navbar';

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const getPosts = async () => {
      dispatch(startLoading());
      try {
        const { data } = await API.get('/posts'); 
        dispatch(setPosts(data)); 
      } catch (err) {
        dispatch(hasError(err.response?.data?.message || "Error fetching posts"));
      }
    };

    getPosts();
  }, [dispatch]);

  return (
    <div className="feed-container">
        <Navbar /> 
        
        <div className="feed-content" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <CreatePost />
            
            {loading && <p style={{textAlign: 'center', marginTop: '20px'}}>Loading posts...</p>}
            
            {error && <p style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>{error}</p>}
            
            {!loading && !error && (
              <div className="posts-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                  ))}
              </div>
            )}
        </div>
    </div>
  );
};

export default Feed;