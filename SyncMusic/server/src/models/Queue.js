import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  items: [{
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    source: { type: String, enum: ['jamendo', 'audius', 'youtube', 'upload'], required: true },
    sourceId: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    artworkUrl: { type: String, default: '' },
    streamUrl: { type: String, default: '' },
    addedBy: { type: String, default: '' }
  }],
  revision: { type: Number, default: 0 }
}, { timestamps: true });

// TODO: Persist debounced queue snapshots; do not put ephemeral chat or room presence here.
export default mongoose.model('Queue', queueSchema);
