import CryptoJS from "crypto-js";

const SECRET_KEY = "shopping-list-secret-key";

export const encrypt = (value: string): string => {
  const key = CryptoJS.SHA256(SECRET_KEY);

  return CryptoJS.AES.encrypt(value, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};