// TODO: Add profile validation and account lifecycle endpoints.
import { Router } from 'express';
import { getMe, updateMe } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/userValidator.js';
const router = Router();
router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, validate(updateUserSchema), updateMe);
export default router;
