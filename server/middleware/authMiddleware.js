import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  // Read the HTTP-Only cookie named 'jwt'
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from Token and attach to Request object (exclude password)
      // Note: 'select' is how Prisma allows us to exclude fields.
      req.user = await prisma.user.findUnique({
         where: { id: decoded.userId },
         select: { id: true, name: true, email: true, xp: true, level: true } 
      });

      next(); // Move to the actual controller
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };