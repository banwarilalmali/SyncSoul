// TODO: Add room password/access checks and lifecycle endpoints.
import { Router } from 'express';
import { createRoom, getRoom, joinRoom } from '../controllers/roomController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRoomSchema } from '../validators/roomValidator.js';
const router = Router();
router.use(requireAuth);
router.post('/', validate(createRoomSchema), createRoom);
router.get('/:roomId', getRoom);
router.post('/:roomId/join', joinRoom);
export default router;
