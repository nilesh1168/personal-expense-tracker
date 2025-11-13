import { Request, Response } from 'express';
import { registerUser } from '../src/controllers/authController';
import User from '../src/models/user';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Mock the User model
jest.mock('../src/models/user');
jest.mock('../src/config/db');

// Mock bcrypt
jest.mock('bcryptjs');

describe('registerUser', () => {
  // Use a Map as test database
  let testDatabase: Map<string, any>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    // Initialize test database (Map)
    testDatabase = new Map();

    // Setup mock request
    mockRequest = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };

    // Setup mock response
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    // Mock User.findOne to check the test database
    (User.findOne as jest.Mock) = jest.fn().mockImplementation((query: any) => {
      const user = testDatabase.get(query.email);
      return user ? Promise.resolve(user) : Promise.resolve(null);
    });

    // Mock User.create to add to test database
    (User.create as jest.Mock) = jest.fn().mockImplementation((userData: any) => {
      const userId = `user_${Date.now()}_${Math.random()}`;
      const newUser = {
        ...userData,
        id: userId,
        _id: userId,
        createdAt: new Date(),
      };
      testDatabase.set(userData.email, newUser);
      return Promise.resolve(newUser);
    });

    // Mock bcrypt.hash
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashedPassword123');

    // Mock mongoose connection state (1 = connected)
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 1,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean the test database after each test
    testDatabase.clear();
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    // Execute the controller function
    await registerUser(mockRequest as Request, mockResponse as Response);

    // Verify the response
    expect(responseStatus).toHaveBeenCalledWith(201);
    expect(responseJson).toHaveBeenCalledWith({
      message: 'User registered successfully',
      userId: expect.any(String),
    });

    // Verify User.findOne was called to check for existing user
    expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });

    // Verify password was hashed
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    // Verify User.create was called with correct data (excluding password which should be hashed)
    expect(User.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123',
    });

    // Verify user was added to test database
    expect(testDatabase.has('john.doe@example.com')).toBe(true);
    const savedUser = testDatabase.get('john.doe@example.com');
    expect(savedUser.firstName).toBe('John');
    expect(savedUser.lastName).toBe('Doe');
    expect(savedUser.email).toBe('john.doe@example.com');
    expect(savedUser.password).toBe('hashedPassword123');
  });
});

