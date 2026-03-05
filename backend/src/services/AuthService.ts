import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import UserRepository from '../repositories/UserRepository';
import { User, UserCreateInput } from '../models/User';
import logger from '../utils/logger';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '24h';
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
}

export class AuthService {
  async signup(input: UserCreateInput): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(input.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(input.password, 10);

      // Create user
      const user: User = {
        id: uuidv4(),
        email: input.email,
        name: input.name,
        organizationId: input.organizationId,
        role: input.role || 'user',
        passwordHash,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const createdUser = await UserRepository.create(user);
      const tokens = this.generateTokens(createdUser);

      logger.info(`User signed up: ${createdUser.email}`);
      return { user: createdUser, tokens };
    } catch (error) {
      logger.error('Signup failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const tokens = this.generateTokens(user);
      logger.info(`User logged in: ${email}`);
      return { user, tokens };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  generateTokens(user: User): AuthTokens {
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRY as string } as any);
    const refreshToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY as string } as any);

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string) as AuthPayload;
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Invalid token');
    }
  }

  refreshAccessToken(refreshToken: string): string {
    try {
      const payload = this.verifyToken(refreshToken);
      const newAccessToken = jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRY as string } as any);
      return newAccessToken;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new Error('Invalid refresh token');
    }
  }
}

export default new AuthService();
