import api from "./api";
import type { User } from "../types";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

/*
 * Register user
 */
export const registerUser = async (
  userData: RegisterData
): Promise<User> => {
  const response = await api.post<User>(
    "/users",
    {
      ...userData,
      email: userData.email
        .trim()
        .toLowerCase(),
      cellNumber: userData.cellNumber.trim(),
    }
  );

  return response.data;
};

/*
 * Find user by email
 */
export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const response = await api.get<User[]>(
    "/users",
    {
      params: {
        email: email
          .trim()
          .toLowerCase(),
      },
    }
  );

  return response.data.length > 0
    ? response.data[0]
    : null;
};

/*
 * Normalise a South African
 * cell number.
 *
 * Examples:
 *
 * 0712345678
 * 071 234 5678
 * +27712345678
 * +27 71 234 5678
 *
 * All become:
 *
 * 0712345678
 */
const normalizeCellNumber = (
  cellNumber: string
): string => {
  let number =
    cellNumber.replace(/\D/g, "");

  if (number.startsWith("27")) {
    number =
      `0${number.slice(2)}`;
  }

  return number;
};


export const getUserByCellNumber = async (
  cellNumber: string
): Promise<User | null> => {
  const normalizedNumber = normalizeCellNumber(cellNumber);

  const response = await api.get<User[]>("/users");

  const user = response.data.find(
    (user) =>
      normalizeCellNumber(user.cellNumber) === normalizedNumber
  );

  return user ?? null;
};

/*
 * Update user using PATCH
 */
export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  const response =
    await api.patch<User>(
      `/users/${id}`,
      updates
    );

  return response.data;
};