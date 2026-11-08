import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateRoomId(length = 6) {
  // Cryptographically random; unique index + duplicate-key retry must handle collisions.
  let id = '';
  for (let index = 0; index < length; index += 1) id += ALPHABET[randomInt(ALPHABET.length)];
  return id;
}
// TODO: Retry creation on MongoDB duplicate-key error.
