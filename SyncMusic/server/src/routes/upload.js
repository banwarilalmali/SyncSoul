// TODO: Add object-storage integration and upload rights attestation.
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadTrack } from '../controllers/uploadController.js';
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024) } });
router.post('/track', requireAuth, upload.single('track'), uploadTrack);
export default router;
