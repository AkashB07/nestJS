import { hash, compare } from 'bcryptjs';
import * as crypto from 'crypto';
import { BCRYPY_SALT_ROUNDS } from '../constants/auth.constant';

export async function hashData(data) {
  const hashedPassword = await hash(data, BCRYPY_SALT_ROUNDS);
  return hashedPassword;
}

export async function verifyHashedData(data, hashedData) {
  const isValid = await compare(data, hashedData);
  return isValid;
}

export function generateEmailResetCode() {
  return crypto.randomBytes(32).toString('hex');
}
