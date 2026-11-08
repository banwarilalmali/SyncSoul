export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}
export function errorHandler(error, req, res, next) {
  // TODO: Add structured logging and safe production error responses.
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'Internal server error' });
}
