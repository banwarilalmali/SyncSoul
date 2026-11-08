import User from '../models/User.js';
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -resetTokenHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
}
export async function updateMe(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true, runValidators: true }).select('-passwordHash');
    res.json({ user });
  } catch (error) { next(error); }
}
// TODO: Add account deletion and avatar storage integration.
