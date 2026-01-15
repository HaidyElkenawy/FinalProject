import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { desc } = req.body;

    const user = await User.findById(req.user.id);
    
    const imgPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newPost = new Post({
      userId: req.user.id,
      desc,
      img: imgPath,
      likes: [],
      comments: []
    });

    const savedPost = await newPost.save();
    
   
    const fullPost = await Post.findById(savedPost._id).populate("userId", "username profilePicture");
    
    res.status(201).json(fullPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getFeedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
   
    const query = search 
      ? { desc: { $regex: search, $options: 'i' } } 
      : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "username profilePicture");

    const count = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalPosts: count
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "username profilePicture");

    const count = await Post.countDocuments({ userId });

    res.status(200).json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { desc } = req.body;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

  
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own posts" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { desc }, 
      { new: true }
    ).populate("userId", "username profilePicture");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
    
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ id, userId, liked: false, message: "Post unliked" });
    } else {
   
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ id, userId, liked: true, message: "Post liked" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { text } = req.body;
    const user = await User.findById(req.user.id);

    const newComment = {
      userId: req.user.id,
      username: user.username,
      userProfilePic: user.profilePicture,
      text,
      createdAt: new Date()
    };

    const post = await Post.findById(id);
    post.comments.push(newComment);
    await post.save();

   
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params; 
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id && post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    
    await post.save();
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};