import mongoose from 'mongoose';
import { generateUserId } from '../utils/generateUserId.js';

const userSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, default: generateUserId, index: true },
  displayName: { type: String, required: true, trim: true, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, maxlength: 160, default: '' },
  resetTokenHash: { type: String, default: null },
  resetTokenExpiresAt: { type: Date, default: null }
}, { timestamps: true });

// TODO: Add email verification and password-reset token lifecycle.
export default mongoose.model('User', userSchema);
