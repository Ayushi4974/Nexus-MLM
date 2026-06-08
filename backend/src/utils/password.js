const bcrypt = require('bcryptjs');

/**
 * Hash a plain text password.
 * @param {string} password - Plain password.
 * @returns {Promise<string>} Hashed password.
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with a hashed password.
 * @param {string} enteredPassword - Plain password provided by user.
 * @param {string} hashedPassword - Stored hashed password.
 * @returns {Promise<boolean>} True if match.
 */
async function comparePassword(enteredPassword, hashedPassword) {
  return bcrypt.compare(enteredPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
