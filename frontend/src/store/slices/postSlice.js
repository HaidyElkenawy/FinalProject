import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/posts');
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);


export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await API.post('/posts', postData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);


export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/posts/${postId}/like`);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/posts/${postId}/comment`, { text });
      return { postId, comments: data }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await API.delete(`/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, desc }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/posts/${postId}`, { desc });
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/posts/${postId}/comment/${commentId}`);
      return { postId, comments: data }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); 
      })
     
      .addCase(likePost.fulfilled, (state, action) => {
        const { id, userId, liked } = action.payload;
        const post = state.posts.find((p) => p._id === id);
        if (post) {
          if (liked) {
            post.likes.push(userId);
          } else {
            post.likes = post.likes.filter((uid) => uid !== userId);
          }
        }
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.comments = action.payload.comments;
        }
      })
    
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
  const post = state.posts.find((p) => p._id === action.payload.postId);
  if (post) {
    post.comments = action.payload.comments; 
  }
});
  },
});

export default postSlice.reducer;