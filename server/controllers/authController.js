import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

const prisma = new PrismaClient();

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password (encrypt it)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in DB (Start at Level 1, 0 XP)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        level: 1, 
        xp: 0
      }
    });

    if (user) {
      generateToken(res, user.id); // Add cookie
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Check password match
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id); // Add cookie
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  // Clear the cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (XP, Level, etc)
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    // The 'protect' middleware puts the user in req.user
    if(req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get top 10 users by XP
// @route   GET /api/auth/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10, // Limit to Top 10
      select: {
        id: true,
        name: true,
        level: true,
        xp: true,
        // We do NOT return email or password for security
      }
    });
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
      // If the user sends new data, use it; otherwise keep old data
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          avatar: req.body.avatar || user.avatar, // We will save the URL string here
        },
        // Return only safe fields
        select: { id: true, name: true, email: true, xp: true, level: true, avatar: true }
      });

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};