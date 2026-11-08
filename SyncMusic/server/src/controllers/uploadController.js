import { storeUpload } from '../services/upload/uploadService.js';
export async function uploadTrack(req, res, next) {
  try {
    // TODO: Enforce MIME, size, ownership/rights attestation and malware scanning.
    const stored = await storeUpload(req.file, req.user);
    res.status(201).json({ track: stored });
  } catch (error) { next(error); }
}
