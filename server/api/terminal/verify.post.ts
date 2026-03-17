import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body.token;
  if (!token) return { valid: false };

  const config = useRuntimeConfig();
  const secret = config.adminPassword;

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payload, signature] = parts;

  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (signature !== expectedSignature) return { valid: false };

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    if (data.exp < Date.now()) return { valid: false, message: 'Token expired' };
    if (data.role !== 'root') return { valid: false, message: 'Insufficient permissions' };
    return { valid: true };
  } catch {
    return { valid: false };
  }
});
