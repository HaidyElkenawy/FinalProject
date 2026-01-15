import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 1. Loading State Handlers
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    hasError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 2. Fetch Posts Success
    setPosts: (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts; // Assuming payload is { posts: [...] }
    },

    // 3. Create Post Success
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    // 4. Like Post Success
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

    // 5. Update Comments (Add or Delete)
    updatePostComments: (state, action) => {
      const { postId, comments } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments = comments;
      }
    },

    // 6. Delete Post Success
    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },

    // 7. Update Post Text Success
    updatePostInState: (state, action) => {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
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