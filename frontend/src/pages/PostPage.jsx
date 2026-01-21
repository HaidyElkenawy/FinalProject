import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/Feed/PostCard';

const PostPage = () => {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 10px' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading post...</p>
        ) : post ? (
          <PostCard post={post} />
        ) : (
          <p style={{ textAlign: 'center' }}>Post not found or deleted.</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;