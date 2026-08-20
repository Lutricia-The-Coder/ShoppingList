import api from "./api";
import type { ShoppingList } from "../types";

export const getShoppingLists = async (
  userId: string
): Promise<ShoppingList[]> => {
  const response = await api.get<ShoppingList[]>("/shoppingLists", {
    params: {
      userId,
    },
  });

  return response.data;
};

export const createShoppingList = async (
  shoppingList: Omit<ShoppingList, "id">
): Promise<ShoppingList> => {
  const response = await api.post<ShoppingList>(
    "/shoppingLists",
    shoppingList
  );

  return response.data;
};

export const updateShoppingList = async (
  id: string,
  shoppingList: Partial<ShoppingList>
): Promise<ShoppingList> => {
  const response = await api.patch<ShoppingList>(
    `/shoppingLists/${id}`,
    shoppingList
  );

  return response.data;
};

export const deleteShoppingList = async (
  id: string
): Promise<void> => {
  await api.delete(`/shoppingLists/${id}`);
};