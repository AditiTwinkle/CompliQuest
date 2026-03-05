import AuthService from '../../services/AuthService';
import UserRepository from '../../repositories/UserRepository';
import { User } from '../../models/User';

jest.mock('../../repositories/UserRepository');
jest.mock('../../services/AuthService');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user with valid input', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        organizationId: 'org-123',
      };

      const mockUser: User = {
        id: 'user-123',
        email: input.email,
        name: input.name,
        organizationId: input.organizationId,
        role: 'user',
        passwordHash: 'hashed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (AuthService.signup as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      });

      const result = await AuthService.signup(input);
      expect(result.user.email).toBe(input.email);
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        organizationId: 'org-123',
      };

      (AuthService.signup as jest.Mock).mockRejectedValue(new Error('User already exists'));

      await expect(AuthService.signup(input)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        organizationId: 'org-123',
        role: 'user',
        passwordHash: 'hashed',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (AuthService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      });

      const result = await AuthService.login('test@example.com', 'password123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await expect(AuthService.login('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('token refresh', () => {
    it('should generate new access token', async () => {
      (AuthService.refreshAccessToken as jest.Mock).mockReturnValue('new-token');

      const result = AuthService.refreshAccessToken('refresh-token');
      expect(result).toBe('new-token');
    });

    it('should reject invalid refresh token', async () => {
      (AuthService.refreshAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid refresh token');
      });

      expect(() => AuthService.refreshAccessToken('invalid')).toThrow('Invalid refresh token');
    });
  });
});
