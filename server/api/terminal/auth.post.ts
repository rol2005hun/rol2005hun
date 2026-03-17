import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const correctPassword = config.adminPassword;

  if (body.password === correctPassword) {
    const payload = Buffer.from(JSON.stringify({ role: 'root', exp: Date.now() + 86400000 })).toString('base64');
    const signature = crypto.createHmac('sha256', correctPassword).update(payload).digest('hex');
    const token = `${payload}.${signature}`;

    return { success: true, token };
  } else {
    return { success: false, message: 'Invalid password' };
  }
});
