import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Random public identifier; it is not an incrementing database sequence.
export function generateUserId() {
  let suffix = '';
  for (let index = 0; index < 6; index += 1) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `SY-${suffix}`;
}
// TODO: Handle the extremely unlikely duplicate-key collision at account creation.
