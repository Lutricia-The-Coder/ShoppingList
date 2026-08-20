import api from "./api";
import type { User } from "../types";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

export const registerUser = async (
  userData: RegisterData
): Promise<User> => {
  const response = await api.post<User>("/users", userData);

  return response.data;
};

export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const response = await api.get<User[]>("/users", {
    params: {
      email,
    },
  });

  return response.data.length > 0 ? response.data[0] : null;
};