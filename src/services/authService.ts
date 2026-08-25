import api from "./api";
import type { User } from "../types";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
};

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
    }
  );

  return response.data;
};

/*
 * Update user using PATCH
 */
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await api.patch<User>(
    `/users/${id}`,
    userData
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
 * Find user by cell number
 */
export const getUserByCellNumber = async (
  cellNumber: string
): Promise<User | null> => {
  const response = await api.get<User[]>(
    "/users",
    {
      params: {
        cellNumber: cellNumber.trim(),
      },
    }
  );

  return response.data.length > 0
    ? response.data[0]
    : null;
};