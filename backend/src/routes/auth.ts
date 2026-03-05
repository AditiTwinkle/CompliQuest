import { Router, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import UserRepository from '../repositories/UserRepository';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';
import { userToResponse } from '../models/User';
import logger from '../utils/logger';

const router = Router();

// POST /auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, name, password, organizationId, role } = req.body;

    if (!email || !name || !password || !organizationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { user, tokens } = await AuthService.signup({
      email,
      name,
      password,
      organizationId,
      role,
    });

    res.status(201).json({
      user: userToResponse(user),
      tokens,
    });
  } catch (error: any) {
    logger.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const { user, tokens } = await AuthService.login(email, password);

    res.json({
      user: userToResponse(user),
      tokens,
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    const accessToken = AuthService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (error: any) {
    logger.error('Token refresh error:', error);
    res.status(401).json({ error: error.message });
  }
});

// POST /auth/logout
router.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  // In a real app, you might invalidate the token in a blacklist
  logger.info(`User logged out: ${req.user?.email}`);
  res.json({ message: 'Logged out successfully' });
});

// GET /auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserRepository.findById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userToResponse(user) });
  } catch (error: any) {
    logger.error('Get current user error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
