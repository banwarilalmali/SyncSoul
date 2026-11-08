export function registerSyncSocket(io, socket) {
  socket.on('sync:ping', ({ clientTime }) => {
    socket.emit('sync:pong', { clientTime, serverTime: Date.now() });
  });
  // TODO: Add periodic sampling, offset smoothing and sync snapshot version checks.
}
