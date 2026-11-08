// TODO: Add provider-specific quotas, result normalization and cache headers.
import { Router } from 'express';
import { searchMusic } from '../controllers/musicController.js';
import { searchLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { musicSearchSchema } from '../validators/musicValidator.js';
const router = Router();
router.get('/search', searchLimiter, validate(musicSearchSchema, 'query'), searchMusic);
export default router;
