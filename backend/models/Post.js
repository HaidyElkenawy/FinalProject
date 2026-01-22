import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  desc: {
    type: String,
    max: 500,
    trim: true
  },
  img: {
        type: [String], 
        default: [],
      },
  likes: {
    type: Array,
    default: []
  },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true },
      userProfilePic: { type: String },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;