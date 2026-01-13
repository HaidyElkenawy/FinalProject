import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import Joi from 'joi';

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

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const login = async (req, res) => {
  try {
    // 1. Validate Input Format
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 5. Send Response (excluding the password hash)
    res.status(200).json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        profilePicture: user.profilePicture 
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};