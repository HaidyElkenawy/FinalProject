import User from "../models/User.js";
import bcrypt from "bcrypt"; 
import Post from "../models/Post.js"; 

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "You can only update your own account" });
  }

  try {
    const { username, bio, password } = req.body;
    
    let updateData = { username, bio };
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    const { password: userPassword, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: "Invalid User ID format" });
    }

    const user = await User.findById(id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, ...otherDetails } = user._doc;
    res.status(200).json(otherDetails);
  } catch (error) {
    //console.error("Error in getUser:", error); 
    res.status(500).json({ error: error.message });
  }
};


export const searchAll = async (req, res) => {
  try {
    const query = req.query.searchtext; 
    
    if (!query) return res.status(400).json({ message: "Search query is required" });
    const users = await User.find({ 
      username: { $regex: query, $options: "i" } 
    }).select("username profilePicture");

    const posts = await Post.find({ 
      desc: { $regex: query, $options: "i" } 
    }).populate("userId", "username profilePicture");

    res.status(200).json({ users, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

