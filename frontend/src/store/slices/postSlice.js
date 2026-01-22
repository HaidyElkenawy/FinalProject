import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
   
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    hasError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

   
    setPosts: (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts;
    },

  
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

   
    updatePostLikes: (state, action) => {
      const { id, userId, liked } = action.payload;
      const post = state.posts.find((p) => p._id === id);
      if (post) {
        if (liked) {
          post.likes.push(userId);
        } else {
          post.likes = post.likes.filter((uid) => uid !== userId);
        }
      }
    },
    updatePostComments: (state, action) => {
      const { postId, comments } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments = comments;
      }
    },

    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },

    updatePostInState: (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
});

// Export standard actions
export const { 
  startLoading, 
  hasError, 
  setPosts, 
  addPost, 
  updatePostLikes, 
  updatePostComments, 
  removePost, 
  updatePostInState 
} = postSlice.actions;

export default postSlice.reducer;