import CryptoJS from "crypto-js";

const SECRET_KEY = "shopping-list-secret-key";


export const hashPassword = (
  password: string
): string => {
  return CryptoJS.SHA256(password).toString(
    CryptoJS.enc.Hex
  );
};


export const encrypt = (
  value: string
): string => {
  return CryptoJS.AES.encrypt(
    value,
    SECRET_KEY
  ).toString();
};