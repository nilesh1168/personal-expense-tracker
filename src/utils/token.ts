import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  [key: string]: unknown;
}

const DEFAULT_EXPIRATION = '1h';

export const generateToken = (
  payload: TokenPayload,
  options: SignOptions = { expiresIn: DEFAULT_EXPIRATION },
): string => {
  const secret = process.env.JWT_SECRET || 'test-secret';

  return jwt.sign(payload, secret, options);
};

export default generateToken;

