import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body ?? {};

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
      await connectDB();
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const createdUserId = (newUser as any).id ?? (newUser as any)._id;

    res.status(201).json({
      message: 'User registered successfully',
      userId: createdUserId,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = (req: Request, res: Response): void => {
  // Implementation pending
};
