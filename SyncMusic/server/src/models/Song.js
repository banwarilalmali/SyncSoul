import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  source: { type: String, enum: ['jamendo', 'audius', 'youtube', 'upload'], required: true },
  sourceId: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  artworkUrl: { type: String, default: '' },
  streamUrl: { type: String, default: '' },
  tags: [{ type: String }]
}, { timestamps: true });

songSchema.index({ source: 1, sourceId: 1 }, { unique: true });
// TODO: Store only permitted metadata and source references; validate rights for uploads.
export default mongoose.model('Song', songSchema);
