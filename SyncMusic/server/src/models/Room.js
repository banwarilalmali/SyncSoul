import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true, minlength: 6, maxlength: 6 },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permission: { type: String, enum: ['everyone', 'host-only'], default: 'everyone' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

// TODO: Add TTL index if room expiry policy is enabled; active presence remains in memory.
export default mongoose.model('Room', roomSchema);
