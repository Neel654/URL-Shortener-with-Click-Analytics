const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function toBase62(num) {
  if (num === 0) return ALPHABET[0];

  let result = '';
  while (num > 0) {
    result = ALPHABET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

module.exports = { toBase62 };
