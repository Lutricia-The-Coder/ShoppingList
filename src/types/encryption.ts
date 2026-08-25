import CryptoJS from "crypto-js";

const SECRET_KEY = "shopping-list-secret-key";

/**
 * Hashes a password using SHA-256.
 * The same password will always produce
 * the same hash.
 */
export const hashPassword = (
  password: string
): string => {
  return CryptoJS.SHA256(password).toString(
    CryptoJS.enc.Hex
  );
};

/**
 * Encrypts general data using AES.
 */
export const encrypt = (
  value: string
): string => {
  return CryptoJS.AES.encrypt(
    value,
    SECRET_KEY
  ).toString();
};