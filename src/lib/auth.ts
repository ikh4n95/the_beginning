import crypto from 'crypto';

const PASSWORD_KEY_LEN = 64;
const SALT_LEN = 16;
export const PASSWORD_MIN_LENGTH = 8;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(SALT_LEN).toString('hex');
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEY_LEN).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEY_LEN).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

export function getPasswordErrors(password: string) {
  const errors: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }
  return errors;
}
