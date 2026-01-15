import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend (port 5173) to talk to backend (port 5000)
app.use(express.json()); 

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});