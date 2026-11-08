import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

function setSessionCookie(res, user) {
  const token = jwt.sign({ userId: user._id, publicId: user.publicId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.cookie('access_token', token, { httpOnly: true, secure: env.cookieSecure, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function signup(req, res, next) {
  try {
    const { displayName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ displayName, email, passwordHash });
    setSessionCookie(res, user);
    res.status(201).json({ user: { publicId: user.publicId, displayName: user.displayName, email: user.email } });
  } catch (error) { next(error); }
}
export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid credentials' });
    setSessionCookie(res, user);
    res.json({ user: { publicId: user.publicId, displayName: user.displayName, email: user.email } });
  } catch (error) { next(error); }
}
export function logout(req, res) {
  res.clearCookie('access_token', { httpOnly: true, secure: env.cookieSecure, sameSite: 'lax' });
  res.json({ ok: true });
}
export async function forgotPassword(req, res) {
  // TODO: Generate a hashed one-time token, expiry, and send through emailService.
  res.json({ ok: true, message: 'If the account exists, reset instructions will be sent.' });
}
export async function resetPassword(req, res) {
  // TODO: Verify one-time token, update password hash and revoke existing sessions.
  res.status(501).json({ error: 'Reset flow TODO' });
}


export async function getSession(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -resetTokenHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: { publicId: user.publicId, displayName: user.displayName, email: user.email, avatarUrl: user.avatarUrl, bio: user.bio } });
  } catch (error) { next(error); }
}
