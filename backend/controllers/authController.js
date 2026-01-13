import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePicturePath = req.file ? req.file.path.replace(/\\/g, "/") : "";
    //Create User with the hashed password
    const user = await User.create({ 
        username, 
        email, 
        password: hashedPassword ,
        profilePicture: profilePicturePath
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email , password: user.password}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};