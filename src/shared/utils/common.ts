import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

export function convertArrayToObject(arr: string[]): {
  [key: string]: boolean;
} {
  const result: { [key: string]: boolean } = {};
  arr.forEach((item) => {
    result[item] = true;
  });
  return result;
}

export function generateToken(): string {
  // 1. Generate a cryptographically secure random UUID for high uniqueness:
  const rawToken = uuidv4();

  // 2. Hash the token using a strong algorithm (e.g., SHA-256) for added security:
  const hashedToken = createHash('sha256').update(rawToken).digest('hex');

  return hashedToken;
}
