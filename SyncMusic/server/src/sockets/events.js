// Canonical event-name inventory. TODO: Import these constants in all handlers.
export const SOCKET_EVENTS = Object.freeze({
  room: ['room:join', 'room:leave', 'room:state', 'room:members', 'room:host-changed', 'room:error'],
  music: ['music:play', 'music:pause', 'music:seek', 'music:next', 'music:prev', 'music:ready', 'music:shuffle', 'music:repeat', 'music:state'],
  queue: ['queue:add', 'queue:remove', 'queue:reorder', 'queue:update'],
  autodj: ['autodj:toggle'],
  chat: ['chat:send', 'chat:new', 'chat:typing'],
  sync: ['sync:ping', 'sync:pong']
});
